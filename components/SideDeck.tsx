import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";
import { PublicationItem } from "@/components/PublicationItem";
import { ProjectFrontmatter } from "@/lib/mdx";
import { Publication } from "@/data/publications";

export function SideDeck({ projects, publications }: { projects: ProjectFrontmatter[]; publications: Publication[] }) {
  return (
    <section className="side-deck" id="work">
      <div className="side-deck-heading">
        <div>
          <p className="eyebrow">Selected research</p>
          <h2 className="section-title">Curiosity, put to work.</h2>
        </div>
        <p className="deck-side-indicator">RESEARCH</p>
      </div>

      <div className="side-card">
        <div className="side-stamp" aria-hidden="true">
          <div className="vinyl vinyl-a">
            <div className="vinyl-grooves"><span className="vinyl-label">FIELD<br /><b>R</b><small>RESEARCH</small></span></div>
          </div>
          <span className="side-caption">LISTEN · EXPLORE · DISCOVER</span>
        </div>

        <div className="side-content" aria-label="Research">
          <p className="eyebrow">Research</p>
          <h3 className="side-title">Ideas for technology that lives with us.</h3>
          <p className="side-description">I study how wearables, smart environments, and AI can sense context and support people in everyday life—from more natural interactions to systems that adapt with us.</p>
          <div className="side-projects">{projects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div>
          <div className="side-papers">
            <div className="side-subheading"><h4>On the record</h4><Link href="/publications" className="section-link">All publications ↗</Link></div>
            <div className="divide-y divide-line">{publications.map((publication) => <PublicationItem key={`${publication.title}-${publication.year}`} publication={publication} />)}</div>
          </div>
          <Link href="/research" className="side-more">Explore the research <span>↗</span></Link>
        </div>
      </div>
    </section>
  );
}
