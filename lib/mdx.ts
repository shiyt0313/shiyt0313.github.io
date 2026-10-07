import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { getAssetPath } from "@/lib/assets";

type BaseFrontmatter = {
  title: string;
  slug: string;
  date: string;
  sortOrder?: number;
  tags?: string[];
};

export type ProjectFrontmatter = BaseFrontmatter & {
  status: string;
  showVenueBadge?: boolean;
  badgeTone?: "orange";
  award?: string;
  description: string;
  image?: string;
  links?: {
    label: string;
    href: string;
  }[];
};

export function getProjectList() {
  const directory = path.join(process.cwd(), "content", "projects");
  if (!fs.existsSync(directory)) return [];

  const projects = fs.readdirSync(directory)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const source = fs.readFileSync(path.join(directory, file), "utf8");
      const { data } = matter(source);
      const project = data as ProjectFrontmatter;
      return {
        ...project,
        image: project.image ? getAssetPath(project.image) : undefined
      };
    });

  return projects.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime() ||
    (a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
    a.slug.localeCompare(b.slug)
  );
}
