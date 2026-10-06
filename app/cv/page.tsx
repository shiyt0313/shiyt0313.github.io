import { getAssetPath } from "@/lib/assets";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "CV"
};

export default function CVPage() {
  return (
    <section className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-panel">
      <p className="eyebrow">Curriculum vitae</p>
      <h1 className="mt-4 font-serif text-4xl text-ink">Experience, education, and research.</h1>
      <p className="mt-6 max-w-2xl leading-8 text-slate">Download a current copy of my CV for details on my academic background, publications, and selected projects.</p>
      <div className="mt-8">
        <a
          className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white"
          href={getAssetPath(siteConfig.cv)}
          target="_blank"
        >
          Download CV
        </a>
      </div>
    </section>
  );
}
