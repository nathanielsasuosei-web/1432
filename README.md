# 🎧 BeatForge — Music Producer Beat Store

A full-featured website for a music producer where:

- 🎛 **Admin** uploads beats & videos from a private dashboard
- 🎤 **Artists** create free accounts
- 💳 Artists pay via **Mobile Money** (MTN / Vodafone / AirtelTigo) or **Bank Transfer**
- 📬 Buyers **receive the beat via email** instantly (MP3 + WAV + license)
- 📩 Email notifications go to both artist and admin on every sale
- 📅 Artists **book the producer** (custom beats, production, mixing, sessions) — the producer receives every booking order **on the website dashboard and straight on his WhatsApp**
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
| `/book` | **Book the producer** — pick a service, send a booking order. It lands on the admin dashboard **and the producer's WhatsApp instantly**. |
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
| `POST /api/bookings` | Public: submit a **booking order** → notifies the producer on WhatsApp + email |
| `GET  /api/admin/bookings` | Admin: list all booking orders (newest first) |
| `PATCH /api/admin/bookings` | Admin: update status and/or **reply** (reply is pushed to the artist's WhatsApp) |

### Email
Emails are saved to `.mailbox/*.eml` for demo purposes (see `lib/email.js`).
In production, swap in **Resend / SendGrid / Postmark / SES** — the rest of the flow
(session, payment confirmation, purchase record) is already wired up.

### 📅 Bookings & WhatsApp
The producer can now receive **booking orders** (custom beats, production, mixing,
studio sessions, songwriting) two ways at once:

1. **On the website** — the **Admin → Bookings** inbox lists every order with the
   artist's details, a chat thread, and quick status actions (Confirm / Decline /
   Complete). It auto-refreshes every 15s, and the tab shows a live pending count.
2. **On his WhatsApp** — the moment an order is submitted, a formatted message
   (service, budget, date, details) is pushed to the producer's number via the
   **Meta WhatsApp Business Cloud API**.

The producer can **reply from the dashboard** — the reply is saved in the thread
*and* delivered to the artist's WhatsApp — or tap "chat" to open a `wa.me` link.

**WhatsApp delivery (`lib/whatsapp.js`) runs in two modes:**

- **Demo (default, no config):** messages are written to the local `.whatsapp/`
  outbox as `.json` (mirrors `.mailbox/` for email) and logged to the console, so
  the whole flow works out of the box.
- **Live:** set the env vars below to route real messages through the
  WhatsApp Business Platform. If a live send fails, it automatically falls back
  to the demo outbox so no booking is ever lost.

```bash
# .env.local
WHATSAPP_ACCESS_TOKEN=      # Meta system-user token
WHATSAPP_PHONE_NUMBER_ID=   # registered sender number id
WHATSAPP_PRODUCER_NUMBER=   # producer's number, intl format without "+"
NEXT_PUBLIC_WHATSAPP_NUMBER=  # number on public "Chat on WhatsApp" buttons
```

## 🚀 Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

> **Note:** demo state (beats, users, purchases, bookings, sessions) persists to
> `.beatforge/data.json`, and outbound demo messages land in `.mailbox/` (email) and
> `.whatsapp/` (WhatsApp). Delete those folders to reset the demo to seed data.

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
  book/            # Book the producer (booking order form)
  dashboard/       # Artist library
  admin/           # Admin panel (beats, videos, **bookings inbox**)
  downloads/[slug] # Download landing page
components/        # React UI components (Hero, BeatCard, Navbar, Player, …)
lib/
  store.js         # In-memory data (swap for Postgres/Mongo in production)
  email.js         # Email sending (mock .eml files)
  whatsapp.js      # WhatsApp delivery (Meta Cloud API or demo outbox)
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
6. **WhatsApp** — set `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` and
   `WHATSAPP_PRODUCER_NUMBER` in `.env.local` (see the Bookings & WhatsApp section)
   to deliver booking alerts and replies to a real phone instead of the `.whatsapp/` outbox.
