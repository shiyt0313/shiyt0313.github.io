import Image from "next/image";
import Link from "next/link";
import { ProjectFrontmatter } from "@/lib/mdx";
import { Tag } from "@/components/Tag";

export function ProjectCard({ project }: { project: ProjectFrontmatter }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white/80 transition hover:-translate-y-1 hover:shadow-panel">
      <Link href={`/projects/${project.slug}`} className="relative block aspect-[1.65] overflow-hidden bg-paper" aria-label={`Read about ${project.title}`}>
        {project.image ? <Image src={project.image} alt="" fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.03]" /> : <div className="grid h-full place-items-center font-serif text-4xl text-muted">{project.title}</div>}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[.14em] text-muted">{project.date}</p>
          <span className="text-[10px] font-semibold text-accent">{project.status}</span>
        </div>
        <h3 className="font-serif text-2xl tracking-tight text-ink"><Link href={`/projects/${project.slug}`} className="hover:text-accent">{project.title}</Link></h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-slate">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">{project.tags?.slice(0, 2).map((tag) => <Tag key={tag}>{tag}</Tag>)}</div>
      </div>
    </article>
  );
}
