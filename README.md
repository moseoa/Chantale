# Chantale

Track **events** and **social media content** in one place — styled like a campaign outreach dashboard. Share with your team using a free link (Netlify, GitHub Pages, etc.). **No custom domain required.**

## Features

- **Events** — table + calendar, status, assignees, priority, dates
- **Social media** — posts by platform, schedule, captions, links
- **Share & sync** — copy a team link (`?workspace=your-team`), export/import JSON backups
- Works offline in the browser; data saved per workspace in local storage

## Quick start (local)

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Share with everyone (no domain)

1. Build the site:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder for free:
   - **[Netlify Drop](https://app.netlify.com/drop)** — drag `dist` onto the page → you get `https://something.netlify.app`
   - **GitHub Pages** — push repo, enable Pages, set `base` in `vite.config.ts` if using a project subpath
3. In the app, open **Share & sync** → **Copy** the team link
4. Send that link to your team. Same `workspace` ID = same board name (each person still needs **Import backup** to sync data across devices, or use export/import after updates)

### Syncing data across teammates

Browsers don’t share storage between people automatically. Use:

1. **Export backup** (JSON) → share file in Slack/email/Drive
2. Teammates click **Import backup**
3. Re-export when the board changes

Tabs on the **same computer** stay in sync automatically via BroadcastChannel.

## Custom workspace

Add to your shared URL:

```
https://your-site.netlify.app/?workspace=my-campaign-2026
```

Everyone using that exact URL shares the same workspace ID (and should use import/export to share data).

## Tech

- React + TypeScript + Vite + Tailwind CSS
- No backend, no accounts, no domain purchase
