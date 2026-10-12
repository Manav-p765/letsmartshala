# Website leads → SmartShala sales CRM

The website's demo form (`/demo`, `/pricing`, `/contact`) POSTs every lead
to the CRM, server to server, from `api/lead.js`. The CRM only needs one
endpoint that turns this payload into a lead in its pipeline. Email
(Resend) still runs alongside as a backup.

## The request the website sends

```
POST {CRM_LEAD_URL}
Authorization: Bearer {CRM_LEAD_TOKEN}
Content-Type: application/json
```

```json
{
  "source": "website",
  "name": "Sunita Sharma",
  "schoolName": "Green Valley Public School",
  "numberOfStudents": 650,
  "role": "Principal",
  "phone": "+919876543210",
  "email": "sunita@example.com",
  "page": "/demo",
  "utm": { "utm_source": "google", "utm_campaign": "admissions", "gclid": "…" },
  "submittedAt": "2026-10-12T09:30:00.000Z"
}
```

| Field | Type | Notes |
|---|---|---|
| `source` | string | Always `"website"` |
| `name` | string, 2–80 chars | The person's name |
| `schoolName` | string, 2–120 chars | |
| `numberOfStudents` | integer, 1–10000 | |
| `role` | enum | `Principal`, `Owner / Trustee`, `Administrator`, `Accountant`, `Teacher`, `Other` |
| `phone` | string | E.164 Indian mobile, e.g. `+919876543210`; already validated |
| `email` | string or `null` | Optional on the form |
| `page` | string or `null` | Which page the form was on |
| `utm` | object | Any of `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `gclid`, `fbclid` |
| `submittedAt` | ISO 8601 string | |

The website has already validated these fields, but the CRM should validate
them again.

## What the CRM should answer

- `201` (or `200`) when the lead is created. The body is ignored.
- `401` when the bearer token is wrong.
- `400` when the body is invalid.
- Answer within 8 seconds, or the website treats the call as failed. In that
  case it still emails the lead, if email is configured.

## Behaviour the CRM should have

- Create a lead with source/channel **Website**, in the first stage, and
  assign it like the Meta Lead Ads import does (round-robin among sales).
- **Dedupe:** if a lead with the same phone number already exists (for
  example, within the last 30 days), add a note or activity to that lead
  instead of creating a second one.
- Store `numberOfStudents`, `role`, `page` and the `utm` fields on the lead,
  so sales can see which campaign it came from.
- Rate-limit the endpoint (for example, 60 requests per minute per IP) and
  compare the token in constant time.

## Turning it on

1. The CRM team deploys the endpoint and sends you its full URL and the
   token they generated.
2. In Vercel, open the letsmartshala project → Settings → Environment
   Variables, and add:
   - `CRM_LEAD_URL`: the endpoint's full URL
   - `CRM_LEAD_TOKEN`: the shared secret
3. Redeploy, then submit a test lead on `/demo` and check it appears in the
   CRM.

## Prompt for the CRM's Claude Code session

> The marketing website (repo Manav-p765/letsmartshala, file api/lead.js)
> now sends every demo request server-to-server to the CRM. Please add an
> endpoint to the sales CRM that receives it:
>
> - `POST /api/crm/leads/website` (or whatever fits the CRM's route
>   layout), authenticated with `Authorization: Bearer <token>` against a
>   new env var `WEBSITE_LEAD_TOKEN`. Compare the token in constant time,
>   and rate-limit the endpoint.
> - Body (JSON): `source` ("website"), `name`, `schoolName`,
>   `numberOfStudents` (int 1–10000), `role` (Principal | Owner / Trustee |
>   Administrator | Accountant | Teacher | Other), `phone` (E.164, for
>   example +919876543210), `email` (nullable), `page` (nullable), `utm`
>   (object with optional utm_source, utm_medium, utm_campaign, utm_term,
>   utm_content, gclid, fbclid), `submittedAt` (ISO). Validate it with zod.
> - Create a lead with channel "Website" in the first pipeline stage,
>   assigned the same way the Meta Lead Ads import assigns leads
>   (round-robin). Store the student count, role, page and UTM data on it.
>   If a lead with the same phone exists from the last 30 days, add an
>   activity/note to it instead of creating a duplicate.
> - Respond 201 on success, 400 on bad input, 401 on a bad token. Answer
>   within 8 seconds.
> - Reply with the full production URL and how the token was generated, so
>   it can be set as CRM_LEAD_URL / CRM_LEAD_TOKEN on the website's Vercel
>   project. Do not include the token itself in chat; set it in both
>   places directly.

## Endpoint given by the CRM team (2026-10-12)

- URL (goes in Vercel as `CRM_LEAD_URL`): `https://smartshala-backend.onrender.com/api/v1/crm/leads/website`
- Auth: `Authorization: Bearer <token>`; the same value is `CRM_LEAD_TOKEN` on Vercel and `WEBSITE_LEAD_TOKEN` on the backend.
- Answers: 201 `{"leadCode":"LD-000123","created":true}`; 400 invalid body; 401 bad token. `created:false` = the school already had an open deal and the repeat was noted on it. Rate limit 60/min per IP.
- Checked 2026-10-12 from outside: a POST to that URL (no token, and with a dummy token) answered 400 `TENANT_CONTEXT_REQUIRED`, the same as any unknown `/api/v1` path, not 401. So the route did not look deployed on that server yet.
