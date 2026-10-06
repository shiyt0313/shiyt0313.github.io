import newsEntries from "@/content/news.json";

export type NewsItem = {
  date: string; // YYYY-MM
  category: string; // Determines the shared icon on the News page.
  text: string; // Use **bold** and [linked text](https://example.com) where needed.
};

export const newsCategoryEmoji: Record<string, string> = {
  preprint: "📄",
  accepted: "🎉",
  published: "📚",
  event: "🤝",
  position: "🔬",
  education: "🎓"
};

export const newsItems: NewsItem[] = newsEntries;
