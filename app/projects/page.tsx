import { ProjectCard } from "@/components/ProjectCard";
import { getProjectList } from "@/lib/mdx";

export const metadata = {
  title: "Projects"
};

export default function ProjectsPage() {
  const projects = getProjectList();

  return (
    <div className="space-y-8">
      <section className="projects-page-intro px-8 py-4">
        <h1 className="text-ink">From human dynamics to adaptive AI.</h1>
        <p className="mt-6 max-w-5xl text-slate">
          From wearables and smart homes to gaze interaction and learning, these projects use multimodal sensing and time-series learning to understand human behavior in context. They also explore how AI agents and interactive systems can turn that understanding into adaptive support that evolves with people.
        </p>
      </section>
      <div className="flex flex-col gap-5">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} variant="feature" />
        ))}
      </div>
    </div>
  );
}
