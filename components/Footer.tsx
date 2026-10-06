import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-white/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between md:px-10">
        <p>© {new Date().getFullYear()} Yingtian Shi · Atlanta, Georgia</p>
        <div className="flex gap-5">
          <Link href={`mailto:${siteConfig.email}`} className="hover:text-ink">Email</Link>
          <Link href={siteConfig.github} target="_blank" className="hover:text-ink">GitHub</Link>
          <Link href={siteConfig.scholar} target="_blank" className="hover:text-ink">Scholar</Link>
        </div>
      </div>
    </footer>
  );
}
