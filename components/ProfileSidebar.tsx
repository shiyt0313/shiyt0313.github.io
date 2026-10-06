import Image from "next/image";
import Link from "next/link";
import { getAssetPath } from "@/lib/assets";
import { siteConfig } from "@/lib/site";

const profileLinks = [
  { href: `mailto:${siteConfig.email}`, label: "Email" },
  { href: siteConfig.github, label: "GitHub" },
  { href: siteConfig.linkedin, label: "LinkedIn" },
  { href: siteConfig.scholar, label: "Google Scholar" }
];

export function ProfileSidebar() {
  return (
    <aside className="lg:sticky lg:top-10 lg:h-fit">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-panel">
        <div className="h-28 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_45%,#0f766e_100%)]" />
        <div className="px-8 pb-8">
          <Image
            alt={siteConfig.name}
            className="-mt-14 h-28 w-28 rounded-full border-4 border-white object-cover shadow-lg"
            height={112}
            src={getAssetPath("/images/profile.png")}
            width={112}
          />
          <h1 className="mt-5 font-serif text-3xl text-ink">{siteConfig.name}</h1>
          <p className="mt-3 text-sm leading-7 text-slate">{siteConfig.affiliation}</p>
          <p className="mt-1 text-sm leading-7 text-slate">Georgia Tech</p>

          <div className="mt-6 space-y-3 border-t border-slate-200 pt-6 text-sm text-slate">
            <p>Atlanta, Georgia</p>
            <Link className="block hover:text-accent" href={getAssetPath(siteConfig.cv)} target="_blank">
              Curriculum Vitae
            </Link>
          </div>

          <div className="mt-6 space-y-3 border-t border-slate-200 pt-6 text-sm">
            {profileLinks.map((link) => (
              <Link key={link.label} className="block text-slate hover:text-accent" href={link.href} target="_blank">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
