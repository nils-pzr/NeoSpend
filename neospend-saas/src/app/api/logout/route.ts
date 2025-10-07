import { NextResponse } from "next/server";
import { createSupabaseAuthClient } from "@/lib/supabase/auth-route";

export async function POST() {
    const supabase = await createSupabaseAuthClient();
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
}
