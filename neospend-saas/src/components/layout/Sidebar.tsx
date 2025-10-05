// src/components/layout/Sidebar.tsx
'use client';
import Link from 'next/link';
import { Wallet, LineChart, BarChart3, Settings, Table } from 'lucide-react';

const nav = [
    { href: '/(dashboard)', label: 'Overview', icon: Wallet },
    { href: '/(dashboard)/transactions', label: 'Transactions', icon: Table },
    { href: '/(dashboard)/analytics', label: 'Analytics', icon: LineChart },
    { href: '/(dashboard)/budgeting', label: 'Budgeting', icon: BarChart3 },
    { href: '/(dashboard)/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
    return (
        <nav className="p-4 space-y-2">
            <div className="mb-4 text-lg font-semibold">NeoSpend</div>
            {nav.map(({ href, label, icon: Icon }) => (
                <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted"
                >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                </Link>
            ))}
        </nav>
    );
}