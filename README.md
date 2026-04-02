# ADHD Girls Club Webshop (Next.js)

Mobile-first webshop landing met quiz funnel, e-book aanbod, zachte feminine stijl en mobile-only sound feedback.

## Stack
- Next.js 16 (App Router)
- Tailwind CSS 4
- Framer Motion (scroll animaties)
- Lenis (smooth scroll)
- Netlify Next.js plugin

## Lokaal draaien
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

## Quality checks
```bash
npm run lint
npm run build
```

## Netlify deploy
Dit project bevat al `netlify.toml` en gebruikt de Next.js Netlify plugin.

Build settings:
- Build command: `npm run build`
- Publish directory: leeg laten (plugin regelt dit)

## Belangrijkste pagina onderdelen
- Hero + snelle CTA
- ADHD type quiz
- E-book kaarten
- About sectie
- Social proof
- Funnel + checkout CTA
- Mobile dock (app-feel)
- Footer met navigatie

## Git push (als je non-fast-forward krijgt)
```bash
git pull --rebase origin main
git push -u origin main
```
