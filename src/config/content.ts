// Single source of truth for page copy (DRY). The brief's one-liner bank and wedge options live
// here; components read from this module and never inline their own strings. To re-lead the page,
// change ACTIVE_WEDGE — it is the only line that changes (Decision D1).

export type WedgeId = '0' | 'A' | 'B' | 'C' | 'D';

export interface Wedge {
  readonly id: WedgeId;
  readonly name: string;
  readonly headline: string;
}

/** The five candidate leads from the brief. Exactly one is active. */
export const WEDGES: Readonly<Record<WedgeId, Wedge>> = {
  '0': { id: '0', name: 'Progress', headline: "A training app that tells you whether you're actually moving forward." },
  A: { id: 'A', name: 'Glanceable', headline: "See your training. Don't read it." },
  B: { id: 'B', name: 'Whole-body', headline: 'Train everything — not just the mirror.' },
  C: { id: 'C', name: 'Craft', headline: 'A training app built like a good tool.' },
  D: { id: 'D', name: 'Tool, not platform', headline: 'Your training. Offline. No feed, no ads.' },
} as const;

/** Decision D1: lead with wedge 0 (Progress). */
export const ACTIVE_WEDGE: WedgeId = '0';

export const HERO = {
  subHook: "It lights up the muscles you've trained — and the ones you've been skipping.",
  ctaLabel: 'Open the app',
  // D3: founding framing, no number.
  waitlistLabel: 'Join the founding group for a beta invite.',
  waitlistPlaceholder: 'you@email.com',
  waitlistSubmit: 'Join the waitlist',
  waitlistNote: 'One email when your invite is ready. No spam, no list-selling.',
} as const;

export interface BenefitBlock {
  readonly eyebrow: string;
  readonly title: string;
  readonly body: string;
}

/** The three benefit blocks (brief §2), copy pulled from the one-liner bank. */
export const BENEFITS: readonly BenefitBlock[] = [
  {
    eyebrow: 'The body heat-map',
    title: "See what you're neglecting",
    body: "Every set you log lights up the muscles you worked — and greys out the ones you've been skipping. Find the muscle you've quietly avoided for three weeks.",
  },
  {
    eyebrow: 'Colour + icon coding',
    title: 'Read your session at a glance',
    body: 'Colour says what kind of work; the figure says where it landed. Read the shape of a whole session without reading a single number.',
  },
  {
    eyebrow: 'Honest by design',
    title: 'Tracking that never flatters',
    body: "It never flatters your numbers — a light week shows up light. Your training, on your phone, offline. No feed, no ads.",
  },
] as const;

export const FOUNDING = {
  heading: 'Shaping v1 with a small founding group.',
  body: 'Just Train is in private beta. Join the founding group for an invite — and help shape where v1 goes.',
} as const;

export const META = {
  title: 'Just Train — are you actually moving forward?',
  description:
    'An athlete-first training app that answers one question: are you moving forward? A body heat-map shows what you train and what you skip. Offline, no ads.',
} as const;
