"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";

type AdhdType = "spark" | "storm" | "hyper" | "care";

type WeightedOption = {
  label: string;
  note: string;
  weights: Partial<Record<AdhdType, number>>;
};

type QuizQuestion = {
  id: number;
  prompt: string;
  options: WeightedOption[];
};

type NavItem = {
  href: string;
  label: string;
};

const navItems: NavItem[] = [
  { href: "#quiz", label: "Quiz" },
  { href: "#ebooks", label: "E-books" },
  { href: "#about", label: "Over ons" },
  { href: "#join", label: "Start" },
];

const typeCopy: Record<
  AdhdType,
  {
    title: string;
    summary: string;
    ebook: string;
    cta: string;
  }
> = {
  spark: {
    title: "Spark Starter",
    summary:
      "Je hoofd zit vol ideeen en je schakelt snel. Jij wint met mini-starts en korte acties die direct resultaat geven.",
    ebook: "Van Idee Naar Klaar",
    cta: "Stuur mijn Spark plan",
  },
  storm: {
    title: "Overwhelm Storm",
    summary:
      "Je voelt en ziet alles tegelijk. Jij hebt zachte structuur nodig met weinig ruis en een duidelijke eerste stap.",
    ebook: "Calm Focus Blueprint",
    cta: "Stuur mijn Calm plan",
  },
  hyper: {
    title: "Hyperfocus Queen",
    summary:
      "Je kunt diep gaan, maar daarna ben je leeg. Jij hebt ritme nodig met focusblokken en herstelmomenten.",
    ebook: "Hyperfocus Without Burnout",
    cta: "Stuur mijn Energy plan",
  },
  care: {
    title: "Caregiver Brain",
    summary:
      "Je draagt veel voor anderen. Jij wint met grenzen, scripts en een systeem dat jouw tijd beschermt.",
    ebook: "Boundaries Without Guilt",
    cta: "Stuur mijn Boundaries plan",
  },
};

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    prompt: "Hoe start jouw ochtend meestal?",
    options: [
      {
        label: "Mijn hoofd is al vol voor ik begin",
        note: "hoge mentale load",
        weights: { storm: 2, care: 1 },
      },
      {
        label: "Ik spring direct in losse ideeen",
        note: "impuls start",
        weights: { spark: 2, hyper: 1 },
      },
      {
        label: "Ik ga diep op een taak en vergeet de tijd",
        note: "deep focus",
        weights: { hyper: 2 },
      },
      {
        label: "Ik los eerst dingen van anderen op",
        note: "anderen eerst",
        weights: { care: 2 },
      },
    ],
  },
  {
    id: 2,
    prompt: "Wat blokkeert je nu het meest?",
    options: [
      {
        label: "Te veel taken en geen duidelijke eerste stap",
        note: "startfrictie",
        weights: { storm: 2, spark: 1 },
      },
      {
        label: "Ik stel uit tot de stress piekt",
        note: "deadline modus",
        weights: { spark: 2, storm: 1 },
      },
      {
        label: "Ik overwerk en crash daarna",
        note: "energie swing",
        weights: { hyper: 2 },
      },
      {
        label: "Ik vind nee zeggen lastig",
        note: "grens overload",
        weights: { care: 2, storm: 1 },
      },
    ],
  },
  {
    id: 3,
    prompt: "Welke support helpt jou het meest?",
    options: [
      {
        label: "Korte checklist met 1 concrete actie",
        note: "duidelijkheid",
        weights: { storm: 2, spark: 1 },
      },
      {
        label: "Snelle mini-wins en momentum",
        note: "energie",
        weights: { spark: 2, hyper: 1 },
      },
      {
        label: "Focusblokken plus herstelritme",
        note: "balans",
        weights: { hyper: 2 },
      },
      {
        label: "Scripts voor grenzen en rust",
        note: "bescherming",
        weights: { care: 2 },
      },
    ],
  },
  {
    id: 4,
    prompt: "Wat wil jij deze maand bereiken?",
    options: [
      {
        label: "Minder chaos en meer rust in mijn hoofd",
        note: "calm",
        weights: { storm: 2 },
      },
      {
        label: "Afmaken wat ik start",
        note: "done",
        weights: { spark: 2, hyper: 1 },
      },
      {
        label: "Meer energie zonder burnout",
        note: "sustainable",
        weights: { hyper: 2, care: 1 },
      },
      {
        label: "Sterkere grenzen zonder schuldgevoel",
        note: "boundaries",
        weights: { care: 2 },
      },
    ],
  },
];

const ebookCards = [
  {
    title: "Calm Focus Blueprint",
    subtitle: "voor ADHD girls met een druk hoofd",
    price: "EUR 19",
    badge: "Best seller",
  },
  {
    title: "Hyperfocus Without Burnout",
    subtitle: "voor creators die sprinten en crashen",
    price: "EUR 19",
    badge: "Energy reset",
  },
  {
    title: "Boundaries Without Guilt",
    subtitle: "voor high-empathy vrouwen",
    price: "EUR 19",
    badge: "Nieuw",
  },
];

const socialProof = [
  {
    quote:
      "Ik had eindelijk een webshop funnel die op mobiel logisch voelt. Mijn quiz completion ging direct omhoog.",
    author: "Noor, creator",
  },
  {
    quote:
      "De flow is rustig, zonder ruis, maar wel high converting. Dit is exact wat mijn doelgroep nodig had.",
    author: "Sanne, coach",
  },
  {
    quote:
      "Mensen klikken sneller door naar afrekenen. Vooral de sticky CTA op mobiel werkt extreem goed.",
    author: "Mila, founder",
  },
];

function scoreQuiz(answers: number[]): AdhdType {
  const scores: Record<AdhdType, number> = {
    spark: 0,
    storm: 0,
    hyper: 0,
    care: 0,
  };

  quizQuestions.forEach((question, idx) => {
    const choiceIndex = answers[idx] ?? 0;
    const choice = question.options[choiceIndex];

    if (!choice) return;

    (Object.keys(choice.weights) as AdhdType[]).forEach((key) => {
      scores[key] += choice.weights[key] ?? 0;
    });
  });

  return (Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] as AdhdType) || "spark";
}

function useMobileSound(enabled: boolean) {
  const audioCtxRef = useRef<AudioContext | null>(null);

  return (tone: "tap" | "success" = "tap") => {
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 1024) return;
    if (!enabled) return;

    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!Ctx) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new Ctx();
    }

    const ctx = audioCtxRef.current;
    if (!ctx) return;

    if (ctx.state === "suspended") {
      void ctx.resume();
    }

    const ping = (freq: number, duration: number, gainValue: number, delay = 0) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startAt = ctx.currentTime + delay;

      osc.type = "sine";
      osc.frequency.value = freq;

      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(gainValue, startAt + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startAt);
      osc.stop(startAt + duration + 0.02);
    };

    if (tone === "tap") {
      ping(660, 0.08, 0.025);
      return;
    }

    ping(560, 0.08, 0.03, 0);
    ping(760, 0.1, 0.03, 0.08);
  };
}

export default function AdhdGirlsSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [leadEmail, setLeadEmail] = useState("");
  const [leadName, setLeadName] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const playSound = useMobileSound(soundOn);
  const heroRef = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [44, -46]);
  const heroRotate = useTransform(scrollYProgress, [0, 1], [5, -5]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [0.98, 1.03]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      smoothWheel: true,
      duration: 1.05,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
    });

    let rafId = 0;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const currentQuestion = quizQuestions[questionIndex];

  const resultType = useMemo(() => {
    if (!quizDone) return null;
    return scoreQuiz(answers);
  }, [answers, quizDone]);

  const result = resultType ? typeCopy[resultType] : null;
  const answerProgress = Math.round((answers.length / quizQuestions.length) * 100);

  const selectAnswer = (optionIndex: number) => {
    playSound("tap");

    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = optionIndex;
      return next;
    });

    if (questionIndex === quizQuestions.length - 1) {
      setQuizDone(true);
      playSound("success");
      return;
    }

    setQuestionIndex((prev) => prev + 1);
  };

  const goBack = () => {
    if (questionIndex === 0) return;
    playSound("tap");
    setQuestionIndex((prev) => prev - 1);
  };

  const resetQuiz = () => {
    playSound("tap");
    setQuestionIndex(0);
    setAnswers([]);
    setQuizDone(false);
  };

  const submitLead = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!leadName.trim() || !/^.+@.+\..+$/.test(leadEmail.trim())) {
      playSound("tap");
      return;
    }

    playSound("success");
    setLeadSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[var(--cream-50)] text-[var(--ink-900)]">
      <header className="sticky top-0 z-50 border-b border-[var(--peach-200)]/90 bg-[color:rgba(253,247,242,0.92)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-8">
          <a href="#top" className="inline-flex items-center gap-2" onClick={() => playSound("tap")}>
            <span className="size-3 rounded-full bg-[var(--peach-500)]" />
            <span className="font-[var(--font-display)] text-xl tracking-tight">ADHD Girls Club</span>
          </a>

          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="nav-link">
                {item.label}
              </a>
            ))}
            <a href="#join" className="btn-primary text-sm" onClick={() => playSound("tap")}>
              Shop direct
            </a>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--peach-300)] bg-white px-3 py-1 text-xs font-semibold"
              onClick={() => setSoundOn((prev) => !prev)}
            >
              <span aria-hidden>{soundOn ? "on" : "off"}</span>
              <span>sound</span>
            </button>

            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full border border-[var(--peach-300)] bg-white"
              onClick={() => {
                playSound("tap");
                setMenuOpen((prev) => !prev);
              }}
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <span className="hamburger" />
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-[rgba(48,32,24,0.34)] md:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <motion.nav
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute right-0 top-0 h-full w-[82%] max-w-sm border-l border-[var(--peach-200)] bg-[var(--cream-100)] px-5 pb-8 pt-20"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink-500)]">Menu</p>
            <div className="mt-4 grid gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-xl border border-[var(--peach-200)] bg-white px-4 py-3 font-semibold"
                  onClick={() => {
                    playSound("tap");
                    setMenuOpen(false);
                  }}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <a
              href="#join"
              className="btn-primary mt-4 w-full justify-center"
              onClick={() => {
                playSound("success");
                setMenuOpen(false);
              }}
            >
              Direct bestellen
            </a>
          </motion.nav>
        </motion.div>
      ) : null}

      <main id="top" className="relative overflow-hidden pb-24 md:pb-0">
        <section
          ref={heroRef}
          className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-12 pt-10 md:grid-cols-[1.08fr_0.92fr] md:px-8 md:pt-16"
        >
          <div className="space-y-5">
            <p className="badge">
              Mobile-first funnel voor TikTok verkeer
            </p>
            <h1 className="font-[var(--font-display)] text-4xl leading-[1.03] tracking-tight md:text-6xl">
              Rustige webshop voor snelle ADHD breinen.
            </h1>
            <p className="max-w-xl text-base text-[var(--ink-600)] md:text-lg">
              Gebaseerd op jouw layout vibe, maar cleaner en moderner. Minder visuele ruis, duidelijke keuzes en een
              flow die impulsieve koopmomenten direct opvangt.
            </p>

            <div className="flex flex-wrap gap-3">
              <a href="#quiz" className="btn-primary" onClick={() => playSound("tap")}>
                Start de quiz
              </a>
              <a href="#ebooks" className="btn-soft" onClick={() => playSound("tap")}>
                Bekijk e-books
              </a>
            </div>

            <ul className="grid gap-2 text-sm text-[var(--ink-600)] sm:grid-cols-3">
              <li className="pill">Z-patroon contentflow</li>
              <li className="pill">1 scherm = 1 keuze</li>
              <li className="pill">snel naar checkout</li>
            </ul>
          </div>

          <motion.div
            style={{ y: heroY, rotateX: heroRotate, scale: heroScale }}
            className="relative [transform-style:preserve-3d]"
          >
            <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-[var(--peach-300)]/50 blur-2xl" />
            <div className="absolute -bottom-4 -right-2 h-28 w-28 rounded-full bg-[var(--beige-300)]/60 blur-2xl" />

            <div className="relative overflow-hidden rounded-[28px] border border-[var(--peach-200)] bg-white p-4 shadow-soft-lg">
              <Image
                src="/images/ebook-cover.jpg"
                alt="ADHD Girls Club e-book"
                width={640}
                height={960}
                className="h-auto w-full rounded-2xl object-cover"
                priority
              />

              <div className="mt-3 rounded-2xl border border-[var(--peach-200)] bg-[var(--cream-100)] p-3">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink-500)]">TikTok social proof</p>
                <p className="mt-1 text-sm font-semibold">Eindelijk een systeem dat licht en haalbaar voelt.</p>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-3 px-4 pb-14 md:grid-cols-3 md:px-8">
          <StatsCard label="Gem. quiz completion" value="86%" />
          <StatsCard label="Lead naar checkout uplift" value="2.3x" />
          <StatsCard label="Mobiele sessieduur" value="4.8 min" />
        </section>

        <section id="quiz" className="mx-auto w-full max-w-6xl px-4 pb-14 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="section-shell"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink-500)]">Quiz funnel</p>
                <h2 className="font-[var(--font-display)] text-3xl tracking-tight md:text-4xl">
                  Welke ADHD type ben jij?
                </h2>
              </div>

              <button type="button" onClick={resetQuiz} className="btn-soft text-sm">
                Reset
              </button>
            </div>

            <div className="mb-5 h-2.5 overflow-hidden rounded-full bg-[var(--cream-200)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--peach-500)] to-[var(--beige-500)] transition-all duration-300"
                style={{ width: `${Math.max(answerProgress, quizDone ? 100 : 6)}%` }}
              />
            </div>

            {!quizDone ? (
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--ink-500)]">
                  vraag {questionIndex + 1} van {quizQuestions.length}
                </p>
                <h3 className="font-[var(--font-display)] text-2xl tracking-tight md:text-3xl">
                  {currentQuestion.prompt}
                </h3>

                <div className="grid gap-3">
                  {currentQuestion.options.map((option, idx) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => selectAnswer(idx)}
                      className="group rounded-2xl border border-[var(--peach-200)] bg-[var(--cream-100)] p-4 text-left transition hover:-translate-y-0.5 hover:border-[var(--peach-400)] hover:bg-white"
                    >
                      <p className="text-base font-semibold leading-tight text-[var(--ink-900)]">{option.label}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--ink-500)]">
                        {option.note}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={goBack}
                    disabled={questionIndex === 0}
                    className="btn-soft text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Vorige
                  </button>
                </div>
              </div>
            ) : result ? (
              <div className="grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4 rounded-2xl border border-[var(--peach-200)] bg-[var(--cream-100)] p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink-500)]">Jouw type</p>
                  <h3 className="font-[var(--font-display)] text-3xl tracking-tight">{result.title}</h3>
                  <p className="text-[var(--ink-600)]">{result.summary}</p>

                  <div className="rounded-xl bg-white p-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-[var(--ink-500)]">Aanbevolen e-book</p>
                    <p className="mt-1 font-semibold">{result.ebook}</p>
                  </div>

                  <a href="#join" className="btn-primary inline-flex" onClick={() => playSound("success")}>
                    {result.cta}
                  </a>
                </div>

                <form onSubmit={submitLead} className="space-y-3 rounded-2xl border border-[var(--peach-200)] bg-white p-5">
                  <p className="text-sm font-semibold">Ontvang je typeplan + eerste hoofdstuk gratis</p>

                  <input
                    value={leadName}
                    onChange={(event) => setLeadName(event.target.value)}
                    placeholder="Jouw naam"
                    className="input"
                    required
                  />

                  <input
                    type="email"
                    value={leadEmail}
                    onChange={(event) => setLeadEmail(event.target.value)}
                    placeholder="jij@email.com"
                    className="input"
                    required
                  />

                  <button type="submit" className="btn-primary w-full justify-center">
                    Stuur mijn plan
                  </button>

                  {leadSubmitted ? (
                    <p className="rounded-xl border border-[var(--beige-300)] bg-[var(--beige-100)] p-3 text-sm text-[var(--ink-700)]">
                      Top. Lead is in de UI opgeslagen. Koppel deze knop aan Mailerlite, ConvertKit of Klaviyo.
                    </p>
                  ) : null}
                </form>
              </div>
            ) : null}
          </motion.div>
        </section>

        <section id="ebooks" className="mx-auto w-full max-w-6xl px-4 pb-14 md:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink-500)]">E-book aanbod</p>
              <h2 className="font-[var(--font-display)] text-3xl tracking-tight md:text-4xl">
                Praktisch, zacht en direct uitvoerbaar
              </h2>
            </div>
            <a href="#join" className="btn-soft text-sm" onClick={() => playSound("tap")}>
              Naar checkout flow
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {ebookCards.map((card) => (
              <motion.article
                key={card.title}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-[var(--peach-200)] bg-white p-4 shadow-soft"
              >
                <p className="inline-flex rounded-full border border-[var(--peach-300)] bg-[var(--cream-100)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--ink-500)]">
                  {card.badge}
                </p>
                <h3 className="mt-3 font-[var(--font-display)] text-2xl tracking-tight">{card.title}</h3>
                <p className="mt-1 text-sm text-[var(--ink-600)]">{card.subtitle}</p>
                <div className="mt-5 flex items-center justify-between">
                  <p className="text-2xl font-semibold">{card.price}</p>
                  <a href="#join" className="btn-primary text-sm" onClick={() => playSound("tap")}>
                    Koop nu
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="about" className="mx-auto w-full max-w-6xl px-4 pb-14 md:px-8">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink-500)]">Over ons</p>
            <h2 className="font-[var(--font-display)] text-3xl tracking-tight md:text-4xl">
              ADHD girls club stijl: zacht, duidelijk, converterend
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <FeatureCard
              title="Visuele rust"
              text="Brede witruimte, zachte contrasten en heldere hiarchie zorgen voor minder oogstress en meer focus."
            />
            <FeatureCard
              title="Impuls vasthouden"
              text="CTA's blijven dichtbij en herhalen slim op scrollmomenten zodat interesse direct actie wordt."
            />
            <FeatureCard
              title="Snelle beslissingen"
              text="Korte blokken, weinig tekst per scherm en duidelijke kooproute verlagen keuze-overload."
            />
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 pb-14 md:px-8">
          <div className="mb-6 flex items-end justify-between gap-3">
            <h2 className="font-[var(--font-display)] text-3xl tracking-tight md:text-4xl">Wat creators zeggen</h2>
            <p className="text-sm text-[var(--ink-500)]">Social proof voor hogere conversie</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {socialProof.map((item) => (
              <article key={item.author} className="rounded-2xl border border-[var(--beige-300)] bg-white p-5">
                <p className="text-sm text-[var(--ink-700)]">&quot;{item.quote}&quot;</p>
                <p className="mt-4 text-xs uppercase tracking-[0.14em] text-[var(--ink-500)]">{item.author}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="join" className="mx-auto w-full max-w-6xl px-4 pb-16 md:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            <FunnelStep
              step="01"
              title="Quiz als hook"
              text="TikTok traffic landt op een directe actie: quiz starten en type ontdekken."
            />
            <FunnelStep
              step="02"
              title="Persoonlijke match"
              text="Resultaat koppelt direct aan het juiste e-book, zonder keuzestress."
            />
            <FunnelStep
              step="03"
              title="Snelle checkout"
              text="Duidelijke CTA's en mobiele dock houden de kooproute altijd zichtbaar."
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mt-6 rounded-[28px] border border-[var(--peach-200)] bg-gradient-to-br from-[var(--cream-100)] to-white p-6 text-center md:p-8"
          >
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink-500)]">High-converting CTA</p>
            <h3 className="mt-2 font-[var(--font-display)] text-3xl tracking-tight md:text-4xl">
              Klaar om scrolls om te zetten naar sales?
            </h3>
            <p className="mx-auto mt-3 max-w-2xl text-[var(--ink-600)]">
              Houd het licht, duidelijk en snel. Een tap naar quiz, een tap naar je e-book en direct door naar checkout.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a href="#quiz" className="btn-primary" onClick={() => playSound("tap")}>
                Start quiz
              </a>
              <a href="#ebooks" className="btn-soft" onClick={() => playSound("tap")}>
                Shop e-books
              </a>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-[var(--peach-200)] bg-[color:rgba(255,252,248,0.95)] pb-24 pt-10 md:pb-10">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 md:grid-cols-4 md:px-8">
          <div>
            <p className="font-[var(--font-display)] text-2xl tracking-tight">ADHD Girls Club</p>
            <p className="mt-2 text-sm text-[var(--ink-600)]">
              Feminine funnel website met hoge UX, mobile app-feel en snelle koopflow.
            </p>
          </div>

          <div>
            <p className="footer-title">Paginas</p>
            <ul className="footer-list">
              <li>
                <a href="#quiz">Quiz</a>
              </li>
              <li>
                <a href="#ebooks">E-books</a>
              </li>
              <li>
                <a href="#about">Over ons</a>
              </li>
            </ul>
          </div>

          <div>
            <p className="footer-title">Business</p>
            <ul className="footer-list">
              <li>
                <a href="#join">Funnel flow</a>
              </li>
              <li>
                <a href="#join">Checkout CTA</a>
              </li>
              <li>
                <a href="#join">Lead capture</a>
              </li>
            </ul>
          </div>

          <div>
            <p className="footer-title">Contact</p>
            <ul className="footer-list">
              <li>
                <a href="mailto:hello@adhdgirlsclub.com">hello@adhdgirlsclub.com</a>
              </li>
              <li>
                <a href="#top">Instagram</a>
              </li>
              <li>
                <a href="#top">TikTok</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>

      <div className="mobile-dock md:hidden">
        <a href="#quiz" className="mobile-dock-item" onClick={() => playSound("tap")}>
          Quiz
        </a>
        <a href="#ebooks" className="mobile-dock-item" onClick={() => playSound("tap")}>
          Shop
        </a>
        <a href="#join" className="mobile-dock-cta" onClick={() => playSound("success")}>
          Koop nu
        </a>
      </div>
    </div>
  );
}

function StatsCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-[var(--beige-300)] bg-white p-4 text-center shadow-soft">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink-500)]">{label}</p>
      <p className="mt-2 font-[var(--font-display)] text-4xl tracking-tight">{value}</p>
    </article>
  );
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-2xl border border-[var(--beige-300)] bg-white p-5 shadow-soft">
      <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--peach-200)]">
        <span className="h-2 w-2 rounded-full bg-[var(--peach-600)]" />
      </div>
      <h3 className="font-[var(--font-display)] text-2xl tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-[var(--ink-600)]">{text}</p>
    </article>
  );
}

function FunnelStep({
  step,
  title,
  text,
}: {
  step: string;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-2xl border border-[var(--beige-300)] bg-white p-4 shadow-soft">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--ink-500)]">stap {step}</p>
      <h4 className="mt-2 font-[var(--font-display)] text-2xl tracking-tight">{title}</h4>
      <p className="mt-2 text-sm text-[var(--ink-600)]">{text}</p>
    </article>
  );
}
