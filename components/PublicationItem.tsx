import Link from "next/link";
import { Publication } from "@/data/publications";

export function PublicationItem({ publication, showYear = true }: { publication: Publication; showYear?: boolean }) {
  return (
    <article className="group flex flex-col gap-2 border-b border-line py-7 first:border-t md:flex-row md:items-start md:gap-8">
      <div className={`w-20 flex-none text-sm font-medium tabular-nums text-muted ${showYear ? "" : "hidden md:block"}`}>
        {showYear ? publication.year : null}
      </div>
      <div className="min-w-0 flex-1">
        <span className="mb-3 inline-flex rounded-full bg-[#386da5] px-3 py-1 text-sm font-semibold text-white">
          {publication.venue}
        </span>
        <h2 className="text-xl font-medium leading-snug tracking-tight text-ink">{publication.title}</h2>
        <p className="mt-2 text-base leading-7 text-slate">
          {publication.authors.map((author, index) => {
            const hasAsterisk = author.endsWith("*");
            const name = hasAsterisk ? author.slice(0, -1) : author;

            return (
              <span key={`${author}-${index}`}>
                {index > 0 ? ", " : null}
                {name === "Yingtian Shi" ? <strong className="font-semibold text-ink">{name}</strong> : name}
                {hasAsterisk ? <sup>*</sup> : null}
              </span>
            );
          })}
        </p>
        {publication.authorNote ? <p className="mt-1 text-sm text-muted">{publication.authorNote}</p> : null}
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-ink">
          {publication.paper ? <Link className="hover:text-accent" href={publication.paper} target="_blank">Paper ↗</Link> : null}
          {publication.code ? <Link className="hover:text-accent" href={publication.code} target="_blank">Code ↗</Link> : null}
        </div>
      </div>
    </article>
  );
}
