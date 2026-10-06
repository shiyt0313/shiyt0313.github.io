import { newsCategoryEmoji, type NewsItem } from "@/data/news";
import { formatNewsMonth, renderNewsText } from "@/lib/news-format";

export function NewsList({ items }: { items: NewsItem[] }) {
  const orderedItems = [...items].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="news-list-page">
      <h1>Latest News</h1>
      <ol className="news-list">
        {orderedItems.map((item, index) => (
          <li className="news-list-item" key={`${item.date}-${index}`} tabIndex={0}>
            <div className="news-list-card">
              <span className="news-list-emoji" aria-hidden="true">{newsCategoryEmoji[item.category] ?? "📰"}</span>
              <time dateTime={item.date}>{formatNewsMonth(item.date)}</time>
              <span className="news-list-copy">{renderNewsText(item.text)}</span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
