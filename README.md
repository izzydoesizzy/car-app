# CarScout

**Your Canadian used car buying companion.** Save listings from AutoTrader, Kijiji, Facebook Marketplace, Clutch, CarGurus, and more — then compare, research, negotiate, and buy with confidence.

Built specifically for the Canadian market with province-specific tax calculators, CBB price comparisons, safety recall checks, and a step-by-step buying guide.

## Features

### Dashboard & Listing Management
- **Save listings** from 7+ Canadian marketplaces via Chrome extension or manual entry
- **Smart filters** — search by make/model, filter by status, source, body type, drivetrain, province, seller type, price range, year range, mileage, and more
- **Compact mobile view** — horizontal card layout on phones shows 5-6 listings per screen
- **Status tracking** — saved → contacted → viewing scheduled → inspected → offer made → purchased → archived
- **Tags, favorites, and strong contender** flags to organize your shortlist

### Listing Detail & Research
- **Side-by-side comparison** of multiple listings
- **Inline editing** — edit any listing's details directly from the detail page
- **Tags & labels** — create color-coded tags to organize and categorize your listings
- **Canadian Black Book (CBB) price range** visualization — see if you're getting a good deal
- **VIN decoder** powered by NHTSA — auto-populate vehicle specs and detect seller fraud (mismatched year/make/model)
- **Odometer red flag detection** — warns if mileage is suspiciously low for the vehicle's age
- **Safety recall check** via Transport Canada's database
- **Negotiation insights** — auto-generated talking points based on CBB data, accident history, mileage, and seller type
- **Condition & history tracking** — accident history, service records, number of owners, CARFAX links

### Financial Tools
- **Provincial tax calculator** — itemized breakdown of GST/HST, PST/QST, safety inspection, lien search, and UVIP fees by province
- **Price history chart** — visual chart of price drops over time with trend indicators
- **Negotiated price tracking** — record your offer vs. listed price

### Buying Guide
- **5-step buying guide** — research, finding cars, inspecting, making the deal, after purchase — each with its own detailed page
- **Province-specific guides** for all 10 provinces: Ontario, British Columbia, Alberta, Quebec, Manitoba, Saskatchewan, Nova Scotia, New Brunswick, Prince Edward Island, and Newfoundland & Labrador
- **Post-purchase checklist** — province-aware registration steps, safety inspection reminders, insurance, lien search, and document tracking

### Recommended Tools & Affiliate Links
- **CARFAX Canada** — vehicle history reports
- **BlueDriver OBD2** — diagnostic scanning
- **CAA Pre-Purchase Inspection** — certified technician inspections
- **iNeedaPPi** — mobile pre-purchase inspection with 50+ photos and condition scoring
- **Kelley Blue Book Canada** — free vehicle valuation
- **PPSA Lien Search** — check for outstanding liens
- **VIN Decoder (NHTSA)** — free VIN decoding
- **Transport Canada Recalls** — safety recall checks

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | [Supabase](https://supabase.com) (PostgreSQL + Row Level Security) |
| Auth | Supabase Auth |
| Monorepo | Turborepo + pnpm |
| Icons | Lucide React |
| Extension | Plasmo (Manifest V3) — coming soon |

## Project Structure

```
carscout/
├── apps/
│   ├── web/                  # Next.js web application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (app)/    # Authenticated app routes (dashboard, listings, compare)
│   │   │   │   ├── (guide)/  # Public buying guide pages
│   │   │   │   ├── api/      # API routes (listings, VIN decode, recalls)
│   │   │   │   └── auth/     # Sign in / sign up
│   │   │   ├── components/   # React components
│   │   │   └── lib/          # Supabase client helpers
│   │   └── ...
│   └── extension/            # Chrome extension (coming soon)
├── packages/
│   └── shared/               # Shared types, constants, utilities
│       ├── src/
│       │   ├── types/        # Listing, Marketplace, Province types
│       │   ├── constants/    # Marketplace configs, province data, status labels
│       │   └── utils/        # VIN decoder, NHTSA mapper, price formatter
│       └── ...
├── supabase/
│   ├── migrations/           # Database schema (PostgreSQL)
│   └── seed.sql              # Sample data (13 realistic Canadian listings)
└── turbo.json
```

## Getting Started

### Prerequisites

- **Node.js** 22+
- **pnpm** 10+ (or use `npm` — a `package-lock.json` is included)
- A **Supabase** project ([create one free](https://supabase.com))

### 1. Clone & Install

```bash
git clone https://github.com/izzydoesizzy/car-app.git
cd car-app
pnpm install
```

### 2. Configure Environment

```bash
cp apps/web/.env.local.example apps/web/.env.local
```

Edit `apps/web/.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: Transport Canada Recalls API (free, register at https://tc.api.canada.ca)
TRANSPORT_CANADA_API_KEY=your-key-here
```

### 3. Set Up Database

Run the migration SQL in your Supabase dashboard:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Paste and run `supabase/migrations/00001_initial_schema.sql`
3. This creates all tables with Row Level Security policies

### 4. Create Account & Seed Data

```bash
pnpm dev
```

1. Open [http://localhost:3000](http://localhost:3000) and sign up
2. (Optional) Paste `supabase/seed.sql` into Supabase SQL Editor to load 13 sample listings across 6 Canadian cities and 5 marketplaces

### 5. Start Developing

```bash
pnpm dev          # Start dev server (Turbopack)
pnpm build        # Production build
pnpm typecheck    # Run TypeScript checks
pnpm lint         # Run linting
```

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/listings` | GET | Fetch all listings for authenticated user |
| `/api/listings` | POST | Create a new manual listing |
| `/api/listings/[id]` | GET, PATCH, DELETE | Read, update, or delete a listing |
| `/api/vin/decode` | GET | Decode VIN via NHTSA (free, no key needed) |
| `/api/recalls` | GET | Check Transport Canada safety recalls |
| `/api/extension/save` | POST | Save listing from Chrome extension |
| `/api/affiliate/redirect` | GET | Track affiliate clicks and redirect |

## Supported Marketplaces

| Marketplace | Source Key |
|-------------|-----------|
| AutoTrader.ca | `autotrader` |
| Kijiji Autos | `kijiji` |
| Facebook Marketplace | `facebook` |
| Clutch | `clutch` |
| CarGurus | `cargurus` |
| Carpages | `carpages` |
| Auto123 | `auto123` |
| Manual Entry | `manual` |

## Database Schema

The app uses 8 tables with Row Level Security:

- **listings** — core vehicle data (50+ fields covering identity, pricing, condition, location, seller info)
- **price_history** — price change tracking over time
- **profiles** — user profiles extending Supabase Auth
- **tags** / **listing_tags** — user-created tags for organizing listings
- **comparisons** / **comparison_listings** — named comparison groups
- **checklist_progress** — guide checklist and post-purchase checklist progress
- **affiliate_clicks** — analytics for recommended tool clicks

## Codespaces / Dev Container

This repo includes a `.devcontainer/` configuration for GitHub Codespaces with:
- Node.js 22 + pnpm
- Supabase CLI
- Auto port forwarding for the dev server
- Environment variables injected via Codespaces secrets

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private. All rights reserved.
