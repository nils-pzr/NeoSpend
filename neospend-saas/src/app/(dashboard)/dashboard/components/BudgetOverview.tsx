// app/(dashboard)/dashboard/components/BudgetOverview.tsx
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type BudgetItem = {
    name: string;
    used: number; // 0..1
    amountUsed: number; // absolute numbers for the hint
    limit: number;
};

const demo: BudgetItem[] = [
    { name: "Groceries", used: 0.73, amountUsed: 220, limit: 300 },
    { name: "Subscriptions", used: 0.48, amountUsed: 24, limit: 50 },
    { name: "Leisure", used: 0.21, amountUsed: 42, limit: 200 },
    { name: "Transport", used: 0.36, amountUsed: 72, limit: 200 },
];

function currency(n: number) {
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
    }).format(n);
}

export default function BudgetOverview({ items = demo }: { items?: BudgetItem[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Budget Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {items.map((b) => (
                    <div key={b.name} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{b.name}</span>
                            <span className="text-muted-foreground">
                {currency(b.amountUsed)} / {currency(b.limit)}
              </span>
                        </div>
                        <Progress value={Math.round(b.used * 100)} />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
