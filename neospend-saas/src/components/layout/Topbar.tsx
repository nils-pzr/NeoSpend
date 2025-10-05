// src/components/layout/Topbar.tsx
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export default function Topbar() {
    const [email, setEmail] = useState<string | null>(null);
    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    }, []);

    return (
        <header className="border-b">
            <div className="container max-w-6xl mx-auto flex items-center justify-between p-4">
                <div className="font-medium">Dashboard</div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{email}</span>
                    <Button
                        variant="outline"
                        onClick={async () => {
                            await supabase.auth.signOut();
                            window.location.href = '/';
                        }}
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    );
}