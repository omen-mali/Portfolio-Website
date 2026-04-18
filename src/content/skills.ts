export interface SkillCategory {
  name: string;
  skills: string[];
}

const SHOW_PRACTICES = false;

export const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    skills: ["C", "C++", "C#", "Python", "Java", "Bash", "ARM Assembly"],
  },
  {
    name: "Embedded Systems & Hardware",
    skills: [
      "TI-MSP432P401R",
      "STM32 M7/M4",
      "Arduino UNO",
      "Raspberry Pi 4",
      "Keil uVision",
      "IAR Embedded Workbench",
    ],
  },
  {
    name: "Systems & RTOS",
    skills: [
      "QNX Neutrino",
      "QNX Momentics",
      "Linux",
    ],
  },
  {
    name: "Frameworks & Tools",
    skills: [
      ".NET",
      "Git",
      "Azure DevOps",
      "CMake",
      "Docker",
      "Jenkins",
    ],
  },
  {
    name: "AI & Data",
    skills: [
      "YOLOv8",
      "OpenCV",
      "HuggingFace",
      "NumPy",
      "Pandas",
      "Matplotlib",
      "PostgreSQL",
    ],
  },
  ...(SHOW_PRACTICES
    ? [
        {
          name: "Practices",
          skills: [
            "Agile / Scrum",
            "CI/CD",
            "Unit & Integration Testing",
            "OOP Design Patterns",
            "UML",
            "FDA/GMP/ISO Compliance",
            "Technical Documentation",
          ],
        },
      ]
    : []),
];
