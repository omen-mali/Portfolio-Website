export interface Achievement {
  title: string;
  issuer: string;
  date: string;
  verifyUrl?: string;
  badge?: string; // path to badge image
}

export const achievements: Achievement[] = [
  {
    title: "Riipen Work-Integrated Learner Badge",
    issuer: "Riipen",
    date: "2024",
  },
  {
    title: "DELF B2 — French Language Certification",
    issuer: "French Ministry of Education",
    date: "2022",
  },
  {
    title: "International Youth Day Leadership Award",
    issuer: "Innovation Award",
    date: "2024",
  },
];
