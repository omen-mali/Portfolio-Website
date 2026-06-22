import type { ReactNode } from "react";
import FadeInUp from "@/components/ui/FadeInUp";
import PhotoSlot from "@/components/ui/PhotoSlot";
import SectionHeading from "@/components/ui/SectionHeading";

interface Interest {
  label: string;
  blurb: string;
  icon: ReactNode;
}

// Icons scale with the viewport (clamp) so they stay proportional to the ring
// and the photo column as the window narrows.
const ICON_CLASS = "h-[clamp(16px,1.9vw,24px)] w-[clamp(16px,1.9vw,24px)]";

const bikeIcon = (
  <svg className={ICON_CLASS} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="18.5" cy="17.5" r="3.5" />
    <circle cx="5.5" cy="17.5" r="3.5" />
    <circle cx="15" cy="5" r="1" />
    <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
  </svg>
);

const gamepadIcon = (
  <svg className={ICON_CLASS} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 12h4M8 10v4" />
    <circle cx="15" cy="11" r="1" />
    <circle cx="18" cy="13.5" r="1" />
    <rect x="2" y="6" width="20" height="12" rx="6" />
  </svg>
);

const cpuIcon = (
  <svg className={ICON_CLASS} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
  </svg>
);

const INTERESTS: Interest[] = [
  {
    label: "Cycling",
    blurb: "Long rides around the city trails to clear my head and get in some cardio.",
    icon: bikeIcon,
  },
  {
    label: "Gaming",
    blurb: "Action and strategy games on my PC and favourite handhelds.",
    icon: gamepadIcon,
  },
  {
    label: "Tinkering",
    blurb: "Side projects on microcontrollers and personal hardware mods.",
    icon: cpuIcon,
  },
];

export default function Interests() {
  return (
    <section id="interests" className="section-alt px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-[1700px]">
        <SectionHeading
          kicker="Interests"
          title="Off the clock."
          subtitle="A few things that keep me busy away from the keyboard."
        />

        {/* Tall portrait photo (1/3) with the three interest items filling
            the remaining 2/3. */}
        <div className="mx-auto mt-12 grid max-w-[1480px] gap-4 sm:grid-cols-3 sm:items-center">
          <FadeInUp>
            <figure>
              <PhotoSlot src="/images/photos/ferrari.jpg" caption="Off the clock" className="aspect-[3/4] w-full" />
              <figcaption className="mt-2.5 text-center text-sm font-medium text-muted">
                At the Ottawa Ferrari Festival
              </figcaption>
            </figure>
          </FadeInUp>

          {/* Items vertically centered against the headshot (not stretched to
              its top/bottom edges); consistent spacing between them. */}
          <FadeInUp delay={0.1} className="sm:col-span-2">
            {/* clamp() sizing keeps the items proportional to the photo column
                as the viewport narrows — everything shrinks together. */}
            <div className="flex flex-col gap-[clamp(0.85rem,1.7vw,1.4rem)]">
              {INTERESTS.map((it) => (
                <div
                  key={it.label}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card px-[clamp(1.1rem,2vw,1.65rem)] py-[clamp(0.75rem,1.4vw,1.15rem)] transition-[border-color,box-shadow] hover:border-violet-400/60 hover:ring-1 hover:ring-violet-400/40"
                >
                  <span className="flex h-[clamp(2.5rem,4.1vw,3.25rem)] w-[clamp(2.5rem,4.1vw,3.25rem)] shrink-0 items-center justify-center rounded-full bg-gradient-to-t from-indigo-500 via-violet-600 to-violet-400 p-[1.5px] icon-gradient-ring">
                    <span className="flex h-full w-full items-center justify-center rounded-full bg-card text-violet-300">
                      {it.icon}
                    </span>
                  </span>
                  <div>
                    <h3 className="text-[clamp(14px,1.3vw,16px)] font-semibold text-foreground">{it.label}</h3>
                    <p className="mt-0.5 text-[clamp(13px,1.15vw,15px)] leading-relaxed text-muted">{it.blurb}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
}
