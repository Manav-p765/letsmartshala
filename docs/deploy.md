# Deploying the SmartShala site

The site is a static React build plus one serverless function
(`api/lead.js`). Both run on Vercel; no separate backend (Render) is needed.

## 1. First deploy

1. On a machine with the repo: `npx vercel login`, then `npx vercel link`
   (create a new project, for example "smartshala-site").
2. `npx vercel deploy` gives a preview URL. Check it, then run
   `npx vercel deploy --prod`.
   - Or connect the git repository in the Vercel dashboard, so every push
     deploys.
3. Vercel reads `vercel.json`:
   - The build runs `npm run build`: Vite, then the pre-render step.
   - On Vercel the pre-render step uses `@sparticuz/chromium` (a Chromium
     build made for Vercel's build machine). After a deploy, open
     `/prerender.txt`: "ok: N pages" means every page shipped as finished
     HTML; "skipped: …" means the browser could not start and the site
     shipped as a plain single-page app (it works, but shows nothing until
     its JavaScript has run, so it feels slow).
   - For the full pre-rendered site, run `npm run build` locally, then
     `npx vercel deploy --prebuilt --prod` after `npx vercel build`.

## 2. Environment variables

Set these in Vercel under Project → Settings → Environment Variables, then
redeploy.

| Variable | Needed for | Value |
|---|---|---|
| `CRM_LEAD_URL` | Leads into the sales CRM | The CRM's website-lead endpoint (see `docs/crm-lead-endpoint.md`) |
| `CRM_LEAD_TOKEN` | Leads into the sales CRM | Shared secret, same value set on the CRM |
| `ADMIN_PASSWORD` | Blog admin at `/admin` (**required** to sign in) | A long password only the team knows |
| `GITHUB_TOKEN` | Blog admin saving posts (**required**) | GitHub fine-grained token: only repo letsmartshala, permission "Contents: Read and write" |
| `ADMIN_SECRET` | Optional | Signs admin sessions; defaults to ADMIN_PASSWORD |
| `RESEND_API_KEY` | Lead emails (**required**; without it the form shows the phone/WhatsApp fallback instead of sending) | API key from resend.com |
| `LEAD_TO` | Inbox for leads | `support@letssmartshala.com` (the default) |
| `LEAD_FROM` | Sender address | `SmartShala Website <leads@letssmartshala.com>`, after the domain is verified in Resend |
| `VITE_GA4_ID` | Google Analytics | `G-XXXXXXX` |
| `VITE_GADS_ID` | Google Ads | `AW-XXXXXXXXX` |
| `VITE_GADS_LEAD_LABEL` | Google Ads lead conversion | The conversion label for "demo request" |
| `VITE_META_PIXEL_ID` | Meta (Facebook/Instagram) ads | Pixel ID |

All tracking is opt-in. With no `VITE_*` IDs set, no third-party script
loads. The lead conversion fires on `/thank-you`, once per real form
submission; a refresh or a direct visit doesn't count.

## 3. Domain and DNS

1. Decide the split. The suggestion is the site at `letssmartshala.com` (and
   `www`), and the CRM at `app.letssmartshala.com`.
2. In Vercel under Project → Domains, add `letssmartshala.com` and
   `www.letssmartshala.com`. Then add the DNS records Vercel shows (an A
   record and a CNAME) at the domain's DNS provider.
3. Resend: add the domain, then add its DKIM/SPF records at the same DNS
   provider. Once it shows as verified, set `LEAD_FROM`. Until then Resend
   only delivers from its test sender to the Resend account owner's email.
4. When the CRM moves to `app.`, update `appUrl`/`loginUrl` in
   `src/data/site.js`.

## 4. After launch

- Send a test lead from `/demo` and confirm it arrives at
  support@letssmartshala.com.
- Paste `https://letssmartshala.com` into WhatsApp to check the link preview
  (`public/share/og.png`; regenerate it with `npm run og`).
- Submit `https://letssmartshala.com/sitemap.xml` in Google Search Console.
- The legal pages are drafts, marked as such and not indexed. Have them
  reviewed, fill in the [bracketed] parts, then set `reviewed: true` in
  `src/data/legal.js`.

## Blog admin

- Go to `https://<site>/admin` and sign in with `ADMIN_PASSWORD`.
- Saving or publishing a post commits `content/blog/<slug>.json` (and any
  images, to `public/blog-media/`) to GitHub. Vercel then rebuilds, and the
  post is live in about a minute. Each change shows in GitHub history, so
  any post can be restored from there.
- Create the token at GitHub → Settings → Developer settings →
  Fine-grained tokens. Choose Repository access: only
  `Manav-p765/letsmartshala`, and Permissions → Contents: Read and write.
