"use client";

import { Wallet } from "lucide-react";

export default function DashboardHeader() {
    return (
        <header className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
                <Wallet className="h-6 w-6 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Überblick über deine Finanzen und Budgets.
                    </p>
                </div>
            </div>
        </header>
    );
}
