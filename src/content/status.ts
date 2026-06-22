export interface StatusItem {
  label: string;
  value: string;
  icon: string; // emoji or short icon text
}

export const statusItems: StatusItem[] = [
  {
    label: "Currently working on",
    value: "Features and automation for the PA testing platform (Java) at the CRA",
    icon: "⚙️",
  },
  {
    label: "Currently learning",
    value: "Test automation & Jenkins CI pipelines",
    icon: "📖",
  },
  {
    label: "Building",
    value: "Personal Raspberry Pi 4 / STM32 embedded projects",
    icon: "📡",
  },
  {
    label: "Studying",
    value: "B.Eng. Computer Systems Engineering — Carleton University",
    icon: "🎓",
  },
];
