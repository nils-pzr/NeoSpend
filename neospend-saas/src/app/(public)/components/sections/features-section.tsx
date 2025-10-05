"use client";

import { motion } from "framer-motion";
import { Wallet, BarChart3, CreditCard, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function FeaturesSection() {
    const features = [
        {
            icon: <Wallet className="h-8 w-8 text-primary" />,
            title: "Smart Budgeting",
            desc: "Set personalized budgets and stay on top of your spending effortlessly.",
        },
        {
            icon: <BarChart3 className="h-8 w-8 text-primary" />,
            title: "Financial Insights",
            desc: "Visualize your spending habits and track progress in real-time.",
        },
        {
            icon: <CreditCard className="h-8 w-8 text-primary" />,
            title: "Multi-Account Tracking",
            desc: "Connect all your accounts in one place and manage transactions easily.",
        },
        {
            icon: <ShieldCheck className="h-8 w-8 text-primary" />,
            title: "Bank-Level Security",
            desc: "Your financial data is encrypted and protected with advanced security standards.",
        },
    ];

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="py-24 px-6 text-center bg-background border-t border-border"
        >
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground mb-12">
                Everything you need to manage your money in one place.
            </p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
                {features.map((f, i) => (
                    <Card key={i} className="hover:shadow-md transition-all">
                        <CardContent className="p-6 flex flex-col items-center space-y-3">
                            {f.icon}
                            <h3 className="font-semibold text-lg">{f.title}</h3>
                            <p className="text-sm text-muted-foreground">{f.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </motion.section>
    );
}