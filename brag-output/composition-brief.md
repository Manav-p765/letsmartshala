# Hyperframes Composition Brief: SmartShala

## Objective
Create a short launch-style brag video for SmartShala.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape - 1920x1080
- Duration: 22.93 seconds

## Source Material
- Project root: `D:\work\smart-shala`
- Primary files read: `index.html`, `README.md`, `src/data/site.js`, `src/data/home.js`, `src/components/DayArc/DayArcHero.jsx`, `src/components/Home/Desks.jsx`, `src/components/Home/Flow.jsx`, `src/styles/variables.css`, `film/storyboard.md`
- Product name: SmartShala
- Tagline / strongest claim: "The whole school day, in one system."
- Key UI or visual moment to recreate: the day arc hero, role-specific desk cards, and the student-file journey.
- Copy that must appear verbatim:
  - "The whole school day, in one system."
  - "One school, four desks"
  - "From admission to fee receipt."
  - "Built for Indian schools"
  - "Book a demo"

## Creative Direction
- Tone preset: polished
- Creative direction: trusted school-office product film with a crisp before/after reveal
- Interpretation: measured pacing, readable UI, restrained transitions, and school-office specificity.
- Angle: one student being rewritten across registers collapses into one day arc, four role views, and a single student file.
- Hook: "one student. five registers."
- Outro / punchline: SmartShala, Book a demo, letssmartshala.com.
- Avoid:
  - Generic SaaS language
  - Abstract filler visuals
  - Unrelated redesign
  - Real contact details or personal data from site config

## Visual Identity
- Background: #F5EFE6
- Text: #0E1D61
- Accent: #003DE5 / #2456E6
- Gold: #B8964F
- Night surface: #071433
- Display font: Plus Jakarta Sans Variable or system sans fallback
- Body font: Plus Jakarta Sans Variable or system sans fallback
- Visual references from the project: paper texture, navy ink, gold linework, blue CTA, day arc, role cards, sample student file.

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

Scene summary:
1. Five registers - 2.73s - repeated sample student rows and "one student. five registers."
2. The day arc - 3.27s - SmartShala hero concept and "The whole school day, in one system."
3. Four desks - 4.93s - Principal, Office admin, Teacher, Accountant cards.
4. From admission to fee receipt - 6.54s - sample student file advances to Paid.
5. Built for Indian schools - 2.19s - Indian school-office terms.
6. CTA - 3.27s - mark, name, tagline, Book a demo, URL.

## Audio
- Audio role: polished support bed with sparse professional accents.
- Audio arc: steady from the opening, stronger on reveal, restrained under the final CTA.
- Music: `assets/music/happy-beats-business-moves-vol-12-by-ende-dot-app.mp3`
- Music treatment: volume 0.28, full-duration bed, fade under final logo.
- Music cue guidance: bundled cue preset at `C:/Users/manav/.codex/plugins/cache/brag/brag/0.4.0/skills/brag/assets/music/cues/happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.json`; target strong cues near 8.74s, 17.47s, 22.93s.
- Audio-reactive treatment: subtle glow breathing only; skipped if unsupported by the older local CLI.
- Audio-coupled moments:
  - Register rows - soft drops
  - Four role cards - card-by-card drops
  - Student file columns - UI clicks and final impact
  - Final logo - bell
- SFX selection guidance: use low-risk, sparse interface/impact sounds already copied into composition assets.
- SFX analysis guidance: use restrained polished-tone picks.
- Exact SFX choice: `drop_001.ogg`, `click_001.ogg`, `impactSoft_medium_001.ogg`, `impactBell_heavy_000.ogg`
- Audio files: copied into `brag-output/composition/assets/`

## Hyperframes Instructions
This composition targets local `hyperframes@0.6.121` because the installed Node.js is 20.19.4 and the latest Hyperframes requires Node.js >= 22. Use the v0.6.121 contract: timed elements have `class="clip"`, `data-start`, `data-duration`, and `data-track-index`; the root has `data-composition-id`, dimensions, and total duration; GSAP timelines are paused and registered on `window.__timelines`.

Requirements:
- Show at least one real UI, copy, or visual element from the source project.
- Keep all text readable.
- Keep the video within 15-25 seconds.
- Include music and sparse SFX.
- Use local assets only.
- Validate with `npx -y hyperframes@0.6.121 lint brag-output/composition`.
- Render locally to `brag-output/brag.mp4`.
