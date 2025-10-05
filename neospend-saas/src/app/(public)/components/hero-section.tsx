"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative flex flex-col items-center justify-center text-center py-24 px-6 space-y-6">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"
            >
                Manage your <span className="text-primary">Finances</span> smarter 💸
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-2xl text-muted-foreground text-lg md:text-xl"
            >
                Track expenses, analyze trends, and grow your savings effortlessly.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex gap-4 mt-6"
            >
                <Button asChild size="lg">
                    <Link href="/login">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                    <Link href="#features">Learn More</Link>
                </Button>
            </motion.div>
        </section>
    );
}