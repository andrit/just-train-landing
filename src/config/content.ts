// Single source of truth for page copy (DRY). The brief's one-liner bank and wedge options live
// here; components read from this module and never inline their own strings. To re-lead the page,
// change ACTIVE_WEDGE — it is the only line that changes.

export type WedgeId = '0' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface Wedge {
  readonly id: WedgeId;
  readonly name: string;
  readonly headline: string;
}

/** Candidate leads. Exactly one is active. 'E'/'F' added 2026-11-07 for the capture-first lead. */
export const WEDGES: Readonly<Record<WedgeId, Wedge>> = {
  '0': { id: '0', name: 'Progress', headline: "A training app that tells you whether you're actually moving forward." },
  A: { id: 'A', name: 'Glanceable', headline: "See your training. Don't read it." },
  B: { id: 'B', name: 'Whole-body', headline: 'Train everything — not just the mirror.' },
  C: { id: 'C', name: 'Craft', headline: 'A training app built like a good tool.' },
  D: { id: 'D', name: 'Tool, not platform', headline: 'Your training. Offline. No feed, no ads.' },
  E: { id: 'E', name: 'Capture', headline: 'Record your training the way you actually do it.' },
  F: { id: 'F', name: 'Logger', headline: 'Log the set, not the feed.' },
} as const;

/**
 * Decision D1 — SUPERSEDED 2026-11-07. Lead with CAPTURE, not the insight payoff. The product's
 * priority is the streamlined logging interface (capture your workout as you do it); tracking and
 * insight are the secondary dividend of a well-built data model. Was '0' (Progress). One-line swap.
 */
export const ACTIVE_WEDGE: WedgeId = 'E';

export const HERO = {
  // Capture-first lead; the insight payoff is named second, as the consequence of the data model.
  subHook:
    'No feed, no filler — just capture your training as you do it. The insight follows, from a data model that actually holds it.',
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

/**
 * The three benefit blocks, ordered to the product's priority arc (2026-11-07):
 * streamlined capture → a data model worth keeping → the insight that follows.
 */
export const BENEFITS: readonly BenefitBlock[] = [
  {
    eyebrow: 'Streamlined capture',
    title: 'Log it while you train',
    body: 'A minimal, efficient interface that captures your workout the way you actually do it — set by set, in the moment. No fluff, no feed, nothing between you and the next set.',
  },
  {
    eyebrow: 'A data model worth keeping',
    title: 'Built on structure, not screenshots',
    body: 'Every set lands in a well-constructed data model — honest and complete. It never flatters your numbers; a light week shows up light. Offline-first, and yours.',
  },
  {
    eyebrow: 'Actual augmentation',
    title: 'See what it adds up to',
    body: "A streamlined logger plus a solid data model is where real insight comes from: a body heat-map of what you've trained and skipped, and the shape of a session at a glance.",
  },
] as const;

export const FOUNDING = {
  heading: 'Shaping v1 with a small founding group.',
  body: 'Just Train is in private beta. Join the founding group for an invite — and help shape where v1 goes.',
} as const;

export const META = {
  title: 'Just Train — record your training, the way you do it',
  description:
    'A training app with one job: capture your workout as you do it. No feed, no filler. A solid data model turns every set into honest tracking and insight.',
} as const;
