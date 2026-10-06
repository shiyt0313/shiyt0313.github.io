import { HomeExperience } from "@/components/HomeExperience";
import { getProjectList } from "@/lib/mdx";
import { getSelectedPublications } from "@/lib/publications";

export default function HomePage() {
  return <HomeExperience projects={getProjectList().slice(0, 3)} publications={getSelectedPublications(3)} />;
}
