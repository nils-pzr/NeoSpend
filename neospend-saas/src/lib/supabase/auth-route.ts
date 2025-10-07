import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createSupabaseAuthClient() {
    const cookieStore = await cookies(); // ✅ Next 15 requires await

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get: (name: string) => cookieStore.get(name)?.value,
                set: (name, value, options) => {
                    try {
                        cookieStore.set({
                            name,
                            value,
                            ...options,
                            sameSite: "lax",
                        });
                    } catch {
                        // Ignore if Next blocks cookie writes outside RouteHandlers
                    }
                },
                remove: (name, options) => {
                    try {
                        cookieStore.set({
                            name,
                            value: "",
                            ...options,
                            sameSite: "lax",
                        });
                    } catch {
                        // ignore
                    }
                },
            },
        }
    );
}