import { describe, it, expect } from 'vitest';
import { WEDGES, ACTIVE_WEDGE, BENEFITS, HERO, FOUNDING, META } from '../src/config/content';

describe('content invariants', () => {
  it('the active wedge exists and has a non-empty headline', () => {
    const wedge = WEDGES[ACTIVE_WEDGE];
    expect(wedge).toBeDefined();
    expect(wedge.headline.trim().length).toBeGreaterThan(0);
  });

  it('leads with the Capture wedge (Decision D1, superseded 2026-11-07: capture-first)', () => {
    expect(ACTIVE_WEDGE).toBe('E');
    expect(WEDGES['E'].name).toBe('Capture');
  });

  it('ships exactly three benefit blocks, each fully populated', () => {
    expect(BENEFITS).toHaveLength(3);
    for (const block of BENEFITS) {
      expect(block.eyebrow.trim()).not.toBe('');
      expect(block.title.trim()).not.toBe('');
      expect(block.body.trim()).not.toBe('');
    }
  });

  it('keeps the founding framing numberless (Decision D3)', () => {
    const copy = `${HERO.waitlistLabel} ${FOUNDING.heading} ${FOUNDING.body}`;
    expect(copy.toLowerCase()).toContain('founding');
    // No advertised count of spots/members/places — "v1" (a version) is fine.
    expect(copy.toLowerCase()).not.toContain('spots');
    expect(copy).not.toMatch(/\d+\s*(founding\s+)?(spots?|members?|places?|seats?)/i);
  });

  it('has a meta description within a sensible length for search snippets', () => {
    expect(META.description.length).toBeGreaterThan(50);
    expect(META.description.length).toBeLessThanOrEqual(160);
  });
});
