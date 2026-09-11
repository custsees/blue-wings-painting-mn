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
| `content/site.ts` | **Single source of truth.** Business facts, services, before/after pairs, process. Change copy here, not in pages. |
| `app/globals.css` | Design tokens and shared classes. Palette is measured from client assets — see the comment at the top. |
| `components/BeforeAfter.tsx` | The signature drag-to-reveal ("the wet edge"). |
| `content/assistant.ts` | Assistant knowledge base. Answers and keywords. |
| `components/assistant-match.ts` | Retrieval: scores a question against the knowledge base. |
| `components/Assistant.tsx` | The chat panel UI. |
| `app/api/quote/route.ts` | Quote submissions. Optional Neon persistence. |
| `public/img/` | Real client photos, renamed. Originals in `../assets/source/`. |
| `qa/` | Screenshots from the build QA pass. Not shipped. |

## Environment

| Variable | Required | Effect |
|---|---|---|
| `DATABASE_URL` | No | Neon connection string. **Without it the quote route still accepts leads and logs them** rather than failing at a customer. Set it in Vercel to start persisting — no code change needed. |

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
  submitted_at timestamptz not null
);
```

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
- **Palette is measured, not chosen.** `#5170FF` is sampled from the logo file
  (37.2% of its opaque pixels); the cedar accent is sampled from the real
  deck-after photo. Neither was picked by eye.
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
- **The logo has no alpha channel** — it is a circular badge on an opaque white
  square, so it is clipped to a circle in CSS. Drop that rule if Jessica sends a
  transparent file.
- **The live site's `<title>` says "Blue Wings Pinting MN".** That typo is what
  Google has indexed today. Fixed here.
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
