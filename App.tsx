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
  cover?: any;
  sample?: boolean;
};

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const SAMPLE_COVER = require("./assets/ebook-rust-in-je-hoofd.jpg");

const TYPE_PRIORITY: AdhdType[] = [
  "overwhelm_queen",
  "uitsteller",
  "chaos_creator",
  "hyperfocus_hustler",
  "people_pleaser",
  "burnout_builder",
];

const ANSWER_OPTIONS = ["Nooit", "Soms", "Vaak", "Altijd"];
const OPTION_POINTS = [0, 1, 2, 3];
const OPTION_VIBE_LABELS = ["Rustig", "Wisselend", "Herkenbaar", "Vol raak"];

const TYPE_PROFILES: Record<AdhdType, TypeProfile> = {
  overwhelm_queen: {
    name: "Overwhelm Queen",
    description:
      "Jij voelt alles tegelijk. Je brein staat vaak op 20 tabbladen tegelijk open en je wilt alles goed doen.",
    struggles: [
      "To-do lijst voelt meteen te groot",
      "Je raakt overprikkeld van details",
      "Je denkt veel na en komt moeilijk tot rust",
    ],
    solutions: [
      "Werk met 1 focusblok van 20 minuten",
      "Kies elke dag alleen je top 3 prioriteiten",
      "Gebruik een vaste reset-routine in de avond",
    ],
    ebookTitle: "Rust in je Hoofd",
  },
  uitsteller: {
    name: "Uitsteller",
    description:
      "Je weet wat je moet doen, maar starten voelt zwaar. Met tijdsdruk kun je ineens wel heel veel.",
    struggles: [
      "Belangrijke taken schuiven door",
      "Je begint pas bij stress of schuldgevoel",
      "Je baalt achteraf van uitstel",
    ],
    solutions: [
      "Start met een mini-actie van 5 minuten",
      "Gebruik korte timers voor een snelle kickstart",
      "Beloon starten, niet perfectie",
    ],
    ebookTitle: "Van Uitstel naar Actie",
  },
  chaos_creator: {
    name: "Chaos Creator",
    description:
      "Jij hebt veel energie en ideeen, maar structuur blijft niet vanzelf staan. Je leeft in snelle schakels.",
    struggles: [
      "Rommel stapelt zich snel op",
      "Je springt van taak naar taak",
      "Je vergeet kleine maar belangrijke dingen",
    ],
    solutions: [
      "Werk met visuele checklists",
      "Plan een dagelijkse 15-min reset",
      "Bundel vergelijkbare taken in 1 blok",
    ],
    ebookTitle: "Orde in je Chaos",
  },
  hyperfocus_hustler: {
    name: "Hyperfocus Hustler",
    description:
      "Als je iets leuk vindt ga je all-in. Je kunt superproductief zijn, maar balans en herstel verdwijnen snel.",
    struggles: [
      "Tijdsbesef raakt weg tijdens focus",
      "Pauzes en zelfzorg schieten erbij in",
      "Je crasht na een productiviteitspiek",
    ],
    solutions: [
      "Zet stop-alarmen per 45 minuten",
      "Plan herstel net zo hard als werk",
      "Eindig focusblokken met een korte cooling down",
    ],
    ebookTitle: "Hyperfocus Zonder Crash",
  },
  people_pleaser: {
    name: "People Pleaser",
    description:
      "Je voelt anderen goed aan en helpt graag. Daardoor zet je jezelf vaak op plek twee.",
    struggles: [
      "Te vaak ja zeggen terwijl je nee voelt",
      "Je agenda raakt vol met andermans prioriteiten",
      "Grenzen aangeven voelt ongemakkelijk",
    ],
    solutions: [
      "Gebruik een standaard vriendelijke nee-zin",
      "Plan eerst tijd voor je eigen topprioriteit",
      "Check dagelijks: wat heb IK vandaag nodig",
    ],
    ebookTitle: "Grenzen Zonder Schuldgevoel",
  },
  burnout_builder: {
    name: "Burn-out Builder",
    description:
      "Je bent sterk en loyaal, maar gaat vaak te lang door. Je lichaam geeft pas laat een stop-signaal.",
    struggles: [
      "Doorgaan terwijl je leeg bent",
      "Herstelmomenten overslaan",
      "Moe zijn maar toch blijven presteren",
    ],
    solutions: [
      "Meet je energie dagelijks op schaal 1-10",
      "Bouw niet-onderhandelbare rustblokken in",
      "Werk met stopregels voor overbelasting",
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
    cover: SAMPLE_COVER,
    sample: true,
  },
  {
    id: "uitstel-actie",
    title: "Van Uitstel naar Actie",
    subtitle: "Starten zonder stress",
    type: "uitsteller",
  },
  {
    id: "chaos-reset",
    title: "Orde in je Chaos",
    subtitle: "Structuur die blijft",
    type: "chaos_creator",
  },
  {
    id: "focus-crash",
    title: "Hyperfocus Zonder Crash",
    subtitle: "Productief met balans",
    type: "hyperfocus_hustler",
  },
  {
    id: "grenzen",
    title: "Grenzen Zonder Schuldgevoel",
    subtitle: "People pleasing loslaten",
    type: "people_pleaser",
  },
  {
    id: "energie",
    title: "Energie Zonder Opbranden",
    subtitle: "Duurzame rust en ritme",
    type: "burnout_builder",
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
    question: "Hoe vaak stel je een taak uit tot de druk hoog wordt?",
    hint: "Startgedrag en deadlines",
    weights: { uitsteller: 1.3, overwhelm_queen: 0.4 },
  },
  {
    id: 3,
    question: "Hoe vaak begin je aan meerdere dingen tegelijk?",
    hint: "Aandacht verspreiden",
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
    question: "Hoe vaak voelt je hoofd chaotisch terwijl je wel wil presteren?",
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
    question: "Hoe vaak vergeet je pauzes, eten of water tijdens focus?",
    hint: "Zelfzorg tijdens werk",
    weights: { hyperfocus_hustler: 1.0, burnout_builder: 1.0 },
  },
  {
    id: 11,
    question: "Hoe vaak wordt je planning ingehaald door spontane impulsen?",
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

export default function App() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 860;
  const isSmallPhone = width < 376;

  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [animating, setAnimating] = useState(false);

  const [emailCapture, setEmailCapture] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [note, setNote] = useState("");
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installNote, setInstallNote] = useState("");

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const quizDone = answers.length >= QUESTIONS.length;
  const progress = Math.min(answers.length, QUESTIONS.length) / QUESTIONS.length;
  const question = QUESTIONS[questionIndex];
  const answeredCount = Math.min(answers.length, QUESTIONS.length);
  const currentQuestionNumber = Math.min(questionIndex + 1, QUESTIONS.length);
  const canGoBack = questionIndex > 0 && !quizDone;
  const stepLabel = quizDone
    ? "Resultaat klaar"
    : `Vraag ${currentQuestionNumber} van ${QUESTIONS.length}`;
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["2%", "100%"],
  });

  const resultType = useMemo(() => {
    if (!quizDone) return null;
    return determineType(answers);
  }, [answers, quizDone]);

  const resultProfile = resultType ? TYPE_PROFILES[resultType] : null;
  const recommendedEbook = resultType
    ? EBOOK_CATALOG.find((item) => item.type === resultType) ?? EBOOK_CATALOG[0]
    : EBOOK_CATALOG[0];

  useEffect(() => {
    slideAnim.setValue(18);
    fadeAnim.setValue(0);

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 240,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [questionIndex, quizDone, fadeAnim, slideAnim]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 240,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setInstallNote("App toegevoegd aan je beginscherm.");
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt as EventListener);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt as EventListener);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const installAsApp = async () => {
    if (!installPrompt) {
      setInstallNote("Gebruik in Safari: Deel > Zet op beginscherm.");
      return;
    }

    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;

    if (choice.outcome === "accepted") {
      setInstallNote("Top, app-installatie gestart.");
    } else {
      setInstallNote("Installatie geannuleerd. Je kunt later opnieuw proberen.");
    }
  };

  const goNext = (optionIndex: number) => {
    if (animating || quizDone) return;

    setAnimating(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -16,
        duration: 170,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setAnswers((prev) => [...prev, optionIndex]);
      setQuestionIndex((prev) => prev + 1);
      setAnimating(false);
    });
  };

  const goBack = () => {
    if (animating || questionIndex === 0 || quizDone) return;

    setAnswers((prev) => prev.slice(0, -1));
    setQuestionIndex((prev) => Math.max(0, prev - 1));
  };

  const resetQuiz = () => {
    setAnswers([]);
    setQuestionIndex(0);
    setAnimating(false);
    setEmailCapture(false);
    setEmail("");
    setEmailError("");
    setNote("");
  };

  const downloadPlan = async () => {
    if (!resultProfile || !resultType) return;

    if (emailCapture && !isValidEmail(email)) {
      setEmailError("Vul een geldig e-mailadres in.");
      return;
    }

    setEmailError("");
    const content = formatPlan(resultProfile);

    if (Platform.OS === "web") {
      const web = globalThis as any;
      if (web?.document && web?.Blob && web?.URL) {
        const blob = new web.Blob([content], { type: "text/plain;charset=utf-8" });
        const url = web.URL.createObjectURL(blob);
        const anchor = web.document.createElement("a");
        anchor.href = url;
        anchor.download = `adhd-plan-${resultType}.txt`;
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

    setNote(emailCapture ? "Plan gedownload en e-mail vastgelegd." : "Plan gedownload.");
  };

  const shareResult = async () => {
    if (!resultProfile) return;

    const shareText = `Ik deed de quiz: ${resultProfile.name}. Doe de test ook en pak je ADHD-plan.`;

    if (Platform.OS === "web") {
      const web = globalThis as any;
      const pageUrl = web?.location?.href ?? "";

      if (web?.navigator?.share) {
        await web.navigator.share({
          title: "Welke ADHD type ben jij?",
          text: shareText,
          url: pageUrl,
        });
        return;
      }

      if (web?.navigator?.clipboard?.writeText) {
        await web.navigator.clipboard.writeText(`${shareText} ${pageUrl}`.trim());
        Alert.alert("Gekopieerd", "Je resultaat staat klaar om te delen op WhatsApp of TikTok.");
        return;
      }
    }

    await Share.share({
      title: "Welke ADHD type ben jij?",
      message: shareText,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8efe8" />

      <View pointerEvents="none" style={styles.bgLayer}>
        <View style={styles.bgBlobOne} />
        <View style={styles.bgBlobTwo} />
      </View>

      <View style={[styles.appBar, isDesktop && styles.appBarDesktop]}>
        <View style={styles.appBarBrandWrap}>
          <Text style={styles.appBarBrand}>Focuskracht</Text>
          <Text style={styles.appBarSub}>ADHD Type Quiz</Text>
        </View>
        <View style={styles.appBarPill}>
          <Text style={styles.appBarPillText}>{stepLabel}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          !isDesktop && styles.scrollMobilePadded,
          isDesktop && styles.scrollDesktop,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={[styles.container, isDesktop && styles.containerDesktop]}>
          <View style={styles.headerCard}>
            <Text style={styles.badge}>Self test</Text>
            <Text style={[styles.title, isSmallPhone && styles.titleSmall]}>
              Welke ADHD type ben jij?
            </Text>
            <Text style={styles.subtitle}>
              12 snelle vragen, 1 per scherm. Daarna krijg je direct een persoonlijk plan.
            </Text>
            <View style={styles.installWrap}>
              <Pressable style={styles.installButton} onPress={installAsApp}>
                <Text style={styles.installButtonText}>Installeer als app</Text>
              </Pressable>
              {installNote ? <Text style={styles.installNote}>{installNote}</Text> : null}
            </View>
          </View>

          <View style={styles.progressWrap}>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
            </View>
            <Text style={styles.progressLabel}>
              {answeredCount}/{QUESTIONS.length}
            </Text>
          </View>

          {!quizDone && question ? (
            <Animated.View
              style={[
                styles.questionCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateX: slideAnim }],
                },
              ]}
            >
              <Text style={styles.questionCount}>
                Vraag {questionIndex + 1} van {QUESTIONS.length}
              </Text>
              <Text style={[styles.questionText, isSmallPhone && styles.questionTextSmall]}>
                {question.question}
              </Text>
              <Text style={styles.questionHint}>{question.hint}</Text>

              <View style={styles.optionsWrap}>
                {ANSWER_OPTIONS.map((label, index) => (
                  <Pressable
                    key={label}
                    onPress={() => goNext(index)}
                    style={({ pressed }) => [styles.optionButton, pressed && styles.optionButtonPressed]}
                    disabled={animating}
                  >
                    <Text style={styles.optionLabel}>{label}</Text>
                    <Text style={styles.optionMeta}>{OPTION_VIBE_LABELS[index]}</Text>
                  </Pressable>
                ))}
              </View>

              {isDesktop && (
                <View style={styles.footerRow}>
                  <Pressable
                    onPress={goBack}
                    style={[styles.backButton, questionIndex === 0 && styles.backButtonDisabled]}
                    disabled={questionIndex === 0}
                  >
                    <Text style={styles.backButtonText}>Vorige</Text>
                  </Pressable>
                </View>
              )}
            </Animated.View>
          ) : (
            resultProfile && (
              <View style={styles.resultCard}>
                <Text style={styles.resultBadge}>Jouw uitslag</Text>
                <Text style={[styles.resultTitle, isSmallPhone && styles.resultTitleSmall]}>
                  Jij bent: {resultProfile.name}
                </Text>
                <Text style={styles.resultDescription}>{resultProfile.description}</Text>

                <View style={[styles.blocksWrap, isDesktop && styles.blocksWrapDesktop]}>
                  <View style={styles.infoBlock}>
                    <Text style={styles.blockTitle}>3 struggles</Text>
                    {resultProfile.struggles.map((item) => (
                      <Text key={item} style={styles.blockItem}>
                        • {item}
                      </Text>
                    ))}
                  </View>

                  <View style={styles.infoBlock}>
                    <Text style={styles.blockTitle}>3 oplossingen</Text>
                    {resultProfile.solutions.map((item) => (
                      <Text key={item} style={styles.blockItem}>
                        • {item}
                      </Text>
                    ))}
                  </View>
                </View>

                <View style={styles.recoWrap}>
                  <Text style={styles.recoLabel}>Aanbevolen e-book</Text>
                  <View style={styles.recoCard}>
                    {recommendedEbook.cover ? (
                      <Image source={recommendedEbook.cover} resizeMode="cover" style={styles.recoImage} />
                    ) : (
                      <View style={styles.recoPlaceholder}>
                        <Text style={styles.recoPlaceholderText}>Preview</Text>
                      </View>
                    )}
                    <View style={styles.recoCopy}>
                      <Text style={styles.recoTitle}>{recommendedEbook.title}</Text>
                      <Text style={styles.recoSubtitle}>{recommendedEbook.subtitle}</Text>
                    </View>
                  </View>
                </View>

                <Pressable
                  onPress={() => setEmailCapture((prev) => !prev)}
                  style={styles.captureRow}
                >
                  <View style={[styles.captureDot, emailCapture && styles.captureDotActive]} />
                  <Text style={styles.captureText}>Stuur mijn resultaat ook naar e-mail (optioneel)</Text>
                </Pressable>

                {emailCapture && (
                  <View style={styles.emailWrap}>
                    <TextInput
                      value={email}
                      onChangeText={(value) => {
                        setEmail(value);
                        if (emailError) setEmailError("");
                      }}
                      placeholder="jij@email.com"
                      placeholderTextColor="#9d9089"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={styles.emailInput}
                    />
                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                  </View>
                )}

                <View style={styles.actionStack}>
                  <Pressable style={styles.downloadButton} onPress={downloadPlan}>
                    <Text style={styles.downloadButtonText}>Download jouw plan</Text>
                  </Pressable>

                  <Pressable style={styles.shareButton} onPress={shareResult}>
                    <Text style={styles.shareButtonText}>Deel resultaat</Text>
                  </Pressable>

                  <Pressable style={styles.restartButton} onPress={resetQuiz}>
                    <Text style={styles.restartButtonText}>Quiz opnieuw doen</Text>
                  </Pressable>
                </View>

                {note ? <Text style={styles.noteText}>{note}</Text> : null}

                <View style={styles.catalogSection}>
                  <Text style={styles.catalogTitle}>Alle e-books los bekijken</Text>
                  <View style={styles.catalogGrid}>
                    {EBOOK_CATALOG.map((ebook) => {
                      const isRecommended = ebook.type === resultType;
                      return (
                        <View
                          key={ebook.id}
                          style={[styles.catalogCard, isRecommended && styles.catalogCardRecommended]}
                        >
                          {ebook.cover ? (
                            <Image source={ebook.cover} resizeMode="cover" style={styles.catalogImage} />
                          ) : (
                            <View style={styles.catalogPlaceholder}>
                              <Text style={styles.catalogPlaceholderText}>Binnenkort</Text>
                            </View>
                          )}

                          <Text style={styles.catalogCardTitle}>{ebook.title}</Text>
                          <Text style={styles.catalogCardSubtitle}>{ebook.subtitle}</Text>
                          {ebook.sample ? <Text style={styles.sampleTag}>Voorbeeld cover</Text> : null}
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
            )
          )}
        </View>
      </ScrollView>

      {!isDesktop && (
        <View style={styles.mobileDock}>
          <Pressable style={styles.dockButton} onPress={resetQuiz}>
            <Text style={styles.dockButtonIcon}>⌂</Text>
            <Text style={styles.dockButtonText}>Home</Text>
          </Pressable>

          <View style={styles.dockCenter}>
            <Text style={styles.dockCenterTitle}>{stepLabel}</Text>
            <Text style={styles.dockCenterMeta}>{Math.round(progress * 100)}% voltooid</Text>
          </View>

          <Pressable
            style={[styles.dockButton, !quizDone && !canGoBack && styles.dockButtonDisabled]}
            onPress={quizDone ? downloadPlan : goBack}
            disabled={!quizDone && !canGoBack}
          >
            <Text style={styles.dockButtonIcon}>{quizDone ? "⬇" : "←"}</Text>
            <Text style={styles.dockButtonText}>{quizDone ? "Plan" : "Vorige"}</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const appFont = Platform.select({
  ios: "Avenir Next",
  android: "sans-serif",
  default: "system-ui",
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8efe8",
  },
  appBar: {
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 6,
    minHeight: 64,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ead8cf",
    backgroundColor: "rgba(255, 250, 246, 0.95)",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#a99388",
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  appBarDesktop: {
    maxWidth: 760,
    width: "100%",
    alignSelf: "center",
  },
  appBarBrandWrap: {
    gap: 2,
  },
  appBarBrand: {
    fontFamily: appFont,
    color: "#2e2738",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  appBarSub: {
    fontFamily: appFont,
    color: "#7b6d77",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  appBarPill: {
    minHeight: 34,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ddc9bf",
    backgroundColor: "#fff5ee",
    paddingHorizontal: 11,
    justifyContent: "center",
  },
  appBarPillText: {
    fontFamily: appFont,
    color: "#6a5f68",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  bgLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  bgBlobOne: {
    position: "absolute",
    top: -120,
    left: -60,
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: "rgba(255, 227, 214, 0.7)",
  },
  bgBlobTwo: {
    position: "absolute",
    right: -80,
    top: 120,
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: "rgba(220, 232, 226, 0.55)",
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 28,
  },
  scrollMobilePadded: {
    paddingBottom: 108,
  },
  scrollDesktop: {
    alignItems: "center",
  },
  container: {
    width: "100%",
    gap: 12,
  },
  containerDesktop: {
    maxWidth: 760,
  },
  headerCard: {
    paddingHorizontal: 4,
    gap: 6,
  },
  installWrap: {
    marginTop: 4,
    gap: 6,
    alignItems: "flex-start",
  },
  installButton: {
    minHeight: 36,
    borderRadius: 999,
    backgroundColor: "#f1e1d7",
    borderWidth: 1,
    borderColor: "#ddc6b9",
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  installButtonText: {
    fontFamily: appFont,
    fontSize: 12,
    color: "#6a5548",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  installNote: {
    fontFamily: appFont,
    fontSize: 12,
    color: "#786a63",
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e9d7cb",
    backgroundColor: "#fff7f0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontFamily: appFont,
    fontSize: 11,
    fontWeight: "700",
    color: "#856d62",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  title: {
    fontFamily: appFont,
    color: "#2d2636",
    fontSize: 34,
    lineHeight: 39,
    fontWeight: "800",
    letterSpacing: -0.9,
  },
  titleSmall: {
    fontSize: 30,
    lineHeight: 35,
  },
  subtitle: {
    fontFamily: appFont,
    color: "#665d66",
    fontSize: 15,
    lineHeight: 22,
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
    backgroundColor: "#d0a291",
  },
  progressLabel: {
    minWidth: 50,
    textAlign: "right",
    fontFamily: appFont,
    fontSize: 12,
    fontWeight: "700",
    color: "#84746a",
  },
  questionCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#ead9cf",
    backgroundColor: "rgba(255, 251, 246, 0.96)",
    padding: 18,
    gap: 14,
    shadowColor: "#a99388",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
    minHeight: 430,
  },
  questionCount: {
    fontFamily: appFont,
    fontSize: 12,
    fontWeight: "700",
    color: "#8c7a70",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  questionText: {
    fontFamily: appFont,
    color: "#322b39",
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  questionTextSmall: {
    fontSize: 27,
    lineHeight: 33,
  },
  questionHint: {
    fontFamily: appFont,
    color: "#6f646f",
    fontSize: 14,
  },
  optionsWrap: {
    gap: 10,
  },
  optionButton: {
    minHeight: 70,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e5d2c8",
    backgroundColor: "#fff9f3",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#c9aa9e",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  optionButtonPressed: {
    backgroundColor: "#ffefe6",
    transform: [{ scale: 0.985 }],
  },
  optionLabel: {
    fontFamily: appFont,
    color: "#352e3a",
    fontSize: 17,
    fontWeight: "700",
  },
  optionMeta: {
    fontFamily: appFont,
    color: "#8f7f76",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.75,
  },
  footerRow: {
    marginTop: 2,
    flexDirection: "row",
  },
  backButton: {
    minHeight: 42,
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
    fontSize: 14,
    fontWeight: "700",
    color: "#5b4f5d",
  },
  resultCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#ead9cf",
    backgroundColor: "rgba(255, 251, 246, 0.96)",
    padding: 18,
    gap: 14,
    shadowColor: "#a99388",
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  resultBadge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e0d9d3",
    backgroundColor: "#f8f5f2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontFamily: appFont,
    fontSize: 11,
    fontWeight: "700",
    color: "#766a63",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  resultTitle: {
    fontFamily: appFont,
    color: "#302938",
    fontSize: 34,
    lineHeight: 39,
    fontWeight: "800",
    letterSpacing: -0.9,
  },
  resultTitleSmall: {
    fontSize: 31,
    lineHeight: 36,
  },
  resultDescription: {
    fontFamily: appFont,
    color: "#615863",
    fontSize: 15,
    lineHeight: 23,
  },
  blocksWrap: {
    gap: 10,
  },
  blocksWrapDesktop: {
    flexDirection: "row",
  },
  infoBlock: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e7d7ce",
    backgroundColor: "#fff8f3",
    padding: 12,
    gap: 7,
  },
  blockTitle: {
    fontFamily: appFont,
    color: "#433848",
    fontSize: 14,
    fontWeight: "800",
  },
  blockItem: {
    fontFamily: appFont,
    color: "#695d69",
    fontSize: 13,
    lineHeight: 19,
  },
  recoWrap: {
    gap: 7,
  },
  recoLabel: {
    fontFamily: appFont,
    color: "#655965",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  recoCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ddcec4",
    backgroundColor: "#fff6f0",
    overflow: "hidden",
  },
  recoImage: {
    width: "100%",
    aspectRatio: 1024 / 1536,
    backgroundColor: "#f0e4db",
  },
  recoPlaceholder: {
    width: "100%",
    aspectRatio: 1024 / 1536,
    backgroundColor: "#efe2d8",
    alignItems: "center",
    justifyContent: "center",
  },
  recoPlaceholderText: {
    fontFamily: appFont,
    color: "#8a7b72",
    fontSize: 13,
    fontWeight: "700",
  },
  recoCopy: {
    padding: 12,
    gap: 4,
  },
  recoTitle: {
    fontFamily: appFont,
    color: "#352e3b",
    fontSize: 19,
    fontWeight: "800",
  },
  recoSubtitle: {
    fontFamily: appFont,
    color: "#6f646e",
    fontSize: 14,
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
  emailInput: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2d0c6",
    backgroundColor: "#fff8f2",
    paddingHorizontal: 12,
    fontFamily: appFont,
    fontSize: 15,
    color: "#362f3c",
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
  downloadButton: {
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: "#d9947e",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#bb7f6b",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  downloadButtonText: {
    fontFamily: appFont,
    color: "#fffdfa",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  shareButton: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d8c8bf",
    backgroundColor: "#fff5ee",
    justifyContent: "center",
    alignItems: "center",
  },
  shareButtonText: {
    fontFamily: appFont,
    color: "#4d4253",
    fontSize: 15,
    fontWeight: "700",
  },
  restartButton: {
    minHeight: 46,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  restartButtonText: {
    fontFamily: appFont,
    color: "#7a6d77",
    fontSize: 14,
    fontWeight: "700",
  },
  noteText: {
    fontFamily: appFont,
    color: "#5b7a6a",
    fontSize: 13,
    fontWeight: "700",
  },
  catalogSection: {
    gap: 10,
    marginTop: 4,
  },
  catalogTitle: {
    fontFamily: appFont,
    color: "#433848",
    fontSize: 18,
    fontWeight: "800",
  },
  catalogGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  catalogCard: {
    width: "48%",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e3d3c9",
    backgroundColor: "#fff9f4",
    padding: 8,
    gap: 6,
  },
  catalogCardRecommended: {
    borderColor: "#c28f7a",
    backgroundColor: "#fff2ea",
  },
  catalogImage: {
    width: "100%",
    aspectRatio: 1024 / 1536,
    borderRadius: 10,
    backgroundColor: "#f0e4dc",
  },
  catalogPlaceholder: {
    width: "100%",
    aspectRatio: 1024 / 1536,
    borderRadius: 10,
    backgroundColor: "#f1e7df",
    alignItems: "center",
    justifyContent: "center",
  },
  catalogPlaceholderText: {
    fontFamily: appFont,
    color: "#8d7f77",
    fontSize: 12,
    fontWeight: "700",
  },
  catalogCardTitle: {
    fontFamily: appFont,
    color: "#3e3445",
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 18,
  },
  catalogCardSubtitle: {
    fontFamily: appFont,
    color: "#6c616c",
    fontSize: 12,
    lineHeight: 17,
  },
  sampleTag: {
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e6d7ce",
    backgroundColor: "#fff5ee",
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontFamily: appFont,
    color: "#856f64",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  mobileDock: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 8,
    minHeight: 74,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#dfcec4",
    backgroundColor: "rgba(255, 251, 247, 0.94)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "#a58d81",
    shadowOpacity: 0.24,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  dockButton: {
    width: 80,
    minHeight: 58,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#decdc3",
    backgroundColor: "#fff7f1",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  dockButtonDisabled: {
    opacity: 0.45,
  },
  dockButtonIcon: {
    fontFamily: appFont,
    color: "#5d5060",
    fontSize: 16,
    fontWeight: "800",
  },
  dockButtonText: {
    fontFamily: appFont,
    color: "#5d5060",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  dockCenter: {
    flex: 1,
    minHeight: 58,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ddc9bf",
    backgroundColor: "#fff3eb",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 2,
  },
  dockCenterTitle: {
    fontFamily: appFont,
    color: "#4a3f4f",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },
  dockCenterMeta: {
    fontFamily: appFont,
    color: "#7f6f79",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    textAlign: "center",
  },
});
