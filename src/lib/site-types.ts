export type Locale = "nl" | "en";

export type LinkCta = {
  label: string;
  href: string;
};

export type HeroCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: LinkCta;
  secondaryCta?: LinkCta;
};

export type FeatureItem = {
  title: string;
  description: string;
  icon?: string;
};

export type TestimonialItem = {
  quote: string;
  author: string;
  role: string;
};

export type ProductItem = {
  name: string;
  subtitle: string;
  price: string;
  bullets: string[];
  cta: string;
};

export type ContactFormValues = {
  name: string;
  email: string;
  message: string;
};

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

export type MailtoPayload = ContactFormValues & {
  subject: string;
};

export type SiteCopy = {
  nav: {
    home: string;
    about: string;
    services: string;
    contact: string;
    landing: string;
    openMenu: string;
    closeMenu: string;
  };
  language: {
    label: string;
    nl: string;
    en: string;
  };
  common: {
    serviceLabel: string;
    stickyCta: string;
    badge: string;
  };
  home: {
    hero: HeroCopy;
    stats: string[];
    featuresTitle: string;
    features: FeatureItem[];
    testimonialsTitle: string;
    testimonials: TestimonialItem[];
    cta: {
      title: string;
      body: string;
      primary: LinkCta;
      secondary: LinkCta;
    };
  };
  about: {
    hero: HeroCopy;
    storyTitle: string;
    storyBody: string[];
    pillarsTitle: string;
    pillars: FeatureItem[];
    timelineTitle: string;
    timelineItems: string[];
    cta: {
      title: string;
      body: string;
      primary: LinkCta;
    };
  };
  services: {
    hero: HeroCopy;
    products: ProductItem[];
    valueTitle: string;
    valuePoints: string[];
    cta: {
      title: string;
      body: string;
      primary: LinkCta;
      secondary: LinkCta;
    };
  };
  contact: {
    hero: HeroCopy;
    form: {
      name: string;
      email: string;
      message: string;
      submit: string;
      success: string;
      intro: string;
      validationName: string;
      validationEmail: string;
      validationMessage: string;
    };
    supportTitle: string;
    supportItems: string[];
    mailSubject: string;
  };
  landing: {
    hero: HeroCopy;
    proofBadges: string[];
    offerTitle: string;
    offerBody: string;
    offerPoints: string[];
    cta: {
      primary: LinkCta;
      secondary: LinkCta;
    };
  };
  footer: {
    brand: string;
    blurb: string;
    linksTitle: string;
    legalTitle: string;
    contactTitle: string;
    legalItems: string[];
    contactItems: string[];
  };
};

export type HeroMedia = {
  heroVideoSrc: string | null;
  heroPosterSrc: string;
  foregroundSrc: string | null;
  uiElementSrcs: string[];
};
