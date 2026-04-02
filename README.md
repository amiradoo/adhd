# Focuskracht Shop (React Native)

React Native (Expo) versie van je ADHD-proof webshop.

## Features

- Kleurrijke homepagina met sterke CTA's
- Hamburger-menu met pagina's: Home, Over ons, FAQ, Contact, Privacy, Checkout
- Snelle checkoutflow met betaalmethode-keuze
- Bedankpagina met downloadknop
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

## Bestanden

- `App.tsx`: volledige app met alle pagina's en checkoutflow
- `app.json`: Expo app-config

## Downloadlink aanpassen

In `App.tsx` staat een placeholder:

- `DOWNLOAD_URL = "https://example.com/focuskracht.pdf"`

Vervang dit met je echte e-book PDF-link.

## GitHub klaarzetten

Ik kon hier niet automatisch pushen, omdat `git` op deze machine momenteel geblokkeerd is door een niet-geaccepteerde Xcode-licentie.

Als je dit één keer uitvoert in Terminal:

```bash
sudo xcodebuild -license
```

Dan kan ik in de volgende stap direct voor je doen:

1. `git init`
2. eerste commit maken
3. remote GitHub repo koppelen
4. pushen naar GitHub

