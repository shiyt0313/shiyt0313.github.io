import { BlogFrontmatter } from "@/lib/mdx";
import { Tag } from "@/components/Tag";

export function BlogCard({ post }: { post: BlogFrontmatter }) {
  return (
    <article className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-panel">
      <p className="text-sm uppercase tracking-[0.18em] text-slate">{post.date}</p>
      <h3 className="mt-3 font-serif text-2xl text-ink">{post.title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate">{post.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags?.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
    </article>
  );
}
