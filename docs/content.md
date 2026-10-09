# SmartShala site — content sources, placeholders, open questions

Rule: the site never states a claim we can't back up. Product facts come from
the CRM codebase brief (generated 2026-10-09 from the CRM repo). Anything not
confirmed is either left out or shown on the page with a **Dummy** tag.

## Confirmed facts we use (from the CRM brief)

- Modules: admissions/enquiries, student records, classes & timetable,
  student + staff attendance, fees (structures, instalments, ledgers,
  defaulters, receipt PDFs), exams & report cards, homework, communication &
  announcements, calendar, leave, payroll (shift/attendance based), transport
  (vehicles, routes, stops), reports & dashboards, activity logs.
- Roles: principal, admin, teacher, accountant, parent (partial).
- Each school gets its own isolated database.
- Web app + Flutter principal and teacher apps.
- Indian context: Aadhaar, APAAR, GST invoices, UPI/cheque/DD, class/section,
  roll no., academic session rollover.
- Brand: logo (interlocking SS, #003DE5), CRM palette, Inter.

## Things we deliberately do NOT claim yet

| Topic | Why | Status |
|---|---|---|
| WhatsApp messages to parents | Provider runs in dry-run without credentials | Ask owner if live |
| AI assistant | Exists, capabilities depend on config | Ask owner |
| Parent app | Not found in code | Don't mention |
| Library, inventory, GPS bus tracking | Not found in code | Don't mention |
| Hindi UI | Exists; strings may have encoding issues | Ask owner before marketing |
| Multi-branch / school chains | No branch model in code | Ask owner |
| Specific boards (CBSE/ICSE/State) | Only an optional field | Ask owner |
| Apps on Play Store / App Store | Unknown if published | Ask owner |

## Placeholders on the site (all render with a "Dummy" tag)

| Where | Field | Source file |
|---|---|---|
| Hero day cards, stream phone, module previews | Names/numbers ("38 of 41", "₹1,84,500") | `src/data/dayArc.js`, `src/data/stream.js`, `Modules.jsx` — illustrative UI. Per owner's call (2026-10-09) the hero and stream carry no on-page "sample data" line; module previews still do. Never reuse these figures as claims. |

## Open questions

1. ~~Phone, email~~ — confirmed: +91 78630 41196, support@letssmartshala.com. Address: none shown (HR: skip).
2. ~~Legal entity~~ — Hybrid Monks LLP. Registered address still unknown (privacy/terms pages may need it for a grievance contact).
3. ~~Leads inbox~~ — support@letssmartshala.com.
3a. ~~WhatsApp~~ — yes, +91 78630 41196 takes calls and WhatsApp.
3b. ~~Domain~~ — letssmartshala.com, shared with the CRM. Open: which part goes where (site at the root, CRM at app.? ), and who can add DNS records for lead email.
4. Analytics IDs: GA4 measurement ID, Google Ads conversion ID/label, Meta Pixel ID.
5. Pricing — "will give later".
6. Production domain for the site and for the app login (currently `campus-loom.vercel.app/login`).
7. Real customers / testimonials / school logos we're allowed to show (none yet → section held back).
8. Every "Ask owner" row in the table above.
