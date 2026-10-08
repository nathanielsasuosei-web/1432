# 🎧 BeatForge — Music Producer Beat Store

A full-featured website for a music producer where:

- 🎛 **Admin** uploads beats & videos from a private dashboard
- 🎤 **Artists** create free accounts
- 💳 Artists pay via **Mobile Money** (MTN / Vodafone / AirtelTigo) or **Bank Transfer**
- 📬 Buyers **receive the beat via email** instantly (MP3 + WAV + license)
- 📩 Email notifications go to both artist and admin on every sale
- 🎬 A cinematic, **animated hero** greets visitors (spinning vinyl, orbiting notes, waveform, marquee)

## ✨ Features

### Frontend
- Next.js 14 App Router + React 18
- Tailwind CSS with custom dark/neon theme
- **Framer Motion** animations throughout (hero, cards, page transitions, equalizer)
- Fully responsive — desktop, tablet, mobile
- Animated sticky navbar with pill indicators
- Persistent audio player bar at the bottom
- Toast notifications for user feedback

### Pages
| Route | Purpose |
|---|---|
| `/` | Animated hero, featured beats, genres, how-it-works, CTA |
| `/beats` | Full catalog with search & genre filters |
| `/videos` | Producer videos / tutorials grid |
| `/login`, `/signup` | Artist authentication |
| `/login?next=/admin` | Producer / Admin login; opens the upload dashboard |
| `/checkout/[beatId]` | Secure checkout with **MoMo** & **Bank** tabs |
| `/dashboard` | Artist library — purchased beats, download links |
| `/admin` | Admin panel (role-gated) to upload beats & videos |

### Backend / API
| Route | Purpose |
|---|---|
| `POST /api/auth/signup` | Create artist account + welcome email |
| `POST /api/auth/login` | Log in, set httpOnly session cookie |
| `GET  /api/auth/me` | Current user + purchases |
| `POST /api/auth/logout` | Sign out |
| `GET  /api/beats` | Public beat listing |
| `POST /api/admin/beats` | Admin: upload new beat |
| `DELETE /api/admin/beats?id=` | Admin: delete beat |
| `GET/POST /api/admin/videos` | List / add videos |
| `POST /api/payments/momo` | Mobile Money charge → sends beat email |
| `POST /api/payments/bank` | Bank transfer confirmation → sends beat email |

### Email
Emails are saved to `.mailbox/*.eml` for demo purposes (see `lib/email.js`).
In production, swap in **Resend / SendGrid / Postmark / SES** — the rest of the flow
(session, payment confirmation, purchase record) is already wired up.

## 🚀 Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

### Demo accounts
- Use **Producer / Admin login** in the navigation (or mobile menu) to open the admin sign-in form. The producer uses the admin account; public signup creates artist accounts only.
- **Admin:** `admin@beatforge.com` / `admin123`
- **Artist:** sign up on `/signup` (any email/password works)

## 🗂 Project structure

```
app/               # Next.js App Router pages & API routes
  api/             # All API endpoints (auth, beats, payments, admin)
  beats/           # Beat catalog + filter
  videos/          # Video listing
  login/ signup/   # Auth pages
  checkout/[id]/   # Checkout with MoMo / Bank options
  dashboard/       # Artist library
  admin/           # Admin upload panel
  downloads/[slug] # Download landing page
components/        # React UI components (Hero, BeatCard, Navbar, Player, …)
lib/
  store.js         # In-memory data (swap for Postgres/Mongo in production)
  email.js         # Email sending (mock .eml files)
  cookies.js       # Session cookie helpers
  AuthContext.js   # Client-side auth
  CartContext.js   # Audio player state
```

## 🔌 Going to production

1. **Database** — replace `lib/store.js` with Prisma/Drizzle against Postgres/Supabase.
2. **Email** — plug Resend/Postmark into `lib/email.js` (swap the file writer).
3. **Payments** — integrate real Mobile Money APIs
   (MTN MoMo API, Hubtel, Flutterwave, Paystack) and a bank transfer gateway.
4. **File storage** — upload audio/video to S3 / Cloudflare R2 using presigned URLs.
5. **Licenses** — extend beat model with license tiers (Basic/Premium/Exclusive).
