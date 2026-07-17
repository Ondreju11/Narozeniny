# Narozeninová pozvánka

Jednostránková pozvánka vytvořená ve Vite s RSVP formulářem napojeným na Supabase.

## Spuštění

```bash
npm install
copy .env.example .env.local
npm run dev
```

Do `.env.local` doplňte `VITE_SUPABASE_URL` a `VITE_SUPABASE_ANON_KEY` z nastavení Supabase projektu.

## Supabase

1. V Supabase otevřete **SQL Editor**.
2. Spusťte obsah souboru `supabase/schema.sql`.
3. V **Project Settings → API** zkopírujte Project URL a anon/public key do `.env.local`.

Odpovědi se zobrazí v **Table Editor → rsvps**. Veřejný návštěvník může odpověď pouze vložit; nemůže číst ani upravovat odpovědi ostatních.

## Nasazení

Projekt lze nasadit z Git repozitáře například na Vercel, Netlify nebo Cloudflare Pages. Build command je `npm run build`, výstupní složka `dist`. Na hostingu nastavte stejné dvě proměnné prostředí jako v `.env.local`.
