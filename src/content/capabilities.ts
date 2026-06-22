// A deep-link from a capability card to supporting evidence elsewhere on the
// page — either a project card (by slug) or a specific experience bullet
// (by experience id + bullet index).
export type CapabilityLink =
  | { label: string; kind: "project"; slug: string }
  | { label: string; kind: "experience"; expId: string; point: number };

export interface Capability {
  title: string;
  // One-line proof statement — outcome-first, grounded in real work.
  proof: string;
  tags: string[];
  // Quick-links shown in the card footing — jump to the supporting evidence.
  links: CapabilityLink[];
}

// "What I do" — the At a Glance domain cards. Higher-level than the Skills
// toolkit: each card is a capability area with one concrete proof line and
// quick-links to the experience bullets / projects that back it up.
export const capabilities: Capability[] = [
  {
    title: "Embedded & Real-Time Systems",
    proof:
      "C/C++ firmware for the epoc® Blood Analysis System on a dual-core STM32 M7/M4 — plus QNX Neutrino real-time applications.",
    tags: ["C/C++", "STM32 M7/M4", "QNX Neutrino"],
    links: [
      { label: "epoc® firmware", kind: "experience", expId: "siemens", point: 0 },
      { label: "Wi-Fi Analyzer", kind: "project", slug: "wifi-spectrum-analyzer" },
    ],
  },
  {
    title: "Test & Tooling Automation",
    proof:
      "A C#/.NET code generator producing 100+ protocol artifacts per platform, and a ~17-step automated unit-test pipeline at Siemens Healthineers.",
    tags: ["C#/.NET", "Jenkins", "IAR"],
    links: [
      { label: "Code generator", kind: "experience", expId: "siemens", point: 1 },
      { label: "Test pipeline", kind: "experience", expId: "siemens", point: 3 },
    ],
  },
  {
    title: "Application Software & Platforms",
    proof:
      "Internal tooling and platform features in Java and C#/.NET — currently building automation for the CRA's Production Assurance testing platform.",
    tags: ["Java", "C#/.NET", "Azure DevOps"],
    links: [
      { label: "CRA platform", kind: "experience", expId: "cra", point: 0 },
    ],
  },
  {
    title: "AI & Data",
    proof:
      "YOLOv8 computer-vision pipelines and data tooling — RoadSense detects road damage from dashcam imagery.",
    tags: ["YOLOv8", "OpenCV", "Python"],
    links: [
      { label: "RoadSense", kind: "project", slug: "roadsense" },
    ],
  },
];
