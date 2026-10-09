# SmartShala site — working handoff

Read this first in a new session. It holds the project state, the decisions
made, the owner's feedback, and the open task list. Content facts and open
content questions live in `docs/content.md`.

## Project

- Marketing site for **SmartShala**, a school CRM for Indian schools. Company:
  **Hybrid Monks LLP**. Phone/WhatsApp **+91 78630 41196**, email
  **support@letssmartshala.com** (also the inbox for demo leads). No address.
- Domain **letssmartshala.com** (shared with the CRM; the split, such as
  app.letssmartshala.com, is not decided). Hosting: Vercel, plus Render only
  if a backend is needed.
- CRM source: `D:\work\campusloom\smartshala`. Live CRM:
  campus-loom.vercel.app (login at /login). Logo pulled from there.
- Stack: React 19 + Vite 8, GSAP + ScrollTrigger, Lenis, react-router 7.
  Run the dev server with `npx vite --port 5180 --strictPort`. The owner
  views the site on port 5181, so another server may be running there.
- Working agreement (see memory `design-build-brief`): one signature moment,
  design tokens first, never invent claims, small commits, show a to-do list
  at the end of every reply, check in the browser before calling work done.

## Design decisions (current)

- **Palette:** light only. Paper `#F7F8FB`, white, mist `#E9EEFC`, logo blue
  `#003DE5`, CRM blue `#2456E6`, ink `#0F1419`. No dark or bright-blue section
  backgrounds (the owner rejected them). The `navy`, `night` and `blue` themes
  still exist in `variables.css` but are unused.
- **Font:** Plus Jakarta Sans everywhere, plus Instrument Serif italic for one
  accent word, JetBrains Mono for labels, and Mukta for Hindi.
- **Section titles** use `--fs-title`, sized by width and capped by height.
- **Logo:** free-standing blue SS letters, traced to a vector
  (`src/components/Brand/markPath.js`), with no box around them. The favicon
  is the boxed version (`public/favicon.svg`).
- **Hero (the signature moment):** a light page with a blurred blue arc. A sun
  crosses it from 7:30 AM to 4:30 PM **once**, and does not loop. Small,
  muted cards float gently (about 6px) and hang off the arc on dotted
  strings. The arc must never overlap any text. The role switch (principal,
  teacher, accountant) replays the day only when clicked. No lede paragraph
  and no "sample data" line.
- **Reveals:** `useReveal()` per section. Nothing is hidden by CSS.
  `data-animate="in"` adds `.is-in` through an IntersectionObserver.
- **Owner's preferences:**
  - Professional, not playful.
  - Floating elements are welcome, but they must not pull attention from the
    copy.
  - Nothing that loops in an annoying way.
  - **No scroll-jacking or pinned scroll-driven sections.**
  - Sections should fit the screen where possible. Longer is fine if it
    displays well, but nothing may be cut off.
  - Leave breathing room at the bottom of sections.
  - Two sections must not share the same layout.

## Home page sections (`src/pages/HomePage.jsx`)

1. `DayArcHero`: done; the owner likes it.
2. `Desks` (four roles): a 2×2 grid; each card has a live preview on the left
   and text on the right. **Open:** the owner says the preview animations
   don't play and wants more animation. Make sure `.is-in` fires (bars fill,
   P/A marks pop, PAID stamp) and add more motion.
3. `Stream`: modules flow on a curve into a floating principal's phone, and
   its feed fills up. Light theme. Liked.
4. `Tour` (modules): **just changed** to not be scroll-driven. It plays
   through the modules once when in view (`useAutoStep`, 3.8s each) with a
   timer line, then rests; clicking takes over. Bottom padding increased.
   **Needs a browser check.**
5. `Flow` (admission to fee receipt): **To do:** the owner wants the student
   file and the steps **side by side**, with no scroll pinning. Remove the
   `PIN_MQ`/ScrollTrigger code and use `useAutoStep(5, ~1600ms)` to light the
   steps once. The file sits on the left and the steps on the right.
   Clicking a step selects it. It must look different from the Tour layout,
   for example with a vertical track and the file building up.
6. `India`: a marquee of Indian school terms.
7. `Security`: three-schools diagram (your own database) plus three points.
8. `Faq`: chat-style; tapping a question shows a typing indicator, then the
   answer.
9. `CtaBand`: soft paper background with a blurred arc.
10. Footer: light.

## Task list

- [ ] Browser-check the new Tour (autoplay once, click, bottom space, no pin)
- [ ] Flow: side by side, no pin, autoplay once (see above)
- [ ] Desks: fix the preview animations not firing; add more animation
- [ ] Commit the work in progress (a WIP commit was made at handoff)
- [ ] `/demo` landing page: form in the hero (name, school name, role,
      phone, email)
- [ ] Form backend: email each lead to support@letssmartshala.com (Vercel
      function; needs DNS access on letssmartshala.com for sending)
- [ ] `/thank-you` page with GA4, Google Ads and Meta conversion events
      (IDs pending)
- [ ] Pages: features, solutions, pricing ("talk to us"), about, contact,
      security, legal (privacy, terms, refunds; Hybrid Monks LLP)
- [ ] Pre-render pages, OG/share images, deploy to Vercel at
      letssmartshala.com
- Waiting on the owner:
  - the domain split
  - DNS access
  - analytics IDs
  - answers on WhatsApp messaging, Hindi, app stores and boards
  - pricing
  - git user name (commits use "Kartik")

## Checking tools

- `node scripts/sections.mjs 1536 700`: one screenshot per section, plus its
  height. The owner's screen is about 1536×700 CSS pixels (1920 at 125%).
- `node scripts/fullpage.mjs /`: errors, stuck reveals and overflow, at all
  sizes.
- `node scripts/shots.mjs / 7500`: hero screenshots. Run it from
  PowerShell, because Git Bash rewrites the `/` argument.
- Don't edit files with PowerShell `Set-Content`; it corrupts ₹, · and —.
