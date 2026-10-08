// Mock email sender — logs to console and writes to .mailbox for debugging.
// In production replace with Resend / SendGrid / Postmark / SES.
import fs from 'fs'
import path from 'path'

const MAILBOX = path.join(process.cwd(), '.mailbox')
try { fs.mkdirSync(MAILBOX, { recursive: true }) } catch {}

function writeEmail(to, subject, html, text) {
  const filename = path.join(MAILBOX, `${Date.now()}-${to.replace(/[^a-z0-9]/gi,'_')}.eml`)
  const body = `To: ${to}\nSubject: ${subject}\n\n${text || html}`
  fs.writeFileSync(filename, body)
  console.log(`[email] → ${to} | ${subject}  (saved to ${filename})`)
}

export function sendPurchaseConfirmation({ to, name, beat, downloadUrl, reference, method }) {
  const subject = `🎧 Your beat "${beat.title}" is ready — BeatForge`
  const text = `
Hi ${name},

Thanks for your purchase! Your payment via ${method} (ref: ${reference}) was successful.

Beat: ${beat.title}
Genre: ${beat.genre} | BPM: ${beat.bpm} | Key: ${beat.key}
Price: $${beat.price}

Download your beat here: ${downloadUrl}
(Link is valid for 30 days)

If you have any questions reply to this email.

Keep creating,
— The BeatForge Team
`
  const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0a0a0f;color:#fff;border-radius:16px;">
  <div style="font-size:28px;font-weight:800;background:linear-gradient(90deg,#8b5cf6,#fbbf24);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">BEATFORGE</div>
  <h2 style="margin-top:24px;">🎧 Your beat is ready, ${name}!</h2>
  <p>Payment <strong style="color:#10b981;">confirmed</strong> via ${method}. Reference: <code>${reference}</code></p>
  <div style="background:#12121a;border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:16px;margin:20px 0;">
    <strong>${beat.title}</strong><br/>
    ${beat.genre} · ${beat.bpm} BPM · ${beat.key}<br/>
    <span style="color:#fbbf24;font-weight:700;">$${beat.price}</span>
  </div>
  <a href="${downloadUrl}" style="display:inline-block;padding:14px 28px;background:linear-gradient(90deg,#8b5cf6,#7c3aed);color:#fff;text-decoration:none;border-radius:999px;font-weight:700;">⬇ Download Beat</a>
  <p style="margin-top:24px;color:#aaa;font-size:13px;">If you didn't make this purchase you can safely ignore this email.</p>
</div>`
  writeEmail(to, subject, html, text)
}

export function sendWelcome({ to, name }) {
  const subject = 'Welcome to BeatForge 🎵'
  const text = `Hi ${name},\n\nWelcome to BeatForge! Your account is ready.\n\nBrowse beats: /beats\n\nKeep creating!`
  writeEmail(to, subject, `<h2>Welcome to BeatForge, ${name}!</h2><p>Your artist account is ready. <a href="/beats">Browse beats →</a></p>`, text)
}

export function sendNotification({ to, subject, message }) {
  writeEmail(to, subject, `<p>${message}</p>`, message)
}
