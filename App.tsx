import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

type Route =
  | "home"
  | "quiz"
  | "result"
  | "shop"
  | "checkout"
  | "about"
  | "contact"
  | "thanks";

type PaymentMethod = "iDEAL" | "Kaart" | "PayPal";

type AdhdType =
  | "overwhelm_queen"
  | "uitsteller"
  | "chaos_creator"
  | "hyperfocus_hustler"
  | "people_pleaser"
  | "burnout_builder";

type TypeProfile = {
  name: string;
  description: string;
  struggles: string[];
  solutions: string[];
  ebookTitle: string;
};

type QuizQuestion = {
  id: number;
  question: string;
  hint: string;
  weights: Partial<Record<AdhdType, number>>;
};

type EbookCard = {
  id: string;
  title: string;
  subtitle: string;
  type: AdhdType;
  description: string;
  price: string;
  cover?: any;
  sample?: boolean;
  downloadUrl: string;
};

const SAMPLE_COVER = require("./assets/ebook-rust-in-je-hoofd.jpg");

const ROUTES: Route[] = [
  "home",
  "quiz",
  "result",
  "shop",
  "checkout",
  "about",
  "contact",
  "thanks",
];

const DESKTOP_NAV: { route: Route; label: string }[] = [
  { route: "home", label: "Home" },
  { route: "quiz", label: "Quiz" },
  { route: "shop", label: "Shop" },
  { route: "about", label: "Over ons" },
  { route: "contact", label: "Contact" },
];

const MOBILE_TABS: { route: Route; label: string; icon: string }[] = [
  { route: "home", label: "Home", icon: "⌂" },
  { route: "quiz", label: "Quiz", icon: "◉" },
  { route: "shop", label: "Shop", icon: "🛍" },
  { route: "about", label: "Over", icon: "ℹ" },
];

const ANSWER_OPTIONS = ["Nooit", "Soms", "Vaak", "Altijd"];
const OPTION_POINTS = [0, 1, 2, 3];
const OPTION_VIBE_LABELS = ["Rustig", "Wisselend", "Herkenbaar", "Vol raak"];
const PAYMENT_METHODS: PaymentMethod[] = ["iDEAL", "Kaart", "PayPal"];

const TYPE_PRIORITY: AdhdType[] = [
  "overwhelm_queen",
  "uitsteller",
  "chaos_creator",
  "hyperfocus_hustler",
  "people_pleaser",
  "burnout_builder",
];

const TYPE_PROFILES: Record<AdhdType, TypeProfile> = {
  overwhelm_queen: {
    name: "Overwhelm Queen",
    description:
      "Je voelt veel tegelijk en je hoofd staat vaak vol open tabs. Je wil veel goed doen, maar dat kost energie.",
    struggles: [
      "To-do lijst voelt meteen te groot",
      "Je raakt snel overprikkeld door details",
      "Je hoofd blijft doorgaan, ook in rust",
    ],
    solutions: [
      "Werk met 1 focusblok van 20 minuten",
      "Kies elke dag alleen top 3 prioriteiten",
      "Eindig je dag met een vaste reset-routine",
    ],
    ebookTitle: "Rust in je Hoofd",
  },
  uitsteller: {
    name: "Uitsteller",
    description:
      "Je weet wat je moet doen, maar starten voelt zwaar. Onder druk kun je ineens pieken.",
    struggles: [
      "Taken schuiven te vaak door",
      "Starten gebeurt pas bij stress",
      "Achteraf baal je van uitstel",
    ],
    solutions: [
      "Start met een mini-actie van 5 minuten",
      "Gebruik korte timers om te beginnen",
      "Beloon starten in plaats van perfectie",
    ],
    ebookTitle: "Van Uitstel naar Actie",
  },
  chaos_creator: {
    name: "Chaos Creator",
    description:
      "Je hebt veel ideeen en energie, maar structuur verdwijnt snel wanneer je schakelt.",
    struggles: [
      "Rommel en losse taken stapelen op",
      "Veel tegelijk beginnen, weinig afronden",
      "Belangrijke kleine dingen vergeten",
    ],
    solutions: [
      "Gebruik visuele checklists",
      "Plan een dagelijkse 15-min reset",
      "Bundel vergelijkbare taken in blokken",
    ],
    ebookTitle: "Orde in je Chaos",
  },
  hyperfocus_hustler: {
    name: "Hyperfocus Hustler",
    description:
      "Als iets klikt ga je full force. Dat levert veel op, maar balans en herstel verdwijnen.",
    struggles: [
      "Tijdsbesef raakt weg tijdens focus",
      "Pauzes en zelfzorg schieten erbij in",
      "Na piek volgt vaak een crash",
    ],
    solutions: [
      "Zet stop-alarmen per 45 minuten",
      "Plan herstel net zo strak als werk",
      "Eindig focusblokken met cooling down",
    ],
    ebookTitle: "Hyperfocus Zonder Crash",
  },
  people_pleaser: {
    name: "People Pleaser",
    description:
      "Je voelt anderen goed aan en helpt snel, maar je eigen ruimte raakt vol.",
    struggles: [
      "Te vaak ja zeggen terwijl je nee voelt",
      "Andermans prioriteiten vullen je agenda",
      "Grenzen aangeven voelt ongemakkelijk",
    ],
    solutions: [
      "Gebruik een vriendelijke standaard nee-zin",
      "Plan eerst je eigen topprioriteit",
      "Check dagelijks: wat heb IK nodig",
    ],
    ebookTitle: "Grenzen Zonder Schuldgevoel",
  },
  burnout_builder: {
    name: "Burn-out Builder",
    description:
      "Je bent loyaal en sterk, maar gaat vaak te lang door tot je lichaam remt.",
    struggles: [
      "Doorgaan op lege batterij",
      "Herstelmomenten overslaan",
      "Moe maar toch blijven presteren",
    ],
    solutions: [
      "Meet dagelijks energie op schaal 1-10",
      "Bouw niet-onderhandelbare rustblokken in",
      "Werk met stopregels bij overbelasting",
    ],
    ebookTitle: "Energie Zonder Opbranden",
  },
};

const EBOOK_CATALOG: EbookCard[] = [
  {
    id: "rust-hoofd",
    title: "Rust in je Hoofd",
    subtitle: "Voor vrouwen die altijd aan staan",
    type: "overwhelm_queen",
    description: "Krijg rust in je hoofd met korte routines en praktische focuskaarten.",
    price: "€19",
    cover: SAMPLE_COVER,
    sample: true,
    downloadUrl: "https://example.com/rust-in-je-hoofd.pdf",
  },
  {
    id: "uitstel-actie",
    title: "Van Uitstel naar Actie",
    subtitle: "Starten zonder stress",
    type: "uitsteller",
    description: "Concrete startprotocollen om uitstel te doorbreken in 5 minuten.",
    price: "€19",
    downloadUrl: "https://example.com/uitstel-actie.pdf",
  },
  {
    id: "chaos-reset",
    title: "Orde in je Chaos",
    subtitle: "Structuur die blijft",
    type: "chaos_creator",
    description: "Bouw visuele structuur en haal meer rust uit je dagplanning.",
    price: "€19",
    downloadUrl: "https://example.com/chaos-reset.pdf",
  },
  {
    id: "focus-crash",
    title: "Hyperfocus Zonder Crash",
    subtitle: "Productief met balans",
    type: "hyperfocus_hustler",
    description: "Behoud hyperfocus kracht zonder je energie op te branden.",
    price: "€19",
    downloadUrl: "https://example.com/focus-crash.pdf",
  },
  {
    id: "grenzen",
    title: "Grenzen Zonder Schuldgevoel",
    subtitle: "People pleasing loslaten",
    type: "people_pleaser",
    description: "Leer grenzen zetten zonder relatieverlies of schuldgevoel.",
    price: "€19",
    downloadUrl: "https://example.com/grenzen.pdf",
  },
  {
    id: "energie",
    title: "Energie Zonder Opbranden",
    subtitle: "Duurzame rust en ritme",
    type: "burnout_builder",
    description: "Reset je energie met simpele herstelblokken en duidelijke stopregels.",
    price: "€19",
    downloadUrl: "https://example.com/energie.pdf",
  },
];

const QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Hoe vaak voelt je dag direct te vol zodra je wakker wordt?",
    hint: "Eerste gevoel in de ochtend",
    weights: { overwhelm_queen: 1.2, burnout_builder: 0.6 },
  },
  {
    id: 2,
    question: "Hoe vaak stel je taken uit tot de druk hoog wordt?",
    hint: "Startgedrag en deadline stress",
    weights: { uitsteller: 1.3, overwhelm_queen: 0.4 },
  },
  {
    id: 3,
    question: "Hoe vaak begin je aan meerdere dingen tegelijk?",
    hint: "Aandacht en schakelen",
    weights: { chaos_creator: 1.2, overwhelm_queen: 0.5 },
  },
  {
    id: 4,
    question: "Hoe vaak verlies je tijdsbesef als je in iets zit?",
    hint: "Hyperfocus momenten",
    weights: { hyperfocus_hustler: 1.3, burnout_builder: 0.6 },
  },
  {
    id: 5,
    question: "Hoe vaak zeg je ja terwijl je eigenlijk nee voelt?",
    hint: "Grenzen en sociale druk",
    weights: { people_pleaser: 1.3, burnout_builder: 0.5 },
  },
  {
    id: 6,
    question: "Hoe vaak ga je door terwijl je energie op is?",
    hint: "Doorgaan op lege batterij",
    weights: { burnout_builder: 1.4, people_pleaser: 0.4 },
  },
  {
    id: 7,
    question: "Hoe vaak voelt je hoofd chaotisch terwijl je wil presteren?",
    hint: "Interne ruis",
    weights: { overwhelm_queen: 1.0, chaos_creator: 0.8 },
  },
  {
    id: 8,
    question: "Hoe vaak kun je pas starten als het bijna te laat is?",
    hint: "Uitstel patroon",
    weights: { uitsteller: 1.2, burnout_builder: 0.4 },
  },
  {
    id: 9,
    question: "Hoe vaak neem je emoties of problemen van anderen over?",
    hint: "Emotionele belasting",
    weights: { people_pleaser: 1.2, overwhelm_queen: 0.5 },
  },
  {
    id: 10,
    question: "Hoe vaak vergeet je pauzes of eten tijdens focus?",
    hint: "Zelfzorg tijdens werk",
    weights: { hyperfocus_hustler: 1.0, burnout_builder: 1.0 },
  },
  {
    id: 11,
    question: "Hoe vaak wordt je planning ingehaald door impulsen?",
    hint: "Impuls versus planning",
    weights: { chaos_creator: 1.1, hyperfocus_hustler: 0.6 },
  },
  {
    id: 12,
    question: "Hoe vaak voel je je schuldig als je rust pakt?",
    hint: "Rust en zelfbeeld",
    weights: { burnout_builder: 1.1, people_pleaser: 0.9 },
  },
];

function emptyScores(): Record<AdhdType, number> {
  return {
    overwhelm_queen: 0,
    uitsteller: 0,
    chaos_creator: 0,
    hyperfocus_hustler: 0,
    people_pleaser: 0,
    burnout_builder: 0,
  };
}

function determineType(answers: number[]): AdhdType {
  const scores = emptyScores();

  QUESTIONS.forEach((question, index) => {
    const points = OPTION_POINTS[answers[index] ?? 0] ?? 0;

    Object.entries(question.weights).forEach(([type, weight]) => {
      const key = type as AdhdType;
      scores[key] += points * (weight ?? 0);
    });
  });

  return TYPE_PRIORITY.reduce((best, current) =>
    scores[current] > scores[best] ? current : best,
  );
}

function formatPlan(profile: TypeProfile): string {
  const struggles = profile.struggles.map((item) => `- ${item}`).join("\n");
  const solutions = profile.solutions.map((item) => `- ${item}`).join("\n");

  return [
    `Jij bent: ${profile.name}`,
    "",
    profile.description,
    "",
    "3 herkenbare struggles:",
    struggles,
    "",
    "3 oplossingen:",
    solutions,
    "",
    `Aanbevolen e-book: ${profile.ebookTitle}`,
  ].join("\n");
}

function isValidEmail(email: string): boolean {
  return /.+@.+\..+/.test(email.trim());
}

function parseRouteFromHash(hash: string): Route | null {
  const cleaned = hash.replace(/^#\/?/, "").trim().toLowerCase();
  if (!cleaned) return "home";

  const candidate = cleaned as Route;
  if (ROUTES.includes(candidate)) {
    return candidate;
  }

  return null;
}

function getInitialRoute(): Route {
  if (Platform.OS !== "web" || typeof window === "undefined") {
    return "home";
  }

  return parseRouteFromHash(window.location.hash) ?? "home";
}

type WaveType = "sine" | "triangle" | "square" | "sawtooth";

const appFont = Platform.select({
  ios: "Avenir Next",
  android: "sans-serif-medium",
  default: "Helvetica Neue",
});

const displayFont = Platform.select({
  ios: "Didot",
  android: "serif",
  default: "Times New Roman",
});

export default function App() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 980;
  const isPhoneWeb = Platform.OS === "web" && width < 980;

  const [route, setRoute] = useState<Route>(getInitialRoute);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [emailCapture, setEmailCapture] = useState(false);
  const [resultEmail, setResultEmail] = useState("");
  const [resultEmailError, setResultEmailError] = useState("");
  const [resultNote, setResultNote] = useState("");

  const [selectedProductId, setSelectedProductId] = useState(EBOOK_CATALOG[0].id);
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutCoupon, setCheckoutCoupon] = useState("");
  const [checkoutMethod, setCheckoutMethod] = useState<PaymentMethod>("iDEAL");
  const [checkoutError, setCheckoutError] = useState("");
  const [thanksDetails, setThanksDetails] = useState<{
    name: string;
    method: PaymentMethod;
    product: EbookCard;
  } | null>(null);

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  const audioContextRef = useRef<any>(null);
  const menuFade = useRef(new Animated.Value(0)).current;

  const selectedProduct = useMemo(
    () => EBOOK_CATALOG.find((item) => item.id === selectedProductId) ?? EBOOK_CATALOG[0],
    [selectedProductId],
  );

  const answeredCount = Math.min(answers.length, QUESTIONS.length);
  const quizDone = answeredCount >= QUESTIONS.length;
  const question = QUESTIONS[questionIndex] ?? null;
  const progress = answeredCount / QUESTIONS.length;

  const resultType = useMemo(() => {
    if (!quizDone) return null;
    return determineType(answers);
  }, [answers, quizDone]);

  const resultProfile = resultType ? TYPE_PROFILES[resultType] : null;

  const recommendedEbook = useMemo(() => {
    if (!resultType) return selectedProduct;
    return EBOOK_CATALOG.find((item) => item.type === resultType) ?? selectedProduct;
  }, [resultType, selectedProduct]);

  const activeProductForThanks = thanksDetails?.product ?? selectedProduct;

  const playUiSound = (tone: "tap" | "success" | "error" = "tap") => {
    if (!isPhoneWeb || !soundEnabled || Platform.OS !== "web") return;

    const web = globalThis as any;
    const AudioContextCtor = web?.AudioContext || web?.webkitAudioContext;
    if (!AudioContextCtor) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextCtor();
    }

    const ctx = audioContextRef.current;
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => undefined);
    }

    const playBeep = (freq: number, duration: number, volume: number, wave: WaveType, delay = 0) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime + delay;

      oscillator.type = wave;
      oscillator.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(now);
      oscillator.stop(now + duration + 0.02);
    };

    if (tone === "tap") {
      playBeep(620, 0.08, 0.028, "triangle");
    } else if (tone === "success") {
      playBeep(540, 0.08, 0.03, "sine", 0);
      playBeep(760, 0.12, 0.03, "sine", 0.08);
    } else {
      playBeep(260, 0.14, 0.03, "sawtooth");
    }
  };

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") {
      return;
    }

    const onHashChange = () => {
      const nextRoute = parseRouteFromHash(window.location.hash);
      if (nextRoute) {
        setRoute((prev) => (prev === nextRoute ? prev : nextRoute));
      }
    };

    window.addEventListener("hashchange", onHashChange);
    onHashChange();

    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined") {
      return;
    }

    const nextHash = `#/${route}`;
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash);
    }
  }, [route]);

  useEffect(() => {
    Animated.timing(menuFade, {
      toValue: menuOpen ? 1 : 0,
      duration: menuOpen ? 220 : 170,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [menuFade, menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [route]);

  const goRoute = (next: Route, tone: "tap" | "success" | "error" = "tap") => {
    setRoute(next);
    playUiSound(tone);

    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const startQuiz = () => {
    setAnswers([]);
    setQuestionIndex(0);
    setResultNote("");
    setResultEmail("");
    setResultEmailError("");
    setEmailCapture(false);
    goRoute("quiz", "tap");
  };

  const answerQuestion = (optionIndex: number) => {
    if (quizDone || !question) return;

    const isLastQuestion = questionIndex === QUESTIONS.length - 1;
    setAnswers((prev) => [...prev, optionIndex]);
    setQuestionIndex((prev) => Math.min(prev + 1, QUESTIONS.length - 1));

    if (isLastQuestion) {
      goRoute("result", "success");
    } else {
      playUiSound("tap");
    }
  };

  const previousQuestion = () => {
    if (answeredCount === 0) return;

    setAnswers((prev) => prev.slice(0, -1));
    setQuestionIndex((prev) => Math.max(0, prev - 1));
    playUiSound("tap");
  };

  const downloadPlan = async () => {
    if (!resultProfile) return;

    if (emailCapture && !isValidEmail(resultEmail)) {
      setResultEmailError("Vul een geldig e-mailadres in.");
      playUiSound("error");
      return;
    }

    setResultEmailError("");

    const content = formatPlan(resultProfile);

    if (Platform.OS === "web") {
      const web = globalThis as any;
      if (web?.document && web?.Blob && web?.URL) {
        const blob = new web.Blob([content], { type: "text/plain;charset=utf-8" });
        const url = web.URL.createObjectURL(blob);
        const anchor = web.document.createElement("a");
        anchor.href = url;
        anchor.download = `adhd-plan-${resultType ?? "focuskracht"}.txt`;
        web.document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        web.URL.revokeObjectURL(url);
      }
    } else {
      await Share.share({
        title: `Plan: ${resultProfile.name}`,
        message: content,
      });
    }

    setResultNote(emailCapture ? "Plan gedownload en e-mail vastgelegd." : "Plan gedownload.");
    playUiSound("success");
  };

  const shareResult = async () => {
    if (!resultProfile) return;

    const shareText = `Ik deed de Focuskracht quiz: ${resultProfile.name}. Doe de test ook.`;

    if (Platform.OS === "web") {
      const web = globalThis as any;
      const pageUrl = web?.location?.href ?? "";

      if (web?.navigator?.share) {
        await web.navigator.share({
          title: "Welke ADHD type ben jij?",
          text: shareText,
          url: pageUrl,
        });
        playUiSound("tap");
        return;
      }

      if (web?.navigator?.clipboard?.writeText) {
        await web.navigator.clipboard.writeText(`${shareText} ${pageUrl}`.trim());
        Alert.alert("Gekopieerd", "Je link staat klaar om te delen.");
        playUiSound("tap");
        return;
      }
    }

    await Share.share({
      title: "Welke ADHD type ben jij?",
      message: shareText,
    });
    playUiSound("tap");
  };

  const pickProduct = (product: EbookCard, openCheckout = false) => {
    setSelectedProductId(product.id);
    if (openCheckout) {
      goRoute("checkout", "tap");
    } else {
      playUiSound("tap");
    }
  };

  const completeOrder = (express: boolean) => {
    const name = express ? "Express klant" : checkoutName.trim();
    const email = express ? "" : checkoutEmail.trim();

    if (!express) {
      if (!name || !isValidEmail(email)) {
        setCheckoutError("Vul je naam en een geldig e-mailadres in.");
        playUiSound("error");
        return;
      }
    }

    setCheckoutError("");
    setThanksDetails({
      name,
      method: checkoutMethod,
      product: selectedProduct,
    });

    goRoute("thanks", "success");
  };

  const openDownloadFile = () => {
    const url = activeProductForThanks.downloadUrl;

    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
      playUiSound("tap");
      return;
    }

    Share.share({
      title: activeProductForThanks.title,
      message: url,
    }).catch(() => undefined);
  };

  const sendContact = () => {
    const safeName = contactName.trim();
    const safeEmail = contactEmail.trim();
    const safeMessage = contactMessage.trim();

    if (!safeName || !isValidEmail(safeEmail) || !safeMessage) {
      Alert.alert("Niet compleet", "Vul naam, e-mail en bericht in.");
      playUiSound("error");
      return;
    }

    const subject = encodeURIComponent("Vraag via Focuskracht website");
    const body = encodeURIComponent(
      `Naam: ${safeName}\nE-mail: ${safeEmail}\n\nBericht:\n${safeMessage}`,
    );

    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.location.href = `mailto:info@focuskracht.nl?subject=${subject}&body=${body}`;
      playUiSound("tap");
      return;
    }

    Share.share({
      title: "Contact Focuskracht",
      message: `Mail: info@focuskracht.nl\n\n${safeMessage}`,
    }).catch(() => undefined);
  };

  const renderHome = () => (
    <>
      <View style={[styles.heroWrap, isDesktop && styles.heroWrapDesktop]}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>ADHD-proof website</Text>
          <Text style={styles.heroTitle}>Ontdek je type, pak direct je plan</Text>
          <Text style={styles.heroText}>
            Op mobiel voelt dit als een app. Op desktop als een strakke website. Alles draait om
            snelle actie, weinig ruis en duidelijke keuzes.
          </Text>
          <View style={styles.heroActions}>
            <Pressable style={styles.primaryButton} onPress={startQuiz}>
              <Text style={styles.primaryButtonText}>Start quiz nu</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => goRoute("shop", "tap")}>
              <Text style={styles.secondaryButtonText}>Bekijk e-books</Text>
            </Pressable>
          </View>
          <View style={styles.chipRow}>
            <InfoChip text="12 korte vragen" icon="⚡" />
            <InfoChip text="Direct resultaat" icon="🧠" />
            <InfoChip text="Snelle checkout" icon="🛍" />
          </View>
        </View>

        <View style={styles.heroSideCard}>
          <Text style={styles.sideTitle}>Waarom dit werkt</Text>
          <Text style={styles.sideBullet}>• Korte contentblokken</Text>
          <Text style={styles.sideBullet}>• Grote tappable knoppen</Text>
          <Text style={styles.sideBullet}>• Eenduidige volgende stap</Text>
          <Text style={styles.sideBullet}>• Minder keuzestress</Text>
        </View>
      </View>

      <View style={[styles.featureGrid, isDesktop && styles.featureGridDesktop]}>
        <FeatureCard
          title="Snelle flow"
          text="Van binnenkomst naar actie in minder dan 2 minuten."
          icon="⏱"
        />
        <FeatureCard
          title="Hoge focus"
          text="Duidelijke typografie en visuele hiërarchie zonder chaos."
          icon="🎯"
        />
        <FeatureCard
          title="Mobiel eerst"
          text="Op telefoon voelt het als een native app met snelle acties."
          icon="📱"
        />
      </View>

      <View style={styles.bannerCard}>
        <Text style={styles.bannerEyebrow}>Momentum vasthouden</Text>
        <Text style={styles.bannerTitle}>Begin nu en rond vandaag je eerste stap af</Text>
        <Pressable style={styles.primaryButton} onPress={startQuiz}>
          <Text style={styles.primaryButtonText}>Doe de test</Text>
        </Pressable>
      </View>
    </>
  );

  const renderQuiz = () => (
    <View style={styles.pageCard}>
      <Text style={styles.sectionTitle}>Welke ADHD type ben jij?</Text>
      <Text style={styles.sectionLead}>
        12 vragen, elk in 1 scherm. Kies wat het meest klopt voor jou.
      </Text>

      <View style={styles.progressWrap}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.max(progress * 100, 3)}%` }]} />
        </View>
        <Text style={styles.progressLabel}>
          {answeredCount}/{QUESTIONS.length}
        </Text>
      </View>

      {quizDone ? (
        <View style={styles.inlineMessageCard}>
          <Text style={styles.inlineMessageTitle}>Klaar met de quiz</Text>
          <Text style={styles.inlineMessageText}>Je resultaat staat voor je klaar.</Text>
          <Pressable style={styles.primaryButton} onPress={() => goRoute("result", "success")}>
            <Text style={styles.primaryButtonText}>Bekijk resultaat</Text>
          </Pressable>
        </View>
      ) : question ? (
        <View style={styles.questionCard}>
          <Text style={styles.questionCount}>
            Vraag {questionIndex + 1} van {QUESTIONS.length}
          </Text>
          <Text style={styles.questionText}>{question.question}</Text>
          <Text style={styles.questionHint}>{question.hint}</Text>

          <View style={styles.optionsWrap}>
            {ANSWER_OPTIONS.map((label, index) => (
              <Pressable
                key={label}
                onPress={() => answerQuestion(index)}
                style={({ pressed }) => [styles.optionButton, pressed && styles.optionPressed]}
              >
                <Text style={styles.optionLabel}>{label}</Text>
                <Text style={styles.optionMeta}>Tap</Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={previousQuestion}
            style={[styles.backButton, answeredCount === 0 && styles.backButtonDisabled]}
            disabled={answeredCount === 0}
          >
            <Text style={styles.backButtonText}>Vorige vraag</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );

  const renderResult = () => {
    if (!resultProfile) {
      return (
        <View style={styles.pageCard}>
          <Text style={styles.sectionTitle}>Nog geen resultaat</Text>
          <Text style={styles.sectionLead}>Doe eerst de quiz om je persoonlijke profiel te zien.</Text>
          <Pressable style={styles.primaryButton} onPress={startQuiz}>
            <Text style={styles.primaryButtonText}>Start quiz</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.pageCard}>
        <Text style={styles.resultBadge}>Jouw uitslag</Text>
        <Text style={styles.sectionTitle}>Jij bent: {resultProfile.name}</Text>
        <Text style={styles.sectionLead}>{resultProfile.description}</Text>

        <View style={[styles.twoCol, isDesktop && styles.twoColDesktop]}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoBlockTitle}>3 struggles</Text>
            {resultProfile.struggles.map((item) => (
              <Text key={item} style={styles.infoBlockText}>
                • {item}
              </Text>
            ))}
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoBlockTitle}>3 oplossingen</Text>
            {resultProfile.solutions.map((item) => (
              <Text key={item} style={styles.infoBlockText}>
                • {item}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.recommendCard}>
          <Text style={styles.recommendLabel}>Aanbevolen e-book</Text>
          <View style={[styles.recommendInner, isDesktop && styles.recommendInnerDesktop]}>
            <Image source={recommendedEbook.cover ?? SAMPLE_COVER} style={styles.recommendImage} resizeMode="cover" />
            <View style={styles.recommendCopy}>
              <Text style={styles.recommendTitle}>{recommendedEbook.title}</Text>
              <Text style={styles.recommendText}>{recommendedEbook.description}</Text>
              <Pressable style={styles.secondaryButton} onPress={() => pickProduct(recommendedEbook, true)}>
                <Text style={styles.secondaryButtonText}>Bestel dit e-book</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <Pressable style={styles.captureRow} onPress={() => setEmailCapture((prev) => !prev)}>
          <View style={[styles.captureDot, emailCapture && styles.captureDotActive]} />
          <Text style={styles.captureText}>Stuur mijn resultaat ook naar e-mail (optioneel)</Text>
        </Pressable>

        {emailCapture && (
          <View style={styles.emailWrap}>
            <TextInput
              value={resultEmail}
              onChangeText={(value) => {
                setResultEmail(value);
                if (resultEmailError) setResultEmailError("");
              }}
              placeholder="jij@email.com"
              placeholderTextColor="#9d9089"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            {resultEmailError ? <Text style={styles.errorText}>{resultEmailError}</Text> : null}
          </View>
        )}

        <View style={styles.actionStack}>
          <Pressable style={styles.primaryButton} onPress={downloadPlan}>
            <Text style={styles.primaryButtonText}>Download jouw plan</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={shareResult}>
            <Text style={styles.secondaryButtonText}>Deel resultaat</Text>
          </Pressable>
          <Pressable style={styles.ghostButton} onPress={startQuiz}>
            <Text style={styles.ghostButtonText}>Quiz opnieuw doen</Text>
          </Pressable>
        </View>

        {resultNote ? <Text style={styles.noteText}>{resultNote}</Text> : null}
      </View>
    );
  };

  const renderShop = () => (
    <View style={styles.pageCard}>
      <Text style={styles.sectionTitle}>Shop</Text>
      <Text style={styles.sectionLead}>Kies je e-book en ga direct door naar checkout.</Text>

      <View style={[styles.catalogGrid, isDesktop && styles.catalogGridDesktop]}>
        {EBOOK_CATALOG.map((ebook) => {
          const active = ebook.id === selectedProduct.id;
          return (
            <View
              key={ebook.id}
              style={[
                styles.catalogCard,
                isDesktop && styles.catalogCardDesktop,
                active && styles.catalogCardActive,
              ]}
            >
              <Image source={ebook.cover ?? SAMPLE_COVER} style={styles.catalogImage} resizeMode="cover" />
              <Text style={styles.catalogTitle}>{ebook.title}</Text>
              <Text style={styles.catalogSubtitle}>{ebook.subtitle}</Text>
              <Text style={styles.catalogDescription}>{ebook.description}</Text>
              <View style={styles.catalogFooter}>
                <Text style={styles.catalogPrice}>{ebook.price}</Text>
                <Pressable style={styles.smallButton} onPress={() => pickProduct(ebook, true)}>
                  <Text style={styles.smallButtonText}>Bestel</Text>
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderCheckout = () => (
    <View style={styles.pageCard}>
      <Text style={styles.sectionTitle}>Checkout</Text>
      <Text style={styles.sectionLead}>Snelle checkout om je momentum vast te houden.</Text>

      <View style={[styles.twoCol, isDesktop && styles.twoColDesktop]}>
        <View style={styles.checkoutFormCard}>
          <Text style={styles.infoBlockTitle}>Jouw gegevens</Text>
          <TextInput
            value={checkoutName}
            onChangeText={setCheckoutName}
            placeholder="Naam"
            placeholderTextColor="#9d9089"
            style={styles.input}
          />
          <TextInput
            value={checkoutEmail}
            onChangeText={setCheckoutEmail}
            placeholder="E-mail"
            placeholderTextColor="#9d9089"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <TextInput
            value={checkoutCoupon}
            onChangeText={setCheckoutCoupon}
            placeholder="Code (optioneel)"
            placeholderTextColor="#9d9089"
            style={styles.input}
          />

          <Text style={styles.fieldLabel}>Betaalmethode</Text>
          <View style={styles.paymentGrid}>
            {PAYMENT_METHODS.map((method) => {
              const active = method === checkoutMethod;
              return (
                <Pressable
                  key={method}
                  style={[styles.methodButton, active && styles.methodButtonActive]}
                  onPress={() => {
                    setCheckoutMethod(method);
                    playUiSound("tap");
                  }}
                >
                  <Text style={[styles.methodText, active && styles.methodTextActive]}>{method}</Text>
                </Pressable>
              );
            })}
          </View>

          {checkoutError ? <Text style={styles.errorText}>{checkoutError}</Text> : null}

          <Pressable style={styles.primaryButton} onPress={() => completeOrder(false)}>
            <Text style={styles.primaryButtonText}>Betaal nu met {checkoutMethod}</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => completeOrder(true)}>
            <Text style={styles.secondaryButtonText}>Express checkout</Text>
          </Pressable>
        </View>

        <View style={styles.checkoutSummaryCard}>
          <Text style={styles.infoBlockTitle}>Je bestelling</Text>
          <Image source={selectedProduct.cover ?? SAMPLE_COVER} style={styles.summaryImage} resizeMode="cover" />
          <Text style={styles.summaryTitle}>{selectedProduct.title}</Text>
          <Text style={styles.summaryText}>{selectedProduct.subtitle}</Text>
          <Text style={styles.summaryPrice}>{selectedProduct.price}</Text>
          <Text style={styles.summaryFine}>Je ontvangt direct toegang na betaling.</Text>
        </View>
      </View>
    </View>
  );

  const renderThanks = () => (
    <View style={styles.pageCard}>
      <Text style={styles.resultBadge}>Bedankt</Text>
      <Text style={styles.sectionTitle}>Je bestelling is binnen</Text>
      <Text style={styles.sectionLead}>
        {thanksDetails
          ? `${thanksDetails.name}, je betaling met ${thanksDetails.method} is verwerkt.`
          : "Je bestelling is verwerkt."}
      </Text>

      <View style={[styles.twoCol, isDesktop && styles.twoColDesktop]}>
        <View style={styles.infoBlock}>
          <Text style={styles.infoBlockTitle}>Directe volgende stap</Text>
          <Text style={styles.infoBlockText}>Download nu je e-book en start met je eerste focusblok.</Text>
          <Pressable style={styles.primaryButton} onPress={openDownloadFile}>
            <Text style={styles.primaryButtonText}>Download {activeProductForThanks.title}</Text>
          </Pressable>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.infoBlockTitle}>Overzicht</Text>
          <Text style={styles.infoBlockText}>• Product: {activeProductForThanks.title}</Text>
          <Text style={styles.infoBlockText}>• Bedrag: {activeProductForThanks.price}</Text>
          <Text style={styles.infoBlockText}>
            • Methode: {thanksDetails?.method ?? checkoutMethod}
          </Text>
          <Pressable style={styles.secondaryButton} onPress={() => goRoute("home", "tap")}>
            <Text style={styles.secondaryButtonText}>Terug naar home</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  const renderAbout = () => (
    <View style={styles.pageCard}>
      <Text style={styles.sectionTitle}>Over Focuskracht</Text>
      <Text style={styles.sectionLead}>
        We bouwen ADHD-proof digitale ervaringen: snel, helder en met minimale keuzestress.
      </Text>

      <View style={[styles.featureGrid, isDesktop && styles.featureGridDesktop]}>
        <FeatureCard
          title="Psychologie-gedreven"
          text="Korte blokken, duidelijke hiërarchie en directe beloning door snelle acties."
          icon="🧠"
        />
        <FeatureCard
          title="Mobile first"
          text="Op telefoon voelt het als een app, met vaste snelle acties en subtiele feedback."
          icon="📲"
        />
        <FeatureCard
          title="Conversie focus"
          text="Van quiz naar passende productaanbeveling en snelle checkoutflow."
          icon="⚡"
        />
      </View>

      <Pressable style={styles.secondaryButton} onPress={() => goRoute("contact", "tap")}>
        <Text style={styles.secondaryButtonText}>Contact opnemen</Text>
      </Pressable>
    </View>
  );

  const renderContact = () => (
    <View style={styles.pageCard}>
      <Text style={styles.sectionTitle}>Contact</Text>
      <Text style={styles.sectionLead}>Stuur een bericht. We reageren meestal binnen 24 uur.</Text>

      <TextInput
        value={contactName}
        onChangeText={setContactName}
        placeholder="Naam"
        placeholderTextColor="#9d9089"
        style={styles.input}
      />
      <TextInput
        value={contactEmail}
        onChangeText={setContactEmail}
        placeholder="E-mail"
        placeholderTextColor="#9d9089"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        value={contactMessage}
        onChangeText={setContactMessage}
        placeholder="Bericht"
        placeholderTextColor="#9d9089"
        multiline
        style={[styles.input, styles.textArea]}
      />

      <Pressable style={styles.primaryButton} onPress={sendContact}>
        <Text style={styles.primaryButtonText}>Verstuur bericht</Text>
      </Pressable>
    </View>
  );

  const renderPage = () => {
    switch (route) {
      case "home":
        return renderHome();
      case "quiz":
        return renderQuiz();
      case "result":
        return renderResult();
      case "shop":
        return renderShop();
      case "checkout":
        return renderCheckout();
      case "about":
        return renderAbout();
      case "contact":
        return renderContact();
      case "thanks":
        return renderThanks();
      default:
        return renderHome();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f7eee7" />

      <View pointerEvents="none" style={styles.bgLayer}>
        <View style={styles.bgBlobOne} />
        <View style={styles.bgBlobTwo} />
      </View>

      <View style={[styles.topBar, isDesktop && styles.topBarDesktop]}>
        <View>
          <Text style={styles.brand}>Focuskracht</Text>
          <Text style={styles.brandSub}>{isDesktop ? "ADHD-proof website" : "ADHD web-app"}</Text>
        </View>

        {isDesktop ? (
          <View style={styles.desktopNav}>
            {DESKTOP_NAV.map((item) => {
              const active = route === item.route;
              return (
                <Pressable
                  key={item.route}
                  style={[styles.desktopNavItem, active && styles.desktopNavItemActive]}
                  onPress={() => goRoute(item.route, "tap")}
                >
                  <Text style={[styles.desktopNavText, active && styles.desktopNavTextActive]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
            <Pressable style={styles.headerCta} onPress={() => goRoute("checkout", "tap")}>
              <Text style={styles.headerCtaText}>Koop nu</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={styles.soundToggle}
            onPress={() => {
              setSoundEnabled((prev) => !prev);
              playUiSound("tap");
            }}
          >
            <Text style={styles.soundToggleText}>{soundEnabled ? "🔊" : "🔈"}</Text>
            <Text style={styles.soundToggleLabel}>Geluid</Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && styles.scrollDesktop,
          isPhoneWeb && styles.scrollMobile,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, isDesktop && styles.containerDesktop]}>{renderPage()}</View>

        {isDesktop && (
          <View style={styles.footer}>
            <Text style={styles.footerTitle}>Focuskracht</Text>
            <Text style={styles.footerText}>
              ADHD-proof website en web-app ervaring met quiz, shop en snelle checkout.
            </Text>
          </View>
        )}
      </ScrollView>

      {!isDesktop && (
        <View style={styles.mobileDock}>
          {MOBILE_TABS.map((item) => {
            const active = route === item.route;
            return (
              <Pressable
                key={item.route}
                style={[styles.mobileTab, active && styles.mobileTabActive]}
                onPress={() => goRoute(item.route, "tap")}
              >
                <Text style={[styles.mobileTabIcon, active && styles.mobileTabIconActive]}>{item.icon}</Text>
                <Text style={[styles.mobileTabLabel, active && styles.mobileTabLabelActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}

          <Pressable style={styles.mobileAction} onPress={() => goRoute("checkout", "tap")}>
            <Text style={styles.mobileActionText}>Bestel</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

function FeatureCard({ title, text, icon }: { title: string; text: string; icon: string }) {
  return (
    <View style={styles.featureCard}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

function InfoChip({ text, icon }: { text: string; icon: string }) {
  return (
    <View style={styles.infoChip}>
      <Text style={styles.infoChipIcon}>{icon}</Text>
      <Text style={styles.infoChipText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7eee7",
  },
  bgLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  bgBlobOne: {
    position: "absolute",
    top: -140,
    left: -70,
    width: 340,
    height: 340,
    borderRadius: 999,
    backgroundColor: "rgba(255, 214, 188, 0.68)",
  },
  bgBlobTwo: {
    position: "absolute",
    right: -120,
    top: 110,
    width: 340,
    height: 340,
    borderRadius: 999,
    backgroundColor: "rgba(216, 232, 221, 0.62)",
  },
  topBar: {
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 8,
    minHeight: 72,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ead8cd",
    backgroundColor: "rgba(255, 249, 244, 0.95)",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#ad9588",
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  topBarDesktop: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 1120,
  },
  brand: {
    fontFamily: appFont,
    color: "#2f2735",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  brandSub: {
    fontFamily: appFont,
    color: "#7a6b73",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  soundToggle: {
    minWidth: 72,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dfcdc1",
    backgroundColor: "#fff5ee",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    gap: 1,
  },
  soundToggleText: {
    fontFamily: appFont,
    fontSize: 16,
  },
  soundToggleLabel: {
    fontFamily: appFont,
    color: "#5b4f5a",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  desktopNav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  desktopNavItem: {
    minHeight: 38,
    borderRadius: 10,
    paddingHorizontal: 11,
    justifyContent: "center",
  },
  desktopNavItemActive: {
    backgroundColor: "#fff0e8",
    borderWidth: 1,
    borderColor: "#e5c8b6",
  },
  desktopNavText: {
    fontFamily: appFont,
    color: "#5f515f",
    fontSize: 14,
    fontWeight: "700",
  },
  desktopNavTextActive: {
    color: "#3f3444",
  },
  headerCta: {
    minHeight: 40,
    borderRadius: 11,
    backgroundColor: "#d88f75",
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCtaText: {
    fontFamily: appFont,
    color: "#fffaf6",
    fontSize: 13,
    fontWeight: "800",
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 26,
  },
  scrollDesktop: {
    alignItems: "center",
  },
  scrollMobile: {
    paddingBottom: 108,
  },
  container: {
    width: "100%",
    gap: 14,
  },
  containerDesktop: {
    maxWidth: 1120,
  },
  heroWrap: {
    gap: 12,
  },
  heroWrapDesktop: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  heroCard: {
    flex: 1.2,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#e9d7cb",
    backgroundColor: "rgba(255, 250, 246, 0.95)",
    padding: 18,
    gap: 12,
    shadowColor: "#ac9487",
    shadowOpacity: 0.22,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  heroSideCard: {
    flex: 0.8,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#d8dbcf",
    backgroundColor: "rgba(242, 248, 243, 0.95)",
    padding: 18,
    gap: 9,
  },
  sideTitle: {
    fontFamily: appFont,
    color: "#3a3242",
    fontSize: 20,
    fontWeight: "800",
  },
  sideBullet: {
    fontFamily: appFont,
    color: "#5d5560",
    fontSize: 14,
    lineHeight: 21,
  },
  eyebrow: {
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e8d5ca",
    backgroundColor: "#fff6ef",
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontFamily: appFont,
    color: "#826d60",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  heroTitle: {
    fontFamily: appFont,
    color: "#2f2736",
    fontSize: 36,
    lineHeight: 42,
    fontWeight: "800",
    letterSpacing: -1,
  },
  heroText: {
    fontFamily: appFont,
    color: "#635967",
    fontSize: 15,
    lineHeight: 23,
  },
  heroActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  primaryButton: {
    minHeight: 48,
    borderRadius: 14,
    backgroundColor: "#d88f75",
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#b97f68",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  primaryButtonText: {
    fontFamily: appFont,
    color: "#fffbf8",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  secondaryButton: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#dfccc1",
    backgroundColor: "#fff6ef",
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonText: {
    fontFamily: appFont,
    color: "#4f4252",
    fontSize: 14,
    fontWeight: "700",
  },
  ghostButton: {
    minHeight: 46,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  ghostButtonText: {
    fontFamily: appFont,
    color: "#786a74",
    fontSize: 14,
    fontWeight: "700",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  infoChip: {
    minHeight: 32,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e4d2c6",
    backgroundColor: "#fff8f3",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoChipIcon: {
    fontFamily: appFont,
    fontSize: 13,
  },
  infoChipText: {
    fontFamily: appFont,
    color: "#5e5562",
    fontSize: 12,
    fontWeight: "700",
  },
  featureGrid: {
    gap: 10,
  },
  featureGridDesktop: {
    flexDirection: "row",
  },
  featureCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e6d5ca",
    backgroundColor: "rgba(255, 250, 246, 0.94)",
    padding: 14,
    gap: 6,
  },
  featureIcon: {
    fontFamily: appFont,
    fontSize: 20,
  },
  featureTitle: {
    fontFamily: appFont,
    color: "#3e3446",
    fontSize: 18,
    fontWeight: "800",
  },
  featureText: {
    fontFamily: appFont,
    color: "#665d67",
    fontSize: 14,
    lineHeight: 21,
  },
  bannerCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d9ddd0",
    backgroundColor: "rgba(241, 247, 242, 0.95)",
    padding: 16,
    gap: 10,
  },
  bannerEyebrow: {
    fontFamily: appFont,
    color: "#637167",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  bannerTitle: {
    fontFamily: appFont,
    color: "#2f3036",
    fontSize: 29,
    lineHeight: 35,
    fontWeight: "800",
    letterSpacing: -0.9,
  },
  pageCard: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#e8d7cc",
    backgroundColor: "rgba(255, 251, 247, 0.95)",
    padding: 18,
    gap: 12,
    shadowColor: "#a79387",
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: appFont,
    color: "#312938",
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
    letterSpacing: -0.9,
  },
  sectionLead: {
    fontFamily: appFont,
    color: "#645a66",
    fontSize: 15,
    lineHeight: 23,
  },
  progressWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#eadfd8",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#d89c88",
  },
  progressLabel: {
    minWidth: 50,
    textAlign: "right",
    fontFamily: appFont,
    fontSize: 12,
    fontWeight: "700",
    color: "#7c6f68",
  },
  questionCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e7d5cb",
    backgroundColor: "#fff8f2",
    padding: 14,
    gap: 12,
  },
  questionCount: {
    fontFamily: appFont,
    color: "#837168",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  questionText: {
    fontFamily: appFont,
    color: "#342b39",
    fontSize: 29,
    lineHeight: 35,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  questionHint: {
    fontFamily: appFont,
    color: "#6d626d",
    fontSize: 14,
  },
  optionsWrap: {
    gap: 9,
  },
  optionButton: {
    minHeight: 62,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e4d2c7",
    backgroundColor: "#fffdf9",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionPressed: {
    backgroundColor: "#fff2e8",
    transform: [{ scale: 0.99 }],
  },
  optionLabel: {
    fontFamily: appFont,
    color: "#3a3240",
    fontSize: 17,
    fontWeight: "700",
  },
  optionMeta: {
    fontFamily: appFont,
    color: "#9a8a80",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  backButton: {
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#decdc2",
    backgroundColor: "#fff6ef",
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonDisabled: {
    opacity: 0.45,
  },
  backButtonText: {
    fontFamily: appFont,
    color: "#5b4f5d",
    fontSize: 14,
    fontWeight: "700",
  },
  inlineMessageCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#dfcec2",
    backgroundColor: "#fff7f1",
    padding: 14,
    gap: 8,
  },
  inlineMessageTitle: {
    fontFamily: appFont,
    color: "#3f3547",
    fontSize: 20,
    fontWeight: "800",
  },
  inlineMessageText: {
    fontFamily: appFont,
    color: "#675d67",
    fontSize: 14,
  },
  resultBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e2d6ce",
    backgroundColor: "#fff6ef",
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontFamily: appFont,
    color: "#7b6a61",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  twoCol: {
    gap: 10,
  },
  twoColDesktop: {
    flexDirection: "row",
  },
  infoBlock: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5d4c9",
    backgroundColor: "#fff9f4",
    padding: 12,
    gap: 6,
  },
  infoBlockTitle: {
    fontFamily: appFont,
    color: "#43394a",
    fontSize: 16,
    fontWeight: "800",
  },
  infoBlockText: {
    fontFamily: appFont,
    color: "#685d67",
    fontSize: 14,
    lineHeight: 20,
  },
  recommendCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddcec3",
    backgroundColor: "#fff5ee",
    padding: 12,
    gap: 8,
  },
  recommendLabel: {
    fontFamily: appFont,
    color: "#6e6168",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  recommendInner: {
    gap: 10,
  },
  recommendInnerDesktop: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  recommendImage: {
    width: "100%",
    aspectRatio: 1024 / 1536,
    borderRadius: 12,
    backgroundColor: "#efe4db",
  },
  recommendCopy: {
    flex: 1,
    gap: 8,
  },
  recommendTitle: {
    fontFamily: appFont,
    color: "#3c3244",
    fontSize: 22,
    fontWeight: "800",
  },
  recommendText: {
    fontFamily: appFont,
    color: "#675d66",
    fontSize: 14,
    lineHeight: 21,
  },
  captureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  captureDot: {
    width: 18,
    height: 18,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#cab7ad",
    backgroundColor: "#fff7f1",
  },
  captureDotActive: {
    borderColor: "#b18371",
    backgroundColor: "#b18371",
  },
  captureText: {
    flex: 1,
    fontFamily: appFont,
    color: "#665b65",
    fontSize: 14,
  },
  emailWrap: {
    gap: 6,
  },
  input: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2d0c6",
    backgroundColor: "#fff8f2",
    paddingHorizontal: 12,
    fontFamily: appFont,
    fontSize: 15,
    color: "#362f3c",
  },
  textArea: {
    minHeight: 116,
    textAlignVertical: "top",
    paddingVertical: 12,
  },
  errorText: {
    fontFamily: appFont,
    color: "#c4555d",
    fontSize: 12,
    fontWeight: "700",
  },
  actionStack: {
    gap: 10,
  },
  noteText: {
    fontFamily: appFont,
    color: "#5b7a6a",
    fontSize: 13,
    fontWeight: "700",
  },
  catalogGrid: {
    gap: 10,
  },
  catalogGridDesktop: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  catalogCard: {
    width: "100%",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e3d3c9",
    backgroundColor: "#fff9f4",
    padding: 10,
    gap: 7,
  },
  catalogCardDesktop: {
    width: "32.4%",
  },
  catalogCardActive: {
    borderColor: "#c28f7a",
    backgroundColor: "#fff2ea",
  },
  catalogImage: {
    width: "100%",
    aspectRatio: 1024 / 1536,
    borderRadius: 10,
    backgroundColor: "#f0e4dc",
  },
  catalogTitle: {
    fontFamily: appFont,
    color: "#3e3445",
    fontSize: 16,
    fontWeight: "800",
    lineHeight: 20,
  },
  catalogSubtitle: {
    fontFamily: appFont,
    color: "#6c616c",
    fontSize: 13,
    lineHeight: 18,
  },
  catalogDescription: {
    fontFamily: appFont,
    color: "#6e626d",
    fontSize: 13,
    lineHeight: 19,
  },
  catalogFooter: {
    marginTop: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  catalogPrice: {
    fontFamily: appFont,
    color: "#3d3344",
    fontSize: 20,
    fontWeight: "800",
  },
  smallButton: {
    minHeight: 38,
    borderRadius: 10,
    backgroundColor: "#d88f75",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  smallButtonText: {
    fontFamily: appFont,
    color: "#fffaf7",
    fontSize: 13,
    fontWeight: "800",
  },
  checkoutFormCard: {
    flex: 1.1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e4d4ca",
    backgroundColor: "#fff8f2",
    padding: 12,
    gap: 9,
  },
  checkoutSummaryCard: {
    flex: 0.9,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e1d2c7",
    backgroundColor: "#fff6ef",
    padding: 12,
    gap: 8,
  },
  fieldLabel: {
    fontFamily: appFont,
    color: "#4f4452",
    fontSize: 13,
    fontWeight: "700",
  },
  paymentGrid: {
    gap: 7,
  },
  methodButton: {
    minHeight: 42,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#dec9be",
    backgroundColor: "#fffdfb",
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  methodButtonActive: {
    borderColor: "#ba816f",
    backgroundColor: "#fff0e7",
  },
  methodText: {
    fontFamily: appFont,
    color: "#4f4350",
    fontSize: 14,
    fontWeight: "700",
  },
  methodTextActive: {
    color: "#8b5748",
  },
  summaryImage: {
    width: "100%",
    aspectRatio: 1024 / 1536,
    borderRadius: 12,
    backgroundColor: "#efe2d8",
  },
  summaryTitle: {
    fontFamily: appFont,
    color: "#3e3346",
    fontSize: 18,
    fontWeight: "800",
  },
  summaryText: {
    fontFamily: appFont,
    color: "#675c67",
    fontSize: 13,
  },
  summaryPrice: {
    fontFamily: appFont,
    color: "#372d3f",
    fontSize: 24,
    fontWeight: "800",
  },
  summaryFine: {
    fontFamily: appFont,
    color: "#7a6f77",
    fontSize: 12,
  },
  footer: {
    marginTop: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e2d2c7",
    backgroundColor: "rgba(255, 250, 246, 0.95)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 4,
  },
  footerTitle: {
    fontFamily: appFont,
    color: "#372e40",
    fontSize: 17,
    fontWeight: "800",
  },
  footerText: {
    fontFamily: appFont,
    color: "#685d67",
    fontSize: 13,
    lineHeight: 19,
  },
  mobileDock: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ddcbbf",
    backgroundColor: "rgba(255, 250, 246, 0.98)",
    minHeight: 76,
    paddingHorizontal: 8,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    shadowColor: "#9f8578",
    shadowOpacity: 0.26,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  mobileTab: {
    width: 58,
    minHeight: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e4d2c7",
    backgroundColor: "#fff7f1",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  },
  mobileTabActive: {
    borderColor: "#c38973",
    backgroundColor: "#ffeee3",
  },
  mobileTabIcon: {
    fontFamily: appFont,
    fontSize: 15,
    color: "#5f5160",
    fontWeight: "800",
  },
  mobileTabIconActive: {
    color: "#8d5848",
  },
  mobileTabLabel: {
    fontFamily: appFont,
    color: "#5f5160",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.55,
  },
  mobileTabLabelActive: {
    color: "#8d5848",
  },
  mobileAction: {
    flex: 1,
    minHeight: 60,
    borderRadius: 14,
    backgroundColor: "#d88f75",
    alignItems: "center",
    justifyContent: "center",
  },
  mobileActionText: {
    fontFamily: appFont,
    color: "#fffaf7",
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.65,
  },
});
