# Focuskracht Shop (React Native)

React Native (Expo) versie van je ADHD-proof webshop.

## Features

- Kleurrijke homepagina met sterke CTA's
- Desktop navigatie + mobiele hamburger
- Snelle checkoutflow met betaalmethode-keuze
- Bedankpagina met downloadknop
- Hash-routing op web: `#/home`, `#/about`, `#/checkout`, enz.
- Werkt op iOS, Android en Web via Expo

## Lokaal draaien

```bash
cd "/Users/amiradouairi/Documents/New project/adhd-webshop-native"
npm install
npm start
```

Daarna kun je kiezen:

- `w` voor web
- `i` voor iOS simulator
- `a` voor Android emulator

Direct web starten:

```bash
npm run web
```

Productie web build (zelfde als Netlify):

```bash
npm run build
```

## Netlify deploy

Deze app is Netlify-klaar met [netlify.toml](/Users/amiradouairi/Documents/New%20project/adhd-webshop-native/netlify.toml).

Belangrijk:

- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirect: alle routes gaan naar `index.html`
- Security + cache headers zijn ingesteld in `netlify.toml`

Stappen in Netlify:

1. Koppel je GitHub repo: `amiradoo/adhd`.
2. Bij Build settings laat je staan:
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy site.

## Bestanden

- `App.tsx`: volledige app met alle pagina's en checkoutflow
- `app.json`: Expo app-config
- `netlify.toml`: Netlify build, redirect en headers config

## Downloadlink aanpassen

In `App.tsx` staat een placeholder:

- `DOWNLOAD_URL = "https://example.com/focuskracht.pdf"`

Vervang dit met je echte e-book PDF-link.
