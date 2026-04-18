import { events } from "@/content/events";
import FadeInUp from "@/components/ui/FadeInUp";

const TYPE_LABELS: Record<string, string> = {
  talk: "Talk",
  conference: "Conference",
  workshop: "Workshop",
  hackathon: "Hackathon",
  other: "Event",
};

export default function Events() {
  const upcoming = events.filter((e) => e.upcoming);
  const past = events.filter((e) => !e.upcoming);

  return (
    <section id="events" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white/[0.03] p-8 md:p-10">
        <FadeInUp>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Events</h2>
          <p className="mt-2 text-muted">
            Conferences, talks, and hackathons.
          </p>
        </FadeInUp>

        {upcoming.length > 0 && (
          <div className="mt-12">
            <FadeInUp>
              <p className="mb-4 font-mono text-xs tracking-widest text-muted uppercase">
                Upcoming
              </p>
            </FadeInUp>
            <div className="space-y-4">
              {upcoming.map((event, i) => (
                <FadeInUp key={event.title} delay={i * 0.1}>
                  <EventCard event={event} />
                </FadeInUp>
              ))}
            </div>
          </div>
        )}

        {past.length > 0 && (
          <div className="mt-12">
            <FadeInUp>
              <p className="mb-4 font-mono text-xs tracking-widest text-muted uppercase">
                Past
              </p>
            </FadeInUp>
            <div className="space-y-4">
              {past.map((event, i) => (
                <FadeInUp key={event.title} delay={i * 0.1}>
                  <EventCard event={event} />
                </FadeInUp>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function EventCard({ event }: { event: (typeof events)[number] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-muted">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/5 px-3 py-0.5 text-xs text-muted">
              {TYPE_LABELS[event.type]}
            </span>
            {event.upcoming && (
              <span className="rounded-full bg-blue-500/10 px-3 py-0.5 text-xs text-blue-400">
                Upcoming
              </span>
            )}
          </div>
          <h3 className="mt-2 text-base font-semibold text-foreground">
            {event.url ? (
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-white"
              >
                {event.title}
              </a>
            ) : (
              event.title
            )}
          </h3>
          <p className="mt-1 text-xs text-muted">{event.location}</p>
        </div>
        <time className="font-mono text-xs text-muted whitespace-nowrap">
          {new Date(event.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            timeZone: "UTC",
          })}
        </time>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        {event.description}
      </p>
    </div>
  );
}
