"use client";

import { motion } from "framer-motion";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function PricingFAQ() {
    const faqs = [
        {
            q: "Can I cancel my subscription anytime?",
            a: "Yes, you can cancel anytime. Your data and preferences will remain safely stored for future access.",
        },
        {
            q: "Is there a free trial for the Pro plan?",
            a: "Absolutely! Every new user gets a 14-day free trial with full access to all Pro features.",
        },
        {
            q: "Do you support multiple currencies?",
            a: "Yes, NeoSpend supports all major currencies and automatically converts between them in analytics.",
        },
        {
            q: "How secure is my financial data?",
            a: "We use end-to-end encryption and industry-leading security standards. Your data is never shared with third parties.",
        },
    ];

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="py-24 px-6 max-w-3xl mx-auto text-center"
        >
            <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-muted-foreground mb-10">
                Everything you need to know about NeoSpend’s pricing and plans.
            </p>

            <Accordion
                type="single"
                collapsible
                className="text-left space-y-3"
            >
                {faqs.map((faq, i) => (
                    <AccordionItem
                        key={i}
                        value={`item-${i}`}
                        className="border border-border rounded-lg bg-card shadow-sm"
                    >
                        <AccordionTrigger className="px-4 py-3 text-base font-medium hover:no-underline hover:bg-accent/20 transition">
                            {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 text-muted-foreground text-sm leading-relaxed">
                            {faq.a}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </motion.section>
    );
}