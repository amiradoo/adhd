# ADHD Girls Club (website-next)

Premium multi-page Next.js website met cinematic hero, zachte beige luxury styling, NL/EN taalwissel en conversion-first flow.

## Stack
- Next.js 16 (App Router)
- Tailwind CSS 4
- Framer Motion
- Lenis
- Netlify Next.js plugin

## Routes
- `/` Home
- `/about`
- `/services`
- `/contact`
- `/landing`

## Lokaal draaien
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

## Checks
```bash
npm run lint
npm run build
```

## Assets
Gebruik deze mappen in `public/`:
- `videos/hero.mp4`
- `backgrounds/*`
- `foregrounds/*`
- `ui-elements/*`
- `icons/*`

Fallbacks zijn ingebouwd: als video of extra media ontbreken, blijft de site stabiel met poster/image fallback.

## Netlify
`netlify.toml` gebruikt `@netlify/plugin-nextjs`.

Belangrijk:
- Build command: `npm run build`
- Publish directory in Netlify UI leeg laten
