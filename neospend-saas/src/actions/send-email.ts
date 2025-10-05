'use server';

import { Resend } from 'resend';
import { env } from '@/env.mjs';
import { formSchema, TFormSchema } from '@/lib/form-schema';

const resend = new Resend(env.RESEND_API_KEY);

export const sendEmailAction = async (data: TFormSchema) => {
    try {
        const { name, email, message } = formSchema.parse(data);

        // Inhalt absichern (kein Script-Injection)
        const safeMessage = message
            .replace(/\n/g, '<br />')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // ✨ Neues Design
        await resend.emails.send({
            from: 'NeoSpend Contact <onboarding@resend.dev>',
            to: 'neospend@gmail.com',
            subject: 'Neue Nachricht von deinem NeoSpend Kontaktformular',
            replyTo: email,
            text: `Von: ${name} (${email})\n\n${message}`,
            html: `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>Neue Nachricht von NeoSpend</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f6fa; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#222; line-height:1.6;">
  <div style="max-width:640px; margin:40px auto; background:#ffffff; border-radius:14px; box-shadow:0 8px 24px rgba(0,0,0,0.05); overflow:hidden;">
    
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#6C63FF,#A491FF); color:white; padding:28px 20px; text-align:center;">
      <h1 style="margin:0; font-size:24px; font-weight:600;">Neue Kontaktanfrage</h1>
      <p style="margin:6px 0 0; font-size:14px; opacity:0.9;">über das NeoSpend Kontaktformular</p>
    </div>

    <!-- Content -->
    <div style="padding:32px 28px;">
      <p style="font-size:16px; margin:0 0 12px;">Hey <strong>NeoSpend Team</strong>,</p>
      <p style="font-size:16px; margin:0 0 16px;">du hast eine neue Nachricht erhalten:</p>

      <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
        <tr>
          <td style="width:120px; font-weight:600; color:#6C63FF;">Name:</td>
          <td>${name}</td>
        </tr>
        <tr>
          <td style="width:120px; font-weight:600; color:#6C63FF;">E-Mail:</td>
          <td><a href="mailto:${email}" style="color:#6C63FF; text-decoration:none;">${email}</a></td>
        </tr>
      </table>

      <div style="background:#f8f9fb; border-left:4px solid #6C63FF; padding:16px 20px; border-radius:8px; margin-top:10px;">
        <p style="margin:0; font-size:15px;">${safeMessage}</p>
      </div>

      <p style="margin-top:28px; font-size:14px; color:#555; text-align:center;">
        Diese Nachricht wurde automatisch über dein 
        <strong>NeoSpend Kontaktformular</strong> generiert.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#fafafa; border-top:1px solid #eee; padding:18px; text-align:center;">
      <p style="font-size:13px; color:#888; margin:0;">
        © ${new Date().getFullYear()} NeoSpend. Alle Rechte vorbehalten.
      </p>
      <a href="https://neospend.nils-pzr.eu" style="color:#6C63FF; font-size:13px; text-decoration:none;">
        neospend.app
      </a>
    </div>

  </div>
</body>
</html>
      `,
        });

        return { data: 'Message sent successfully!' };
    } catch (error) {
        console.error('[sendEmailAction] Error:', error);
        return { error: 'An error occurred while sending your message.' };
    }
};