export interface Achievement {
  title: string;
  issuer: string;
  date: string;
  verifyUrl?: string;
  badge?: string; // path to badge image
}

export const achievements: Achievement[] = [
  {
    title: "RCMP Enhanced Reliability Security Clearance",
    issuer: "Royal Canadian Mounted Police",
    date: "2024 — 2034",
  },
  {
    title: "CRA Reliability Status Clearance",
    issuer: "Canada Revenue Agency",
    date: "2026 — 2036",
  },
  {
    title: "DELF B2 — French Language Certification",
    issuer: "French Ministry of Education",
    date: "2022",
  },
  {
    title: "Mentored Team — Dev.0 “Best Demo” Award",
    issuer: "CGI · SCESoc Dev.0 Hackathon",
    date: "2026",
  },
  {
    title: "International Youth Day Leadership Award — Innovation",
    issuer: "Somali Centre for Family Services",
    date: "2024",
  },
  {
    title: "Work-Integrated Learner Badge",
    issuer: "Riipen",
    date: "2024",
  },
];
