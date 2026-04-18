import Link from "next/link";
import { getAllPosts, getAllTags } from "@/lib/blog";
import GradientText from "@/components/ui/GradientText";
import FadeInUp from "@/components/ui/FadeInUp";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogTagFilter from "@/components/sections/BlogTagFilter";

export const metadata = {
  title: "Blog | Momen Ali",
  description: "Thoughts on embedded systems, systems programming, and software engineering.",
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <>
      <Navbar />
      <main id="main-content" className="px-6 pt-32 pb-24">
        <div className="mx-auto max-w-3xl">
          <FadeInUp>
            <GradientText as="h1" breathe className="text-3xl font-bold md:text-4xl">
              Blog
            </GradientText>
            <p className="mt-4 text-muted">
              Thoughts on embedded systems, systems programming, and software
              engineering.
            </p>
          </FadeInUp>

          <FadeInUp delay={0.15}>
            <BlogTagFilter tags={tags} />
          </FadeInUp>

          <div className="mt-10 space-y-6">
            {posts.map((post, i) => (
              <FadeInUp key={post.slug} delay={0.1 + i * 0.08}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <article className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-muted">
                    <time className="font-mono text-xs text-muted">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <h2 className="mt-2 text-xl font-semibold text-foreground group-hover:text-white">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted"
                          data-tag={tag}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </article>
                </Link>
              </FadeInUp>
            ))}
          </div>

          <FadeInUp delay={0.4}>
            <div className="mt-12 text-center">
              <Link
                href="/"
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                &larr; Back to Home
              </Link>
            </div>
          </FadeInUp>
        </div>
      </main>
      <Footer />
    </>
  );
}
