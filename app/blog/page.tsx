import { NewsList } from "@/components/NewsList";
import { newsItems } from "@/data/news";

export const metadata = {
  title: "News"
};

export default function NewsPage() {
  return <NewsList items={newsItems} />;
}
