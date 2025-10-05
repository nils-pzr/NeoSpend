"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            <header className="flex items-center gap-3">
                <Settings className="h-6 w-6 text-primary" />
                <div>
                    <h1 className="text-2xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">
                        Passe dein Profil, Sicherheit und Präferenzen an.
                    </p>
                </div>
            </header>

            <section className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Profil</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Profilverwaltung folgt …</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Benachrichtigungen</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Benachrichtigungseinstellungen folgen …
                        </p>
                    </CardContent>
                </Card>
            </section>
        </motion.div>
    );
}