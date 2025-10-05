"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
    {
        name: "Lisa M.",
        role: "Freelancer",
        text: "NeoSpend completely changed how I manage my business finances. The analytics are so intuitive!",
        image: "/avatars/lisa.png",
    },
    {
        name: "Daniel K.",
        role: "Student",
        text: "I love how easy it is to track my expenses and set goals. The clean interface is a big plus.",
        image: "/avatars/daniel.png",
    },
    {
        name: "Sophie R.",
        role: "Designer",
        text: "Finally, a finance app that feels modern and actually enjoyable to use!",
        image: "/avatars/sophie.png",
    },
];

export default function TestimonialsSection() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="py-24 px-6 bg-card border-t border-border text-center"
        >
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground mb-12">Real feedback from NeoSpend users</p>

            <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
                {testimonials.map((t, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.2 }}
                        className="rounded-xl border border-border bg-background p-6 shadow-sm"
                    >
                        <div className="flex flex-col items-center space-y-3">
                            <Image
                                src={t.image}
                                alt={t.name}
                                width={64}
                                height={64}
                                className="rounded-full border border-border"
                            />
                            <p className="text-sm text-muted-foreground">“{t.text}”</p>
                            <div className="text-sm font-medium">
                                {t.name} <span className="text-muted-foreground">• {t.role}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}