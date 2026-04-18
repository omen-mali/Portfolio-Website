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
    title: "DELF B2 — French Language Certification",
    issuer: "French Ministry of Education",
    date: "2022",
  },
  {
    title: "Riipen Work-Integrated Learner Badge",
    issuer: "Riipen",
    date: "2024",
  },
  {
    title: "International Youth Day Leadership Award",
    issuer: "Innovation Award",
    date: "2024",
  },
  /*
  {
    title: "Suddy and Barbara Ashfield Award",
    issuer: "Ridgemont High School",
    date: "2022",
  },
  {
    title: "Silver Medal",
    issuer: "Ridgemont High School",
    date: "2022",
  },
  */
  
];
