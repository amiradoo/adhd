import type { Locale, SiteCopy } from "@/lib/site-types";

export const siteCopy: Record<Locale, SiteCopy> = {
  nl: {
    nav: {
      home: "Home",
      about: "Over ons",
      services: "Producten",
      contact: "Contact",
      landing: "Start",
      openMenu: "Open menu",
      closeMenu: "Sluit menu",
    },
    language: {
      label: "Taal",
      nl: "Nederlands",
      en: "Engels",
    },
    common: {
      serviceLabel: "Producten",
      stickyCta: "Start jouw ADHD test",
      badge: "ADHD Girls Club",
    },
    home: {
      hero: {
        eyebrow: "Premium self-test funnel",
        title: "Rust in je hoofd. Sneller resultaat in je dag.",
        subtitle:
          "Een cinematic ADHD platform voor vrouwen die minder chaos en meer focus willen, zonder harde routines.",
        primaryCta: { label: "Doe de quiz", href: "/landing" },
        secondaryCta: { label: "Bekijk producten", href: "/services" },
      },
      stats: ["2.500+ vrouwen geholpen", "Mobiel-first flow", "Ontworpen voor ADHD-brein"],
      featuresTitle: "Waarom deze funnel werkt",
      features: [
        {
          title: "Eerste stap in 10 seconden",
          description:
            "Grote knoppen, 1 keuze per scherm en minimale afleiding houden impuls en momentum vast.",
          icon: "01",
        },
        {
          title: "Visuele rust met zachte diepte",
          description:
            "Beige cinematic lagen, heldere contrasten en duidelijke scroll-richting maken scannen makkelijker.",
          icon: "02",
        },
        {
          title: "Persoonlijk resultaat + aanbod",
          description:
            "Na de quiz krijgt elke bezoeker een herkenbaar type met direct een passend e-book plan.",
          icon: "03",
        },
      ],
      testimonialsTitle: "Wat vrouwen teruggeven",
      testimonials: [
        {
          quote:
            "Dit voelt als een app, niet als een drukke website. Ik wist direct waar ik moest klikken.",
          author: "Noor",
          role: "Creator",
        },
        {
          quote:
            "Mijn hoofd werd rustiger door de opbouw. Ik bleef vanzelf doorscrollen tot de checkout.",
          author: "Mila",
          role: "Founder",
        },
        {
          quote:
            "De quiz was confronterend op een fijne manier. Het advies voelde echt persoonlijk.",
          author: "Sara",
          role: "Community lid",
        },
      ],
      cta: {
        title: "Klaar voor jouw ADHD reset?",
        body: "Start met de snelle test en ontvang direct het type-plan dat past bij jouw energie, focus en ritme.",
        primary: { label: "Start de quiz", href: "/landing" },
        secondary: { label: "Plan een vraaggesprek", href: "/contact" },
      },
    },
    about: {
      hero: {
        eyebrow: "Over ADHD Girls Club",
        title: "Gebouwd door vrouwen met ADHD, voor vrouwen met ADHD.",
        subtitle:
          "Geen generieke productivity hacks, maar emotioneel intelligente structuren die in het echte leven werken.",
        primaryCta: { label: "Bekijk producten", href: "/services" },
      },
      storyTitle: "Onze aanpak",
      storyBody: [
        "Wij ontwerpen op basis van gedrag: snelle beslissingen, korte aandachtsspanne en behoefte aan heldere richting.",
        "Elke pagina is gebouwd om mentale ruis weg te nemen en direct de volgende logische actie te tonen.",
      ],
      pillarsTitle: "3 pijlers",
      pillars: [
        {
          title: "Calm conversion",
          description: "Zachte visuals + duidelijke CTA's zorgen voor rust en actie tegelijk.",
          icon: "A",
        },
        {
          title: "Micro commitments",
          description: "Kleine keuzes per stap maken starten makkelijker en verhogen afronding.",
          icon: "B",
        },
        {
          title: "Emotionele herkenning",
          description: "Copy die voelt als jouw realiteit, niet als een standaard salespagina.",
          icon: "C",
        },
      ],
      timelineTitle: "Van scroll naar resultaat",
      timelineItems: [
        "1. Je komt binnen op een rustige hero met duidelijke focus.",
        "2. Je doet de test en krijgt direct herkenning + richting.",
        "3. Je klikt door naar het e-book plan en bestelt zonder frictie.",
      ],
      cta: {
        title: "Wil je dit ook voor jouw merk?",
        body: "Plan een korte call en we bepalen samen welke funnelflow jouw doelgroep nodig heeft.",
        primary: { label: "Neem contact op", href: "/contact" },
      },
    },
    services: {
      hero: {
        eyebrow: "Producten",
        title: "Digitale tools die je hoofd rustiger maken.",
        subtitle:
          "Kies het e-book dat past bij jouw ADHD type en ga direct van overprikkeling naar concrete actie.",
        primaryCta: { label: "Start met quiz", href: "/landing" },
        secondaryCta: { label: "Hulp nodig?", href: "/contact" },
      },
      products: [
        {
          name: "Rust in je Hoofd",
          subtitle: "Voor vrouwen die altijd aan staan",
          price: "EUR 29",
          bullets: [
            "3-stappen reset voor overwhelm",
            "Dagelijkse focus templates",
            "Rust rituelen van 7 minuten",
          ],
          cta: "Download plan",
        },
        {
          name: "Van Uitstel naar Actie",
          subtitle: "Voor snelle starters die niet afronden",
          price: "EUR 24",
          bullets: [
            "Start-script voor lastige taken",
            "Dopamine vriendelijke planning",
            "Anti-uitstel mini challenges",
          ],
          cta: "Start direct",
        },
        {
          name: "Hyperfocus Zonder Crash",
          subtitle: "Voor pieken en daarna leegte",
          price: "EUR 34",
          bullets: [
            "Focus blokken met energie buffers",
            "Grenzen voor werk en telefoon",
            "Herstelroutine voor drukke weken",
          ],
          cta: "Bekijk bundle",
        },
      ],
      valueTitle: "Waarom dit premium voelt",
      valuePoints: [
        "Geen overload: alleen wat je vandaag nodig hebt.",
        "Direct toepasbaar op werk, studie en thuis.",
        "Ontwikkeld met ADHD-psychologie en gedragspatronen.",
      ],
      cta: {
        title: "Twijfel je over je type?",
        body: "Doe eerst de quiz en krijg meteen een persoonlijk advies met beste match.",
        primary: { label: "Doe de type quiz", href: "/landing" },
        secondary: { label: "Stuur je vraag", href: "/contact" },
      },
    },
    contact: {
      hero: {
        eyebrow: "Contact",
        title: "Stuur ons je vraag. We reageren snel en helder.",
        subtitle:
          "Gebruik het formulier of open direct je mailapp met een ingevuld conceptbericht.",
        primaryCta: { label: "Naar formulier", href: "/contact#contact-form" },
      },
      form: {
        name: "Naam",
        email: "E-mail",
        message: "Bericht",
        submit: "Verstuur",
        success: "Je mailconcept is klaar. Rond je bericht af in je mailapp.",
        intro: "Vertel kort wat je wil bereiken. Dan helpen we gericht.",
        validationName: "Vul een naam in van minimaal 2 tekens.",
        validationEmail: "Vul een geldig e-mailadres in.",
        validationMessage: "Je bericht moet minimaal 20 tekens bevatten.",
      },
      supportTitle: "Support",
      supportItems: [
        "Gemiddelde reactietijd: binnen 24 uur",
        "Focus: quiz funnels, e-book sales, ADHD UX",
        "Mail: hello@adhdgirlsclub.com",
      ],
      mailSubject: "Nieuwe aanvraag via ADHD Girls Club",
    },
    landing: {
      hero: {
        eyebrow: "Snelste route naar resultaat",
        title: "Welke ADHD type ben jij?",
        subtitle:
          "Doe de test, ontvang je profiel en pak direct het juiste e-book voor jouw volgende stap.",
        primaryCta: { label: "Start de zelftest", href: "/landing#offer" },
        secondaryCta: { label: "Bekijk alle producten", href: "/services" },
      },
      proofBadges: ["TikTok-proof flow", "1 vraag per stap", "Hoog afgerond op mobiel"],
      offerTitle: "Na de quiz krijg je",
      offerBody:
        "Een herkenbaar profiel, heldere struggles, concrete oplossingen en een directe downloadroute.",
      offerPoints: [
        "Persoonlijke uitslag met ADHD type",
        "3 herkenbare struggles + 3 oplossingen",
        "Aanbevolen e-book en duidelijke CTA",
      ],
      cta: {
        primary: { label: "Download jouw plan", href: "/services" },
        secondary: { label: "Stel een vraag", href: "/contact" },
      },
    },
    footer: {
      brand: "ADHD Girls Club",
      blurb: "Calm funnel design voor vrouwen met ADHD. Premium UX, zachte esthetiek en duidelijke conversie.",
      linksTitle: "Pagina's",
      legalTitle: "Legal",
      contactTitle: "Contact",
      legalItems: ["Privacy", "Voorwaarden", "Cookies"],
      contactItems: ["hello@adhdgirlsclub.com", "Amsterdam, NL", "Binnen 24u reactie"],
    },
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      services: "Products",
      contact: "Contact",
      landing: "Start",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    language: {
      label: "Language",
      nl: "Dutch",
      en: "English",
    },
    common: {
      serviceLabel: "Products",
      stickyCta: "Start your ADHD quiz",
      badge: "ADHD Girls Club",
    },
    home: {
      hero: {
        eyebrow: "Premium self-test funnel",
        title: "More calm in your mind. Better results in your day.",
        subtitle:
          "A cinematic ADHD platform for women who want less chaos and more focus, without rigid routines.",
        primaryCta: { label: "Take the quiz", href: "/landing" },
        secondaryCta: { label: "View products", href: "/services" },
      },
      stats: ["2,500+ women supported", "Mobile-first flow", "Designed for ADHD brains"],
      featuresTitle: "Why this funnel converts",
      features: [
        {
          title: "First action in 10 seconds",
          description:
            "Large buttons, one choice per step, and low visual noise keep momentum and impulse alive.",
          icon: "01",
        },
        {
          title: "Visual calm with subtle depth",
          description:
            "Soft beige cinematic layers and clear hierarchy make scanning easy and natural.",
          icon: "02",
        },
        {
          title: "Personal result + offer",
          description:
            "After the quiz each visitor gets a relatable ADHD type and a matching e-book recommendation.",
          icon: "03",
        },
      ],
      testimonialsTitle: "What women share",
      testimonials: [
        {
          quote: "It feels like an app, not a busy website. I instantly knew where to tap.",
          author: "Noor",
          role: "Creator",
        },
        {
          quote: "The structure calmed my mind. I naturally kept scrolling until checkout.",
          author: "Mila",
          role: "Founder",
        },
        {
          quote: "The quiz was honest in a good way. The recommendation felt truly personal.",
          author: "Sara",
          role: "Community member",
        },
      ],
      cta: {
        title: "Ready for your ADHD reset?",
        body: "Start the quick test and get the type-based plan that matches your energy, focus, and rhythm.",
        primary: { label: "Start quiz", href: "/landing" },
        secondary: { label: "Book a question call", href: "/contact" },
      },
    },
    about: {
      hero: {
        eyebrow: "About ADHD Girls Club",
        title: "Built by women with ADHD, for women with ADHD.",
        subtitle:
          "No generic productivity advice. We build emotionally intelligent structures that work in real life.",
        primaryCta: { label: "Explore products", href: "/services" },
      },
      storyTitle: "Our method",
      storyBody: [
        "We design for behavior: fast decisions, short attention loops, and constant context switching.",
        "Every section reduces cognitive noise and points to the next clear action.",
      ],
      pillarsTitle: "3 pillars",
      pillars: [
        {
          title: "Calm conversion",
          description: "Soft visuals plus clear calls-to-action deliver calm and action at once.",
          icon: "A",
        },
        {
          title: "Micro commitments",
          description: "Small decisions per step make starting easier and increase completion.",
          icon: "B",
        },
        {
          title: "Emotional recognition",
          description: "Copy that sounds like your real day, not a generic sales script.",
          icon: "C",
        },
      ],
      timelineTitle: "From scroll to result",
      timelineItems: [
        "1. Enter through a calm hero with one clear focus.",
        "2. Take the type test and get immediate clarity.",
        "3. Move to the matching e-book plan and checkout without friction.",
      ],
      cta: {
        title: "Want this flow for your brand?",
        body: "Book a short call and we map the conversion experience your audience needs.",
        primary: { label: "Contact us", href: "/contact" },
      },
    },
    services: {
      hero: {
        eyebrow: "Products",
        title: "Digital tools that quiet the noise.",
        subtitle:
          "Choose the e-book that matches your ADHD type and move from overwhelm to clear action.",
        primaryCta: { label: "Start quiz", href: "/landing" },
        secondaryCta: { label: "Need help?", href: "/contact" },
      },
      products: [
        {
          name: "Peace in Your Head",
          subtitle: "For women always switched on",
          price: "EUR 29",
          bullets: [
            "3-step reset for overwhelm",
            "Daily focus templates",
            "7-minute calm rituals",
          ],
          cta: "Download plan",
        },
        {
          name: "From Delay to Action",
          subtitle: "For fast starters who struggle to finish",
          price: "EUR 24",
          bullets: [
            "Start scripts for hard tasks",
            "Dopamine-friendly planning",
            "Anti-procrastination mini challenges",
          ],
          cta: "Start now",
        },
        {
          name: "Hyperfocus Without Crash",
          subtitle: "For intense peaks and empty crashes",
          price: "EUR 34",
          bullets: [
            "Focus blocks with energy buffers",
            "Boundaries for work and phone",
            "Recovery flow for intense weeks",
          ],
          cta: "View bundle",
        },
      ],
      valueTitle: "Why this feels premium",
      valuePoints: [
        "No overload: only what you need today.",
        "Instantly usable for work, study, and home life.",
        "Built on ADHD psychology and real behavior patterns.",
      ],
      cta: {
        title: "Not sure about your type?",
        body: "Take the quiz first and get a direct recommendation for the best e-book match.",
        primary: { label: "Take type quiz", href: "/landing" },
        secondary: { label: "Ask a question", href: "/contact" },
      },
    },
    contact: {
      hero: {
        eyebrow: "Contact",
        title: "Send us your question. We respond with clarity.",
        subtitle: "Use the form or open your mail app with a prefilled draft.",
        primaryCta: { label: "Go to form", href: "/contact#contact-form" },
      },
      form: {
        name: "Name",
        email: "Email",
        message: "Message",
        submit: "Send",
        success: "Your email draft is ready. Finish and send it in your mail app.",
        intro: "Tell us what outcome you want. We will help with a focused answer.",
        validationName: "Please enter a name with at least 2 characters.",
        validationEmail: "Please enter a valid email address.",
        validationMessage: "Your message must contain at least 20 characters.",
      },
      supportTitle: "Support",
      supportItems: [
        "Average reply time: within 24 hours",
        "Focus: quiz funnels, e-book sales, ADHD UX",
        "Email: hello@adhdgirlsclub.com",
      ],
      mailSubject: "New request via ADHD Girls Club",
    },
    landing: {
      hero: {
        eyebrow: "Fastest path to your plan",
        title: "Which ADHD type are you?",
        subtitle:
          "Take the test, get your profile, and unlock the exact e-book designed for your next step.",
        primaryCta: { label: "Start self-test", href: "/landing#offer" },
        secondaryCta: { label: "View all products", href: "/services" },
      },
      proofBadges: ["TikTok-ready flow", "One question per step", "High mobile completion"],
      offerTitle: "After the quiz you get",
      offerBody:
        "A relatable profile, clear struggles, practical solutions, and a direct download path.",
      offerPoints: [
        "Personal ADHD type result",
        "3 recognizable struggles + 3 solutions",
        "Recommended e-book and clear CTA",
      ],
      cta: {
        primary: { label: "Download your plan", href: "/services" },
        secondary: { label: "Ask a question", href: "/contact" },
      },
    },
    footer: {
      brand: "ADHD Girls Club",
      blurb: "Calm funnel design for women with ADHD. Premium UX, soft aesthetics, and clear conversion.",
      linksTitle: "Pages",
      legalTitle: "Legal",
      contactTitle: "Contact",
      legalItems: ["Privacy", "Terms", "Cookies"],
      contactItems: ["hello@adhdgirlsclub.com", "Amsterdam, NL", "Reply within 24h"],
    },
  },
};

export function getSiteCopy(locale: Locale): SiteCopy {
  return siteCopy[locale];
}
