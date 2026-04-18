import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import FadeInUp from "@/components/ui/FadeInUp";

export default function BlogPreview() {
  const posts = getAllPosts().slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white/[0.03] p-8 md:p-10">
        <FadeInUp>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Blog</h2>
          <p className="mt-2 text-muted">
            Recent thoughts and technical writing.
          </p>
        </FadeInUp>

        <div className="mt-12 space-y-6">
          {posts.map((post, i) => (
            <FadeInUp key={post.slug} delay={0.1 + i * 0.1}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <article className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-muted">
                  <time className="font-mono text-xs text-muted">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      timeZone: "UTC",
                    })}
                  </time>
                  <h3 className="mt-2 text-lg font-semibold text-foreground group-hover:text-white">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {post.excerpt}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted"
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
          <div className="mt-8 text-center">
            <Link
              href="/blog"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              View all posts &rarr;
            </Link>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
