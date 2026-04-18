export interface StatusItem {
  label: string;
  value: string;
  icon: string; // emoji or short icon text
}

export const statusItems: StatusItem[] = [
  {
    label: "Currently working on",
    value: "Firmware & code generation tools at Epocal, Siemens Healthineers",
    icon: "⚙️",
  },
  {
    label: "Currently learning",
    value: "STM32 simulation tools & ARM Virtual Hardware",
    icon: "📖",
  },
  {
    label: "Building",
    value: "Wi-Fi Spectrum Analyzer on QNX RTOS (Raspberry Pi 4)",
    icon: "📡",
  },
  {
    label: "Studying",
    value: "B.Eng. Computer Systems Engineering — Carleton University",
    icon: "🎓",
  },
];
