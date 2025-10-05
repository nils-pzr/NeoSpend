"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTASection() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="py-24 text-center border-t border-border bg-primary/5"
        >
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-8">
                Join thousands of users managing their finances with NeoSpend.
            </p>
            <Button asChild size="lg">
                <Link href="/login">Start Free Today</Link>
            </Button>
        </motion.section>
    );
}