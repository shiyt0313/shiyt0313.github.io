function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  const [owner, repository] = process.env.GITHUB_REPOSITORY?.split("/") ?? [];

  if (owner && repository) {
    if (repository.endsWith(".github.io")) {
      return `https://${repository}`;
    }

    return `https://${owner}.github.io/${repository}`;
  }

  return "http://localhost:3000";
}

export const siteConfig = {
  name: "Yingtian Shi",
  title: "Yingtian Shi | PhD Student at Georgia Tech",
  description:
    "Yingtian Shi is a Computer Science PhD student at Georgia Tech researching Human–AI Co-evolution, ubiquitous computing, and multimodal sensing.",
  url: getSiteUrl(),
  affiliation: "PhD Student, Computer Science, Georgia Tech",
  advisor: "Prof. Thomas Plötz",
  advisorUrl: "https://www.ic.gatech.edu/people/thomas-ploetz",
  bio: "I study ubiquitous computing and AI, with a focus on Human–AI Co-evolution, wearable sensing, smart environments, and deployable interactive systems.",
  email: "yshi457@gatech.edu",
  alternateEmail: "shiyt0313@gmail.com",
  github: "https://github.com/shiyt0313",
  scholar: "https://scholar.google.com/citations?user=8R-dDuMAAAAJ",
  orcid: "https://orcid.org/0000-0001-8733-7041",
  linkedin: "https://www.linkedin.com/in/yingtian-shi-8122b7324",
  cv: "/cv.pdf"
};
