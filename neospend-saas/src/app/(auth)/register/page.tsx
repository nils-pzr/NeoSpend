'use client'

import { useTransition, useState } from 'react'
import { registerUser } from '@/actions/register-user'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function RegisterPage() {
    const [message, setMessage] = useState('')
    const [isPending, startTransition] = useTransition()

    return (
        <main className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
            <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-md p-8 space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Join <span className="text-primary">NeoSpend</span>
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Create your account and start managing smarter
                    </p>
                </div>

                {/* Register Form */}
                <form
                    action={(formData) =>
                        startTransition(async () => {
                            const result = await registerUser(formData)
                            setMessage(result.error || result.success || '')
                        })
                    }
                    className="space-y-4"
                >
                    {/* Email */}
                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-muted-foreground"
                        >
                            Email address
                        </label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            required
                            className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 transition-shadow"
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-muted-foreground"
                        >
                            Password
                        </label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="********"
                            required
                            className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 transition-shadow"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full font-medium"
                    >
                        {isPending ? 'Registering...' : 'Sign up'}
                    </Button>

                    {message && (
                        <p
                            className={`text-sm text-center ${
                                message.includes('success')
                                    ? 'text-green-500'
                                    : 'text-red-500'
                            }`}
                        >
                            {message}
                        </p>
                    )}
                </form>

                {/* Footer */}
                <div className="text-center text-sm space-y-2">
                    <p>
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary hover:underline">
                            Log in
                        </Link>
                    </p>
                    <Link
                        href="/"
                        className="underline text-muted-foreground hover:text-foreground"
                    >
                        Back to homepage
                    </Link>
                </div>
            </div>
        </main>
    )
}