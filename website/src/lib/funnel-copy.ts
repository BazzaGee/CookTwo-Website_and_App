export interface ThankYouInput {
  goal: string;
  blocker: string;
  situation: string;
}

const GOAL: Record<string, string> = {
  lose: 'You want to lose a bit of weight',
  keep: 'You want to keep the weight off',
  fitness: 'You want to get fitter',
  'not-sure': 'You want better dinners on the table',
};

const BLOCKER: Record<string, (situation: string) => string> = {
  time: () => 'weeknights leave no time',
  willpower: () => 'willpower runs out by 6pm',
  'mixed-house': (situation) => {
    if (situation === 'different-goals') return 'two sets of diet rules run your kitchen';
    if (situation === 'same-goal') return "you've each been cooking to different rules";
    return "you're not dieting the way anyone else is";
  },
  takeaway: () => 'takeaways win too often',
  'no-ideas': () => "tonight's dinner is always a blank page",
};

const SITUATION: Record<string, string> = {
  solo: 'the kitchen is all yours',
  'same-goal': "you're both eating to the same goal",
  'different-goals': "you're cooking for two different goals",
};

const SENTENCE2: Record<string, string> = {
  solo: 'This video shows how one pantry-first decision ends the 6pm scramble — the Kitchen Calculator does your daily number, pantry to diet.',
  'same-goal': "This video shows how one shared dinner keeps the plan alive — the Kitchen Calculator does the portions, targets, and diet match.",
  'different-goals': 'This video shows how one pan feeds two goals without cooking twice — the Kitchen Calculator does the portions, targets, and diet match.',
};

export function buildThankYouCopy(input: ThankYouInput): string {
  const goal = GOAL[input.goal] || GOAL['not-sure'];
  const blockerFn = BLOCKER[input.blocker] || BLOCKER['no-ideas'];
  const blocker = blockerFn(input.situation);
  const situation = SITUATION[input.situation] || SITUATION['different-goals'];
  const sentence2 = SENTENCE2[input.situation] || SENTENCE2['different-goals'];
  return `${goal}, but ${blocker} — and ${situation}. ${sentence2}`;
}
