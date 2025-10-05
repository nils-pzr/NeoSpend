"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PricingFooter() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
            className="py-20 text-center bg-primary/5 border-t border-border"
        >
            <h2 className="text-3xl font-bold mb-4">Ready to take control of your finances?</h2>
            <p className="text-muted-foreground mb-8">
                Join thousands of users simplifying their money management with NeoSpend.
            </p>
            <Button asChild size="lg">
                <Link href="/login">Get Started Now</Link>
            </Button>
        </motion.section>
    );
}