export interface SkillCategory {
  name: string;
  skills: string[];
  strong?: string[]; // most-relevant items, highlighted first (purple)
}

export const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    strong: ["C", "C++", "C#", "Python", "Java"],
    skills: ["C", "C++", "C#", "Python", "Java", "Bash", "ARM Assembly", "SQL", "TypeScript"],
  },
  {
    name: "Embedded Systems & Hardware",
    strong: ["STM32 M7/M4 (H745)"],
    skills: [
      "STM32 M7/M4 (H745)",
      "TI-MSP432P401R",
      "Arduino UNO",
      "Raspberry Pi 4",
      "Keil uVision",
      "IAR Embedded Workbench",
    ],
  },
  {
    name: "Systems & RTOS",
    strong: ["QNX Neutrino", "Linux"],
    skills: ["QNX Neutrino", "QNX Momentics", "Linux", "POSIX"],
  },
  {
    name: "Frameworks & Tools",
    strong: [".NET", "Git", "NuGet", "Azure DevOps", "OpenXML"],
    skills: [
      ".NET",
      "OpenXML",
      "NuGet",
      "Maven",
      "Gradle",
      "JFrog Artifactory",
      "CMake",
      "Git",
      "Azure DevOps",
      "Jenkins",
      "SonarQube",
      "Docker",
    ],
  },
  {
    name: "AI & Data",
    strong: ["YOLOv8", "PostgreSQL"],
    skills: [
      "YOLOv8",
      "OpenCV",
      "HuggingFace",
      "NumPy",
      "Pandas",
      "Matplotlib",
      "PostgreSQL",
      "Supabase",
    ],
  },
  {
    name: "Practices",
    strong: ["Agile", "CI/CD", "UML"],
    skills: [
      "Agile",
      "CI/CD",
      "Unit & Integration Testing",
      "OOP Design Patterns",
      "UML",
      "FDA/GMP/ISO Compliance",
      "Technical Documentation",
    ],
  },
];
