import Link from "next/link";
import { Publication } from "@/data/publications";

export function PublicationItem({ publication }: { publication: Publication }) {
  return (
    <article className="group flex flex-col gap-3 py-6 md:flex-row md:items-start md:gap-8">
      <div className="w-20 flex-none text-sm font-semibold tabular-nums text-muted">{publication.year}</div>
      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-xl leading-snug tracking-tight text-ink">{publication.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate">{publication.authors.join(", ")}</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[.1em] text-accent">{publication.venue}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-muted">
          {publication.paper ? <Link className="hover:text-accent" href={publication.paper} target="_blank">Paper ↗</Link> : null}
          {publication.code ? <Link className="hover:text-accent" href={publication.code} target="_blank">Code ↗</Link> : null}
          {publication.project ? <Link className="hover:text-accent" href={publication.project}>Project ↗</Link> : null}
        </div>
      </div>
      {publication.selected ? <span className="hidden rounded-full bg-accentSoft/70 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent md:block">Selected</span> : null}
    </article>
  );
}
