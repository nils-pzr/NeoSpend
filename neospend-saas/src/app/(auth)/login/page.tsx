'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) router.replace('/dashboard');
        });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) router.replace('/dashboard');
        });

        return () => listener.subscription.unsubscribe();
    }, [router]);

    return (
        <div className="min-h-screen grid place-items-center bg-background text-foreground">
            <div className="w-full max-w-md space-y-6 border border-border bg-card text-card-foreground rounded-lg p-8 shadow-md">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-semibold">Welcome to NeoSpend</h1>
                    <p className="text-muted-foreground text-sm">
                        Log in, register or reset your password
                    </p>
                </div>

                <Auth
                    supabaseClient={supabase}
                    appearance={{
                        theme: ThemeSupa,
                        variables: {
                            default: {
                                colors: {
                                    brand: 'hsl(var(--primary))',
                                    brandAccent: 'hsl(var(--primary-foreground))',
                                },
                            },
                        },
                    }}
                    providers={[]}
                    redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard`}
                    magicLink
                    showLinks
                />

                <div className="text-center text-sm">
                    <Link href="/" className="underline text-muted-foreground hover:text-foreground">
                        Back to homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}
