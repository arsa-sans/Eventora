import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Service role client — bypasses RLS completely
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { invitation_id, guest_name, attendance, message, pax } = body;

    console.log("[RSVP POST] Received:", { invitation_id, guest_name, attendance });

    if (!invitation_id || !guest_name || !attendance) {
      return NextResponse.json(
        { error: "invitation_id, guest_name, and attendance are required" },
        { status: 400 }
      );
    }

    if (!["yes", "no", "maybe"].includes(attendance)) {
      return NextResponse.json(
        { error: "attendance must be 'yes', 'no', or 'maybe'" },
        { status: 400 }
      );
    }

    // SECURITY: Verifikasi undangan sudah aktif (dibayar) sebelum menerima RSVP
    const { data: invitation } = await supabaseAdmin
      .from("invitations")
      .select("status")
      .eq("id", invitation_id)
      .single();

    if (!invitation || invitation.status !== "active") {
      return NextResponse.json(
        { error: "Undangan belum aktif. RSVP tidak dapat dikirim." },
        { status: 403 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("rsvps")
      .insert({
        invitation_id,
        guest_name: guest_name.trim(),
        attendance,
        message: message?.trim() || null,
        pax: pax || 1,
      })
      .select()
      .single();

    if (error) {
      console.error("[RSVP POST] Insert error:", error);
      return NextResponse.json({ error: "Failed to save RSVP", detail: error.message }, { status: 500 });
    }

    console.log("[RSVP POST] Success:", data.id);
    return NextResponse.json({ success: true, rsvp: data });
  } catch (error) {
    console.error("[RSVP POST] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get("invitation_id");

    if (!invitationId) {
      return NextResponse.json({ error: "invitation_id is required" }, { status: 400 });
    }

    console.log("[RSVP GET] Fetching for invitation:", invitationId);

    // SECURITY: Verifikasi undangan sudah aktif sebelum menampilkan data RSVP
    const { data: invitation } = await supabaseAdmin
      .from("invitations")
      .select("status")
      .eq("id", invitationId)
      .single();

    if (!invitation || invitation.status !== "active") {
      return NextResponse.json(
        { error: "Undangan belum aktif." },
        { status: 403 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("rsvps")
      .select("*")
      .eq("invitation_id", invitationId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[RSVP GET] Fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch RSVPs" }, { status: 500 });
    }

    console.log("[RSVP GET] Found", data?.length || 0, "RSVPs");
    return NextResponse.json({ rsvps: data || [] });
  } catch (error) {
    console.error("[RSVP GET] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
