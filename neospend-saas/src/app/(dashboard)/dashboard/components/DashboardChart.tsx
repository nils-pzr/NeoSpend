// app/(dashboard)/dashboard/components/DashboardChart.tsx
"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ResponsiveContainer,
    LineChart,
    CartesianGrid,
    Line,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

type TrendPoint = { week: string; income: number; expense: number; net?: number };

function toCumulative(data: TrendPoint[]) {
    let acc = 0;
    return data.map((d) => {
        acc += (d.income ?? 0) - (d.expense ?? 0);
        return { ...d, net: acc };
    });
}

const demo: TrendPoint[] = toCumulative([
    { week: "W1", income: 800, expense: 620 },
    { week: "W2", income: 400, expense: 520 },
    { week: "W3", income: 900, expense: 740 },
    { week: "W4", income: 1100, expense: 900 },
]);

export default function DashboardChart({ data = demo }: { data?: TrendPoint[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>This Month Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeOpacity={0.2} vertical={false} />
                        <XAxis dataKey="week" tickMargin={8} />
                        <YAxis tickMargin={8} />
                        <Tooltip />
                        <Line type="monotone" dataKey="income" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="expense" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="net" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
