// src/app/(dashboard)/budgeting/initBudgeting.ts
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { runMonthlyMaintenance } from "./actions";

/** 🧩 Budget-System Initialisierung beim Seitenaufruf */
export async function initializeBudgetingSystem() {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    );

    const { data: authUser } = await supabase.auth.getUser();
    if (!authUser?.user) return; // nicht eingeloggt → überspringen

    // ✅ Monatliche Hintergrundaufgaben (Carry-Over, Auto-Allocate, Reset Rules)
    await runMonthlyMaintenance();
}
