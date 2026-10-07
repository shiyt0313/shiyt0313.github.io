import { PublicationItem } from "@/components/PublicationItem";
import { getPublications } from "@/lib/publications";

export const metadata = {
  title: "Publications"
};

export default function PublicationsPage() {
  const publications = getPublications();

  return (
    <div>
      <div className="px-8">
        {publications.map((publication, index) => (
          <PublicationItem
            key={`${publication.title}-${publication.year}-${publication.venue}`}
            publication={publication}
            showYear={index === 0 || publications[index - 1].year !== publication.year}
          />
        ))}
      </div>
    </div>
  );
}
