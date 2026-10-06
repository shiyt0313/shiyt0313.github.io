import fs from "node:fs";
import path from "node:path";
import { compileMDX } from "next-mdx-remote/rsc";
import matter from "gray-matter";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { getAssetPath } from "@/lib/assets";
import { getMDXComponents } from "@/mdx-components";

type BaseFrontmatter = {
  title: string;
  slug: string;
  date: string;
  tags?: string[];
};

export type ProjectFrontmatter = BaseFrontmatter & {
  status: string;
  description: string;
  image?: string;
  links?: {
    label: string;
    href: string;
  }[];
};

export type BlogFrontmatter = BaseFrontmatter & {
  summary: string;
};

type ContentKind = "projects" | "blog";

function getContentDirectory(kind: ContentKind) {
  return path.join(process.cwd(), "content", kind);
}

function readMdxFile(kind: ContentKind, slug: string) {
  const fullPath = path.join(getContentDirectory(kind), `${slug}.mdx`);
  return fs.readFileSync(fullPath, "utf8");
}

function getSlugs(kind: ContentKind) {
  const dir = getContentDirectory(kind);
  if (!fs.existsSync(dir)) {
    return [];
  }

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

function sortByDate<T extends BaseFrontmatter>(items: T[]) {
  return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function normalizeFrontmatterAssets<T extends BaseFrontmatter>(frontmatter: T) {
  if ("image" in frontmatter && typeof frontmatter.image === "string") {
    return {
      ...frontmatter,
      image: getAssetPath(frontmatter.image)
    };
  }

  return frontmatter;
}

function getFrontmatterList<T extends BaseFrontmatter>(kind: ContentKind) {
  const entries = getSlugs(kind).map((slug) => {
    const file = readMdxFile(kind, slug);
    const { data } = matter(file);
    return normalizeFrontmatterAssets(data as T);
  });

  return sortByDate(entries);
}

async function getEntry<T extends BaseFrontmatter>(kind: ContentKind, slug: string) {
  const source = readMdxFile(kind, slug);
  const { frontmatter, content } = await compileMDX<T>({
    source,
    components: getMDXComponents(),
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug]
      }
    }
  });

  return {
    frontmatter: normalizeFrontmatterAssets(frontmatter),
    content
  };
}

export function getProjectList() {
  return getFrontmatterList<ProjectFrontmatter>("projects");
}

export function getBlogList() {
  return getFrontmatterList<BlogFrontmatter>("blog");
}

export async function getProjectBySlug(slug: string) {
  return getEntry<ProjectFrontmatter>("projects", slug);
}

export async function getBlogBySlug(slug: string) {
  return getEntry<BlogFrontmatter>("blog", slug);
}

export function getProjectSlugs() {
  return getSlugs("projects");
}

export function getBlogSlugs() {
  return getSlugs("blog");
}
