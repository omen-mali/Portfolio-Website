export interface Contributor {
  name: string;
  username: string; // bare handle, no @
  href: string;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  image?: string;
  contributors?: Contributor[]; // optional — credited collaborators shown when expanded
}

// Removed (non-personal): epoc® Protocol Code Generator, OS Process Scheduling Simulator
// Removed (to be re-added later): Real-Time Embedded Systems Lab, ARM Processor Design
export const projects: Project[] = [
  {
    slug: "wifi-spectrum-analyzer",
    title: "Wi-Fi Spectrum Analyzer",
    description:
      "Multi-threaded real-time application on QNX Neutrino RTOS targeting Raspberry Pi 4. Producer-consumer architecture with POSIX pthreads, priority inheritance mutexes, and deterministic scheduling (SCHED_FIFO/SCHED_RR). Integrates wpa_supplicant for spectrum-aware Wi-Fi channel analysis.",
    tags: ["C", "QNX", "POSIX", "Raspberry Pi 4", "CMake"],
    github: "https://github.com/omen-mali/RPI4-Wi-Fi-Spectrum-Analyzer",
    image: "/images/projects/embedded-controller.svg",
  },
  {
    slug: "arduino-temperature-pressure-sensor",
    title: "Room Temperature & Pressure Sensor",
    description:
      "Embedded room temperature and pressure sensor on the Arduino UNO, using analog & digital sensors and LCD display. Work in progress: Implement IoT capabilities with ESP8266.",
    tags: ["C", "Arduino UNO", "avr-gcc", "PlatformIO"],
    github: "https://github.com/omen-mali/Arduino-Temperature-Pressure-Sensor",
    image: "/images/projects/embedded-controller.svg",
  },
  {
    slug: "roadsense",
    title: "RoadSense — AI Road Damage Detection",
    description:
    "Backend/Systems lead for an MSA Hackathon project. Built a YOLOv8 inference engine with HuggingFace integration, weighted severity scoring, and a 6-step modular pipeline processing dashcam footage into geolocated detection records stored in Supabase (PostgreSQL).\n\nCredits to Omar Ibrahim for substantial work on this project, alongside teammates Abdullah Khan and Musa Sandhu.",
    tags: ["Python", "YOLOv8", "OpenCV", "PostgreSQL", "HuggingFace"],
    github: "https://github.com/omaribrahim6/roadsense",
    image: "/images/projects/automation.svg",
    contributors: [
      { name: "Omar Ibrahim",   username: "omaribrahim6",      href: "https://github.com/omaribrahim6" },
      { name: "Abdullah Khan",  username: "abkhan0517",         href: "https://github.com/abkhan0517" },
      { name: "Musa Sandhu",    username: "sandhumusa10-stack", href: "https://github.com/sandhumusa10-stack" },
    ],
  },
];
