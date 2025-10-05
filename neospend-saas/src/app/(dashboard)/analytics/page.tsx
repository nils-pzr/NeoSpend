"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            <header className="flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold">Analytics</h1>
                    <p className="text-muted-foreground">
                        Überblick über deine Ausgaben, Einnahmen und Trends.
                    </p>
                </div>
            </header>

            <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Monatliche Ausgaben</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Diagramm folgt …</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Einnahmen</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Diagramm folgt …</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Sparquote</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Diagramm folgt …</p>
                    </CardContent>
                </Card>
            </section>
        </motion.div>
    );
}