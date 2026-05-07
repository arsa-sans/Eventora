import { createServerSupabaseClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

// GET: Fetch user's invitations
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("invitations")
      .select("*, rsvps(count)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Invitations] Fetch error:", error);
      return NextResponse.json({ error: "Failed to fetch invitations" }, { status: 500 });
    }

    return NextResponse.json({ invitations: data || [] });
  } catch (error) {
    console.error("[Invitations] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST: Create new invitation
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Generate unique slug
    const groomName = (body.groom_name || "tamu").toLowerCase().replace(/\s+/g, "-");
    const brideName = (body.bride_name || "undangan").toLowerCase().replace(/\s+/g, "-");
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    const slug = `${groomName}-${brideName}-${randomSuffix}`;

    const invitationData = {
      user_id: user.id,
      slug,
      title: body.title || `Undangan ${body.groom_name || ""} & ${body.bride_name || ""}`.trim(),
      event_type: body.event_type || "wedding",
      status: "draft",
      theme_id: body.theme_id || "emerald-garden",
      groom_name: body.groom_name || null,
      bride_name: body.bride_name || null,
      host_name: body.host_name || null,
      groom_father: body.groom_father || null,
      groom_mother: body.groom_mother || null,
      bride_father: body.bride_father || null,
      bride_mother: body.bride_mother || null,
      groom_photo: body.groom_photo || null,
      bride_photo: body.bride_photo || null,
      cover_photo: body.cover_photo || null,
      events: body.events || [],
      event_date: body.event_date || null,
      event_time: body.event_time || null,
      event_location: body.event_location || null,
      event_map_url: body.event_map_url || null,
      message: body.message || null,
      love_story: body.love_story || [],
      gallery_images: body.gallery_images || [],
      bank_accounts: body.bank_accounts || [],
      music_url: body.music_url || null,
    };

    const { data, error } = await supabase
      .from("invitations")
      .insert(invitationData)
      .select()
      .single();

    if (error) {
      console.error("[Invitations] Create error:", error);
      return NextResponse.json({ error: `Gagal menyimpan ke database: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ invitation: data });
  } catch (error) {
    console.error("[Invitations] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT: Update invitation
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "Invitation ID is required" }, { status: 400 });
    }

    // Add updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("invitations")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("[Invitations] Update error:", error);
      return NextResponse.json({ error: "Failed to update invitation" }, { status: 500 });
    }

    return NextResponse.json({ invitation: data });
  } catch (error) {
    console.error("[Invitations] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE: Delete invitation
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Invitation ID is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("invitations")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("[Invitations] Delete error:", error);
      return NextResponse.json({ error: "Failed to delete invitation" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Invitations] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
