'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])
    if (!mounted) return null

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    className="inline-flex items-center justify-center rounded-md border border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground transition-colors p-2"
    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
>
    {theme === 'dark' ? (
        <Sun className="h-5 w-5" />
    ) : (
        <Moon className="h-5 w-5" />
    )}
    </button>
)
}
