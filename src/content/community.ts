export interface CommunityLink {
  label: string;
  href: string;
}

export interface CommunityPhoto {
  src?: string; // drop a file in /public/images/photos and set its path here
  caption: string;
}

export interface CommunityRole {
  role: string;
  org: string;
  period: string;
  description: string;
  tags: string[];
  bilingual?: boolean; // surfaces an EN/FR badge
  links?: CommunityLink[];
  photo?: CommunityPhoto;
}

// Community & giving-back involvement — kept separate from professional
// Experience so the people-facing work is framed on its own terms.
export const communityRoles: CommunityRole[] = [
  {
    role: "Mentorship Program",
    org: "Jaku Konbit",
    period: "Mar 2021 — Present",
    description:
      "Long-standing participant and volunteer in Jaku Konbit's community mentorship program, supporting youth mentorship and community-education initiatives across Ottawa.",
    tags: ["Mentorship", "Community", "Volunteering"],
    links: [
      { label: "Mentorship Program", href: "https://jakukonbit.com/mentorship/" },
    ],
    photo: { caption: "Jaku Konbit mentorship" },
  },
  {
    role: "Africa in Ottawa Project",
    org: "Jaku Konbit · Sankofa Community Courses",
    period: "Dec 2024 — Mar 2025",
    description:
      "Participated in weekly African-history seminars for the Africa in Ottawa Project, delivering three presentations regarding African history and the diaspora, in partnership with Dr. Clyde Ledbetter Jr.'s Sankofa Community Courses — supporting youth-led research and presentations.",
    tags: ["Facilitation", "Community Education", "History"],
    links: [
      { label: "Sankofa Courses", href: "https://clyde-s-school.thinkific.com/collections/courses" },
      { label: "Lukasa Library", href: "https://www.instagram.com/lukasa.library/" },
    ],
    photo: { caption: "Africa in Ottawa Project" },
  },
  {
    role: "Black Star Tutoring",
    org: "Jaku Konbit",
    period: "Feb 2026 — Present",
    bilingual: true,
    description:
      "Providing bilingual (EN/FR) mathematics and calculus tutoring to high-school and elementary students through the Black Star Tutoring Program, working one-on-one to identify gaps and build confidence.",
    tags: ["Tutoring", "Bilingual EN/FR", "Mathematics"],
    links: [
      { label: "Black Star Tutoring", href: "https://jakukonbit.com/black-star-tutoring/" },
    ],
    photo: { caption: "Black Star Tutoring" },
  },
  {
    role: "Dev.0 Hackathon Mentor",
    org: "SCESoc · Carleton University",
    period: "Oct 2025 — Feb 2026",
    description:
      "Mentored three groups of 1st–3rd-year Computer/Software Engineering and Computer Science students through a three-month hackathon, from idea conception to final demo. Ran weekly check-ins, kept teams on track with regular Git commits, and helped scope ideas to a realistic timeline. One mentee group's project, TutorLink, won CGI's “Best Demo” award.",
    tags: ["Mentorship", "Git", "Project Scoping"],
    links: [
      { label: "Dev.0 Program", href: "https://www.scesoc.ca/2025/10/09/dev-0-project-program/" },
      { label: "Closing Ceremony", href: "https://www.linkedin.com/posts/momen-m-ali_on-feb-2-i-had-the-great-opportunity-to-activity-7425194472759803904-szTo?utm_source=share&utm_medium=member_desktop&rcm=ACoAADa2vQ8B19NQCG_HGI_XEslUiylNjc1eK1M" },
    ],
    photo: { caption: "Dev.0 closing ceremony" },
  },
  {
    role: "Peer Mentor — First Year Connections",
    org: "Carleton University",
    period: "Sep 2024 — Oct 2024 · Sep 2025 — Oct 2025",
    bilingual: false,
    description:
      "Mentored incoming first-year Engineering students across two cohorts, holding weekly one-on-one meetings with up to five mentees to support their transition into university. Provided advice from lived experience, referred students to campus resources, and documented progress in weekly reports.",
    tags: ["Mentoring", "Communication", "Leadership"],
    links: [
      { label: "FYC Program", href: "https://carleton.ca/seo/first-year-connections/" },
    ],
    photo: { caption: "FYC mentoring" },
  },
  {
    role: "Accountability Officer",
    org: "SCESoc · Carleton University",
    period: "Oct 2025 — Apr 2026",
    description:
      "Collected and managed anonymous feedback and complaints from the society's membership through an open channel and during general meetings. Maintained regular communication with the President and relayed structured feedback to executives, handling sensitive input with discretion.",
    tags: ["Governance", "Feedback", "Discretion"],
  },
];
