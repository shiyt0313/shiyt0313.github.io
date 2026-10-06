import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata = {
  title: "Contact"
};

const contacts = [
  { label: "Email", href: `mailto:${siteConfig.email}`, value: siteConfig.email },
  { label: "Alternative Email", href: `mailto:${siteConfig.alternateEmail}`, value: siteConfig.alternateEmail },
  { label: "GitHub", href: siteConfig.github, value: siteConfig.github },
  { label: "Google Scholar", href: siteConfig.scholar, value: siteConfig.scholar },
  { label: "ORCID", href: siteConfig.orcid, value: siteConfig.orcid },
  { label: "LinkedIn", href: siteConfig.linkedin, value: siteConfig.linkedin }
];

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-panel">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-4 font-serif text-4xl text-ink">Let’s start a conversation.</h1>
        <p className="mt-6 max-w-3xl leading-8 text-slate">
          I’m happy to hear from researchers, collaborators, and anyone interested in ubiquitous computing and human-AI systems.
        </p>
      </section>
      <div className="grid gap-6 md:grid-cols-2">
        {contacts.map((contact) => (
          <article key={contact.label} className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-panel">
            <p className="text-sm uppercase tracking-[0.28em] text-gold">{contact.label}</p>
            <Link className="mt-4 block text-lg leading-8 text-accent underline-offset-4 hover:underline" href={contact.href} target="_blank">
              {contact.value}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
