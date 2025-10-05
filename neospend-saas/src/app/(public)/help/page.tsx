'use client';

import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/section-heading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Mail, Shield, CreditCard, Info } from 'lucide-react';

// ✅ Definiere die erlaubten Kategorien-Typen
type Category = 'Getting Started' | 'Security' | 'Billing';

interface CategoryItem {
    name: Category;
    icon: React.ReactElement;
}

interface FAQItem {
    q: string;
    a: string;
}

export default function HelpCenterPage() {
    // ✅ Kategorien getypt
    const categories: CategoryItem[] = [
        { name: 'Getting Started', icon: <Info className="h-4 w-4 mr-1" /> },
        { name: 'Security', icon: <Shield className="h-4 w-4 mr-1" /> },
        { name: 'Billing', icon: <CreditCard className="h-4 w-4 mr-1" /> },
    ];

    // ✅ FAQ sauber getypt mit Record<Category, FAQItem[]>
    const faqs: Record<Category, FAQItem[]> = {
        'Getting Started': [
            {
                q: 'How do I create an account?',
                a: 'Click “Sign Up” on the homepage, enter your email, and follow the verification link.',
            },
            {
                q: 'Can I import my transactions?',
                a: 'Yes! You can upload a CSV file or connect your bank account securely.',
            },
        ],
        Security: [
            {
                q: 'How is my data protected?',
                a: 'We use AES-256 encryption and comply with GDPR to ensure your information stays safe.',
            },
            {
                q: 'Do you share data with third parties?',
                a: 'No. Your financial data stays private — we never sell or share it.',
            },
        ],
        Billing: [
            {
                q: 'Can I change my subscription?',
                a: 'Yes, you can switch between plans anytime from your account settings.',
            },
            {
                q: 'What payment methods are supported?',
                a: 'We accept credit cards, PayPal, and selected EU SEPA transfers.',
            },
        ],
    };

    return (
        <section className="container mx-auto px-4 py-16">
            <SectionHeading>Help Center</SectionHeading>

            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-8">
                Find answers, learn best practices, and get help with your NeoSpend account.
            </p>

            {/* ✅ Tabs für Kategorien */}
            <Tabs defaultValue="Getting Started" className="w-full">
                <TabsList className="flex justify-center flex-wrap gap-2 mb-8">
                    {categories.map((cat) => (
                        <TabsTrigger key={cat.name} value={cat.name}>
              <span className="flex items-center">
                {cat.icon}
                  {cat.name}
              </span>
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* ✅ Dynamische Inhalte für jede Kategorie */}
                {categories.map((cat) => (
                    <TabsContent key={cat.name} value={cat.name}>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-2xl mx-auto"
                        >
                            <Accordion type="single" collapsible className="w-full">
                                {faqs[cat.name].map((item, i) => (
                                    <AccordionItem key={i} value={`item-${i}`}>
                                        <AccordionTrigger>{item.q}</AccordionTrigger>
                                        <AccordionContent>{item.a}</AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </motion.div>
                    </TabsContent>
                ))}
            </Tabs>

            {/* ✅ Call-to-action unten */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="mt-12 text-center"
            >
                <p className="text-muted-foreground mb-3">Still need help?</p>
                <Button asChild>
                    <a href="/contact">
                        <Mail className="mr-2 h-4 w-4" /> Contact Support
                    </a>
                </Button>
            </motion.div>
        </section>
    );
}