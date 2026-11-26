import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  CheckCircle2,
  Copy,
  Flame,
  Lightbulb,
  MessageCircle,
  Play,
  Printer,
  RotateCcw,
  SkipForward,
  Sparkles,
  Swords,
  Target,
  Trophy,
  Volume2,
  VolumeX,
  XCircle,
} from 'lucide-react';
import {
  CANONICAL_ORIGIN,
  LANGUAGE_LABELS,
  SUPPORTED_LANGUAGES,
  type CategoryId,
  type ChallengePayload,
  type LanguageCode,
  type LocalSaveState,
  type RoundDuration,
  type RoundQuestionResult,
  type SavedRoundRecord,
} from './types/game';
import { buildDeterministicDeck, GEO_BY_ID } from './data/geoBank';
import {
  detectInitialLanguage,
  persistLanguagePreference,
  TRANSLATIONS,
} from './i18n';
import {
  buildPlayableChallengeUrl,
  buildWhatsAppShareUrl,
  decodeChallengePayload,
  generateRoundSeed,
} from './utils/challengeLink';
import {
  playClueSound,
  playCorrectSound,
  playFinishSound,
  playWrongSound,
} from './utils/sound';
import { loadLocalState, saveLocalState } from './utils/storage';
import { SeoHeadManager } from './components/SeoHeadManager';
import { GeoRushSvg } from './components/GeoRushSvg';
import { AffiliateGearSection, MediaNetAdSlot } from './components/AdAndAffiliateBlocks';
import { RecordsAndNotesPanel } from './components/RecordsAndNotesPanel';
import { EditorialSeoSection } from './components/EditorialSeoSection';
import { PrintScorecard } from './components/PrintScorecard';

type GamePhase = 'IDLE' | 'PLAYING' | 'SUMMARY';

const CATEGORIES: readonly CategoryId[] = [
  'all',
  'countries',
  'capitals',
  'rivers',
  'monuments',
];

const DURATIONS: readonly RoundDuration[] = [60, 90, 120];

const CLUE_BASE_POINTS: Record<1 | 2 | 3, number> = {
  1: 150,
  2: 100,
  3: 60,
};

export default function App() {
  const [lang, setLang] = useState<LanguageCode>(() => detectInitialLanguage());
  const t = TRANSLATIONS[lang];

  const [saveState, setSaveState] = useState<LocalSaveState>(() => loadLocalState());

  // Incoming URL duel (?c=...)
  const [incomingDuel, setIncomingDuel] = useState<ChallengePayload | null>(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return decodeChallengePayload(params.get('c'));
  });

  // Setup configuration
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>(
    () => incomingDuel?.category ?? 'all'
  );
  const [selectedDuration, setSelectedDuration] = useState<RoundDuration>(
    () => incomingDuel?.duration ?? 90
  );

  // Active & Summary Round State
  const [phase, setPhase] = useState<GamePhase>('IDLE');
  const [roundSeed, setRoundSeed] = useState<string>(() =>
    incomingDuel?.seed ?? generateRoundSeed()
  );
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [activeDuration, setActiveDuration] = useState<RoundDuration>(90);
  const [activeDuelOpponent, setActiveDuelOpponent] = useState<ChallengePayload | null>(null);

  const [secondsLeft, setSecondsLeft] = useState<number>(90);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [cluesRevealed, setCluesRevealed] = useState<1 | 2 | 3>(1);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [cluesSaved, setCluesSaved] = useState<number>(0);
  const [results, setResults] = useState<RoundQuestionResult[]>([]);
  const [feedback, setFeedback] = useState<{
    status: 'correct' | 'wrong' | 'skipped';
    selectedId: string | null;
    correctId: string;
    pointsDelta: number;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const questionStartMsRef = useRef<number>(Date.now());
  const advanceTimeoutRef = useRef<number | null>(null);
  const roundFinishedRef = useRef<boolean>(false);
  const arenaRef = useRef<HTMLElement | null>(null);

  // Persist saveState changes
  useEffect(() => {
    saveLocalState(saveState);
  }, [saveState]);

  const handleLanguageChange = (nextLang: LanguageCode) => {
    setLang(nextLang);
    persistLanguagePreference(nextLang);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (nextLang === 'en') {
        url.searchParams.delete('lang');
      } else {
        url.searchParams.set('lang', nextLang);
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  const deck = useMemo(
    () => buildDeterministicDeck(roundSeed, activeCategory),
    [roundSeed, activeCategory]
  );

  const currentQuestion = deck[questionIndex % deck.length];

  const finalizeRound = useCallback(
    (
      finalScore: number,
      finalResults: RoundQuestionResult[],
      finalBestStreak: number,
      finalCluesSaved: number,
      seedUsed: string,
      catUsed: CategoryId,
      durUsed: RoundDuration,
      duelOpp: ChallengePayload | null
    ) => {
      if (roundFinishedRef.current) return;
      roundFinishedRef.current = true;
      if (advanceTimeoutRef.current !== null) {
        window.clearTimeout(advanceTimeoutRef.current);
        advanceTimeoutRef.current = null;
      }

      const correctCount = finalResults.filter((r) => r.isCorrect).length;
      const answeredCount = finalResults.length;
      let duelOutcome: 'win' | 'tie' | 'loss' | undefined;
      if (duelOpp) {
        if (finalScore > duelOpp.score) duelOutcome = 'win';
        else if (finalScore === duelOpp.score) duelOutcome = 'tie';
        else duelOutcome = 'loss';
      }

      playFinishSound(saveState.soundEnabled, duelOutcome === 'win');

      const record: SavedRoundRecord = {
        id: `${Date.now()}_${seedUsed}`,
        seed: seedUsed,
        category: catUsed,
        duration: durUsed,
        score: finalScore,
        correct: correctCount,
        answered: answeredCount,
        bestStreak: finalBestStreak,
        cluesSaved: finalCluesSaved,
        playedAt: new Date().toISOString(),
        opponentScore: duelOpp?.score,
        opponentName: duelOpp?.challengerName || undefined,
        duelOutcome,
      };

      setSaveState((prev) => ({
        ...prev,
        bestByCategory: {
          ...prev.bestByCategory,
          [catUsed]: Math.max(prev.bestByCategory[catUsed], finalScore),
        },
        history: [record, ...prev.history].slice(0, 50),
      }));

      setPhase('SUMMARY');
    },
    [saveState.soundEnabled]
  );

  // Refs for latest round metrics so the timer effect reads up-to-date values cleanly
  const latestMetricsRef = useRef({
    score,
    results,
    bestStreak,
    cluesSaved,
    roundSeed,
    activeCategory,
    activeDuration,
    activeDuelOpponent,
  });
  latestMetricsRef.current = {
    score,
    results,
    bestStreak,
    cluesSaved,
    roundSeed,
    activeCategory,
    activeDuration,
    activeDuelOpponent,
  };

  // Countdown timer loop
  useEffect(() => {
    if (phase !== 'PLAYING') return;
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          const m = latestMetricsRef.current;
          finalizeRound(
            m.score,
            m.results,
            m.bestStreak,
            m.cluesSaved,
            m.roundSeed,
            m.activeCategory,
            m.activeDuration,
            m.activeDuelOpponent
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [phase, finalizeRound]);

  const startRound = (options: {
    seed: string;
    category: CategoryId;
    duration: RoundDuration;
    duelOpponent: ChallengePayload | null;
  }) => {
    if (advanceTimeoutRef.current !== null) {
      window.clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
    roundFinishedRef.current = false;
    setRoundSeed(options.seed);
    setActiveCategory(options.category);
    setActiveDuration(options.duration);
    setActiveDuelOpponent(options.duelOpponent);
    setSecondsLeft(options.duration);
    setQuestionIndex(0);
    setCluesRevealed(1);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCluesSaved(0);
    setResults([]);
    setFeedback(null);
    setCopiedLink(false);
    questionStartMsRef.current = Date.now();
    setPhase('PLAYING');
  };

  const handleStartCustomRound = () => {
    startRound({
      seed: generateRoundSeed(),
      category: selectedCategory,
      duration: selectedDuration,
      duelOpponent: null,
    });
  };

  const handleAcceptDuel = () => {
    if (!incomingDuel) return;
    setSelectedCategory(incomingDuel.category);
    setSelectedDuration(incomingDuel.duration);
    startRound({
      seed: incomingDuel.seed,
      category: incomingDuel.category,
      duration: incomingDuel.duration,
      duelOpponent: incomingDuel,
    });
  };

  const handleDismissDuel = () => {
    setIncomingDuel(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('c');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleNextClue = useCallback(() => {
    if (phase !== 'PLAYING' || feedback !== null) return;
    setCluesRevealed((prev) => {
      if (prev >= 3) return prev;
      playClueSound(saveState.soundEnabled);
      return (prev + 1) as 1 | 2 | 3;
    });
  }, [phase, feedback, saveState.soundEnabled]);

  const advanceToNextQuestion = useCallback(() => {
    setQuestionIndex((prev) => prev + 1);
    setCluesRevealed(1);
    setFeedback(null);
    questionStartMsRef.current = Date.now();
  }, []);

  const handleAnswer = useCallback(
    (optionId: string) => {
      if (phase !== 'PLAYING' || feedback !== null || !currentQuestion) return;

      const elapsedSec = Math.max(
        0.5,
        (Date.now() - questionStartMsRef.current) / 1000
      );
      const isCorrect = optionId === currentQuestion.item.id;

      let pointsDelta = 0;
      let nextScore = score;
      let nextStreak = streak;
      let nextBestStreak = bestStreak;
      let nextCluesSaved = cluesSaved;

      if (isCorrect) {
        const basePts = CLUE_BASE_POINTS[cluesRevealed];
        const speedBonus = Math.max(0, Math.round((12 - Math.min(12, elapsedSec)) * 3.33));
        nextStreak = streak + 1;
        nextBestStreak = Math.max(bestStreak, nextStreak);
        const streakBonus = Math.min(60, Math.max(0, (nextStreak - 1) * 15));
        pointsDelta = basePts + speedBonus + streakBonus;
        nextScore = score + pointsDelta;
        nextCluesSaved = cluesSaved + (3 - cluesRevealed);
        playCorrectSound(saveState.soundEnabled);
      } else {
        pointsDelta = -25;
        nextScore = Math.max(0, score - 25);
        nextStreak = 0;
        playWrongSound(saveState.soundEnabled);
      }

      const qResult: RoundQuestionResult = {
        itemId: currentQuestion.item.id,
        category: currentQuestion.item.category,
        region: currentQuestion.item.region,
        selectedOptionId: optionId,
        correctOptionId: currentQuestion.item.id,
        isCorrect,
        skipped: false,
        cluesUsed: cluesRevealed,
        elapsedSec: Number(elapsedSec.toFixed(1)),
        pointsEarned: isCorrect ? pointsDelta : 0,
      };

      setScore(nextScore);
      setStreak(nextStreak);
      setBestStreak(nextBestStreak);
      setCluesSaved(nextCluesSaved);
      setResults((prev) => [...prev, qResult]);
      setFeedback({
        status: isCorrect ? 'correct' : 'wrong',
        selectedId: optionId,
        correctId: currentQuestion.item.id,
        pointsDelta,
      });

      advanceTimeoutRef.current = window.setTimeout(() => {
        advanceToNextQuestion();
      }, 520);
    },
    [
      phase,
      feedback,
      currentQuestion,
      score,
      streak,
      bestStreak,
      cluesSaved,
      cluesRevealed,
      saveState.soundEnabled,
      advanceToNextQuestion,
    ]
  );

  const handleSkip = useCallback(() => {
    if (phase !== 'PLAYING' || feedback !== null || !currentQuestion) return;
    const elapsedSec = Math.max(
      0.5,
      (Date.now() - questionStartMsRef.current) / 1000
    );
    const qResult: RoundQuestionResult = {
      itemId: currentQuestion.item.id,
      category: currentQuestion.item.category,
      region: currentQuestion.item.region,
      selectedOptionId: null,
      correctOptionId: currentQuestion.item.id,
      isCorrect: false,
      skipped: true,
      cluesUsed: cluesRevealed,
      elapsedSec: Number(elapsedSec.toFixed(1)),
      pointsEarned: 0,
    };

    setStreak(0);
    setResults((prev) => [...prev, qResult]);
    setFeedback({
      status: 'skipped',
      selectedId: null,
      correctId: currentQuestion.item.id,
      pointsDelta: 0,
    });

    advanceTimeoutRef.current = window.setTimeout(() => {
      advanceToNextQuestion();
    }, 360);
  }, [phase, feedback, currentQuestion, cluesRevealed, advanceToNextQuestion]);

  // Keyboard shortcuts during active play: 1-4 answer, H next clue, S skip
  useEffect(() => {
    if (phase !== 'PLAYING') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = Number(e.key) - 1;
        const opt = currentQuestion?.options[idx];
        if (opt) {
          e.preventDefault();
          handleAnswer(opt.id);
        }
      } else if (e.key.toLowerCase() === 'h') {
        e.preventDefault();
        handleNextClue();
      } else if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [phase, currentQuestion, handleAnswer, handleNextClue, handleSkip]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current !== null) {
        window.clearTimeout(advanceTimeoutRef.current);
      }
    };
  }, []);

  const correctCount = results.filter((r) => r.isCorrect).length;
  const answeredCount = results.length;
  const accuracyPct = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  // Build challenge payload from current completed round (or rematch with fresh seed)
  const buildCurrentChallengeUrl = (rematchFreshSeed = false): string => {
    const payload: ChallengePayload = {
      v: 1,
      seed: rematchFreshSeed ? generateRoundSeed() : roundSeed,
      category: activeCategory,
      duration: activeDuration,
      score,
      correct: correctCount,
      answered: answeredCount,
      bestStreak,
      cluesSaved,
      challengerName: saveState.playerName.trim() || t.print.anonymousPlayer,
      createdAt: Date.now(),
    };
    return buildPlayableChallengeUrl(payload, lang);
  };

  const handleCopyChallengeLink = async () => {
    const url = buildCurrentChallengeUrl(false);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2200);
    } catch {
      // Fallback copy
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  const buildWhatsAppLink = (isRematch: boolean): string => {
    const challengeUrl = buildCurrentChallengeUrl(false);
    const template = isRematch ? t.summary.waRematchText : t.summary.waChallengeText;
    const message = template
      .replace('{score}', String(score))
      .replace('{target}', String(activeDuelOpponent?.score ?? 0))
      .replace('{correct}', String(correctCount))
      .replace('{answered}', String(answeredCount))
      .replace('{category}', t.categories[activeCategory])
      .replace('{duration}', String(activeDuration));
    return buildWhatsAppShareUrl(`${message} ${challengeUrl}`);
  };

  const latestRoundForPrint =
    phase === 'SUMMARY' || results.length > 0
      ? {
          seed: roundSeed,
          category: activeCategory,
          duration: activeDuration,
          score,
          correct: correctCount,
          answered: answeredCount,
          bestStreak,
          cluesSaved,
          results,
          duelOpponent: activeDuelOpponent,
        }
      : saveState.history[0]
        ? {
            seed: saveState.history[0].seed,
            category: saveState.history[0].category,
            duration: saveState.history[0].duration,
            score: saveState.history[0].score,
            correct: saveState.history[0].correct,
            answered: saveState.history[0].answered,
            bestStreak: saveState.history[0].bestStreak,
            cluesSaved: saveState.history[0].cluesSaved,
            results: [],
            duelOpponent:
              typeof saveState.history[0].opponentScore === 'number'
                ? {
                    v: 1 as const,
                    seed: saveState.history[0].seed,
                    category: saveState.history[0].category,
                    duration: saveState.history[0].duration,
                    score: saveState.history[0].opponentScore,
                    correct: 0,
                    answered: 0,
                    bestStreak: 0,
                    cluesSaved: 0,
                    challengerName: saveState.history[0].opponentName || '',
                    createdAt: Date.now(),
                  }
                : null,
          }
        : null;

  const duelDiff = activeDuelOpponent ? score - activeDuelOpponent.score : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <SeoHeadManager lang={lang} t={t} />

      {/* Top Navigation Bar — strict 3-zone contract */}
      <header className="no-print border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
          {/* Zone 1: Single-element Brand wordmark */}
          <a
            href="#play"
            className="font-display text-xl font-extrabold tracking-tight text-[#1E40AF] whitespace-nowrap shrink-0"
          >
            GeoRushCue
          </a>

          {/* Zone 2: 4 concise single-line nav links */}
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <a
              href="#play"
              className="hover:text-[#1E40AF] hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              {t.nav.play}
            </a>
            <a
              href="#duel-guide"
              className="hover:text-[#1E40AF] hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              {t.nav.duelGuide}
            </a>
            <a
              href="#records"
              className="hover:text-[#1E40AF] hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              {t.nav.records}
            </a>
            <a
              href="#faq"
              className="hover:text-[#1E40AF] hover:underline underline-offset-4 whitespace-nowrap shrink-0"
            >
              {t.nav.faq}
            </a>
          </nav>

          {/* Zone 3: Language Switcher + Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <label htmlFor="lang-select" className="sr-only">
              Language
            </label>
            <select
              id="lang-select"
              value={lang}
              onChange={(e) => handleLanguageChange(e.target.value as LanguageCode)}
              className="min-h-[40px] rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:border-[#1E40AF] focus:outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((code) => (
                <option key={code} value={code}>
                  {LANGUAGE_LABELS[code]}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                if (phase !== 'PLAYING') {
                  if (incomingDuel && phase === 'IDLE') {
                    handleAcceptDuel();
                  } else {
                    handleStartCustomRound();
                  }
                } else {
                  arenaRef.current?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="hidden sm:inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-[#1E40AF] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E3A8A] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
              {t.nav.startNow}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:py-10">
        {/* Hero Header */}
        <section id="play" ref={arenaRef} className="no-print">
          {phase === 'IDLE' && (
            <div className="mb-8 max-w-3xl">
              <p className="text-xs font-semibold text-[#1E40AF]">{t.hero.kicker}</p>
              <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl [text-wrap:balance]">
                {t.hero.h1}
              </h1>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                {t.hero.subtitle}
              </p>
            </div>
          )}

          {/* Incoming URL Duel Banner (visible when ?c= is present in IDLE) */}
          {phase === 'IDLE' && incomingDuel && (
            <div className="mb-6 rounded-2xl border border-[#D97706] bg-white p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#D97706]">
                    <Swords className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>{t.setup.incomingDuelHeading}</span>
                  </div>
                  <p className="text-base font-medium text-slate-800">
                    <strong className="font-bold text-slate-900">
                      {incomingDuel.challengerName || t.print.anonymousPlayer}
                    </strong>{' '}
                    {t.setup.incomingDuelDesc}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-slate-600">
                    <span>
                      {t.setup.categoryLabel}:{' '}
                      <strong className="text-slate-900">
                        {t.categories[incomingDuel.category]}
                      </strong>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {t.setup.durationLabel}:{' '}
                      <strong className="tabular-nums text-slate-900">
                        {incomingDuel.duration}
                        {t.setup.secondsSuffix}
                      </strong>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {t.setup.seedLabel}:{' '}
                      <strong className="font-mono text-slate-900">{incomingDuel.seed}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                  <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5">
                    <div className="text-xs font-medium text-slate-500">
                      {t.setup.targetToBeat}
                    </div>
                    <div className="font-display text-2xl font-extrabold text-[#1E40AF] tabular-nums">
                      {incomingDuel.score}{' '}
                      <span className="text-xs font-semibold text-slate-500">
                        {t.records.pts}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleAcceptDuel}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#059669] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#047857] whitespace-nowrap cursor-pointer"
                    >
                      <Swords className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {t.setup.acceptDuel}
                    </button>
                    <button
                      type="button"
                      onClick={handleDismissDuel}
                      className="inline-flex min-h-[44px] items-center rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 whitespace-nowrap cursor-pointer"
                    >
                      {t.setup.declineDuel}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Setup Card */}
          {phase === 'IDLE' && (
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 md:p-8">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
                {/* Category Segmented Control */}
                <div className="lg:col-span-6">
                  <div className="mb-2.5 text-xs font-semibold text-slate-600">
                    {t.setup.categoryLabel}
                  </div>
                  <div className="flex flex-wrap gap-1.5 rounded-xl bg-[#F8FAFC] p-1.5 border border-[#E2E8F0]">
                    {CATEGORIES.map((cat) => {
                      const active = selectedCategory === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={`min-h-[40px] flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                            active
                              ? 'bg-[#1E40AF] text-white'
                              : 'text-slate-700 hover:bg-white hover:text-slate-900'
                          }`}
                        >
                          {t.categories[cat]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Duration Segmented Control */}
                <div className="lg:col-span-3">
                  <div className="mb-2.5 text-xs font-semibold text-slate-600">
                    {t.setup.durationLabel}
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-1.5">
                    {DURATIONS.map((dur) => {
                      const active = selectedDuration === dur;
                      return (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => setSelectedDuration(dur)}
                          className={`min-h-[40px] rounded-lg px-2 py-2 text-xs font-bold tabular-nums transition-colors whitespace-nowrap cursor-pointer ${
                            active
                              ? 'bg-[#D97706] text-white'
                              : 'text-slate-700 hover:bg-white hover:text-slate-900'
                          }`}
                        >
                          {dur}
                          {t.setup.secondsSuffix}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Player Name */}
                <div className="lg:col-span-3">
                  <label
                    htmlFor="player-name"
                    className="mb-2.5 block text-xs font-semibold text-slate-600"
                  >
                    {t.setup.playerNameLabel}
                  </label>
                  <input
                    id="player-name"
                    type="text"
                    maxLength={24}
                    value={saveState.playerName}
                    onChange={(e) =>
                      setSaveState((prev) => ({ ...prev, playerName: e.target.value }))
                    }
                    placeholder={t.setup.playerNamePlaceholder}
                    className="min-h-[44px] w-full rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#1E40AF] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#E2E8F0] pt-5">
                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <button
                    type="button"
                    onClick={() =>
                      setSaveState((prev) => ({
                        ...prev,
                        soundEnabled: !prev.soundEnabled,
                      }))
                    }
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 font-semibold text-slate-700 hover:border-[#1E40AF] cursor-pointer"
                  >
                    {saveState.soundEnabled ? (
                      <Volume2 className="h-4 w-4 text-[#1E40AF]" aria-hidden="true" />
                    ) : (
                      <VolumeX className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    )}
                    {saveState.soundEnabled ? t.hud.soundOn : t.hud.soundOff}
                  </button>
                  <span className="hidden sm:inline">{t.play.clueBonusHint}</span>
                </div>

                <button
                  type="button"
                  onClick={handleStartCustomRound}
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-xl bg-[#1E40AF] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1E3A8A] whitespace-nowrap cursor-pointer"
                >
                  <Play className="h-4 w-4" aria-hidden="true" />
                  {t.setup.startRound}
                </button>
              </div>
            </div>
          )}

          {/* ACTIVE GAMEPLAY ARENA */}
          {phase === 'PLAYING' && currentQuestion && (
            <div className="space-y-5">
              {/* Tabular-nums HUD */}
              <div className="grid grid-cols-2 gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-4 sm:grid-cols-4 lg:grid-cols-6">
                <div>
                  <div className="text-xs font-medium text-slate-500">{t.hud.score}</div>
                  <div className="font-display text-2xl font-extrabold text-[#1E40AF] tabular-nums">
                    {score}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-500">{t.hud.timeLeft}</div>
                  <div
                    className={`font-display text-2xl font-extrabold tabular-nums ${
                      secondsLeft <= 15
                        ? 'text-rose-600'
                        : secondsLeft <= 30
                          ? 'text-[#D97706]'
                          : 'text-slate-900'
                    }`}
                  >
                    {secondsLeft}
                    {t.setup.secondsSuffix}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-500">{t.hud.streak}</div>
                  <div className="flex items-center gap-1.5 font-display text-2xl font-extrabold text-[#D97706] tabular-nums">
                    <Flame className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span>{streak}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-500">{t.hud.solved}</div>
                  <div className="font-display text-2xl font-extrabold text-slate-900 tabular-nums">
                    {correctCount}/{answeredCount}
                  </div>
                </div>

                {activeDuelOpponent ? (
                  <div className="col-span-2 flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 lg:col-span-2">
                    <div>
                      <div className="text-xs font-medium text-slate-500">
                        {t.hud.target} ({activeDuelOpponent.challengerName || t.print.anonymousPlayer})
                      </div>
                      <div className="font-display text-lg font-bold text-slate-900 tabular-nums">
                        {activeDuelOpponent.score} {t.records.pts}
                      </div>
                    </div>
                    <div
                      className={`text-xs font-bold tabular-nums ${
                        duelDiff > 0
                          ? 'text-[#059669]'
                          : duelDiff < 0
                            ? 'text-[#D97706]'
                            : 'text-[#1E40AF]'
                      }`}
                    >
                      {duelDiff > 0 && `${t.hud.aheadBy} +${duelDiff}`}
                      {duelDiff < 0 && `${t.hud.behindBy} ${Math.abs(duelDiff)}`}
                      {duelDiff === 0 && t.hud.tiedTarget}
                    </div>
                  </div>
                ) : (
                  <div className="col-span-2 flex items-center justify-end gap-2 lg:col-span-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSaveState((prev) => ({
                          ...prev,
                          soundEnabled: !prev.soundEnabled,
                        }))
                      }
                      aria-label={saveState.soundEnabled ? t.hud.soundOn : t.hud.soundOff}
                      className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-slate-700 hover:border-[#1E40AF] cursor-pointer"
                    >
                      {saveState.soundEnabled ? (
                        <Volume2 className="h-4 w-4 text-[#1E40AF]" aria-hidden="true" />
                      ) : (
                        <VolumeX className="h-4 w-4 text-slate-400" aria-hidden="true" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        finalizeRound(
                          score,
                          results,
                          bestStreak,
                          cluesSaved,
                          roundSeed,
                          activeCategory,
                          activeDuration,
                          activeDuelOpponent
                        )
                      }
                      className="inline-flex min-h-[40px] items-center rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-rose-300 hover:text-rose-700 whitespace-nowrap cursor-pointer"
                    >
                      {t.hud.quitRound}
                    </button>
                  </div>
                )}
              </div>

              {/* Active Question Stage */}
              <div className="grid grid-cols-1 gap-6 rounded-2xl border border-[#E2E8F0] bg-white p-5 md:p-7 lg:grid-cols-12 lg:items-stretch">
                {/* Left Schematic Column */}
                <div className="flex flex-col justify-between gap-3 lg:col-span-5">
                  <GeoRushSvg
                    region={currentQuestion.item.region}
                    regionLabel={t.regions[currentQuestion.item.region]}
                    category={currentQuestion.item.category}
                    categoryLabel={t.categories[currentQuestion.item.category]}
                    lat={currentQuestion.item.lat}
                    lon={currentQuestion.item.lon}
                    riverPath={currentQuestion.item.riverPath}
                    cluesRevealed={cluesRevealed}
                    secondsLeft={secondsLeft}
                    totalDuration={activeDuration}
                    caption={t.play.mapCaption}
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <span>{t.play.shortcutsHint}</span>
                    {activeDuelOpponent && (
                      <button
                        type="button"
                        onClick={() =>
                          finalizeRound(
                            score,
                            results,
                            bestStreak,
                            cluesSaved,
                            roundSeed,
                            activeCategory,
                            activeDuration,
                            activeDuelOpponent
                          )
                        }
                        className="font-semibold text-slate-600 hover:text-rose-600 cursor-pointer"
                      >
                        {t.hud.quitRound}
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Clues & Options Column */}
                <div className="flex flex-col justify-between gap-5 lg:col-span-7">
                  <div>
                    {/* Unboxed Metadata Line */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-slate-500">
                      <span>
                        <span className="text-[#D97706] tabular-nums">
                          {t.play.clueLabel} {cluesRevealed} {t.play.ofThree}
                        </span>
                        <span aria-hidden="true"> · </span>
                        <span className="text-[#1E40AF]">
                          {t.categories[currentQuestion.item.category]}
                        </span>
                        <span aria-hidden="true"> · </span>
                        <span>{t.regions[currentQuestion.item.region]}</span>
                      </span>

                      <span className="font-mono-tabular text-slate-500">
                        +{CLUE_BASE_POINTS[cluesRevealed]} {t.records.pts}
                      </span>
                    </div>

                    {/* Progressive Clues Stack */}
                    <div className="mt-3 space-y-2.5">
                      {([1, 2, 3] as const).map((level) => {
                        if (level > cluesRevealed) return null;
                        const clueText =
                          currentQuestion.item.translations[lang].clues[level - 1];
                        return (
                          <div
                            key={level}
                            className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm leading-relaxed text-slate-900"
                          >
                            <span className="mr-2 font-mono-tabular text-xs font-bold text-[#D97706]">
                              {level}.
                            </span>
                            {clueText}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4 Answer Options */}
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {currentQuestion.options.map((opt, idx) => {
                      const localizedName = opt.translations[lang].name;
                      const isSelected = feedback?.selectedId === opt.id;
                      const isCorrectOption = feedback?.correctId === opt.id;

                      let btnStyle =
                        'border-[#E2E8F0] bg-white text-slate-900 hover:border-[#1E40AF] hover:bg-[#F8FAFC]';
                      if (feedback) {
                        if (isCorrectOption) {
                          btnStyle =
                            'border-[#059669] bg-[#059669]/10 text-[#059669]';
                        } else if (isSelected && !isCorrectOption) {
                          btnStyle =
                            'border-rose-500 bg-rose-50 text-rose-700';
                        } else {
                          btnStyle = 'border-[#E2E8F0] bg-white text-slate-400';
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={feedback !== null}
                          onClick={() => handleAnswer(opt.id)}
                          className={`flex min-h-[52px] items-center justify-between gap-3 rounded-xl border px-4 py-3 text-start text-sm font-semibold transition-colors cursor-pointer disabled:cursor-default ${btnStyle}`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="font-mono-tabular text-xs font-bold text-slate-400">
                              {idx + 1}
                            </span>
                            <span>{localizedName}</span>
                          </span>
                          {feedback && isCorrectOption && (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#059669]" aria-hidden="true" />
                          )}
                          {feedback && isSelected && !isCorrectOption && (
                            <XCircle className="h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Clue / Skip / Feedback Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E2E8F0] pt-4">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        disabled={cluesRevealed >= 3 || feedback !== null}
                        onClick={handleNextClue}
                        className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-[#D97706] bg-[#D97706]/10 px-4 py-2 text-xs font-bold text-[#B45309] transition-colors hover:bg-[#D97706]/20 disabled:border-[#E2E8F0] disabled:bg-[#F8FAFC] disabled:text-slate-400 whitespace-nowrap cursor-pointer disabled:cursor-default"
                      >
                        <Lightbulb className="h-4 w-4 shrink-0" aria-hidden="true" />
                        {cluesRevealed >= 3 ? t.play.allCluesShown : t.play.nextClue}
                      </button>

                      <button
                        type="button"
                        disabled={feedback !== null}
                        onClick={handleSkip}
                        className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:border-slate-400 whitespace-nowrap cursor-pointer disabled:opacity-50"
                      >
                        <SkipForward className="h-4 w-4 shrink-0" aria-hidden="true" />
                        {t.play.skipQuestion}
                      </button>
                    </div>

                    {feedback && (
                      <div
                        role="status"
                        className={`text-xs font-bold tabular-nums ${
                          feedback.status === 'correct'
                            ? 'text-[#059669]'
                            : feedback.status === 'wrong'
                              ? 'text-rose-600'
                              : 'text-slate-500'
                        }`}
                      >
                        {feedback.status === 'correct' &&
                          `${t.play.correctFeedback} (+${feedback.pointsDelta})`}
                        {feedback.status === 'wrong' && t.play.wrongFeedback}
                        {feedback.status === 'skipped' && t.play.skippedFeedback}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ROUND SUMMARY & LINK / WHATSAPP CHALLENGE */}
          {phase === 'SUMMARY' && (
            <div className="space-y-6">
              {/* Duel Comparison Verdict Banner */}
              {activeDuelOpponent && (
                <div
                  className={`rounded-2xl border bg-white p-6 ${
                    duelDiff > 0
                      ? 'border-[#059669]'
                      : duelDiff === 0
                        ? 'border-[#1E40AF]'
                        : 'border-[#D97706]'
                  }`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-3">
                      {duelDiff > 0 ? (
                        <Trophy className="mt-0.5 h-6 w-6 shrink-0 text-[#059669]" aria-hidden="true" />
                      ) : duelDiff === 0 ? (
                        <Sparkles className="mt-0.5 h-6 w-6 shrink-0 text-[#1E40AF]" aria-hidden="true" />
                      ) : (
                        <Target className="mt-0.5 h-6 w-6 shrink-0 text-[#D97706]" aria-hidden="true" />
                      )}
                      <div>
                        <h2
                          className={`font-display text-xl font-extrabold ${
                            duelDiff > 0
                              ? 'text-[#059669]'
                              : duelDiff === 0
                                ? 'text-[#1E40AF]'
                                : 'text-[#D97706]'
                          }`}
                        >
                          {duelDiff > 0
                            ? t.summary.duelWin
                            : duelDiff === 0
                              ? t.summary.duelTie
                              : t.summary.duelLoss}
                        </h2>
                        <p className="mt-1 text-sm text-slate-700">
                          {duelDiff > 0 && (
                            <>
                              {t.summary.duelDeltaWin}{' '}
                              <strong className="tabular-nums">
                                +{duelDiff} {t.records.pts}
                              </strong>
                            </>
                          )}
                          {duelDiff < 0 && (
                            <>
                              {t.summary.duelDeltaLoss}{' '}
                              <strong className="tabular-nums">
                                {Math.abs(duelDiff)} {t.records.pts}
                              </strong>
                            </>
                          )}
                          {duelDiff === 0 && t.summary.duelDeltaTie}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-5 py-3 text-xs">
                      <div>
                        <div className="text-slate-500">{t.hud.score}</div>
                        <div className="font-display text-xl font-extrabold text-slate-900 tabular-nums">
                          {score}
                        </div>
                      </div>
                      <div className="text-slate-300 font-bold">vs</div>
                      <div>
                        <div className="text-slate-500">
                          {activeDuelOpponent.challengerName || t.print.anonymousPlayer}
                        </div>
                        <div className="font-display text-xl font-extrabold text-slate-700 tabular-nums">
                          {activeDuelOpponent.score}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Summary KPI + Challenge Sharing Card */}
              <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 md:p-8">
                <div className="flex flex-col gap-2 border-b border-[#E2E8F0] pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-display text-2xl font-extrabold text-slate-900">
                      {t.summary.roundComplete}
                    </h2>
                    <p className="mt-1 text-xs font-medium text-slate-500">
                      {t.categories[activeCategory]} ·{' '}
                      <span className="tabular-nums">
                        {activeDuration}
                        {t.setup.secondsSuffix}
                      </span>{' '}
                      · {t.setup.seedLabel}:{' '}
                      <span className="font-mono text-slate-700">{roundSeed}</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2 text-xs font-semibold text-slate-700 hover:border-[#1E40AF] hover:text-[#1E40AF] whitespace-nowrap self-start cursor-pointer"
                  >
                    <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                    {t.summary.printSummary}
                  </button>
                </div>

                {/* 4-Column KPI Strip */}
                <div className="my-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                    <div className="text-xs font-medium text-slate-500">
                      {t.summary.finalScore}
                    </div>
                    <div className="mt-1 font-display text-3xl font-extrabold text-[#1E40AF] tabular-nums">
                      {score}
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                    <div className="text-xs font-medium text-slate-500">
                      {t.summary.accuracy}
                    </div>
                    <div className="mt-1 font-display text-3xl font-extrabold text-slate-900 tabular-nums">
                      {accuracyPct}%{' '}
                      <span className="text-sm font-semibold text-slate-500">
                        ({correctCount}/{answeredCount})
                      </span>
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                    <div className="text-xs font-medium text-slate-500">
                      {t.summary.bestStreak}
                    </div>
                    <div className="mt-1 font-display text-3xl font-extrabold text-[#D97706] tabular-nums">
                      {bestStreak}
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                    <div className="text-xs font-medium text-slate-500">
                      {t.summary.cluesSaved}
                    </div>
                    <div className="mt-1 font-display text-3xl font-extrabold text-[#059669] tabular-nums">
                      {cluesSaved}
                    </div>
                  </div>
                </div>

                {/* Challenge & Rematch Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={buildWhatsAppLink(Boolean(activeDuelOpponent))}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#059669] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#047857] whitespace-nowrap"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {activeDuelOpponent ? t.summary.sendRematch : t.summary.sendWhatsApp}
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyChallengeLink}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#1E40AF] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1E3A8A] whitespace-nowrap cursor-pointer"
                  >
                    {copiedLink ? (
                      <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                    ) : (
                      <Copy className="h-4 w-4 shrink-0" aria-hidden="true" />
                    )}
                    {copiedLink ? t.summary.linkCopied : t.summary.copyLink}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      startRound({
                        seed: generateRoundSeed(),
                        category: activeCategory,
                        duration: activeDuration,
                        duelOpponent: null,
                      })
                    }
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-xs font-bold text-slate-800 hover:border-[#1E40AF] hover:text-[#1E40AF] whitespace-nowrap cursor-pointer"
                  >
                    <Play className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {t.summary.playAgain}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      startRound({
                        seed: roundSeed,
                        category: activeCategory,
                        duration: activeDuration,
                        duelOpponent: activeDuelOpponent,
                      })
                    }
                    className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 whitespace-nowrap cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {t.summary.playSameSeed}
                  </button>
                </div>

                {/* Question Breakdown */}
                {results.length > 0 && (
                  <div className="mt-7 border-t border-[#E2E8F0] pt-5">
                    <h3 className="mb-3 text-sm font-semibold text-slate-700">
                      {t.summary.questionBreakdown}
                    </h3>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {results.map((res, idx) => {
                        const item = GEO_BY_ID[res.itemId];
                        const name = item ? item.translations[lang].name : res.itemId;
                        return (
                          <div
                            key={`${res.itemId}-${idx}`}
                            className="flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-xs"
                          >
                            <div className="min-w-0 pr-2">
                              <div className="truncate font-semibold text-slate-900">
                                {idx + 1}. {name}
                              </div>
                              <div className="text-slate-500">
                                {t.categories[res.category]} · {t.play.clueLabel} {res.cluesUsed}/3
                              </div>
                            </div>
                            <span
                              className={`font-mono-tabular font-bold shrink-0 ${
                                res.isCorrect
                                  ? 'text-[#059669]'
                                  : res.skipped
                                    ? 'text-slate-400'
                                    : 'text-rose-600'
                              }`}
                            >
                              {res.skipped
                                ? '0'
                                : res.isCorrect
                                  ? `+${res.pointsEarned}`
                                  : '-25'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Ad Slot 1: Dedicated Media.net container between Game Arena & Editorial/Records */}
        <MediaNetAdSlot slotId="mid-leaderboard" label={t.monetization.adSlotLabel} />

        {/* Local Records, Duel History, Notes, JSON Export/Import & Print */}
        <RecordsAndNotesPanel
          t={t}
          saveState={saveState}
          onUpdateNotes={(notes) => setSaveState((prev) => ({ ...prev, notes }))}
          onImportState={(nextState) => setSaveState(nextState)}
          onClearHistory={() => setSaveState((prev) => ({ ...prev, history: [] }))}
          onPrint={() => window.print()}
        />

        {/* Editorial SEO Guide & Interactive Accordion FAQ */}
        <EditorialSeoSection t={t} />

        {/* Contextual Affiliate Geography Gear */}
        <AffiliateGearSection t={t} />

        {/* Ad Slot 2: Dedicated Media.net container at bottom of page */}
        <MediaNetAdSlot slotId="bottom-rectangle" label={t.monetization.adSlotLabel} />
      </main>

      {/* Clean Footer */}
      <footer className="no-print border-t border-[#E2E8F0] bg-white py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:px-6">
          <span>{t.footer.tagline}</span>
          <span>
            {t.footer.canonicalLabel}:{' '}
            <a
              href={`${CANONICAL_ORIGIN}/`}
              className="font-medium text-[#1E40AF] hover:underline"
            >
              {CANONICAL_ORIGIN}
            </a>
          </span>
        </div>
      </footer>

      {/* Printable @media print Scorecard */}
      <PrintScorecard t={t} saveState={saveState} latestRound={latestRoundForPrint} />
    </div>
  );
}
