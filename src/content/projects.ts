export interface Contributor {
  name: string;
  username: string; // bare handle, no @
  href: string;
}

export type ProjectCategory = "Personal" | "Academic" | "Work" | "Hackathon";

export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  category?: ProjectCategory;
  specifier?: "Personal" | "Team"; // solo vs. collaborative effort
  course?: string; // course code for academic projects (e.g. "SYSC 4001")
  placement?: string; // optional standing/award (e.g. hackathon placement)
  github?: string;
  demo?: string;
  image?: string;
  contributors?: Contributor[]; // optional — credited collaborators shown when expanded
}

// Work deliverables (epoc Code Generator, Reader UT Automation) live in the
// Experience section to avoid duplication. These are personal/academic builds.
export const projects: Project[] = [
  {
    slug: "wifi-spectrum-analyzer",
    title: "Wi-Fi Spectrum Analyzer",
    category: "Personal",
    specifier: "Personal",
    description:
      "Multi-threaded real-time application on QNX Neutrino RTOS targeting Raspberry Pi 4. Producer-consumer architecture with POSIX pthreads, priority inheritance mutexes, and deterministic scheduling (SCHED_FIFO/SCHED_RR). Integrates wpa_supplicant for spectrum-aware Wi-Fi channel analysis.",
    tags: ["C", "QNX", "POSIX", "Raspberry Pi 4", "CMake"],
    github: "https://github.com/omen-mali/RPI4-Wi-Fi-Spectrum-Analyzer",
    image: "/images/projects/embedded-controller.svg",
  },
  {
    slug: "roadsense",
    title: "RoadSense — AI Road Damage Detection",
    category: "Hackathon",
    specifier: "Team",
    placement: "2nd Place — MSA Hack-The-Future",
    description:
      "Backend/Systems lead for an MSA Hackathon project. Built a YOLOv8 inference engine with HuggingFace integration, weighted severity scoring, and a 6-step modular pipeline processing dashcam footage into geolocated detection records stored in Supabase (PostgreSQL).",
    tags: ["Python", "YOLOv8", "OpenCV", "PostgreSQL", "HuggingFace"],
    github: "https://github.com/omaribrahim6/roadsense",
    image: "/images/projects/automation.svg",
    contributors: [
      { name: "Omar Ibrahim",   username: "omaribrahim6",      href: "https://github.com/omaribrahim6" },
      { name: "Abdullah Khan",  username: "abkhan0517",         href: "https://github.com/abkhan0517" },
      { name: "Musa Sandhu",    username: "sandhumusa10-stack", href: "https://github.com/sandhumusa10-stack" },
    ],
  },
  {
    slug: "os-scheduling-simulator",
    title: "OS Process Scheduling Simulator",
    category: "Academic",
    specifier: "Personal",
    course: "SYSC 4001",
    description:
      "Discrete-event CPU scheduling simulator in C implementing multiple algorithms (Round Robin, FCFS, and priority-based scheduling), tracking real-time metrics — CPU utilisation, system calls, and I/O — to formatted output. A Python/Matplotlib layer visualises and compares scheduling performance. Includes multi-process work with fork/exec, semaphores, and shared memory on Linux.",
    tags: ["C", "Python", "Linux", "Matplotlib", "Concurrency"],
    image: "/images/projects/kernel-module.svg",
  },
  {
    slug: "rt-systems-lab-msp432",
    title: "Real-Time Systems Lab — MSP432",
    category: "Academic",
    specifier: "Personal",
    course: "SYSC 3310",
    description:
      "Bare-metal embedded C on the TI-MSP432P401R, advancing from register-level I/O and polling to interrupt-driven systems using timer and pin interrupts. Final exercises introduced multithreading and mutex synchronisation under QNX Neutrino RTOS. Debugged hardware-software timing in Keil µVision.",
    tags: ["Embedded C", "MSP432", "Interrupts", "QNX", "Keil"],
    image: "/images/projects/firmware.svg",
  },
  {
    slug: "arm-processor-design",
    title: "ARM Processor Design",
    category: "Academic",
    specifier: "Personal",
    course: "SYSC 2320",
    description:
      "Built a basic ARM processor in Logisim from building-block components (latches/flip-flops, ALU, ROM, memory), incrementally adding functionality and instructions per lab. Wrote ARM assembly and used a custom compiler to convert it into processor instructions, interpreting binary and hexadecimal encodings.",
    tags: ["ARM Assembly", "Logisim", "Computer Architecture"],
    image: "/images/projects/monitor.svg",
  },
];
