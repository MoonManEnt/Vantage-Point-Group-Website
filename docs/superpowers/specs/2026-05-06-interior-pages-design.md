# Interior Pages Design Spec (Phase 1)

**Goal:** Build `/arms`, `/arms/[slug]`, `/about/kraken-method`, and `/events` — the four remaining Phase 1 interior pages.

**Architecture:** All pages are server components (RSC). No new npm dependencies. All ARM data sourced from `lib/arm-data.ts`. GHL-dependent section on `/events` ships as a styled placeholder.

**Tech Stack:** Next.js App Router · TypeScript strict · Tailwind CSS v4 (`var()` tokens) · Clash Display + Inter · GSAP (client components only where animation is needed)

---

## 1. File Structure

### New route files
| File | Purpose |
|---|---|
| `app/arms/page.tsx` | ARM index — server RSC, static |
| `app/arms/[slug]/page.tsx` | ARM detail — server RSC, `generateStaticParams` from `ARMS` |
| `app/about/kraken-method/page.tsx` | Kraken doctrine — server RSC, static |
| `app/events/page.tsx` | Events calendar — server RSC, static |

### New component files
| File | Purpose |
|---|---|
| `components/arms/ArmIndexGrid.tsx` | 10-ARM card grid for index page (server) |
| `components/arms/ArmDetailHero.tsx` | Full-bleed colored hero for detail page (server) |
| `components/arms/CrossArmLinks.tsx` | Grid of 9 sibling ARM links at bottom of detail page (server) |
| `components/about/KrakenDoctrine.tsx` | 3-section doctrine layout (server) |
| `components/events/EventsGrid.tsx` | Event cards layout (server) |
| `components/events/GhlFormPlaceholder.tsx` | Styled placeholder for GHL form (server) |

### Existing files to reference (do not modify)
- `lib/arm-data.ts` — `ARMS`, `getArmBySlug`, `getArmById` — all data lives here
- `components/ui/Button.tsx` — tiers: `primary`, `secondary`, `entity`, `tertiary`
- `app/globals.css` — design tokens: `--bg-base` (#0D1B2A), `--bg-surface` (#111a26), `--color-parchment`, `--color-orange`, etc.
- `components/sections/KrakenPrinciples.tsx` — existing homepage principle cards; do NOT reuse directly (detail page needs larger variant)

---

## 2. Shared Conventions

### Section wrapper pattern
Every page section follows this pattern (consistent with homepage sections):
```tsx
<section style={{ background: 'var(--bg-base)', padding: '80px 24px' }}>
  <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
    {/* content */}
  </div>
</section>
```
Alternating sections use `--bg-surface` to create depth.

### Page hero pattern
Every interior page opens with a hero section:
```tsx
<section style={{ background: 'var(--bg-base)', padding: '120px 24px 80px' }}>
  <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
    <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: ACCENT_COLOR, marginBottom: '16px' }}>
      {LABEL}
    </p>
    <h1 style={{ fontFamily: 'var(--font-clash)', fontWeight: 800, fontSize: 'clamp(32px, 5vw, 56px)', color: 'var(--color-parchment)', marginBottom: '16px' }}>
      {HEADLINE}
    </h1>
    <p style={{ fontSize: '16px', fontWeight: 300, color: 'rgba(245,240,232,0.55)', maxWidth: '560px', lineHeight: 1.6, marginBottom: '32px' }}>
      {SUBHEAD}
    </p>
  </div>
</section>
```

### Metadata
Each page exports a `generateMetadata` or static `metadata` object:
```tsx
export const metadata: Metadata = {
  title: 'PAGE TITLE',
  description: 'PAGE DESCRIPTION',
}
```

---

## 3. Page: /arms (ARM Index)

**File:** `app/arms/page.tsx`

### Sections
1. **Hero** (bg: `--bg-base`)
   - Label: `THE PORTFOLIO` (gold `#C9960C`)
   - h1: `Ten Arms. One Body.`
   - Subhead: "Every ARM operates independently. Every ARM feeds the whole. Find the one that fits your next move."
   - CTA: `<Button tier="primary" href="/quiz">Find Your ARM →</Button>`

2. **ARM Grid** (bg: `--bg-surface`)
   - Component: `<ArmIndexGrid />`
   - 2-column grid on desktop (`md:grid-cols-2`), single column on mobile
   - Each ARM card (see §3.1 below)

3. **Bottom CTA** (bg: `--bg-base`)
   - Centered text: "Not sure which ARM fits?" (Inter 400, 14px, muted)
   - `<Button tier="secondary" href="/quiz">Take the ARM Quiz →</Button>`

### 3.1 ARM Card (inside ArmIndexGrid)
Each of 10 ARM cards:
```
[left accent bar: 3px, ARM color, full height]
[content]
  ARM number (Inter 700, 10px, letter-spacing 0.15em, ARM color)  |  entity label (same)
  ARM name (Clash Display 700, 20px, --color-parchment)
  descriptor (Inter 400, 12px, rgba(245,240,232,0.5))
  resultDescription (Inter 400, 13px, rgba(245,240,232,0.65), 2-line clamp)
  "Explore [entity] →" (Button tier="tertiary", ARM color as inline style color)
```

Card styles:
- Background: `rgba(255,255,255,0.03)`
- Border: `1px solid rgba(255,255,255,0.08)`
- Border-radius: `6px`
- Padding: `24px`
- Hover: border-color → `rgba(255,255,255,0.2)`, transition 200ms

**No filter/sort.** Static render, no client state.

---

## 4. Page: /arms/[slug] (ARM Detail)

**File:** `app/arms/[slug]/page.tsx`

### Route generation
```tsx
export function generateStaticParams() {
  return ARMS.map((arm) => ({ slug: arm.slug }))
}
```
`notFound()` when `getArmBySlug(slug)` returns undefined.

### Metadata
Next.js 16: `params` is a `Promise` — must be awaited.
```tsx
type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const arm = getArmBySlug(slug)
  if (!arm) return {}
  return {
    title: arm.name,
    description: arm.resultDescription,
  }
}

export default async function ArmDetailPage({ params }: Props) {
  const { slug } = await params
  const arm = getArmBySlug(slug)
  if (!arm) notFound()
  // ...
}
```

### Sections
1. **Detail Hero** — component `<ArmDetailHero arm={arm} />`
   - Full-bleed section, bg: `--bg-base`
   - Top accent line: `4px solid [arm.color]`, full width
   - ARM number badge: `ARM [arm.id.toString().padStart(2,'0')]` pill — bg `rgba(arm.color, 0.15)`, text `arm.color`, Inter 700, 10px
   - h1: `arm.name` (Clash Display 800, clamp 36–52px)
   - Descriptor: `arm.descriptor` (Inter 400, 14px, muted)
   - Entity label: `arm.entity` (Inter 700, 11px, arm.color, letter-spacing 0.15em, uppercase)

2. **About section** (bg: `--bg-surface`)
   - Left-aligned label: `ABOUT THIS ARM` (arm.color, 10px, uppercase)
   - Body: `arm.resultDescription` (Inter 400, 16px, rgba(245,240,232,0.75), max-width 680px, line-height 1.75)

3. **Services Offered** (bg: `--bg-base`) — *template placeholder*
   - Section label: `WHAT WE DO` (arm.color, 10px)
   - 3-column grid, each item: `—` dash + placeholder text "Service area coming soon."
   - Note: `{/* TODO: populate arm-data.ts with services[] array */}`

4. **Who This Is For** (bg: `--bg-surface`) — *template placeholder*
   - Section label: `WHO THIS IS FOR` (arm.color, 10px)
   - 3 bullet items: "Operator profile coming soon."
   - Note: `{/* TODO: populate arm-data.ts with idealFor[] array */}`

5. **Cross-ARM Links** (bg: `--bg-base`)
   - Component: `<CrossArmLinks currentSlug={arm.slug} />`
   - Section label: `EXPLORE THE OTHER ARMS`
   - Compact card grid: all ARMs except the current one
   - Each compact card: left accent dot (arm color), arm name, descriptor, link `/arms/[slug]`

6. **CTA** (bg: `--bg-surface`)
   - Centered h2: "Ready to activate?" (Clash Display 700, 28px)
   - Subtext: "The ARM quiz matches you to the right entry point."
   - `<Button tier="primary" href="/quiz">Take the ARM Quiz →</Button>`

---

## 5. Page: /about/kraken-method

**File:** `app/about/kraken-method/page.tsx`

### Sections
1. **Hero** (bg: `--bg-base`)
   - Label: `THE OPERATING SYSTEM` (gold `#C9960C`)
   - h1: `The Kraken Method`
   - Subhead: "The proprietary operating philosophy behind every VPG engagement. Six principles. Seven decision filters. One organism."

2. **6 Principles** (bg: `--bg-surface`) — component `<KrakenDoctrine />`
   - Section label: `THE SIX PRINCIPLES`
   - Single-column stacked cards (larger than homepage 3×2 grid)
   - Each principle card:
     - Left border: `3px solid [accent]`
     - Number (accent color, Inter 700, 10px, letter-spacing 0.15em)
     - Name (Clash Display 700, 22px, --color-parchment)
     - Descriptor (Inter 400, 12px, muted) — same as homepage
     - Body copy: 2-sentence expansion of each principle (see §5.1)
   - Principle data: hard-coded in `KrakenDoctrine.tsx` (same 6 entries as `KrakenPrinciples.tsx`)

3. **7 Decision Filters** (bg: `--bg-base`)
   - Section label: `THE SEVEN FILTERS`
   - Section subhead: "Before every engagement, VPG runs seven questions. If a move fails more than two, it doesn't happen."
   - Numbered list: 7 items, each with a filter name and one-sentence description
   - **Content:** placeholders — `{/* TODO: replace with actual Kraken doctrine copy */}`
   - Placeholder filters (replace with real doctrine):
     1. "Does this build authority or chase attention?"
     2. "Can all applicable ARMs be activated?"
     3. "Is there a clear path to sustained engagement?"
     4. "Does this feed back into the portfolio body?"
     5. "Have we earned depth in this market?"
     6. "Is our system — not our price — the differentiator?"
     7. "Is this faith-rooted and results-verified?"

4. **ARM Anatomy** (bg: `--bg-surface`)
   - Section label: `ANATOMY OF AN ARM`
   - Section subhead: "Every ARM shares the same six-part structure. Different market. Same organism."
   - 6-part grid:
     | # | Part | Description |
     |---|---|---|
     | 01 | Market Position | The specific niche the ARM owns |
     | 02 | Delivery Method | How the ARM executes for clients |
     | 03 | Revenue Model | How the ARM generates and shares revenue |
     | 04 | Body Integration | How it cross-refers and feeds other ARMs |
     | 05 | IPA Activation | How partners earn from this ARM |
     | 06 | Tech Stack | Proprietary tools or platforms the ARM uses |

5. **CTA** (bg: `--bg-base`)
   - Centered: "Find your ARM entry point."
   - `<Button tier="primary" href="/quiz">Take the ARM Quiz →</Button>`

### 5.1 Principle Body Copy (per KrakenDoctrine)
| # | Name | Body copy (2 sentences) |
|---|---|---|
| 01 | Position Don't Chase | "VPG builds authority through content, partnerships, and market positioning — not by pursuing every opportunity. The business that defines the category controls the conversation." |
| 02 | Extend Simultaneously | "Every new client activates all applicable ARMs from day one, not sequentially. The compounding effect of multiple arms working in parallel is the Kraken's structural advantage." |
| 03 | Capture Through Contact | "Consistent, high-value contact converts prospects into clients and clients into advocates. Engagement isn't a tactic — it's the mechanism." |
| 04 | Every Arm Feeds the Body | "Cross-referral between ARMs is a reflex, not an afterthought. When one ARM serves a client, every other applicable ARM is evaluated and offered." |
| 05 | Depth Before Breadth | "VPG masters a market before expanding into the next one. Shallow presence in five markets is worth less than dominant presence in one." |
| 06 | Body Is the Differentiator | "No single ARM is the product — the integrated operating system is. Competitors can copy a service; they cannot copy an organism." |

---

## 6. Page: /events

**File:** `app/events/page.tsx`

### Sections
1. **Hero** (bg: `--bg-base`)
   - Label: `EVENTS` (violet `#5B3FA8`)
   - h1: `Where the Body Gathers`
   - Subhead: "Monthly Power Hours, the annual VPG Summit, and the IPA Partner Summit. Operator-only. Results-first."

2. **Power Hour** (bg: `--bg-surface`, id="power-hour")
   - Two-column layout: info left, form right
   - Left:
     - Badge: `MONTHLY` (violet bg, white text, Inter 700, 9px)
     - h2: `VPG Power Hour` (Clash Display 700, 28px)
     - Meta: `Virtual · First Thursday of Every Month`
     - Description: "One hour. One ARM in focus. Operators, partners, and VPG principals on the same call. No slides — just execution."
     - `<Button tier="entity" entityColor="#5B3FA8" href="#power-hour">Register Below →</Button>`
   - Right: `<GhlFormPlaceholder label="Reserve Your Spot" />`

3. **Annual Events** (bg: `--bg-base`)
   - Section label: `ANNUAL EVENTS` (orange `#E8541A`)
   - Two event cards side by side (stack on mobile):
     - **VPG Summit** — Q4 · Dallas, TX · "The annual operator summit. Two days of execution strategy, ARM deep-dives, and direct access to the VPG principals."
     - **IPA Partner Summit** — Q2 · Dallas, TX · "The annual gathering for IPA Certified and Premier partners. Certification reviews, commission reviews, and new ARM previews."
   - Event card style: bg `--bg-surface`, border `1px solid rgba(255,255,255,0.08)`, padding 28px, radius 6px
   - Each card: colored top bar (4px), event name (Clash Display 700, 20px), quarter + location badge, description, `Notify Me →` button (tertiary)

4. **CTA** (bg: `--bg-surface`)
   - Centered: "Not sure which ARM to focus on?"
   - `<Button tier="primary" href="/quiz">Take the ARM Quiz →</Button>`

### 6.1 GhlFormPlaceholder component
```tsx
// components/events/GhlFormPlaceholder.tsx
export function GhlFormPlaceholder({ label }: { label: string }) {
  return (
    <div
      id="ghl-form-placeholder"
      style={{
        background: 'rgba(91,63,168,0.06)',
        border: '1px dashed rgba(91,63,168,0.3)',
        borderRadius: '6px',
        padding: '32px 24px',
        textAlign: 'center',
      }}
    >
      <p style={{ fontFamily: 'var(--font-clash)', fontWeight: 700, fontSize: '14px', color: 'var(--color-parchment)', marginBottom: '8px' }}>
        {label}
      </p>
      <p style={{ fontSize: '12px', color: 'rgba(245,240,232,0.4)', lineHeight: 1.6 }}>
        Registration form coming soon.{' '}
        <a href="mailto:info@vantagepointgroup.com" style={{ color: '#5B3FA8', textDecoration: 'underline' }}>
          Email us to reserve your spot.
        </a>
      </p>
      {/* TODO: replace with GHL iframe embed once form URL is available */}
    </div>
  )
}
```

---

## 7. Routing & Navigation

The root layout (`app/layout.tsx`) already renders `<Navigation />` on every page.

**Two nav fixes required as part of this plan:**

1. **Kraken Method link** — `components/nav/Navigation.tsx` line 12 currently points to `/kraken-method`. Change to `/about/kraken-method` to match the route this plan creates.

2. **MegaMenu "View All" link** — `components/nav/MegaMenu.tsx` links to individual `/arms/[slug]` pages but has no link to the `/arms` index. Add a "View all 10 ARMs →" tertiary link at the bottom of the MegaMenu pointing to `/arms`.

**Already correct (no change needed):**
- `Events` → `/events` ✅
- `Partners` → `/partners` ✅
- MegaMenu ARM cards → `/arms/[slug]` ✅

---

## 8. Testing

Each page gets a smoke-test file in `tests/unit/`:
- `ArmIndexGrid.test.tsx` — renders all 10 ARM names, all 10 links to `/arms/[slug]`
- `ArmDetailTemplate.test.tsx` — renders correct ARM name, descriptor, cross-ARM count = 9
- `KrakenDoctrine.test.tsx` — renders 6 principle cards, 7 filter items, 6 anatomy items
- `EventsGrid.test.tsx` — renders Power Hour section, both annual event cards, GHL placeholder

Pattern: `render(<Component />)` + `getByText` / `getByRole` / `container.querySelectorAll`. No GSAP on these components so no mock needed. Match existing test style in `tests/unit/`.

---

## 9. Out of Scope

- `/partners` — deferred; requires GHL form URL (separate spec + plan)
- Filter/sort on ARM index — not needed with 10 items
- Client-side animations — no GSAP on these pages (content-forward, no scroll drama needed)
- ARM data expansion (`services[]`, `idealFor[]`) — placeholder sections ship first; data filled post-launch
- i18n — Phase 2
