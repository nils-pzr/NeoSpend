// app/(dashboard)/dashboard/components/RecentTransactions.tsx
import Link from "next/link";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Tx = {
    id: string;
    title: string;
    amount: number; // negative = expense, positive = income
    date: string; // ISO or friendly
};

const demo: Tx[] = [
    { id: "1", title: "Rewe Supermarkt", amount: -23.49, date: "2025-10-12" },
    { id: "2", title: "Spotify", amount: -9.99, date: "2025-10-11" },
    { id: "3", title: "Gehalt", amount: +1250, date: "2025-10-10" },
];

function currency(n: number) {
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
    }).format(n);
}

function cls(...xs: (string | false | undefined)[]) {
    return xs.filter(Boolean).join(" ");
}

export default function RecentTransactions({ items = demo }: { items?: Tx[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {items.map((t) => (
                    <div
                        key={t.id}
                        className="flex items-center justify-between rounded-md border px-3 py-2"
                    >
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{t.title}</p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(t.date).toLocaleDateString()}
                            </p>
                        </div>
                        <div
                            className={cls(
                                "text-sm font-medium tabular-nums",
                                t.amount >= 0
                                    ? "text-emerald-600 dark:text-emerald-500"
                                    : "text-rose-600 dark:text-rose-500"
                            )}
                        >
                            {t.amount >= 0 ? "+" : "-"}
                            {currency(Math.abs(t.amount))}
                        </div>
                    </div>
                ))}
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href="/dashboard/transactions">View All</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
