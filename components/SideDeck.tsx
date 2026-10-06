"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";
import type { ProjectFrontmatter } from "@/lib/mdx";

export function SideDeck({ projects }: { projects: ProjectFrontmatter[] }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const body = document.body;
    let frame = 0;

    function clearBackground() {
      delete body.dataset.projectScrollActive;
      body.style.removeProperty("--project-progress");
      body.style.removeProperty("--project-progress-inverse");
      body.style.removeProperty("--project-strength");
      body.style.removeProperty("--project-strength-inverse");
    }

    function update() {
      frame = 0;
      if (!section) return;
      if (reducedMotion.matches) {
        clearBackground();
        return;
      }

      const bounds = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const clamp = (value: number) => Math.min(1, Math.max(0, value));
      const progress = clamp((viewportHeight * 0.9 - bounds.top) / (bounds.height + viewportHeight * 0.8));
      const entering = clamp((viewportHeight * 0.95 - bounds.top) / (viewportHeight * 0.45));
      const leaving = clamp((bounds.bottom - viewportHeight * 0.05) / (viewportHeight * 0.45));
      const strength = Math.min(entering, leaving);

      if (strength === 0) {
        clearBackground();
        return;
      }

      body.dataset.projectScrollActive = "true";
      body.style.setProperty("--project-progress", `${(progress * 100).toFixed(2)}%`);
      body.style.setProperty("--project-progress-inverse", `${((1 - progress) * 100).toFixed(2)}%`);
      body.style.setProperty("--project-strength", `${(strength * 100).toFixed(2)}%`);
      body.style.setProperty("--project-strength-inverse", `${((1 - strength) * 100).toFixed(2)}%`);
    }

    function scheduleUpdate() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(section);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    reducedMotion.addEventListener("change", scheduleUpdate);
    scheduleUpdate();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      reducedMotion.removeEventListener("change", scheduleUpdate);
      if (frame) cancelAnimationFrame(frame);
      clearBackground();
    };
  }, []);

  return (
    <section className="side-deck" id="work" ref={sectionRef}>
      <div className="side-deck-heading">
        <h2 className="section-title">Selected Projects</h2>
        <Link href="/projects" className="side-deck-all section-link">View all projects <span aria-hidden="true">→</span></Link>
      </div>
      <div className="selected-project-grid">
        {projects.map((project) => <ProjectCard key={project.slug} project={project} />)}
      </div>
    </section>
  );
}
