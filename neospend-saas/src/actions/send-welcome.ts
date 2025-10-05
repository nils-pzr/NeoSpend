'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function sendWelcomeEmail(email: string) {
    if (!email) return

    try {
        await resend.emails.send({
            from: 'NeoSpend <no-reply@neospend.de>',
            to: email,
            subject: 'Welcome to NeoSpend 💸',
            replyTo: 'neospend@gmail.com',
            html: `
      <html>
      <body style="margin:0;padding:0;background-color:#f8f8fb;font-family:Inter,Arial,sans-serif;color:#222;">
        <div style="max-width:520px;margin:40px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.06);">
          <div style="background:linear-gradient(135deg,#6C63FF,#A491FF);color:white;text-align:center;padding:28px 20px;">
            <h1 style="margin:0;font-size:22px;">Welcome to NeoSpend 💸</h1>
            <p style="margin:8px 0 0;font-size:14px;opacity:0.9;">Your account is ready</p>
          </div>

          <div style="padding:30px 26px;">
            <p style="font-size:16px;margin-top:0;">Hey there 👋</p>
            <p style="font-size:15px;margin-bottom:18px;">
              Thanks for signing up! You can now explore your dashboard and start managing your finances smarter.
            </p>
            <div style="text-align:center;margin:28px 0;">
              <a href="https://app.neospend.de/dashboard" 
                 style="background:#7546E8;color:white;padding:10px 22px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:500;">
                 Go to Dashboard
              </a>
            </div>
            <p style="font-size:13px;color:#777;text-align:center;margin-top:30px;">
              © ${new Date().getFullYear()} NeoSpend. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>`,
        })
    } catch (err) {
        console.error('❌ Failed to send welcome email:', err)
    }
}