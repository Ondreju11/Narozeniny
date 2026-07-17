# Narozeninová pozvánka

Jednostránková pozvánka vytvořená ve Vite s RSVP formulářem napojeným na Supabase.

## Spuštění

```bash
npm install
copy .env.example .env.local
npm run dev
```

Do `.env.local` doplňte `VITE_SUPABASE_URL` a `VITE_SUPABASE_PUBLISHABLE_KEY` z nastavení Supabase projektu.

## Supabase

Databázová tabulka a bezpečnostní pravidla jsou v `supabase/migrations`. Při zapnutém **Deploy to production** je Supabase GitHub integrace spustí automaticky po pushnutí produkční větve.

V **Project Settings → API Keys** zkopírujte publishable key do `.env.local`. Nikdy do frontendu nevkládejte secret nebo service role key.

Odpovědi se zobrazí v **Table Editor → rsvps**. Veřejný návštěvník může odpověď pouze vložit; nemůže číst ani upravovat odpovědi ostatních.

## Nasazení na GitHub Pages

Vite je nastavený pro adresu `https://ondreju11.github.io/Narozeniny/`. GitHub Pages musí při buildu dostat stejné dvě proměnné prostředí jako lokální `.env.local`.
