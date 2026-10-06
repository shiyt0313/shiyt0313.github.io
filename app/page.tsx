import { HomeExperience } from "@/components/HomeExperience";
import { getProjectList } from "@/lib/mdx";
import { newsItems } from "@/data/news";

export default function HomePage() {
  return <HomeExperience projects={getProjectList().slice(0, 4)} news={newsItems} />;
}
