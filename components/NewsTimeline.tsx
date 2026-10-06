import Link from "next/link";
import type { NewsItem } from "@/data/news";
import { formatNewsMonth, renderNewsText } from "@/lib/news-format";

export function NewsTimeline({ items, limit }: { items: NewsItem[]; limit?: number }) {
  const orderedItems = [...items].sort((a, b) => b.date.localeCompare(a.date));
  const visibleItems = limit ? orderedItems.slice(0, limit) : orderedItems;

  return (
    <section className="home-news" id="news">
      <div className="home-news-heading">
        <h2 className="section-title">Latest News</h2>
        <Link className="home-news-all section-link" href="/blog">View all news <span aria-hidden="true">→</span></Link>
      </div>

      {visibleItems.length > 0 ? (
        <>
          <ol className="news-timeline">
            {visibleItems.map((item, index) => (
              <li className="news-timeline-item" key={`${item.date}-${index}`}>
                <time dateTime={item.date}>{formatNewsMonth(item.date)}</time>
                <p className="news-timeline-text">{renderNewsText(item.text)}</p>
              </li>
            ))}
          </ol>
          {limit && orderedItems.length > limit ? <div className="news-timeline-more" role="img" aria-label="More news"><span /><span /><span /></div> : null}
        </>
      ) : (
        <div className="news-timeline-empty"><span className="news-timeline-dot" aria-hidden="true" /><p>Updates coming soon.</p></div>
      )}
    </section>
  );
}
