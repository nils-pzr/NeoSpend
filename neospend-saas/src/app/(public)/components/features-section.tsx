"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, BarChart3, PiggyBank } from "lucide-react";

export default function FeaturesSection() {
    const features = [
        {
            icon: <Wallet className="h-8 w-8 text-primary" />,
            title: "Smart Budgeting",
            text: "Set spending goals and visualize your limits in real-time.",
        },
        {
            icon: <BarChart3 className="h-8 w-8 text-primary" />,
            title: "Analytics Dashboard",
            text: "Understand your spending patterns through clear insights.",
        },
        {
            icon: <PiggyBank className="h-8 w-8 text-primary" />,
            title: "Save Intelligently",
            text: "Automate your savings and track progress over time.",
        },
    ];

    return (
        <motion.section
            id="features"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid gap-6 md:grid-cols-3 px-6 md:px-12 py-24"
        >
            {features.map((feature, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * i }}
                >
                    <Card className="group hover:shadow-xl hover:border-primary/40 transition-all duration-300 backdrop-blur-sm">
                        <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                            <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-semibold">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground">{feature.text}</p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </motion.section>
    );
}