// app/(dashboard)/dashboard/components/QuickActions.tsx
import Link from "next/link";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ListOrdered,
    ChartLine,
    Settings2,
    WalletCards,
} from "lucide-react";

export default function QuickActions() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
                <Button asChild>
                    <Link href="/dashboard/transactions">
                        <ListOrdered className="mr-2 h-4 w-4" />
                        View Transactions
                    </Link>
                </Button>

                <Button variant="secondary" asChild>
                    <Link href="/dashboard/budgeting">
                        <WalletCards className="mr-2 h-4 w-4" />
                        Manage Budgets
                    </Link>
                </Button>

                <Button variant="outline" asChild>
                    <Link href="/dashboard/analytics">
                        <ChartLine className="mr-2 h-4 w-4" />
                        View Analytics
                    </Link>
                </Button>

                <Button variant="ghost" asChild>
                    <Link href="/dashboard/settings">
                        <Settings2 className="mr-2 h-4 w-4" />
                        Settings
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}
