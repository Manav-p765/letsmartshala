# letsmartshala

Marketing website for **SmartShala**, the school management CRM for Indian
schools by Hybrid Monks LLP. It will live at
[letssmartshala.com](https://letssmartshala.com).

## Stack

React 19 + Vite, GSAP + ScrollTrigger, and Lenis. One Vercel serverless
function (`api/lead.js`) emails demo requests through Resend.

## Run it

```bash
npm install
npm run dev        # http://localhost:5180  (the lead form works locally; leads print to the terminal)
npm run build      # Vite build + prerendered HTML per route (needs Playwright's Chromium: npx playwright install chromium)
```

## Pages

- `/`: home
- `/demo`: ad landing page with the form in the hero
- `/thank-you`: shown after a demo request; fires conversions once
- `/features`, `/solutions`, `/pricing`, `/about`, `/contact`, `/security`
- `/privacy`, `/terms`, `/refunds`: drafts pending legal review

## Docs

- `docs/handoff.md`: project state, design decisions, task list
- `docs/content.md`: confirmed facts, placeholders, open content questions
- `docs/deploy.md`: Vercel deployment, environment variables, DNS

## Checks

```bash
node scripts/fullpage.mjs /      # errors, stuck animations, overflow
node scripts/pages.mjs 1536 760  # every inner route
node scripts/formcheck.mjs       # demo form end to end
```
