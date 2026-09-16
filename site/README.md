# Blue Wings Painting MN — website

Next.js 16 (App Router) + Tailwind 4, built for Vercel. Five pages, no CMS —
every published fact lives in one file.

The project brief and the fact-and-proof ledger are kept privately, outside this
repo. **Check the ledger before changing any copy** — several things on this site
are absent on purpose, and the ledger records why.

## Run it

```bash
npm install
npm run dev
```

Build and serve the production output:

```bash
npm run build && npm run start
```

## Where things live

| Path | What |
|---|---|
| `content/i18n.ts` | **All visitor-facing copy, both languages.** Change wording here, not in pages. |
| `content/site.ts` | Locale-invariant facts and assets: phone, email, image paths, crop positions, slugs. One place to correct a fact. |
| `app/globals.css` | Design tokens and shared classes. Palette is measured from client assets — see the comment at the top. |
| `components/BeforeAfter.tsx` | The signature drag-to-reveal ("the wet edge"). |
| `components/assistant-match.ts` | Assistant retrieval: builds the knowledge base per locale and scores questions against it. |
| `components/Theme.tsx` | Theme toggle + the inline no-flash script. |
| `components/Assistant.tsx` | The chat panel UI. |
| `app/api/quote/route.ts` | Quote submissions. Optional Neon persistence. |
| `public/img/` | Real client photos, renamed. Originals in `../assets/source/`. |
| `qa/` | Screenshots from the build QA pass. Not shipped. |

## Languages

English is primary and is served at the **site root** (`/`, `/services`, …).
Spanish lives under `/es`. Both are real, statically generated routes, so both
get indexed and `hreflang` works; a client-side toggle would leave the Spanish
copy invisible to search.

Routes live under `app/[locale]/` so the layout can set `<html lang>` correctly.
The rewrites in `next.config.ts` map the bare English paths onto `/en`
internally — which is why English has no visible prefix and the homepage the
client shares does not take a redirect hop.

To add or change copy, edit `content/i18n.ts`. The `Dict` type makes a missing
translation a build error rather than a silent English fallback.

## Theming

Light is the default and is what every visitor gets on first load. Dark is
opt-in via the header toggle and remembered in `localStorage`. `prefers-color-scheme`
is deliberately **not** consulted — the client asked for light on load.

The theme redefines the *same* token names rather than adding new ones, so every
CSS module and styled-jsx block flips without being touched. Two families:
`--paper`/`--text` for the page, `--band`/`--band-fg` for the full-width feature
sections (`.on-ink`). `--ink` stays genuinely dark in both themes for the few
places where dark is the point regardless.

## Environment

| Variable | Required | Effect |
|---|---|---|
| `DATABASE_URL` | No | Neon connection string. **Without it the quote route still accepts leads and logs them** rather than failing at a customer. Set it in Vercel to start persisting — no code change needed. |

Note there is **no email service and no API key**. See "How an estimate reaches Jessica" below.

Table expected by the route:

```sql
create table quote_requests (
  id           bigserial primary key,
  name         text not null,
  phone        text not null,
  email        text,
  city         text not null,
  service      text not null,
  details      text,
  locale       text not null default 'en',
  submitted_at timestamptz not null
);
```

## How an estimate reaches Jessica

Submitting the quote form does two independent things, so no single failure
loses a lead:

1. **POSTs to `/api/quote`** — records it server-side, and persists to Neon once
   `DATABASE_URL` is set.
2. **Hands the visitor a pre-filled email** — `mailto:` with a triage-ready
   subject (`Free estimate — {service} in {city}`) and one labelled line per
   field. This is the same handoff the mariachi build uses, and today it is the
   only path that actually reaches her inbox.

A `400` stops the flow and shows the validation message, because that is
something the visitor can fix. Any other failure — offline, server down — is
not their problem, so the email goes anyway.

The body carries **which language the customer wrote in**, so Jessica knows
whether to reply in Spanish. Empty optional fields render as `—`.

`mailto:` has one real failure mode: a device with no mail client configured
opens nothing, silently. The confirmation screen handles that — it explains
what should have happened, offers an "open my email again" button, and falls
back to the phone number and address as plain text.

**To replace this with true server-side sending later** (Resend, Postmark, SMTP
on Jessica's own account), add it inside `app/api/quote/route.ts` next to the
Neon write. Keep the `mailto` as the fallback for when the provider is down or
out of quota.

## Deploying

Deploy to **Jessica's own Vercel account** (she owns the project and pays for it
directly — no markup, per the $10K-websites ownership model).

**Before touching DNS:** check the MX records on `bluewingspainting.com` at
GoDaddy. `bluewingspaintingmn@gmail.com` is a Gmail address so mail is probably
not on the domain, but the domain may still carry forwarding records. Confirm in
writing before changing nameservers.

## Decisions worth knowing

- **The before/after is the argument.** Three verified pairs — the same surface
  photographed twice. Everything else on the site supports them.
- **Palette is measured, not chosen.** `#0062FB` is sampled from the wings in
  the 2026 logo; the cedar accent is sampled from the real deck-after photo.
  Neither was picked by eye. The brand blue carries white text at 5.07:1, so
  the primary CTA uses it directly.
- **No testimonials, no years-in-business, no licence number, no warranty, no
  prices.** None of those are confirmed. Empty beats invented — see the ledger.
- **Reveal animations are progressive enhancement.** The CSS that hides
  `.reveal` elements is scoped to `[data-reveal-armed]`, which only JS sets. No
  JS means everything renders, just without transitions.
- **No reveal on the services grids or the services page list items.** Those
  grids fake their cell borders with 1px gaps over a tinted background, so a
  cell at `opacity: 0` shows as a solid block; and the list items are anchor
  targets, where the reveal's 22px translate pushed headings under the sticky
  header.
- **The logo sits in a dark chip.** The 2026 logo is a rendered composite on a
  `#1F1F1F` ground, not a transparent mark, so it cannot sit on a light
  background without showing a rectangle. It is given that ground explicitly:
  invisible in the dark theme, a deliberate dark chip in the light one. A
  transparent source would let the chip go away.
- **The logo is one file, cropped by CSS.** `public/img/blue-wings-logo.jpg` is
  the full 1123x1123 square. The header shows only the wings via a sized box
  plus `object-position`, rather than shipping a second cropped file to keep in
  sync. `app/icon.png` is the one derived asset (a 256px square crop above the
  wordmark).
- **styled-jsx does not scope elements rendered by `<Link>`.** It adds its
  `jsx-*` class to DOM elements in the component's own JSX only, so a rule like
  `.nav-desktop a` compiles to `a.jsx-xxx` and silently never matches. Any rule
  targeting a Link (or an Image) must use `:global()` with a scoped ancestor —
  e.g. `.nav-desktop :global(a)`. This had quietly killed the desktop nav
  typography, the mobile menu typography, and the mobile hiding of the header's
  "Free estimate" button.
- **The live site's `<title>` says "Blue Wings Pinting MN".** That typo is what
  Google has indexed today. Fixed here.
- **The assistant answers in the visitor's language.** Same retrieval in both;
  Spanish adds its own keyword and phrase sets. Accents are stripped before
  matching, so "¿cuánto?" matches "cuanto". One trap worth knowing: Spanish
  *techo* means both "ceiling" (which they paint) and "roof" (which they do
  not), so there is an explicit out-of-scope entry whose phrases outscore the
  painting services for roofing questions.
- **The assistant is retrieval, not a language model.** It scores the question
  against `content/assistant.ts` and returns the best entry, so it can only say
  what the site already says. No API key, no per-message cost, no latency, and
  no chance of inventing a price or a warranty — which on a contractor site is
  a liability, not a typo. Price, timeline, licence/insurance, hours and
  reviews all get deliberate "that isn't published — call and ask" answers.

  To add an LLM later (Jessica's OpenRouter key, per the original brief), use
  these entries as grounding context and keep the retrieval as the fallback for
  when the API is down or rate-limited.

## Not built yet — blocked, not forgotten

Each has a reserved slot in the layout and a comment at the insertion point.

| Feature | Blocked on |
|---|---|
| Facebook feed embed | Facebook page access / app review. A direct link ships in its place rather than a faked feed. |
| Availability / booking calendar | Jessica choosing a scheduling system. The quote form ships first; the calendar drops into the Contact sidebar without a layout change. |
| Bilingual EN/ES | Confirmation of whether she wants full Spanish pages or the current "Hablamos Español" note. The site is English with Spanish contact copy on About. |
