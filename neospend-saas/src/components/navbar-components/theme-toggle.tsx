'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    const isDark = theme === 'dark';

    return (
        <Toggle
            variant="outline"
            pressed={isDark}
            onPressedChange={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            className="group size-8 rounded-full border-none bg-transparent text-muted-foreground hover:bg-muted transition-all"
        >
            <Moon
                size={16}
                className="shrink-0 scale-0 opacity-0 transition-all group-data-[state=on]:scale-100 group-data-[state=on]:opacity-100"
                aria-hidden="true"
            />
            <Sun
                size={16}
                className="absolute shrink-0 scale-100 opacity-100 transition-all group-data-[state=on]:scale-0 group-data-[state=on]:opacity-0"
                aria-hidden="true"
            />
        </Toggle>
    );
}