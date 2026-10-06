import { ProjectCard } from "@/components/ProjectCard";
import { getProjectList } from "@/lib/mdx";

export const metadata = {
  title: "Projects"
};

export default function ProjectsPage() {
  const projects = getProjectList();

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-panel">
        <p className="eyebrow">Projects</p>
        <h1 className="mt-4 font-serif text-4xl text-ink">Research through working systems.</h1>
        <p className="mt-6 max-w-3xl leading-8 text-slate">
          From wearable sensing and gaze interaction to smart-home intelligence and AI-assisted programming, these projects explore how computation can fit naturally into daily life.
        </p>
      </section>
      <div className="grid gap-6 lg:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
