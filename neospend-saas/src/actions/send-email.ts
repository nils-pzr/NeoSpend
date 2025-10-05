'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function subscribeToNewsletter(formData: FormData) {
    const email = formData.get('email')?.toString()
    if (!email) return { error: 'Please enter a valid email address.' }

    const supabase = await createSupabaseServerClient()

    // Prüfen, ob die E-Mail schon existiert
    const { data: existing } = await supabase
        .from('newsletter_subscribers')
        .select('email')
        .eq('email', email)
        .maybeSingle()

    if (existing) return { error: 'You are already subscribed!' }

    // In DB speichern
    const { error } = await supabase.from('newsletter_subscribers').insert({ email })
    if (error) {
        console.error('[Subscribe] DB insert error:', error)
        return { error: 'Something went wrong. Please try again later.' }
    }

    // ======================================
    // ✉️ 1. Willkommens-Mail an den Nutzer
    // ======================================
    try {
        const { error: sendError } = await resend.emails.send({
            from: 'NeoSpend <onboarding@resend.dev>', // wichtig: Standard-Absender
            to: email,
            subject: 'Willkommen bei NeoSpend 💸',
            html: `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>Willkommen bei NeoSpend</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f6fa; font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#222; line-height:1.6;">
  <div style="max-width:640px; margin:40px auto; background:#ffffff; border-radius:14px; box-shadow:0 8px 24px rgba(0,0,0,0.05); overflow:hidden;">
    <div style="background:linear-gradient(135deg,#6C63FF,#A491FF); color:white; padding:28px 20px; text-align:center;">
      <h1 style="margin:0; font-size:24px; font-weight:600;">Willkommen bei NeoSpend 🚀</h1>
      <p style="margin:6px 0 0; font-size:14px; opacity:0.9;">Danke für deine Anmeldung zum Newsletter</p>
    </div>
    <div style="padding:32px 28px;">
      <p style="font-size:16px;">Hey 👋,</p>
      <p style="font-size:16px;">Schön, dass du dabei bist! Ab sofort erhältst du Updates zu neuen Features, Finanztipps und exklusive Einblicke hinter die Entwicklung von <strong>NeoSpend</strong>.</p>
      <div style="background:#f8f9fb; border-left:4px solid #6C63FF; padding:16px 20px; border-radius:8px; margin-top:10px;">
        <p style="margin:0; font-size:15px;">💡 <strong>Tipp:</strong> Füge <strong>onboarding@resend.dev</strong> zu deinen Kontakten hinzu, damit keine Mail verloren geht.</p>
      </div>
      <p style="margin-top:28px; text-align:center;">
        <a href="https://nils-pzr.eu"
           style="background:#6C63FF; color:white; text-decoration:none; padding:12px 28px; border-radius:8px; font-weight:500; font-size:15px;">
          NeoSpend entdecken
        </a>
      </p>
      <p style="margin-top:28px; font-size:14px; color:#555; text-align:center;">
        Du kannst dich jederzeit abmelden – einfach mit einem Klick in einer unserer E-Mails.
      </p>
    </div>
    <div style="background:#fafafa; border-top:1px solid #eee; padding:18px; text-align:center;">
      <p style="font-size:13px; color:#888; margin:0;">
        © ${new Date().getFullYear()} NeoSpend by Nils Plützer. Alle Rechte vorbehalten.
      </p>
      <a href="https://neospend.nils-pzr.eu" style="color:#6C63FF; font-size:13px; text-decoration:none;">
        neospend.app
      </a>
    </div>
  </div>
</body>
</html>`,
        })

        if (sendError) console.error('[Resend Welcome Error]:', sendError)
    } catch (err) {
        console.error('❌ Welcome email failed:', err)
    }

    // ======================================
    // ✉️ 2. Admin-Mail an dich selbst
    // ======================================
    try {
        const { error: notifyError } = await resend.emails.send({
            from: 'NeoSpend <onboarding@resend.dev>', // gleich halten!
            to: process.env.CONTACT_RECEIVER || 'neospend@gmail.com',
            subject: '🆕 Neuer Newsletter-Abonnent',
            html: `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>Neuer Newsletter-Abonnent</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f6fa; font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#222; line-height:1.6;">
  <div style="max-width:640px; margin:40px auto; background:#ffffff; border-radius:14px; box-shadow:0 8px 24px rgba(0,0,0,0.05); overflow:hidden;">
    <div style="background:linear-gradient(135deg,#6C63FF,#A491FF); color:white; padding:28px 20px; text-align:center;">
      <h1 style="margin:0; font-size:24px; font-weight:600;">Neuer Newsletter-Abonnent</h1>
      <p style="margin:6px 0 0; font-size:14px; opacity:0.9;">über dein NeoSpend Newsletter-Formular</p>
    </div>
    <div style="padding:32px 28px;">
      <p style="font-size:16px;">Hey <strong>Nils</strong> 👋,</p>
      <p style="font-size:16px;">jemand hat sich gerade neu eingetragen:</p>
      <table style="width:100%; border-collapse:collapse; margin-bottom:20px;">
        <tr>
          <td style="width:120px; font-weight:600; color:#6C63FF;">E-Mail:</td>
          <td><a href="mailto:${email}" style="color:#6C63FF; text-decoration:none;">${email}</a></td>
        </tr>
      </table>
      <div style="background:#f8f9fb; border-left:4px solid #6C63FF; padding:16px 20px; border-radius:8px; margin-top:10px;">
        <p style="margin:0; font-size:15px;">📬 Neuer Abonnent in deiner Liste!</p>
      </div>
      <p style="margin-top:28px; font-size:14px; color:#555; text-align:center;">
        Diese Benachrichtigung wurde automatisch vom <strong>NeoSpend Newsletter-System</strong> generiert.
      </p>
    </div>
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
</html>`,
        })

        if (notifyError) console.error('[Resend Admin Error]:', notifyError)
    } catch (err) {
        console.error('❌ Admin email failed:', err)
    }

    return { success: 'You have been successfully subscribed!' }
}
