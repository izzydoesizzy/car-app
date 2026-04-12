# CarScout

Your Canadian used car buying companion. Save, compare, and research used cars from AutoTrader, Kijiji, Facebook Marketplace and more.

## Tech Stack

- **Web App**: Next.js 16 (App Router), Tailwind CSS, TypeScript
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Auth**: Supabase Auth
- **Chrome Extension**: Plasmo (Manifest V3) — coming soon
- **Monorepo**: Turborepo + pnpm

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm 10+
- A [Supabase](https://supabase.com) project

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment template
cp apps/web/.env.local.example apps/web/.env.local
# Edit .env.local with your Supabase credentials

# Run the database migration
# (Run the SQL in supabase/migrations/00001_initial_schema.sql in your Supabase dashboard)

# Start development
pnpm dev
```

### Project Structure

```
packages/shared/    - Shared types, constants, and utilities
apps/web/           - Next.js web application
apps/extension/     - Chrome extension (coming soon)
supabase/           - Database migrations
```

## Features

- Save car listings from 7+ Canadian marketplaces
- Dashboard with filters, search, and status tracking
- Listing detail page with pricing, negotiation, and research fields
- Side-by-side comparison view
- Contextual affiliate links (CARFAX, BlueDriver, CAA)
- Used car buying guide with province-specific info
- Total cost calculator by province
