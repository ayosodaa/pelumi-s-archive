export type Era = {
  id: string;
  number: string;
  title: string;
  years: string;
  kicker: string;
  description: string;
  highlights: string[];
  artifacts: { caption: string; prompt: string }[];
  lessons: string[];
};

export const eras: Era[] = [
  {
    id: "conservation",
    number: "01",
    title: "Conservation",
    years: "2016 — 2018",
    kicker: "Roots in fieldwork & systems thinking",
    description:
      "Early years at the ALU School of Wildlife Conservation. Conservation club leadership, environmental campaigns, fieldwork — the first place where systems thinking became a reflex rather than a discipline.",
    highlights: [
      "ALU School of Wildlife Conservation — student lead",
      "Conservation Club — campaign design & member growth",
      "Field studies across savannah ecosystems",
      "Environmental advocacy & community outreach",
    ],
    artifacts: [
      { caption: "Field notebook, dry season", prompt: "Open field notebook with handwritten conservation notes" },
      { caption: "Wildlife transect", prompt: "Wide savannah landscape with distant wildlife at golden hour" },
      { caption: "Campaign poster, 2017", prompt: "Vintage African conservation poster with bold typography" },
    ],
    lessons: [
      "Ecosystems teach humility before they teach strategy.",
      "The smallest interventions in the right node move the most weight.",
    ],
  },
  {
    id: "community",
    number: "02",
    title: "Community & Volunteer",
    years: "2017 — 2019",
    kicker: "Workshops, grassroots, youth engagement",
    description:
      "Workshops, grassroots initiatives, and ecosystem building work. Learning that programmes are people first, paperwork second.",
    highlights: [
      "Convened 20+ community workshops across three states",
      "Volunteer coordination for youth-focused initiatives",
      "Grassroots fundraising & event production",
    ],
    artifacts: [
      { caption: "Workshop, Lagos", prompt: "Group of African youth in a workshop circle, warm light" },
      { caption: "Volunteer crew", prompt: "Community volunteers wearing matching tees, candid group photo" },
    ],
    lessons: [
      "Convening is design. Who is in the room is most of the work.",
      "Posters, snacks, and timing are not logistics — they are the programme.",
    ],
  },
  {
    id: "literature",
    number: "03",
    title: "Literature & Reflection",
    years: "2018 — present",
    kicker: "Poetry, essays, fragments",
    description:
      "Poetry, essays, articles, reflections — the parallel practice that keeps the systems work honest. Writing as the long way of thinking clearly.",
    highlights: [
      "Personal essays on operations, ecology, and African modernity",
      "Poetry chapbooks & scattered fragments",
      "Editorial work for community publications",
    ],
    artifacts: [
      { caption: "Notebook page, undated", prompt: "Scanned page of handwritten poetry with margin notes" },
      { caption: "Editorial spread", prompt: "Black and white editorial magazine spread with serif typography" },
    ],
    lessons: [
      "If you cannot write the system clearly, you do not yet understand it.",
      "A good sentence is a small operating manual.",
    ],
  },
  {
    id: "technology",
    number: "04",
    title: "Technology & Product",
    years: "2019 — 2022",
    kicker: "No-code, automation, product experiments",
    description:
      "No-code systems, automation tools, product experiments, dashboards, and mobile applications. Treating software as a way to instrument operations rather than chase markets.",
    highlights: [
      "OKU Toolkit — internal operations stack",
      "ROI Gauge — calculator for early-stage MSME decisions",
      "Financial reporting automations",
      "Workflow systems for distributed teams",
    ],
    artifacts: [
      { caption: "OKU Toolkit, dashboard", prompt: "Clean SaaS dashboard mockup with charts and KPI cards" },
      { caption: "ROI Gauge, sketch", prompt: "Hand-drawn UI wireframe of a financial calculator on grid paper" },
      { caption: "Workflow diagram", prompt: "Whiteboard flowchart with arrows and sticky notes" },
    ],
    lessons: [
      "The best product is usually a spreadsheet someone already trusts.",
      "Automate the boring parts last — first, learn why they were boring.",
    ],
  },
  {
    id: "programme-design",
    number: "05",
    title: "Programme Design & Ecosystem",
    years: "2020 — present",
    kicker: "Incubation, training, MSME support",
    description:
      "Entrepreneurship programmes, incubation systems, donor-funded initiatives, training systems, and MSME support programmes. Designing repeatable infrastructure for first-time founders.",
    highlights: [
      "Curriculum design for multi-cohort accelerators",
      "Donor reporting frameworks & M&E systems",
      "Training facilitation across 6 African markets",
      "Investment-readiness programme architecture",
    ],
    artifacts: [
      { caption: "Cohort kickoff", prompt: "Founders in a co-working space mid-presentation, candid" },
      { caption: "Programme map", prompt: "Hand-drawn programme journey map with milestones" },
      { caption: "Slide deck cover", prompt: "Editorial slide deck cover with serif title and serif numerals" },
    ],
    lessons: [
      "A programme is a promise repeated weekly.",
      "Cohorts compound when you design for the alumni, not the applicants.",
    ],
  },
  {
    id: "leadership",
    number: "06",
    title: "Community Leadership",
    years: "2021 — present",
    kicker: "Stakeholder networks & coordination",
    description:
      "ALU Conservation Club, ecosystem coordination, stakeholder networks, and community management — the slow, relational work between the milestones.",
    highlights: [
      "Led ALU Conservation Club through three growth seasons",
      "Cross-organization coordination across NGOs & funders",
      "Online community design & moderation systems",
    ],
    artifacts: [
      { caption: "Council meeting", prompt: "Community leaders around a wooden table, document on display" },
      { caption: "Annual gathering", prompt: "Outdoor community gathering with banner and crowd at dusk" },
    ],
    lessons: [
      "Leadership in ecosystems looks more like gardening than commanding.",
      "Trust accrues at the speed of follow-through, not announcements.",
    ],
  },
  {
    id: "operations",
    number: "07",
    title: "Professional Operations",
    years: "2022 — present",
    kicker: "Grants, programmes, fund administration",
    description:
      "Grant operations, programme administration, investment readiness, stakeholder coordination, donor reporting, and fund administration — across BiD Capital Partners, BuildWithORI, OKU Ventures, Startup Builder 360, and NCIC.",
    highlights: [
      "Operations across 5 portfolio organizations",
      "End-to-end grant cycle management",
      "Investment-readiness diligence frameworks",
      "Strategic planning & quarterly reviews",
    ],
    artifacts: [
      { caption: "Operations dashboard", prompt: "Detailed financial operations dashboard mockup" },
      { caption: "Strategy session", prompt: "Conference room with sticky notes covering a wall" },
      { caption: "Annual report cover", prompt: "Editorial annual report cover, warm earth palette" },
    ],
    lessons: [
      "Reporting is a design surface — most stakeholders meet you through it.",
      "Operations is care, expressed through structure.",
    ],
  },
];
