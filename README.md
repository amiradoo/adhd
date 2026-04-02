# ADHD Quiz Website (Focuskracht)

Mobile-first interactieve quiz in React Native (Expo Web), klaar voor Netlify.

Werkmap:
- `/Users/amiradouairi/Documents/New project/website`

## Wat er nu in zit

- Quiz: `Welke ADHD type ben jij?`
- 12 vragen, 1 vraag per scherm
- Antwoorden: `Nooit / Soms / Vaak / Altijd`
- Scoremodel voor 6 types:
  - Overwhelm Queen
  - Uitsteller
  - Chaos Creator
  - Hyperfocus Hustler
  - People Pleaser
  - Burn-out Builder
- Resultaatpagina met:
  - type-titel
  - beschrijving
  - 3 struggles
  - 3 oplossingen
  - aanbevolen e-book
  - CTA `Download jouw plan`
  - optionele e-mail capture
  - deelknop (Web Share / clipboard fallback)
- E-book overzicht waar alle e-books los zichtbaar zijn
- Jouw voorbeeldcover is gekoppeld in:
  - `assets/ebook-rust-in-je-hoofd.jpg`

## Lokaal draaien

```bash
cd "/Users/amiradouairi/Documents/New project/website"
npm install
npm start
```

Voor web direct:

```bash
npm run web
```

## Build voor Netlify

```bash
npm run build
```

Netlify instellingen:
- Build command: `npm run build`
- Publish directory: `dist`
- Config: `netlify.toml`

## Snel aanpassen met nieuwe info

Alles staat centraal in `App.tsx`:

- `QUESTIONS`: voeg vragen toe/verander scoring
- `TYPE_PROFILES`: pas type-beschrijvingen, struggles en oplossingen aan
- `EBOOK_CATALOG`: voeg extra e-books/covers toe

Als je nieuwe input geeft, updaten we alleen deze blokken en blijft de hele flow intact.
