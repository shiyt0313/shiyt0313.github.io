# Academic Portfolio

Next.js academic website with Home, News, Projects, and Publications pages.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- MDX frontmatter for project cards
- Local TypeScript metadata for publications
- Static export for GitHub Pages or Vercel

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Content Management

### Update News

Edit [`content/news.json`](content/news.json). Each entry has a month (`YYYY-MM`), a `category`, and a sentence of news. Categories share emoji on the News page: `preprint` 📄, `accepted` 🎉, `published` 📚, `event` 🤝, `position` 🔬, and `education` 🎓. Wrap phrases in `**double asterisks**` to make them bold, and use `[linked text](https://example.com)` to link part of a sentence. To link a bold title, use `[**Paper title**](https://example.com)`. The homepage automatically shows the five newest entries, and the News page shows the full list in date order.

```json
{
  "date": "2026-09",
  "text": "Our paper **Example** has been accepted!"
}
```

Local development reloads after an edit. GitHub Pages needs a new deployment to publish changes.

### Add a project

Create a new file in `content/projects/your-project-slug.mdx`:

```mdx
---
title: "Project Title"
slug: "project-slug"
date: "2026-06-12"
status: "Ongoing"
tags:
  - Human-AI Collaboration
description: "Short description"
image: "/images/projects/example.jpg"
links:
  - label: "Paper"
    href: "https://example.com"
---
```

The file automatically appears as a card on `/projects`. The homepage shows the four newest projects. Only the frontmatter is displayed; the body remains in the source as project notes. Project detail pages are not generated.

### Add or edit publications

Edit [`data/publications.ts`](data/publications.ts) and add a new object with:

- `title`
- `authors`
- `venue`
- `year`
- `paper`
- `code`
- `authorNote` (optional)

The publications page sorts entries by year descending automatically.

## Deployment to Vercel

1. Push this directory to a GitHub repository.
2. Import the repository in Vercel.
3. Vercel will auto-detect Next.js.
4. Build command: `npm run build`
5. Output setting: default Next.js
6. No environment variables are required for the current setup.

## Custom Domain

1. Open the project in Vercel.
2. Go to `Settings -> Domains`.
3. Add your custom domain.
4. Follow the DNS records Vercel provides.
5. Wait for SSL provisioning to complete.

## Deployment to GitHub Pages

This repository publishes the Next.js static export to `https://shiyt0313.github.io/`. Pushing `main` runs `.github/workflows/deploy.yml`, which installs dependencies, builds the site, and deploys `out/` to GitHub Pages.

To publish an update from this checkout:

```bash
git add -A
git commit -m "Update website"
git push origin main
```

Wait for the `Deploy website to Pages` workflow to finish in GitHub Actions.

Notes:

- The base path is inferred from `GITHUB_REPOSITORY`; this user-site repository builds at `/`.
- For a custom domain or manual URL override, set `NEXT_PUBLIC_SITE_URL`.
- The static export output is written to `out/`.

## Update Personal Info

Edit [`lib/site.ts`](lib/site.ts) to update:

- name
- site title
- description
- email
- GitHub
- Google Scholar
- LinkedIn
- deployment URL
