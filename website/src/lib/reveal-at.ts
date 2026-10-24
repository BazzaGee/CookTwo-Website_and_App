/**
 * Single source of truth for when each VSL reveals its email-capture box.
 *
 * The value is the `t_in` of that video's own `timecodes.csv` opt-in slide,
 * re-confirmed against the rendered MP4 by extracting the frames either side
 * of the boundary (see the `verifiedBy` field in the JSON for the measurement).
 *
 * Do not hard-code `revealAt` in a page or in `VslPlayer.astro`. Put it in
 * `src/data/vsl-reveal.json` instead, so the page, the player comment and the
 * build-info stamp can never disagree — three copies of one number is exactly
 * what let the comment drift to 420.57 / 500.27 while the pages shipped
 * 420.5 / 500.03.
 */
import revealData from '../data/vsl-reveal.json';

export type VslMode = 'couples' | 'solo';

export interface RevealTiming {
  revealAt: number;
  slide: number;
  source: string;
  verified: string;
  verifiedBy: string;
}

const REVEALS = revealData as unknown as Record<VslMode, RevealTiming>;

export function revealFor(mode: VslMode): RevealTiming {
  return REVEALS[mode];
}

export function revealAtFor(mode: VslMode): number {
  return REVEALS[mode].revealAt;
}

export function revealModes(): VslMode[] {
  return Object.keys(REVEALS) as VslMode[];
}
