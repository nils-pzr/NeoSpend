'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { formSchema, TFormSchema } from '@/lib/form-schema';
import { sendEmailAction } from '@/actions/send-email';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, User, MessageSquare } from 'lucide-react';

export default function ContactPage() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TFormSchema>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (values: TFormSchema) => {
        try {
            const { data, error } = await sendEmailAction(values);

            if (error) {
                toast.error(error);
            } else {
                toast.success(data);
                reset();
            }
        } catch (err) {
            console.error(err);
            toast.error('An unexpected error occurred.');
        }
    };

    return (
        <section className="flex flex-col min-h-screen">
            {/* Hero */}
            <div className="bg-gradient-to-b from-primary/10 to-transparent py-20">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="container mx-auto px-6 text-center"
                >
                    <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Have questions, feedback, or partnership ideas?
                        We’d love to hear from you — our team is here to help.
                    </p>
                </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex-grow container mx-auto px-6 py-12"
            >
                <div className="max-w-3xl mx-auto">
                    <Card className="bg-card/60 backdrop-blur-md border-border shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-center">Send us a message</CardTitle>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                                        <User className="h-4 w-4 text-muted-foreground" /> Name
                                    </label>
                                    <Input
                                        {...register('name')}
                                        placeholder="Your name"
                                        className={errors.name ? 'border-destructive' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-destructive text-xs">{errors.name.message}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                                        <Mail className="h-4 w-4 text-muted-foreground" /> Email
                                    </label>
                                    <Input
                                        {...register('email')}
                                        placeholder="your@email.com"
                                        className={errors.email ? 'border-destructive' : ''}
                                    />
                                    {errors.email && (
                                        <p className="text-destructive text-xs">{errors.email.message}</p>
                                    )}
                                </div>

                                {/* Message */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                                        <MessageSquare className="h-4 w-4 text-muted-foreground" /> Message
                                    </label>
                                    <Textarea
                                        {...register('message')}
                                        placeholder="How can we help?"
                                        rows={6}
                                        className={errors.message ? 'border-destructive' : ''}
                                    />
                                    {errors.message && (
                                        <p className="text-destructive text-xs">{errors.message.message}</p>
                                    )}
                                </div>

                                {/* Submit */}
                                <div className="pt-4 text-center">
                                    <Button type="submit" size="lg" disabled={isSubmitting}>
                                        {isSubmitting ? 'Sending…' : 'Send Message'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 text-center text-muted-foreground"
                    >
                        <p>
                            Or reach us directly via email:{' '}
                            <a
                                href="mailto:business@neospend.app"
                                className="text-primary hover:underline"
                            >
                                business@neospend.app
                            </a>
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}