"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Wallet } from "lucide-react";

export default function BudgetingPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            <header className="flex items-center gap-3">
                <Wallet className="h-6 w-6 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold">Budgeting</h1>
                    <p className="text-muted-foreground">
                        Verwalte deine monatlichen Budgets und Ausgabenlimits.
                    </p>
                </div>
            </header>

            <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Monatsbudget</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Hier kannst du dein Budget festlegen.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Kategorien</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Z. B. Lebensmittel, Freizeit, Transport …
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Fortschritt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Visualisierung folgt …</p>
                    </CardContent>
                </Card>
            </section>
        </motion.div>
    );
}