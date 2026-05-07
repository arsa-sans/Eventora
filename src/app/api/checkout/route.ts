import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";
import { templates } from "@/data/templatesData";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { template_id, invitation_id } = body;

    if (!template_id) {
      return NextResponse.json({ error: "template_id is required" }, { status: 400 });
    }

    // Get price from template data
    const template = templates.find((t) => t.id === template_id);
    if (!template) {
      return NextResponse.json({ error: "Invalid template_id" }, { status: 400 });
    }

    const apiKey = process.env.MAYAR_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 });
    }

    // Use Invoice API for one-time payment
    const mayarRes = await fetch("https://api.mayar.id/hl/v1/invoice/create", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: user.user_metadata?.full_name || user.user_metadata?.name || "Pelanggan Eventora",
        email: user.email || "customer@eventora.id",
        mobile: user.phone || "08000000000",
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?payment=success`,
        description: `Undangan ${template.name} — Eventora`,
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        items: [
          {
            quantity: 1,
            rate: template.price,
            description: `Template ${template.name} — Undangan Digital Eventora`,
          },
        ],
        extraData: {
          user_id: user.id,
          user_email: user.email,
          template_id,
          invitation_id: invitation_id || null,
        },
      }),
    });

    const mayarData = await mayarRes.json();

    if (!mayarRes.ok || !mayarData.data?.link) {
      console.error("[Checkout] Mayar API error:", mayarData);
      return NextResponse.json(
        { error: `Gagal membuat pembayaran: ${mayarData.messages || "Unknown error"}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      checkout_url: mayarData.data.link,
      transaction_id: mayarData.data.transactionId,
    });
  } catch (error) {
    console.error("[Checkout] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
