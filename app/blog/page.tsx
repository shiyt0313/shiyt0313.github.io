import { BlogCard } from "@/components/BlogCard";
import { getBlogList } from "@/lib/mdx";

export const metadata = {
  title: "News"
};

export default function BlogPage() {
  const posts = getBlogList();

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/80 bg-white/90 p-8 shadow-panel">
        <p className="eyebrow">News</p>
        <h1 className="mt-4 font-serif text-4xl text-ink">Latest updates.</h1>
        <p className="mt-6 max-w-3xl leading-8 text-slate">
          Updates from my research, projects, and work in progress.
        </p>
      </section>
      <div className="grid gap-6 lg:grid-cols-2">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
