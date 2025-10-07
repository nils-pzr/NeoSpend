import { NextResponse } from "next/server";
import { createSupabaseAuthClient } from "@/lib/supabase/auth-route";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (code) {
        const supabase = await createSupabaseAuthClient(); // ✅ await
        await supabase.auth.exchangeCodeForSession(code);
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
}