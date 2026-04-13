#!/bin/bash
set -e

echo "==> Installing pnpm..."
corepack enable
corepack prepare pnpm@10.33.0 --activate

echo "==> Installing dependencies..."
pnpm install

echo "==> Setting up environment variables..."
ENV_FILE="apps/web/.env.local"

if [ -n "$NEXT_PUBLIC_SUPABASE_URL" ] && [ -n "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
  echo "NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL" > "$ENV_FILE"
  echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY" >> "$ENV_FILE"
  echo "==> .env.local created from Codespace secrets"
else
  if [ ! -f "$ENV_FILE" ]; then
    echo "NEXT_PUBLIC_SUPABASE_URL=your-supabase-url" > "$ENV_FILE"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key" >> "$ENV_FILE"
    echo "==> WARNING: Supabase secrets not found. Edit apps/web/.env.local with your credentials."
    echo "    Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY as Codespace secrets"
    echo "    at: https://github.com/settings/codespaces"
  fi
fi

echo ""
echo "==> Setup complete! Run 'pnpm dev' to start the dev server."
