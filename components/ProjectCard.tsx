import Image from "next/image";
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

export function ProjectCard({ project, variant = "grid" }: { project: ProjectFrontmatter; variant?: "grid" | "feature" }) {
  const paperLink = project.links?.find((link) => /paper|preprint|arxiv|pdf/i.test(link.label) || /arxiv\.org|\.pdf(?:$|[?#])/i.test(link.href));
  const videoLink = project.links?.find((link) => /video/i.test(link.label));
  const paperLabel = paperLink && /\.pdf(?:$|[?#])/i.test(paperLink.href) ? "PDF" : paperLink && /arxiv\.org|arxiv\./i.test(paperLink.href) ? "arXiv" : "Paper";
  const venueLabel = formatProjectStatus(project.status);
  const isPublished = /^Accepted by\b|^Published\b|^(?:ACM|IEEE)\b/i.test(project.status);
  const content = (
    <>
      <div className="project-card-meta">
        <time dateTime={project.date}>{formatProjectMonth(project.date)}</time>
        {variant === "feature"
          ? project.tags?.map((tag) => <span className="project-card-status" key={tag}>{tag}</span>)
          : <span className={isPublished ? "project-card-status project-card-status-published" : "project-card-status"}>{venueLabel}</span>}
      </div>
      {variant === "feature"
        ? <h2 className="project-feature-title">{project.title}</h2>
        : <h3 className="font-serif text-2xl tracking-tight text-ink">{project.title}</h3>}
      {variant === "grid" && project.tags?.length ? <p className="project-grid-tags">{project.tags.join(" · ")}</p> : null}
      <p className={variant === "feature" ? "project-feature-description" : "mt-3 text-sm leading-6 text-slate"}>{project.description}</p>
      {(paperLink || videoLink) && <div className="project-card-footer">
        {paperLink
          ? <a href={paperLink.href} target="_blank" rel="noopener noreferrer"><span className="project-card-link-label">{paperLabel}</span><svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg></a>
          : null}
        {videoLink && <a href={videoLink.href} target="_blank" rel="noopener noreferrer"><span className="project-card-link-label">Video</span><svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg></a>}
      </div>}
    </>
  );

  if (variant === "feature") {
    return (
      <article className="project-feature group">
        {(project.showVenueBadge !== false || project.award) && <div className="project-badges">
          {project.showVenueBadge !== false && <span className={project.badgeTone === "orange" ? "project-venue-badge project-venue-badge-orange" : "project-venue-badge"}>{venueLabel}</span>}
          {project.award && <span className="project-award-badge" tabIndex={0} role="img" aria-label={project.award}>
            <span aria-hidden="true">🏆</span>
            <span className="project-award-tooltip" aria-hidden="true">{project.award}</span>
          </span>}
        </div>}
        <div className="project-feature-media">
          {project.image
            ? <span className="project-feature-image-frame"><Image src={project.image} alt="" fill sizes="(max-width: 767px) 100vw, 56vw" className="project-feature-image" /></span>
            : <span className="project-feature-placeholder">{project.title}</span>}
        </div>
        <div className="project-feature-copy">{content}</div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white/80 transition hover:-translate-y-1 hover:shadow-panel">
      <div className="project-card-media">
        <span className="project-card-artwork">
          {project.image ? <Image src={project.image} alt="" fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="project-card-image" /> : <span className="grid h-full place-items-center px-5 text-center font-serif text-4xl leading-tight text-muted">{project.title}</span>}
        </span>
      </div>
      <div className="project-card-copy flex flex-1 flex-col p-5">{content}</div>
    </article>
  );
}
