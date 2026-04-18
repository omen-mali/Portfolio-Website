export interface Event {
  title: string;
  type: "talk" | "conference" | "workshop" | "hackathon" | "other";
  date: string;
  location: string;
  description: string;
  url?: string;
  upcoming?: boolean;
}

export const events: Event[] = [
  {
    title: "Discover Technata Career Fair",
    type: "conference",
    date: "2026-03-31",
    location: "Ottawa, ON",
    description:
      "Networking and career opportunities with leading technology companies in the Ottawa region.",
    url: "https://www.discovertechnata.com/career-fair/",
    upcoming: false,
  },
  {
    title: "SCESoc — Ciena Coding Competition",
    type: "hackathon",
    date: "2026-03-26",
    location: "Ottawa, ON",
    description:
      "Coding event hosted by SCESoc in partnership with Ciena, featuring challenges for the WaveServer Mini simulator.",
  },
  {
    title: "MSA Hackathon — RoadSense",
    type: "hackathon",
    date: "2026-01-15",
    location: "Carleton University, Ottawa, ON",
    description:
      "Served as Backend/Systems Lead on a 4-person team building an AI road damage detection system using YOLOv8, OpenCV, and Supabase.",
  },
  {
    title: "Dev.0 Closing Ceremony — Best Demo Award",
    type: "other",
    date: "2026-02-03",
    location: "Carleton University, Ottawa, ON",
    description:
      "Attended the Dev.0 hackathon closing ceremony where a mentee group I guided won CGI's \"Best Demo\" award for TutorLink.",
  },
];
