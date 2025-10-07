'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
    const router = useRouter()

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
                router.push('/dashboard') // ✅ redirect sobald Session existiert
            }
        })

        return () => {
            listener.subscription.unsubscribe()
        }
    }, [router])

    return (
        <main className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
            <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-md p-8 space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Welcome to <span className="text-primary">NeoSpend</span>
                    </h1>
                    <p className="text-sm text-muted-foreground">Log in or use a magic link</p>
                </div>

                <Auth
                    supabaseClient={supabase}
                    view="sign_in"
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
                                },
                            },
                        },
                        className: {
                            button:
                                'w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium rounded-md transition-colors duration-200',
                            input:
                                'border border-border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none',
                            anchor: 'hidden',
                        },
                    }}
                    providers={[]}
                    redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/api/auth/callback`}
                    magicLink
                    showLinks={false}
                />

                <div className="text-center text-sm space-y-2">
                    <p>
                        Forgot your password?{' '}
                        <Link href="/reset-password" className="text-primary hover:underline">
                            Reset it
                        </Link>
                    </p>
                    <p>
                        Don’t have an account?{' '}
                        <Link href="/register" className="text-primary hover:underline">
                            Sign up
                        </Link>
                    </p>
                    <Link href="/" className="underline text-muted-foreground hover:text-foreground">
                        Back to homepage
                    </Link>
                </div>
            </div>
        </main>
    )
}
