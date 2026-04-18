export interface ExperienceLink {
  label: string;
  href: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
  tags: string[];
  links?: ExperienceLink[]; // optional — add per-entry as needed
}

export const experiences: Experience[] = [
  {
    role: "Embedded Software Developer Co-op",
    company: "Epocal, Siemens Healthineers",
    period: "Sep 2025 — Present",
    description:
      "Developing firmware in C/C++ for the epoc\u00AE Blood Analysis System and adjacent desktop tools in C#. Built a code generation application parsing Excel/Word documents to auto-generate protocol code across C++/C#/Java. Designed extensible architecture using abstract base classes and generic typed classes. Configured .NET build pipelines, NuGet packaging, and JFrog Artifactory distribution. Performed cross-platform integration testing against embedded and Android platforms.",
    tags: ["C/C++", "C#", ".NET", "Azure DevOps", "Agile", "FDA/GMP"],
    links: [
      { label: "epoc® Blood Analysis System", href: "https://www.siemens-healthineers.com/blood-gas/blood-gas-systems/epoc-blood-analysis-system" },
    ],
  },
  {
    role: "Technical Analyst — Central Help Desk",
    company: "Royal Canadian Mounted Police (RCMP)",
    period: "Jan 2025 — May 2025",
    description:
      "Provided bilingual (English/French) level-one technical support via phone and email for IT software, hardware, and connectivity issues. Managed support requests through detailed logging systems, coordinated with second-level teams for complex issues. Supported 30,000+ employees and external partners across Canada.",
    tags: ["IT Support", "Bilingual", "Incident Management"],
  },
  {
    role: "IT Plan Intern",
    company: "Midterm Rental Properties",
    period: "Mar 2024 — May 2024",
    description:
      "Audited property listings using IT database for completeness and accuracy. Tracked website analytics, performed SEO optimization, and wrote blog posts to improve website ranking and client experience.",
    tags: ["SEO", "Analytics", "Database", "Technical Writing"],
  },
  {
    role: "Dev.0 Hackathon Mentor",
    company: "SCESoc — Carleton University",
    period: "Oct 2025 — Feb 2026",
    description:
      "Mentored groups of 1st-3rd year engineering students through a 3-month hackathon. Facilitated weekly check-ins, ensured progress via Git commits, and evaluated project feasibility. A mentee group won CGI's \"Best Demo\" award for TutorLink.",
    tags: ["Mentorship", "Git", "Project Management"],
    links: [
      { label: "Dev.0 Program", href: "https://www.scesoc.ca/2025/10/09/dev-0-project-program/" },
      { label: "Dev.0 Closing Ceremony", href: "https://www.linkedin.com/posts/momen-m-ali_on-feb-2-i-had-the-great-opportunity-to-activity-7425194472759803904-szTo?utm_source=share&utm_medium=member_desktop&rcm=ACoAADa2vQ8B19NQCG_HGI_XEslUiylNjc1eK1M" },
    ],
  },
  {
    role: "Peer Mentor — First Year Connections",
    company: "Carleton University",
    period: "Sep 2024 — Oct 2024, Sep 2025 — Oct 2025",
    description:
      "Guided first-year Engineering students through the transition to post-secondary education. Conducted weekly meetings, documented mentee progress, and provided resource referral and advising.",
    tags: ["Mentoring", "Communication", "Leadership"],
    links: [
      { label: "FYC Program", href: "https://carleton.ca/seo/first-year-connections/" },
    ],
  },
];
