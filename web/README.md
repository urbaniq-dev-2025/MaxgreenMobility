## Maxgreen Mobility Website

4-page marketing website built with **Next.js + TypeScript + Tailwind**.

Pages:
- `/` Home
- `/about` About Us
- `/solutions` Solutions
- `/contact` Contact Us

## Getting Started

From the repo root:

```powershell
cd .\web
npm install
npm run dev
```

Open `http://localhost:3000`.

## Editing content (no login)

All editable content lives in JSON and `public/` media files:

- **Site-wide content + theme preset**: `content/site.json`
- **Product content (Solutions page)**: `content/products/*.json`
- **Images/videos**: `public/media/**`

### Change the color scheme (design system)

In `content/site.json`, set:

- `theme.activePreset`: `"green" | "blue" | "teal" | "purple"`

You can also edit the preset values under `theme.presets.*.tokens` (brand colors, text, borders, etc.).

### Replace images/videos

- Put new files under `public/media/...`
- Update the paths in JSON (example: `"/media/products/electric-cart.svg"`)

For product videos in `content/products/*.json`:
- YouTube embed: `"demoVideo": { "kind": "youtube", "url": "https://www.youtube.com/embed/..." }`
- Local file: `"demoVideo": { "kind": "file", "url": "/media/videos/demo.mp4" }`

## Forms

Home + Contact forms submit via **mailto** (no backend). Submitting opens the user’s email client with a prefilled message to `info@maxgreenmobility.com`.

## Web UI editing (Admin CMS)

This project includes a simple admin UI at:

- `http://localhost:3000/admin`

### Custom Admin (same UI, editable)

- Go to `http://localhost:3000/admin`
- Login with the hardcoded demo credentials:
  - Username: `admin`
  - Password: `maxgreen123`
- You’ll be redirected to `http://localhost:3000/admin/edit`

**Save behavior**:
- In local development, Save updates `content/site.json` on disk.
- On Vercel, filesystem writes are not guaranteed to persist. For production, configure **GitHub commit persistence** (recommended) or a database.

### Production persistence via GitHub commits (recommended for Vercel)

The admin UI can persist changes by committing JSON updates back to GitHub. This triggers a Vercel redeploy so edits appear on the live site.

Set these environment variables in Vercel (Project → Settings → Environment Variables):

- `GITHUB_TOKEN`: a fine-grained personal access token with **Contents: Read and write** on the repo
- `GITHUB_REPO`: `"owner/repo"` (example: `"UrbanIQ/Maxgreen-mobility"`)
- `GITHUB_BRANCH` (optional): defaults to `"main"`
- `GITHUB_CONTENT_ROOT` (optional): defaults to `"web"` (repo subfolder that contains `content/`)

Optional (recommended):

- `ADMIN_USER`: defaults to `"admin"`
- `ADMIN_PASS`: defaults to `"maxgreen123"`

## Production build (optional)

```powershell
cd .\web
npm run build
npm start
```

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
