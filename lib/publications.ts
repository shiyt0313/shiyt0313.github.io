import { publications } from "@/data/publications";

export function getPublications() {
  return [...publications].sort((a, b) => b.year - a.year);
}

export function getSelectedPublications(limit = 4) {
  return getPublications()
    .filter((item) => item.selected)
    .slice(0, limit);
}
