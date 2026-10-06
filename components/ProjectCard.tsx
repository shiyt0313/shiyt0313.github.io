import Image from "next/image";
import Link from "next/link";
import type { ProjectFrontmatter } from "@/lib/mdx";

function formatProjectMonth(date: string) {
  const [year, month] = date.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(Date.UTC(year, month - 1, 1)));
}

function formatProjectStatus(status: string) {
  const venue = status.replace(/^Accepted by\s+/, "");
  if (venue === status) return status;
  return /^(CHI|UIST|IMWUT)\b/.test(venue) ? `ACM ${venue}` : venue;
}

export function ProjectCard({ project }: { project: ProjectFrontmatter }) {
  const paperLink = project.links?.find((link) => /paper|preprint|arxiv/i.test(link.label) || /arxiv\.org/i.test(link.href));
  const paperLabel = paperLink && /arxiv\.org|arxiv\./i.test(paperLink.href) ? "arXiv" : "Paper";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white/80 transition hover:-translate-y-1 hover:shadow-panel">
      <Link href={`/projects/${project.slug}`} className="project-card-media" aria-label={`Read about ${project.title}`}>
        <span className="project-card-artwork">
          {project.image ? <Image src={project.image} alt="" fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="project-card-image" /> : <span className="grid h-full place-items-center font-serif text-4xl text-muted">{project.title}</span>}
        </span>
      </Link>
      <div className="project-card-copy flex flex-1 flex-col p-5">
        <div className="project-card-meta">
          <time dateTime={project.date}>{formatProjectMonth(project.date)}</time>
          <span className="project-card-status">{formatProjectStatus(project.status)}</span>
        </div>
        <h3 className="font-serif text-2xl tracking-tight text-ink"><Link href={`/projects/${project.slug}`} className="hover:text-accent">{project.title}</Link></h3>
        <p className="mt-3 text-sm leading-6 text-slate">{project.description}</p>
        <div className="project-card-footer">
          {paperLink
            ? <a href={paperLink.href} target="_blank" rel="noopener noreferrer">{paperLabel} <span aria-hidden="true">↗</span></a>
            : <Link href={`/projects/${project.slug}`}>Project details <span aria-hidden="true">→</span></Link>}
        </div>
      </div>
    </article>
  );
}
