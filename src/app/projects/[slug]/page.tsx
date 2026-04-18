import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { projects } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: `${project.title} | Momen Ali`,
    description: project.description,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <>
      <Navbar />
      <main id="main-content" className="px-6 pt-32 pb-24">
        <article className="mx-auto max-w-3xl">
          <Link
            href="/#projects"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            &larr; Back to Projects
          </Link>

          {project.image && (
            <div className="relative mt-8 h-56 w-full overflow-hidden rounded-xl bg-white/5 md:h-72">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          <header className="mt-8">
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              {project.title}
            </h1>
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
          </header>

          <p className="mt-8 text-base leading-relaxed text-muted">
            {project.description}
          </p>

          {(project.github || project.demo) && (
            <div className="mt-10 flex flex-wrap gap-4">
              {project.github && project.github !== "#" && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-border px-5 py-2.5 text-sm text-muted transition-colors hover:border-muted hover:bg-white/5"
                >
                  GitHub &rarr;
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-transform hover:scale-105"
                >
                  Live Demo &rarr;
                </a>
              )}
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
