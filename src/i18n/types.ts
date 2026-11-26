import type { CategoryId, LanguageCode, RegionId } from '../types/game';

export interface EditorialSectionBlock {
  heading: string;
  body: string;
}

export interface FaqEntry {
  q: string;
  a: string;
}

export interface AffiliateItemCopy {
  title: string;
  subtitle: string;
  cta: string;
  url: string;
}

export interface TranslationBundle {
  code: LanguageCode;
  isRtl: boolean;
  seo: {
    title: string;
    description: string;
    howToTitle: string;
    howToSteps: [
      { name: string; text: string },
      { name: string; text: string },
      { name: string; text: string }
    ];
  };
  nav: {
    play: string;
    duelGuide: string;
    records: string;
    faq: string;
    startNow: string;
  };
  hero: {
    kicker: string;
    h1: string;
    subtitle: string;
  };
  categories: Record<CategoryId, string>;
  regions: Record<RegionId, string>;
  setup: {
    categoryLabel: string;
    durationLabel: string;
    secondsSuffix: string;
    playerNameLabel: string;
    playerNamePlaceholder: string;
    startRound: string;
    acceptDuel: string;
    declineDuel: string;
    incomingDuelHeading: string;
    incomingDuelDesc: string;
    targetToBeat: string;
    seedLabel: string;
  };
  hud: {
    score: string;
    timeLeft: string;
    streak: string;
    solved: string;
    target: string;
    aheadBy: string;
    behindBy: string;
    tiedTarget: string;
    soundOn: string;
    soundOff: string;
    quitRound: string;
  };
  play: {
    clueLabel: string;
    ofThree: string;
    nextClue: string;
    allCluesShown: string;
    skipQuestion: string;
    clueBonusHint: string;
    correctFeedback: string;
    wrongFeedback: string;
    skippedFeedback: string;
    shortcutsHint: string;
    mapCaption: string;
  };
  summary: {
    roundComplete: string;
    finalScore: string;
    accuracy: string;
    bestStreak: string;
    cluesSaved: string;
    duelWin: string;
    duelTie: string;
    duelLoss: string;
    duelDeltaWin: string;
    duelDeltaLoss: string;
    duelDeltaTie: string;
    playAgain: string;
    playSameSeed: string;
    sendWhatsApp: string;
    copyLink: string;
    linkCopied: string;
    sendRematch: string;
    printSummary: string;
    questionBreakdown: string;
    waChallengeText: string;
    waRematchText: string;
  };
  records: {
    sectionTitle: string;
    bestScoresTitle: string;
    historyTitle: string;
    noHistory: string;
    notesTitle: string;
    notesPlaceholder: string;
    exportJson: string;
    importJson: string;
    importSuccess: string;
    importError: string;
    clearHistory: string;
    printBtn: string;
    colCategory: string;
    colScore: string;
    colAccuracy: string;
    colDuel: string;
    colDate: string;
    pts: string;
  };
  monetization: {
    adSlotLabel: string;
    affiliateHeading: string;
    affiliateSubheading: string;
    affiliateDisclosure: string;
    affiliateItems: [
      AffiliateItemCopy,
      AffiliateItemCopy,
      AffiliateItemCopy,
      AffiliateItemCopy
    ];
  };
  editorial: {
    sectionTitle: string;
    blocks: [
      EditorialSectionBlock,
      EditorialSectionBlock,
      EditorialSectionBlock,
      EditorialSectionBlock
    ];
    faqTitle: string;
    faqs: [FaqEntry, FaqEntry, FaqEntry, FaqEntry, FaqEntry];
    transparentNotice: string;
  };
  print: {
    reportTitle: string;
    generatedOn: string;
    playerLabel: string;
    anonymousPlayer: string;
    summaryStats: string;
    notesHeading: string;
  };
  footer: {
    tagline: string;
    canonicalLabel: string;
  };
}
