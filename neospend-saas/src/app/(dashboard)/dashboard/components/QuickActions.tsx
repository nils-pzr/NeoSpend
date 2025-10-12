"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListOrdered, ChartLine, WalletCards } from "lucide-react";

export default function QuickActions() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
                <Button asChild>
                    <Link href="/dashboard/transactions">
                        <ListOrdered className="mr-2 h-4 w-4" /> Transaktionen
                    </Link>
                </Button>
                <Button variant="secondary" asChild>
                    <Link href="/dashboard/budgeting">
                        <WalletCards className="mr-2 h-4 w-4" /> Budgets
                    </Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/dashboard/analytics">
                        <ChartLine className="mr-2 h-4 w-4" /> Analysen
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
