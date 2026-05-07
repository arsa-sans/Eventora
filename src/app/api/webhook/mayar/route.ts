import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// Use service-role for webhook (server-to-server)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function verifySignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-mayar-signature") || "";
    const webhookSecret = process.env.MAYAR_WEBHOOK_SECRET;

    // Verify webhook signature if secret is configured
    if (webhookSecret && signature) {
      const isValid = verifySignature(body, signature, webhookSecret);
      if (!isValid) {
        console.error("[Mayar Webhook] Invalid signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const payload = JSON.parse(body);
    const { event, data } = payload;

    console.log(`[Mayar Webhook] Event: ${event}`, data?.id);

    switch (event) {
      case "payment.success":
      case "payment.completed": {
        const {
          id: transactionId,
          email,
          amount,
          metadata,
          extraData,
          customer_name,
        } = data;

        const meta = metadata || extraData || {};
        const userId = meta.user_id;
        const invitationId = meta.invitation_id;
        const templateId = meta.template_id;

        if (!userId) {
          console.error("[Mayar Webhook] Missing user_id in metadata");
          return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
        }

        // 1. Record the transaction
        const { error: txError } = await supabase.from("transactions").upsert({
          id: transactionId,
          user_id: userId,
          invitation_id: invitationId,
          amount,
          status: "paid",
          payment_provider: "mayar",
          customer_email: email,
          customer_name,
          paid_at: new Date().toISOString(),
          raw_payload: data,
        }, { onConflict: "id" });

        if (txError) {
          console.error("[Mayar Webhook] Transaction insert error:", txError);
        }

        // 2. Activate the invitation
        if (invitationId) {
          const { error: invError } = await supabase
            .from("invitations")
            .update({
              status: "active",
              is_premium: true,
              activated_at: new Date().toISOString(),
            })
            .eq("id", invitationId)
            .eq("user_id", userId);

          if (invError) {
            console.error("[Mayar Webhook] Invitation activation error:", invError);
          } else {
            console.log(`[Mayar Webhook] Invitation ${invitationId} activated for user ${userId}`);
          }
        }

        return NextResponse.json({ received: true, event, transactionId });
      }

      case "payment.failed":
      case "payment.expired": {
        const { id: txId, metadata: failMeta, extraData: failExtra } = data;
        const failData = failMeta || failExtra || {};
        console.log(`[Mayar Webhook] Payment ${event}: ${txId}`);

        if (failData.user_id && txId) {
          await supabase.from("transactions").upsert({
            id: txId,
            user_id: failData.user_id,
            status: event === "payment.failed" ? "failed" : "expired",
            payment_provider: "mayar",
            raw_payload: data,
          }, { onConflict: "id" });
        }

        return NextResponse.json({ received: true, event });
      }

      default:
        console.log(`[Mayar Webhook] Unhandled event: ${event}`);
        return NextResponse.json({ received: true, event: "unhandled" });
    }
  } catch (error) {
    console.error("[Mayar Webhook] Error processing webhook:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ status: "ok", webhook: "mayar", timestamp: new Date().toISOString() });
}
