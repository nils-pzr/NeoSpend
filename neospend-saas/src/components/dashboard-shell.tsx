"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    Home,
    ListOrdered,
    Settings,
    Wallet2,
    Menu,
    X,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // ✅ Wichtige Korrektur: Keine /dashboard/-Präfixe außer bei "Dashboard"
    const links = [
        { name: "Dashboard", href: "/dashboard", icon: Home },
        { name: "Transactions", href: "/transactions", icon: ListOrdered },
        { name: "Budgeting", href: "/budgeting", icon: Wallet2 },
        { name: "Analytics", href: "/analytics", icon: BarChart3 },
        { name: "Settings", href: "/settings", icon: Settings },
    ];

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(`${href}/`);

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-card border-r border-border transition-transform duration-200 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:inset-0`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between border-b border-border px-4 py-4">
                        <h1 className="text-lg font-semibold">NeoSpend</h1>
                        <button
                            className="md:hidden"
                            onClick={() => setSidebarOpen(false)}
                            aria-label="Close sidebar"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <nav className="flex-1 px-3 py-4 space-y-1">
                        {links.map(({ name, href, icon: Icon }) => (
                            <Link
                                key={name}
                                href={href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                ${
                                    isActive(href)
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                }`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <Icon className="h-4 w-4" />
                                {name}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-auto border-t border-border px-4 py-4 flex items-center justify-between">
                        <ThemeToggle />
                        <form action="/api/logout" method="post">
                            <button
                                type="submit"
                                className="text-sm text-red-500 hover:text-red-600 hover:underline underline-offset-4 transition-all"
                            >
                                Logout
                            </button>
                        </form>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-col flex-1">
                {/* Header (mobile) */}
                <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open sidebar"
                        className="flex items-center gap-2"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="font-semibold">NeoSpend Dashboard</span>
                    </button>
                    <ThemeToggle />
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}