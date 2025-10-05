"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TransactionsPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            <header className="flex items-center gap-3">
                <ListOrdered className="h-6 w-6 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold">Transactions</h1>
                    <p className="text-muted-foreground">
                        Alle deine Einnahmen und Ausgaben im Überblick.
                    </p>
                </div>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>Letzte Transaktionen</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between border-b border-border pb-2">
                            <span>Einkauf bei Rewe</span>
                            <span className="text-red-500">- 23,49 €</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-border pb-2">
                            <span>Gehalt</span>
                            <span className="text-green-500">+ 1 250 €</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-border pb-2">
                            <span>Spotify</span>
                            <span className="text-red-500">- 9,99 €</span>
                        </div>
                    </div>
                    <Button variant="secondary" className="mt-4 w-full">
                        Alle Transaktionen anzeigen
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
}