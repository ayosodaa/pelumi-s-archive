export type Tool = {
  id: string;
  code: string;
  title: string;
  category: "Operations" | "Programme" | "Financial" | "Decision" | "Automation";
  description: string;
  format: string;
};

export const tools: Tool[] = [
  {
    id: "oku-toolkit",
    code: "OP-01",
    title: "OKU Toolkit",
    category: "Operations",
    description: "A modular operations stack for early-stage African ventures — finance, reporting, and team rituals in one canvas.",
    format: "Notion template",
  },
  {
    id: "roi-gauge",
    code: "FN-04",
    title: "ROI Gauge",
    category: "Financial",
    description: "A first-pass return calculator for MSMEs deciding between three growth bets without losing the weekend to spreadsheets.",
    format: "Interactive tool",
  },
  {
    id: "stakeholder-ledger",
    code: "OP-07",
    title: "Stakeholder Ledger",
    category: "Operations",
    description: "Map every relationship that funds, blocks, or accelerates the programme. Updated quarterly, used weekly.",
    format: "Airtable base",
  },
  {
    id: "programme-canvas",
    code: "PR-02",
    title: "Programme Canvas",
    category: "Programme",
    description: "A 12-block design canvas for accelerators, fellowships, and training cohorts. Replaces the brief.",
    format: "PDF + Figma",
  },
  {
    id: "investment-readiness",
    code: "FN-09",
    title: "Investment-Readiness Checklist",
    category: "Financial",
    description: "What an early-stage African founder actually needs in the data room — by stage, by ticket, by funder type.",
    format: "Notion doc",
  },
  {
    id: "decision-journal",
    code: "DC-01",
    title: "Decision Journal",
    category: "Decision",
    description: "A monthly structure for capturing the call, the context, and the counterfactual. Designed to be re-read at year end.",
    format: "Template",
  },
  {
    id: "donor-report",
    code: "PR-06",
    title: "Donor Report Skeleton",
    category: "Programme",
    description: "Quarterly donor reporting that respects everyone's time — including the founders being reported on.",
    format: "Docx + Figma",
  },
  {
    id: "ops-automations",
    code: "AT-03",
    title: "Operations Automation Pack",
    category: "Automation",
    description: "Twelve small Make / Zapier scenarios that quietly remove the meetings nobody admitted hating.",
    format: "Recipe set",
  },
  {
    id: "weekly-pulse",
    code: "OP-11",
    title: "Weekly Pulse",
    category: "Operations",
    description: "A five-minute team ritual that replaces the status meeting. Used across three portfolio companies.",
    format: "Template",
  },
];

export const labCategories = ["All", "Operations", "Programme", "Financial", "Decision", "Automation"] as const;
