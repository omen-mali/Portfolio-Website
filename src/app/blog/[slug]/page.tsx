import { notFound } from "next/navigation";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import { getPostBySlug, getPostSlugs } from "@/lib/blog";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export async function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const { meta } = getPostBySlug(slug);
    return {
      title: `${meta.title} | Momen Ali`,
      description: meta.excerpt,
    };
  } catch {
    return { title: "Post Not Found" };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  const { content } = await compileMDX({
    source: post.content,
    options: {
      mdxOptions: {
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: "github-dark-dimmed",
              keepBackground: true,
            },
          ],
        ],
      },
    },
  });

  return (
    <>
      <Navbar />
      <main id="main-content" className="px-6 pt-32 pb-24">
        <article className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            &larr; Back to Blog
          </Link>

          <header className="mt-8">
            <time className="font-mono text-xs text-muted">
              {new Date(post.meta.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "UTC",
              })}
            </time>
            <h1 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">
              {post.meta.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2">
              {post.meta.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="prose-custom mt-12">{content}</div>
        </article>
      </main>
      <Footer />
    </>
  );
}
