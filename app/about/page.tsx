import Image from "next/image";
import { getAssetPath } from "@/lib/assets";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "About"
};

export default function AboutPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <section className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-panel">
        <Image
          alt="Yingtian Shi"
          className="h-36 w-36 rounded-full object-cover"
          height={144}
          src={getAssetPath("/images/profile.png")}
          width={144}
        />
        <p className="eyebrow">About</p>
        <h1 className="mt-4 font-serif text-4xl text-ink">Research grounded in real life.</h1>
        <p className="mt-6 leading-8 text-slate">
            I’m Yingtian Shi, a PhD student in Computer Science at Georgia Tech, advised by
          {` ${siteConfig.advisor}`}. My research interests lie in ubiquitous computing and AI, specifically in Human-AI
          co-evolution.
        </p>
      </section>

      <section className="space-y-6">
        <div className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-panel">
          <h2 className="font-serif text-2xl text-ink">Education</h2>
          <p className="mt-4 leading-8 text-slate">
            I study how intelligent systems can sense context and collaborate with people across wearables, smart homes, and interactive tools.
          </p>
        </div>
        <div className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-panel">
          <h2 className="font-serif text-2xl text-ink">Research Background</h2>
          <p className="mt-4 leading-8 text-slate">
            My work sits at the intersection of ubiquitous computing and AI. I build interactive sensing systems and study
            how intelligent models can collaborate with users in context-aware, deployable environments, including wearables,
            smart homes, gaze interfaces, and multimodal programming tools.
          </p>
        </div>
        <div className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-panel">
          <h2 className="font-serif text-2xl text-ink">Advisor and Lab</h2>
          <p className="mt-4 leading-8 text-slate">
            My work spans ubiquitous computing, multimodal interaction, and human-AI collaboration, with an emphasis on systems that work beyond the lab.
          </p>
        </div>
        <div className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-panel">
          <h2 className="font-serif text-2xl text-ink">Academic Interests</h2>
          <p className="mt-4 leading-8 text-slate">
            Focus areas include human-AI collaboration, situated intelligence, multimodal sensing, wearable interfaces,
            smart-home activity recognition, and everyday health technologies.
          </p>
        </div>
      </section>
    </div>
  );
}
