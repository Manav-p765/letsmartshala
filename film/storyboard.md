# SmartShala story film — storyboard

Explainer, 47.5 s, 1920×1080, 30 fps. Made with the `javascript-animation` +
`soundtrack` skills: every frame is drawn in code (`smartshala-story.html`),
and the score is synthesised in the same page.

## Look

- **Paper era (0–25 s):** wobbly ink lines that "boil" every 4 frames (like
  hand animation) on ivory paper, register covers in muted cloth colours, and
  red pen for mistakes.
- **SmartShala (25 s on):** the wobble settles to 0 and drawing turns into
  crisp flat UI in navy and logo blue. The change in style *is* the story.
- **Type:** system serif italic for handwriting; system sans for UI and
  captions; mono for labels. Zero assets.
- **Persistent gauges:**
  - top right: a school-day clock (the home page's day-arc idea);
  - top left: "Aarav written ×N", which climbs to 5 and falls back to 1.

## Sound

96 BPM, one cut per bar (2.5 s), on the downbeat with a chord change, never a
volume jump.

- **Instruments:** a tanpura-like drone on D, a soft pad, clock-tick
  woodblocks during the paper era, and a soft low tom.
- **Harmony:** minor chords when things break, a silent bar (the break), then
  a bell chime and D major when the screen lights.
- **Sound effects:** a pen scratch per name written, a stamp, alert blips, a
  whoosh, UI ticks, pulses.

## Shots (bars of 2.5 s)

| # | time | framing | camera | what happens | lands on | sound | out |
|---|---|---|---|---|---|---|---|
| 1 | 0–5 | wide, five closed registers on the desk | slow push | question: "Why is the school office always catching up?"; clock 7:30 | 1.25 caption | drone, pad | cut |
| 2 | 5–10 | medium, admission register | drift right | register opens; pen writes "Aarav Sharma · 7-B · Roll 12"; counter ×1 | 6.25 write | pen scratch | pan |
| 3 | 10–17.5 | medium, row of registers | pan right | attendance, fee card, bus list and mark sheet each write him in again; counter ×2…×5; the mark sheet says Roll **21** | 10.6, 12.5, 14.4, 16.2 | scratch ×4, ticks | cut |
| 4a | 17.5–20 | close, two torn strips (world blurred behind) | still | Roll 12 ≠ Roll 21, circled in red | 18.75 circle | stamp | cut |
| 4b | 20–22.5 | close, the principal's chit | still | "Fees collected today?" → "Will tell you by evening." Clock spins to 6:10 PM | 20.6, 21.25 | alert, tick run | cut |
| 4c | 22.5–25 | close, fee register | slow push | defaulters list grows; stamp "23 defaulters — found at term end" | 23.75 stamp | stamp | cut |
| 5 | 25–30 | wide | still | **break bar** (silence); every written line lifts off the registers and streams to the centre; wobble → 0; at 27.5 the SmartShala screen lights | 27.5 chime | whoosh, chime | push in |
| 6 | 30–35 | close, the screen | push in | one record for Aarav; Admission, Attendance, Fees, Transport and Marks tick on; counter ×1 "written once"; clock 9:05 | 30.6…33.1 | UI ticks | pull out |
| 7 | 35–42.5 | wide, screen + four role cards | pull out | Principal, Teacher, Accountant and Office cards pop in; lines with data pulses; fees count up live | 35.6…37.5 | pops, pings | dissolve |
| 8 | 42.5–47.5 | end card | still | SS mark → "SmartShala" → "The whole school day, in one system." → (after motion settles) "Book a demo · letssmartshala.com" | 45.6 last line | resolve, fade | — |

## Facts on screen (sources)

Each claim matches a CRM feature listed in `docs/content.md`:

- one student record read by every office;
- attendance, fees and receipts, transport, marks;
- live principal dashboard figures.

The roll numbers, names and money amounts are illustrative sample data.
