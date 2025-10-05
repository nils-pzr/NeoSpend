"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PricingTable() {
    const plans = [
        {
            name: "Starter",
            price: "€0",
            period: "/mo",
            description: "Perfect for personal finance beginners",
            features: [
                "✔ Up to 50 transactions/month",
                "✔ Basic analytics dashboard",
                "✔ Community support",
            ],
            button: { label: "Start for Free", href: "/login" },
            popular: false,
        },
        {
            name: "Pro",
            price: "€5",
            period: "/mo",
            description: "Ideal for growing users and organizations",
            features: [
                "✔ Unlimited transactions",
                "✔ Advanced insights & charts",
                "✔ Priority email support",
            ],
            button: { label: "Upgrade Now", href: "/" },
            popular: true,
        },
    ];

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="py-20 px-6 text-center max-w-5xl mx-auto"
        >
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Pricing Plans</h2>
            <p className="text-muted-foreground mb-12">
                Simple, transparent, and flexible — upgrade any time.
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-8">
                {plans.map((plan, i) => (
                    <div
                        key={i}
                        className={`relative border rounded-2xl p-8 w-full md:w-80 bg-card shadow-sm hover:shadow-lg transition-all ${
                            plan.popular ? "border-primary bg-primary/5" : ""
                        }`}
                    >
                        {plan.popular && (
                            <span className="absolute -top-3 right-6 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </span>
                        )}
                        <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                        <p className="text-muted-foreground mb-4">{plan.description}</p>
                        <p className="text-4xl font-bold mb-6">
                            {plan.price}
                            <span className="text-base font-medium text-muted-foreground">{plan.period}</span>
                        </p>
                        <ul className="text-sm text-left space-y-2 mb-8">
                            {plan.features.map((f, j) => (
                                <li key={j}>{f}</li>
                            ))}
                        </ul>
                        <Button asChild className="w-full">
                            <Link href={plan.button.href}>{plan.button.label}</Link>
                        </Button>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}