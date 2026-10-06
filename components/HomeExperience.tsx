"use client";

import Image from "next/image";
import Link from "next/link";
import { SideDeck } from "@/components/SideDeck";
import { NewsTimeline } from "@/components/NewsTimeline";
import type { NewsItem } from "@/data/news";
import { ProjectFrontmatter } from "@/lib/mdx";
import { getAssetPath } from "@/lib/assets";
import { siteConfig } from "@/lib/site";
import { useTheme } from "@/components/ThemeProvider";

const links = [
  { label: "Email", href: `mailto:${siteConfig.email}`, icon: "email" },
  { label: "Google Scholar", href: siteConfig.scholar, icon: "scholar" },
  { label: "LinkedIn", href: siteConfig.linkedin, icon: "linkedin" },
  { label: "GitHub", href: siteConfig.github, icon: "github" },
  { label: "ORCID", href: siteConfig.orcid, icon: "orcid" }
];

export function HomeExperience({ projects, news }: { projects: ProjectFrontmatter[]; news: NewsItem[] }) {
  const { mode } = useTheme();

  return (
    <div className="home-stack" data-mode={mode}>
      <section className="intro-zone" id="about">
        <div className="home-titlebar">
          <p className="eyebrow"><span className="eyebrow-dot" /> Human–AI Co-evolution · Ubiquitous Computing · Multimodal Sensing</p>
          <h1 className="home-wordmark">
            <span className="home-wordmark-line"><strong>Understanding Human Dynamics.</strong></span>
            <span className="home-wordmark-line"><strong>Shaping Adaptive AI system</strong></span>
          </h1>
        </div>

        <div className="intro-band">
          <div className="intro-copy">
            <p className="intro-bio">Hi I&apos;m Yingtian. I am a Third year Ph.D. student at Georgia Tech, advised by <a className="advisor-link" href={siteConfig.advisorUrl} target="_blank" rel="noopener noreferrer"><strong>{siteConfig.advisor}</strong></a>. My research connects <strong>time-series learning</strong>, <strong>multimodal sensing</strong> and <strong>AI agents</strong> to understand human dynamics and build AI that evolves with us. My long-term goal is to enable <strong>Human–AI Co-evolution</strong>, where AI learns from people’s changing contexts, needs, and feedback while helping them achieve their goals.</p>
            <div className="intro-links" aria-label="Find me online">
              {links.map((link) => <Link key={link.label} href={link.href} aria-label={link.label} title={link.label} target={link.href.startsWith("mailto:") ? undefined : "_blank"} rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}><Image src={getAssetPath(`/icons/${link.icon}.svg`)} alt="" width={22} height={22} className="social-icon" /></Link>)}
            </div>
          </div>
        </div>
        <div className="intro-portrait-column">
          <div className="intro-portrait-wrap">
            <Link href="/contact" className="intro-portrait-link" aria-label="Contact Yingtian Shi">
              <span className="portrait-orbit portrait-orbit-mid" aria-hidden="true" />
              <span className="portrait-orbit portrait-orbit-far" aria-hidden="true" />
              <span className={`intro-photo-flip ${mode === "night" ? "intro-photo-flip-night" : ""}`}>
                <span className="intro-photo-face intro-photo-front"><Image src={getAssetPath("/images/profile.png")} alt="Yingtian Shi" width={320} height={320} priority className="intro-portrait" /></span>
                <span className="intro-photo-face intro-photo-back"><Image src={getAssetPath("/images/profile2.JPG")} alt="Yingtian Shi" width={320} height={320} priority className="intro-portrait" /></span>
              </span>
              <span className="portrait-link-cue" aria-hidden="true">Contact me ↗</span>
            </Link>
          </div>
        </div>
      </section>

      <NewsTimeline items={news} limit={4} />
      <SideDeck projects={projects} />
    </div>
  );
}
