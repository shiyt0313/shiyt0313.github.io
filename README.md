# Academic Portfolio

Next.js academic website starter for a personal research homepage, portfolio, publications list, project archive, and blog / notes section.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- MDX for projects and blog content
- Local TypeScript metadata for publications
- Static export for GitHub Pages or Vercel

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Content Management

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

The file automatically appears on `/projects` and gets a detail page at `/projects/project-slug`.

### Add a blog post or research note

Create a file in `content/blog/your-post-slug.mdx`:

```mdx
---
title: "Post Title"
slug: "post-slug"
date: "2026-06-12"
tags:
  - Notes
summary: "Short summary"
---
```

The file automatically appears on `/blog` and gets a detail page at `/blog/post-slug`.

### Add or edit publications

Edit [`data/publications.ts`](data/publications.ts) and add a new object with:

- `title`
- `authors`
- `venue`
- `year`
- `paper`
- `code`
- `project`
- `bibtex`
- `selected`

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

This repository publishes to `https://shiyt0313.github.io/`. While the site is under development, `.github/workflows/deploy.yml` publishes the standalone page in `maintenance/index.html` whenever `main` is pushed. The Next.js source remains available for local development, and later pushes will continue to show the placeholder until the workflow is changed back.

To publish an update from this checkout:

```bash
git add -A
git commit -m "Update website"
git push origin main
```

Wait for the `Deploy placeholder to Pages` workflow to finish in GitHub Actions.

To publish the full website later, update the workflow to run `npm ci` and `npm run build`, then upload the generated `out/` directory instead of the placeholder.

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
