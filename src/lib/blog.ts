import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  coverImage?: string;
}

function getPostsDir(): string {
  // Try process.cwd() first (works when cwd IS the project root)
  const cwdPosts = path.join(process.cwd(), "src", "posts");
  if (fs.existsSync(cwdPosts)) return cwdPosts;

  // If launched with `next dev <dir>`, cwd is parent — look in subdirectories
  const entries = fs.readdirSync(process.cwd(), { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const candidate = path.join(process.cwd(), entry.name, "src", "posts");
      if (fs.existsSync(candidate)) return candidate;
    }
  }

  // Fallback
  return cwdPosts;
}

const POSTS_DIR = getPostsDir();

export function getPostSlugs(): string[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getPostBySlug(slug: string): {
  meta: PostMeta;
  content: string;
} {
  // Reject anything that isn't a simple slug, and confirm the resolved path
  // stays inside POSTS_DIR — prevents path traversal (e.g. "../../etc/passwd").
  if (!/^[a-z0-9-]+$/i.test(slug)) {
    throw new Error(`Invalid post slug: ${slug}`);
  }
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (!path.resolve(filePath).startsWith(path.resolve(POSTS_DIR) + path.sep)) {
    throw new Error(`Invalid post slug: ${slug}`);
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    meta: {
      slug,
      title: data.title ?? "Untitled",
      date: data.date ?? "",
      tags: data.tags ?? [],
      excerpt: data.excerpt ?? "",
      coverImage: data.coverImage,
    },
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  return getPostSlugs()
    .map((slug) => getPostBySlug(slug).meta)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  getAllPosts().forEach((post) => post.tags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}
