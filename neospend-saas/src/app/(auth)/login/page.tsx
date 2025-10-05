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
            <div className="w-full max-w-md space-y-6 border border-border bg-card text-card-foreground rounded-xl p-8 shadow-lg">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight">Welcome to NeoSpend</h1>
                    <p className="text-sm text-muted-foreground">
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
                                    brandAccent: 'hsl(var(--primary))',
                                    brandButtonText: 'hsl(var(--primary-foreground))',

                                    inputBackground: 'hsl(var(--card))',
                                    inputText: 'hsl(var(--foreground))',
                                    inputBorder: 'hsl(var(--border))',

                                    messageText: 'hsl(var(--muted-foreground))',
                                    messageBackground: 'transparent',
                                },
                                space: {
                                    buttonPadding: '0.5rem 1rem',
                                },
                                fonts: {
                                    bodyFontFamily: 'var(--font-sans)',
                                    buttonFontFamily: 'var(--font-sans)',
                                },
                                radii: {
                                    borderRadiusButton: 'var(--radius)',
                                    inputBorderRadius: 'var(--radius)', // ✅ richtiger Property-Name
                                },
                            },
                        },
                        className: {
                            button:
                                'bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-md transition-colors duration-200',
                            input:
                                'border border-border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none',
                            anchor: 'text-primary hover:underline',
                        },
                    }}
                    providers={[]}
                    redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard`}
                    magicLink
                    showLinks
                />

                <div className="text-center text-sm">
                    <Link
                        href="/"
                        className="underline text-muted-foreground hover:text-foreground"
                    >
                        Back to homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}
