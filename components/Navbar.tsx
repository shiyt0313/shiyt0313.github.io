"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { getAssetPath } from "@/lib/assets";
import { siteConfig } from "@/lib/site";
import { useTheme } from "@/components/ThemeProvider";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "News" },
  { href: "/projects", label: "Projects" },
  { href: "/publications", label: "Publications" }
];

export function Navbar() {
  const pathname = usePathname();
  const { mode, controlsMode, changeMode } = useTheme();

  return (
    <header className="site-header">
      <div className="site-header-inner mx-auto max-w-6xl px-6 py-5 md:px-10">
        <div className="site-header-main">
          <Link href="/" className="flex items-center gap-3" aria-label="Yingtian Shi home">
            <span className="brand-mark">YS</span>
            <span className="site-brand-name font-serif text-xl font-semibold tracking-tight">Yingtian Shi</span>
          </Link>
          <nav aria-label="Main navigation" className="site-nav flex gap-1 overflow-x-auto pb-1 md:pb-0">
            {navItems.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx("nav-link", active && "nav-link-active")}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
            <a href={getAssetPath(siteConfig.cv)} download className="nav-cv" aria-label="Download CV as PDF">CV ↓</a>
          </nav>
          <div id="site-side-switch" className="site-side-switch">
            <div className="record-controls" role="group" aria-label="Display mode">
              <button className={`record-tab ${controlsMode === "day" ? "record-tab-active" : ""}`} onClick={(event) => changeMode(event, "day")} type="button" aria-pressed={mode === "day"}>
                <span className="record-tab-dot" aria-hidden="true">☀</span> Day
              </button>
              <button className={`record-tab ${controlsMode === "night" ? "record-tab-active" : ""}`} onClick={(event) => changeMode(event, "night")} type="button" aria-pressed={mode === "night"}>
                <span className="record-tab-dot" aria-hidden="true">☾</span> Night
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
