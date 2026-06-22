export interface ExperienceLink {
  label: string;
  href: string;
}

export interface Experience {
  id: string; // stable key — used for cross-section deep-links (point DOM ids)
  role: string;
  company: string;
  period: string;
  points: string[]; // bullet-point responsibilities/achievements (min 3 each)
  tags: string[];
  current?: boolean; // highlights the active role in the timeline
  bilingual?: boolean; // shows an EN / FR badge beside the company
  links?: ExperienceLink[]; // optional — add per-entry as needed
}

export const experiences: Experience[] = [
  {
    id: "cra",
    role: "Software Developer — IT Testing Platform Support",
    company: "Canada Revenue Agency",
    period: "Jun 2026 — Aug 2026",
    current: true,
    bilingual: true,
    points: [
      "Implementing automation and platform improvement features within internal **Production Assurance** testing platform, working with a **Java**-first stack.",
    ],
    tags: ["Java", "Maven", "Jenkins", "Git"],
  },
  {
    id: "siemens",
    role: "Embedded Software Developer",
    company: "Epocal, Siemens Healthineers",
    period: "Sep 2025 — Apr 2026",
    points: [
      "Developed **C/C++ firmware** for the **epoc® Blood Analysis System** on a dual-core STM32 M7/M4 platform, alongside adjacent desktop tooling in **C#**.",
      "Built a **C#/.NET code generator** producing **100+ protocol classes** per platform language **(C++/C#/Java)** from Excel & Word specifications.",
      "Overhauled protocol error reporting with strongly-typed Java and C# error factories consuming generated artifacts.",
      "Architected a **~17-step** Reader unit-test automation pipeline, cutting flash utilisation from **96% to ~80%** by offloading unit tests to a simulator configuration.",
      "Implemented **inter-core IPC messaging** and shipped a Bluetooth disconnect mechanism alongside an NFC pairing fix.",
    ],
    tags: ["C/C++", "C#", ".NET", "STM32 M7/M4", "IAR", "OpenXML", "JFrog", "Azure DevOps"],
    links: [
      { label: "epoc® Blood Analysis System", href: "https://www.siemens-healthineers.com/blood-gas/blood-gas-systems/epoc-blood-analysis-system" },
    ],
  },
  {
    id: "rcmp",
    role: "Technical Analyst",
    company: "Royal Canadian Mounted Police (RCMP)",
    period: "Jan 2025 — May 2025",
    bilingual: true,
    points: [
      "Delivered bilingual (English/French) technical support to **30,000+ employees** and external partners across Canada via internal IT support platform.",
      "Granted **RCMP Enhanced Reliability** security clearance.",
    ],
    tags: ["IT Support", "Bilingual EN/FR", "Incident Management"],
  },
  {
    id: "midterm",
    role: "IT Plan Intern",
    company: "Midterm Rental Properties",
    period: "Mar 2024 — May 2024",
    points: [
      "Audited property listings against the company IT database for completeness and accuracy.",
      "Tracked website analytics and performed **SEO optimisation** to improve search ranking and client experience.",
      "Authored technical summaries documenting progress and promotional blog posts.",
    ],
    tags: ["SEO", "Analytics", "Database", "Technical Writing"],
  },
];
