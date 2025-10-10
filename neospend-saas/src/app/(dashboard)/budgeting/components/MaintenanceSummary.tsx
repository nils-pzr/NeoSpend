"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getLastMaintenanceInfo } from "../actions";
import { History, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";

type MaintenanceData = {
    last_carryover_applied_at: string | null;
    last_auto_allocate_at: string | null;
    last_reset_rules_applied_at: string | null;
};

export default function MaintenanceSummary() {
    const [data, setData] = useState<MaintenanceData | null>(null);

    useEffect(() => {
        (async () => {
            const info = await getLastMaintenanceInfo();
            setData(info);
        })();
    }, []);

    function renderTime(label: string, dateStr: string | null) {
        if (!dateStr)
            return (
                <div className="flex items-center justify-between text-sm">
                    <span>{label}</span>
                    <span className="text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" /> Pending
          </span>
                </div>
            );
        const date = new Date(dateStr);
        return (
            <div className="flex items-center justify-between text-sm">
                <span>{label}</span>
                <span className="flex items-center gap-1 text-green-600">
          <CheckCircle2 className="w-3 h-3" />
                    {format(date, "dd MMM yyyy, HH:mm")}
        </span>
            </div>
        );
    }

    return (
        <Card className="border-border/70 bg-muted/30">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <History className="w-4 h-4" /> System Maintenance
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
                {renderTime("Carry-over applied", data?.last_carryover_applied_at ?? null)}
                {renderTime("Auto-allocate executed", data?.last_auto_allocate_at ?? null)}
                {renderTime("Reset rules applied", data?.last_reset_rules_applied_at ?? null)}
            </CardContent>
        </Card>
    );
}
