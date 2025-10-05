import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get: (name) => req.cookies.get(name)?.value,
                set: (name, value, options) => {
                    res.cookies.set({ name, value, ...options, domain: undefined, sameSite: 'lax' });
                },
                remove: (name, options) => {
                    res.cookies.set({ name, value: '', ...options, domain: undefined, sameSite: 'lax' });
                },
            },
        }
    );

    // synchronisiert Auth-Cookies bei jedem Request
    await supabase.auth.getSession();

    return res;
}

export const config = {
    matcher: ['/dashboard/:path*'],
};
