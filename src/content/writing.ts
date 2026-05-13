export type Writing = {
  slug: string;
  title: string;
  date: string;
  category: "Essay" | "Reflection" | "Poetry" | "Note";
  readingMinutes: number;
  excerpt: string;
  body: string[];
};

export const writings: Writing[] = [
  {
    slug: "the-operational-aesthetic",
    title: "The Operational Aesthetic",
    date: "Mar 2024",
    category: "Essay",
    readingMinutes: 8,
    excerpt: "Why programmes need beauty — and what efficiency owes to elegance.",
    body: [
      "There is a quiet aesthetic to a well-run programme. The receipts arrive on time. The slides do not need explaining. The room feels like someone thought about it before you arrived.",
      "We talk about operations as if it were the opposite of design. It is not. Operations is the design surface most stakeholders actually meet you through — the email cadence, the dashboard, the way reimbursements move.",
      "If your programme is beautiful at the seams, the work in the middle gets to be quieter, harder, and more honest.",
    ],
  },
  {
    slug: "conservation-as-code",
    title: "Conservation as Code",
    date: "Jan 2024",
    category: "Essay",
    readingMinutes: 12,
    excerpt: "Algorithmic thinking for biodiversity protection — what software taught me about ecosystems.",
    body: [
      "Ecosystems are not metaphors for software. Software is a metaphor for ecosystems.",
      "Once you have spent a season counting species in a transect, the deploy pipeline starts to look familiar — small interventions, long feedback loops, irreversible mistakes.",
    ],
  },
  {
    slug: "the-recursive-african-city",
    title: "The Recursive African City",
    date: "Oct 2023",
    category: "Essay",
    readingMinutes: 10,
    excerpt: "On Lagos, Nairobi, and the failure of top-down urban planning.",
    body: [
      "Top-down planning assumes the planner is outside the city. In Lagos, no one is outside the city.",
      "What works instead is recursion: small loops of action and observation, repeated by people who actually live inside the consequences.",
    ],
  },
  {
    slug: "on-the-ethics-of-ecosystem-building",
    title: "On the Ethics of Ecosystem Building",
    date: "Aug 2023",
    category: "Reflection",
    readingMinutes: 6,
    excerpt: "A critical look at the power dynamics inside pan-African entrepreneurship networks.",
    body: [
      "Every ecosystem map I have ever drawn put me near the centre. That should worry me more than it does.",
      "We need ecosystems that survive their conveners.",
    ],
  },
  {
    slug: "field-notes-october",
    title: "Field Notes, October",
    date: "Oct 2023",
    category: "Note",
    readingMinutes: 3,
    excerpt: "Loose fragments from a season of programme design across three cities.",
    body: [
      "Lagos: the cohort is too big and the rooms are too small. Both are fine.",
      "Kigali: the donor wanted a dashboard. We gave them a story instead.",
      "Nairobi: nobody read the deck. Everyone read the WhatsApp.",
    ],
  },
  {
    slug: "the-quiet-hour",
    title: "The Quiet Hour",
    date: "Jun 2023",
    category: "Poetry",
    readingMinutes: 2,
    excerpt: "A short piece on the hour before everyone else wakes.",
    body: [
      "Before the inbox / before the meetings / before the country / there is a small soft window — / call it the quiet hour, / call it the unsigned page.",
    ],
  },
];
