export type JunkItem = {
  id: string;
  title: string;
  kind: "Failed experiment" | "Abandoned prototype" | "Strange idea" | "Sketch";
  date: string;
  what: string;
  whyFailed: string;
  lesson: string;
  rotation: number;
};

export const junkyard: JunkItem[] = [
  {
    id: "community-token",
    title: "The Community Token",
    kind: "Abandoned prototype",
    date: "Nov 2021",
    what: "A points system that would reward neighbours for showing up to community workshops.",
    whyFailed: "The metric quietly replaced the meaning. People started optimizing for points instead of presence.",
    lesson: "If your incentive is louder than your purpose, the incentive wins.",
    rotation: -2,
  },
  {
    id: "garden-scheduler",
    title: "Auto-Garden Scheduler",
    kind: "Failed experiment",
    date: "Mar 2020",
    what: "An app that would assign weekly gardening shifts using calendar APIs.",
    whyFailed: "Plants do not respect Google Calendar. Neither do humans.",
    lesson: "Some systems work because they are loose, not in spite of it.",
    rotation: 3,
  },
  {
    id: "seed-coin",
    title: "Seed Coin",
    kind: "Strange idea",
    date: "Feb 2022",
    what: "A token backed by literal seeds in a literal vault — a half-joke that almost shipped.",
    whyFailed: "Logistics. And a very kind lawyer.",
    lesson: "Some ideas exist to be told at dinner, not deployed at scale.",
    rotation: -1,
  },
  {
    id: "systems-network",
    title: "Network for Systems Thinkers",
    kind: "Abandoned prototype",
    date: "Jul 2019",
    what: "A small social network where every post had to be a Venn diagram.",
    whyFailed: "Turns out we like sentences too.",
    lesson: "Constraint as design is good. Constraint as personality is exhausting.",
    rotation: 2,
  },
  {
    id: "logistics-dashboard",
    title: "Continental Logistics Dashboard",
    kind: "Sketch",
    date: "Aug 2020",
    what: "An ambitious mockup for a single dashboard tracking goods across six countries.",
    whyFailed: "Ambition outran data partnerships by approximately five years.",
    lesson: "Mockups should be cheap so reality can disagree quickly.",
    rotation: 1,
  },
  {
    id: "essay-bot",
    title: "Essay-A-Day Bot",
    kind: "Failed experiment",
    date: "Jan 2023",
    what: "A bot that would email me one prompt every morning, forever.",
    whyFailed: "I unsubscribed on day nine.",
    lesson: "Discipline cannot be outsourced to a cron job.",
    rotation: -3,
  },
];
