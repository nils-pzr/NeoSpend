import { z } from 'zod';

/**
 * Formularvalidierung für das Kontaktformular von NeoSpend.
 * Wird sowohl client- als auch serverseitig verwendet.
 */
export const formSchema = z.object({
    name: z.string().min(1, { message: 'Name ist erforderlich' }),
    email: z
        .string()
        .min(1, { message: 'E-Mail ist erforderlich' })
        .email({ message: 'Bitte eine gültige E-Mail-Adresse angeben' }),
    message: z
        .string()
        .min(5, { message: 'Nachricht ist zu kurz' })
        .max(2000, { message: 'Nachricht ist zu lang (max. 2000 Zeichen)' }),
});

export type TFormSchema = z.infer<typeof formSchema>;