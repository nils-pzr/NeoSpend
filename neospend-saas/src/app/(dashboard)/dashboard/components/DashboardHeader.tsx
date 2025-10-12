// app/(dashboard)/dashboard/components/DashboardHeader.tsx
import { Card, CardContent } from "@/components/ui/card";

function formatMonth(date = new Date()) {
    return date.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
    });
}

export default function DashboardHeader({
                                            name = "Nils",
                                        }: {
    name?: string;
}) {
    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardContent className="px-0">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                        Welcome back<span className="ml-2">👋</span>
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Here’s an overview of your financial activity for {formatMonth()}.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
