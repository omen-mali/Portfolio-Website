import Image from "next/image";
import { projects } from "@/content/projects";
import FadeInUp from "@/components/ui/FadeInUp";

export default function Projects() {
  return (
    <section id="projects" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <FadeInUp>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Projects</h2>
          <p className="mt-4 max-w-xl text-muted">
            A selection of personal projects spanning embedded systems,
            real-time OS development, and applied machine learning.
          </p>
        </FadeInUp>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <FadeInUp key={project.slug} delay={i * 0.1}>
              <a
                href={project.github && project.github !== "#" ? project.github : undefined}
                target={project.github && project.github !== "#" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={`group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-muted ${project.github && project.github !== "#" ? "cursor-pointer" : "cursor-default"}`}
              >
                {project.image && (
                  <div className="relative h-40 w-full overflow-hidden bg-white/5">
                    <Image
                      src={project.image}
                      alt={`Preview of ${project.title}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    {project.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {project.github && project.github !== "#" && (
                    <p className="mt-4 text-xs text-muted/60 group-hover:text-muted transition-colors">
                      View on GitHub →
                    </p>
                  )}
                </div>
              </a>
            </FadeInUp>
          ))}
        </div>

        <FadeInUp delay={0.3}>
          <p className="mt-8 text-sm text-muted/50 italic">
            More to be added soon...
          </p>
        </FadeInUp>
      </div>
    </section>
  );
}
