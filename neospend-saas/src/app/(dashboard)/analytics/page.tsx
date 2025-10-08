// app/(dashboard)/analytics/page.tsx
import AnalyticsClient from './components/AnalyticsClient';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function AnalyticsPage() {
    const supabase = await createSupabaseServerClient();
    // ✅ sicher: verifiziert beim Auth-Server
    const { data: userData, error } = await supabase.auth.getUser();
    const uid = userData?.user?.id ?? null;

    // Optional: wenn Page nur für eingeloggte Nutzer ist:
    // if (!uid) redirect('/login');

    return <AnalyticsClient uid={uid} />;
}
