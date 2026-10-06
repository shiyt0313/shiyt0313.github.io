"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { SideDeck } from "@/components/SideDeck";
import { ProjectFrontmatter } from "@/lib/mdx";
import { Publication } from "@/data/publications";
import { getAssetPath } from "@/lib/assets";
import { siteConfig } from "@/lib/site";

const links = [
  { label: "Email", href: `mailto:${siteConfig.email}` },
  { label: "Google Scholar", href: siteConfig.scholar },
  { label: "GitHub", href: siteConfig.github },
  { label: "LinkedIn", href: siteConfig.linkedin }
];

type ThemeMode = "day" | "night";

export function HomeExperience({ projects, publications }: { projects: ProjectFrontmatter[]; publications: Publication[] }) {
  const [mode, setMode] = useState<ThemeMode>("day");
  const [backgroundReveal, setBackgroundReveal] = useState<{ key: number; finished: boolean } | null>(null);
  const [switchTarget, setSwitchTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setSwitchTarget(document.getElementById("site-side-switch"));
    document.body.dataset.siteMode = "day";
    return () => {
      delete document.body.dataset.siteMode;
      document.body.removeAttribute("data-theme-reveal-active");
      document.body.style.removeProperty("background-color");
      document.body.style.removeProperty("transition");
    };
  }, []);

  function changeMode(event: MouseEvent<HTMLButtonElement>, next: ThemeMode) {
    if (next === mode || (backgroundReveal && !backgroundReveal.finished)) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = bounds.left + bounds.width / 2;
    const y = bounds.top + bounds.height / 2;
    const body = document.body;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      body.dataset.siteMode = next;
      setBackgroundReveal(null);
      setMode(next);
      return;
    }
    document.documentElement.style.setProperty("--theme-origin-x", `${x}px`);
    document.documentElement.style.setProperty("--theme-origin-y", `${y}px`);
    const radius = Math.ceil(Math.max(
      Math.hypot(x, y),
      Math.hypot(window.innerWidth - x, y),
      Math.hypot(x, window.innerHeight - y),
      Math.hypot(window.innerWidth - x, window.innerHeight - y)
    )) + 2;
    document.documentElement.style.setProperty("--theme-reveal-radius", `${radius}px`);
    document.documentElement.style.setProperty("--theme-old-background", getComputedStyle(body).backgroundColor);
    body.dataset.themeRevealActive = "true";
    body.dataset.siteMode = next;
    setBackgroundReveal({ key: Date.now(), finished: false });
    setMode(next);
  }

  function finishBackgroundReveal() {
    const body = document.body;
    body.style.transition = "none";
    body.style.backgroundColor = getComputedStyle(body).getPropertyValue("--paper").trim();
    body.removeAttribute("data-theme-reveal-active");
    setBackgroundReveal((current) => current ? { ...current, finished: true } : current);
    requestAnimationFrame(() => {
      body.style.removeProperty("background-color");
      body.style.removeProperty("transition");
    });
  }

  return (
    <div className="home-stack" data-mode={mode}>
      {backgroundReveal ? <span key={backgroundReveal.key} className="theme-background-reveal" aria-hidden="true" onAnimationEnd={finishBackgroundReveal} /> : null}
      {switchTarget ? createPortal(
        <div className="record-controls" role="group" aria-label="Display mode">
          <button className={`record-tab ${mode === "day" ? "record-tab-active" : ""}`} onClick={(event) => changeMode(event, "day")} type="button" aria-pressed={mode === "day"}>
            <span className="record-tab-dot" aria-hidden="true">☀</span> Day
          </button>
          <button className={`record-tab ${mode === "night" ? "record-tab-active" : ""}`} onClick={(event) => changeMode(event, "night")} type="button" aria-pressed={mode === "night"}>
            <span className="record-tab-dot" aria-hidden="true">☾</span> Night
          </button>
        </div>,
        switchTarget
      ) : null}
      <section className="intro-zone" id="about">
        <div className="home-titlebar">
          <p className="eyebrow"><span className="eyebrow-dot" /> Ubiquitous Computing · Human-AI Collaboration</p>
          <h1 className="home-wordmark">Computing in context, designed around people<span>.</span></h1>
        </div>

        <div key={mode} className={`intro-band intro-flip ${mode === "night" ? "intro-flip-night" : "intro-flip-day"}`}>
          <div className="intro-copy">
            <p className="intro-role">Researcher · Builder · Explorer</p>
            <p className="intro-bio">Hi, I’m Yingtian. I’m a PhD student in Computer Science at Georgia Tech, advised by {siteConfig.advisor}. I work at the intersection of ubiquitous computing and AI—making technology more perceptive, more collaborative, and more at home in everyday life.</p>
            <p className="intro-bio intro-bio-secondary">My work moves between research and making: from wearable sensing and smart environments to interactive systems that help people work with AI.</p>
            <div className="intro-links" aria-label="Find me online">
              {links.map((link) => <Link key={link.label} href={link.href} target={link.href.startsWith("mailto:") ? undefined : "_blank"}>{link.label}<span>↗</span></Link>)}
            </div>
          </div>
          <div className="intro-portrait-wrap">
            <Link href="/about" className="intro-portrait-link" aria-label="About Yingtian Shi">
              <span className="portrait-orbit portrait-orbit-mid" aria-hidden="true" />
              <span className="portrait-orbit portrait-orbit-far" aria-hidden="true" />
              <Image src={getAssetPath("/images/profile.png")} alt="Yingtian Shi" width={320} height={320} priority className="intro-portrait" />
              <span className="portrait-link-cue" aria-hidden="true">About me ↗</span>
            </Link>
          </div>
        </div>
      </section>

      <SideDeck projects={projects} publications={publications} />
    </div>
  );
}
