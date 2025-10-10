// Header.tsx
import React from "react";
import { Badge } from "@/components/ui/badge";
import { daysInMonth, daysLeftInCurrentMonth } from "../utils";

export default function Header() {
    const now = new Date();
    const month = now.toLocaleString("en-US", { month: "long" });
    const year = now.getFullYear();

    return (
        <div className="flex items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Budgeting</h1>
                <p className="text-muted-foreground">Plan, track, and adjust your spending for {month} {year}.</p>
            </div>
            <Badge variant="secondary" className="text-sm">
                {daysLeftInCurrentMonth()} days left • {daysInMonth(now)} total
            </Badge>
        </div>
    );
}
