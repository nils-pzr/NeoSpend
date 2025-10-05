'use client'

import { useState, useTransition } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [isPending, startTransition] = useTransition()

    const handleReset = () => {
        startTransition(async () => {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            })
            if (error) setMessage(error.message)
            else setMessage('Check your email for a reset link!')
        })
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
            <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-md p-8 space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Reset your password
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your email to receive a reset link
                    </p>
                </div>

                <div className="space-y-4">
                    <Input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Button onClick={handleReset} disabled={isPending} className="w-full">
                        {isPending ? 'Sending...' : 'Send reset link'}
                    </Button>
                    {message && (
                        <p className="text-sm text-center text-muted-foreground">{message}</p>
                    )}
                </div>

                <div className="text-center text-sm">
                    <Link
                        href="/login"
                        className="underline text-muted-foreground hover:text-foreground"
                    >
                        Back to login
                    </Link>
                </div>
            </div>
        </main>
    )
}