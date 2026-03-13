**LiveFit** — Train · Track · Thrive. A personal fitness tracker built with Next.js: log workouts, view history, streaks, goals, reminders, and curated resources.

## Optional: Live YouTube videos on Resources

To show **current, relevant** YouTube videos by workout type (instead of static links), set a YouTube Data API v3 key:

1. [Create a key](https://console.cloud.google.com/apis/credentials) (enable YouTube Data API v3).
2. In **Vercel**: Project → Settings → Environment Variables → add `YOUTUBE_API_KEY` with your key.
3. Redeploy. The Resources page will fetch fresh search results per workout type.

See `.env.example` for local development.

## Sign in with Google (production)

For "Sign in with Google" to work on Vercel:

1. **Google Cloud Console** → your OAuth 2.0 Client (e.g. "LiveFit Web") → ensure **both**:
   - **Authorised JavaScript origins** include `https://<your-app>.vercel.app` and `http://localhost:3005`.
   - **Authorised redirect URIs** include `https://<your-app>.vercel.app/api/auth/callback/google` and `http://localhost:3005/api/auth/callback/google` (redirect URIs are different from origins; both are required).
2. **Vercel** → Project → Settings → Environment Variables → set `AUTH_URL` to your main app URL, e.g. `https://fitness-tracker-xlzi.vercel.app` (Production). This makes the auth callback use a single URL so Google’s redirect URI matches.
3. Redeploy after changing env vars.

## Getting Started

First, run the development server:

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

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
