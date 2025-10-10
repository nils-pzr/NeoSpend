"use client";

import React from "react";

export default function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
    return (
        <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className={`text-base md:text-lg font-semibold ${highlight ? "text-amber-600 dark:text-amber-400" : ""}`}>
                {value}
            </div>
        </div>
    );
}
