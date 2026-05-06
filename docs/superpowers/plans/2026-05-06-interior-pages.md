# Interior Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `/arms`, `/arms/[slug]`, `/about/kraken-method`, and `/events` — the four remaining Phase 1 interior pages — plus two nav fixes required to link to them correctly.

**Architecture:** All pages are server RSCs. Components live in `components/arms/`, `components/about/`, `components/events/`. All data from `lib/arm-data.ts`. `/arms/[slug]` uses `generateStaticParams` + async params (Next.js 16). `/events` GHL form ships as a styled placeholder. Nav fixes: update `/kraken-method` → `/about/kraken-method` and add "View all" link to MegaMenu.

**Tech Stack:** Next.js 16 App Router · TypeScript strict · Tailwind CSS v4 · `var()` design tokens from `app/globals.css` · Clash Display (`var(--font-clash)`) + Inter · `components/ui/Button.tsx` (tiers: primary/secondary/entity/tertiary) · Vitest + @testing-library/react

---

## File Map

| Action | File |
|---|---|
| Modify | `components/nav/Navigation.tsx` |
| Modify | `components/nav/MegaMenu.tsx` |
| Modify | `tests/unit/Navigation.test.tsx` |
| Modify | `tests/unit/MegaMenu.test.tsx` |
| Create | `components/arms/ArmIndexGrid.tsx` |
| Create | `app/arms/page.tsx` |
| Create | `tests/unit/ArmIndexGrid.test.tsx` |
| Create | `components/arms/ArmDetailHero.tsx` |
| Create | `components/arms/CrossArmLinks.tsx` |
| Create | `app/arms/[slug]/page.tsx` |
| Create | `tests/unit/ArmDetailPage.test.tsx` |
| Create | `components/about/KrakenDoctrine.tsx` |
| Create | `app/about/kraken-method/page.tsx` |
| Create | `tests/unit/KrakenDoctrine.test.tsx` |
| Create | `components/events/GhlFormPlaceholder.tsx` |
| Create | `components/events/EventsGrid.tsx` |
| Create | `app/events/page.tsx` |
| Create | `tests/unit/EventsGrid.test.tsx` |

---

## Design Tokens Reference

```
--bg-base:    #0D1B2A   (primary background — use on alternating sections)
--bg-surface: #111a26   (elevated background — use on alternating sections)
--color-parchment: #F5F0E8
--color-orange:    #E8541A
--color-gold:      #C9960C
--color-violet:    #5B3FA8
--font-clash: var(--font-clash)   (Clash Display — headings)
--font-inter: system-ui           (Inter — body)
```

ARM colors from `lib/arm-data.ts`:
- ARM 1 VPM: `#E8541A` · ARM 2 D2G: `#00B4CB` · ARM 3 Capital: `#C9960C`
- ARM 4 GTM: `#5B3FA8` · ARM 5 Academy: `#3B6D11` · ARM 6 Ventures: `#C9960C`
- ARM 7 IPA: `#3B6D11` · ARM 8 AMELIA: `#00B4CB` · ARM 9 Influence: `#5B3FA8`
- ARM 10 Global: `#E8541A`

---

## Task 1: Nav fixes — /kraken-method and MegaMenu "View All"

**Files:**
- Modify: `components/nav/Navigation.tsx`
- Modify: `components/nav/MegaMenu.tsx`
- Modify: `tests/unit/Navigation.test.tsx`
- Modify: `tests/unit/MegaMenu.test.tsx`

**Context:** Navigation line 12 links `The Kraken Method` to `/kraken-method` but the page will live at `/about/kraken-method`. MegaMenu shows 10 ARM links but no link to the `/arms` index. Both need fixing before pages exist so the nav is correct on deploy.

- [ ] **Step 1: Write the failing nav test**

Add this test to the bottom of `tests/unit/Navigation.test.tsx` (inside the existing `describe` block):

```tsx
it('links The Kraken Method to /about/kraken-method', () => {
  render(<Navigation />)
  const link = screen.getByRole('link', { name: /the kraken method/i })
  expect(link).toHaveAttribute('href', '/about/kraken-method')
})
```

- [ ] **Step 2: Run it to confirm it fails**

```bash
npm test -- tests/unit/Navigation.test.tsx
```

Expected: FAIL — `expect(received).toHaveAttribute("href", "/about/kraken-method")` — received `/kraken-method`

- [ ] **Step 3: Fix the nav link**

In `components/nav/Navigation.tsx`, find the `NAV_LINKS` array (around line 10–15). Change:

```tsx
{ label: 'The Kraken Method', href: '/kraken-method' },
```

to:

```tsx
{ label: 'The Kraken Method', href: '/about/kraken-method' },
```

- [ ] **Step 4: Run navigation test — expect PASS**

```bash
npm test -- tests/unit/Navigation.test.tsx
```

Expected: all tests pass

- [ ] **Step 5: Write the failing MegaMenu "View All" test**

Add this test to the bottom of `tests/unit/MegaMenu.test.tsx` (inside the existing `describe` block):

```tsx
it('renders a "View all 10 ARMs" link to /arms', () => {
  render(<MegaMenu isOpen={true} />)
  const viewAll = screen.getByRole('link', { name: /view all 10 arms/i })
  expect(viewAll).toHaveAttribute('href', '/arms')
})
```

- [ ] **Step 6: Run it to confirm it fails**

```bash
npm test -- tests/unit/MegaMenu.test.tsx
```

Expected: FAIL — unable to find link with name `/view all 10 arms/i`

- [ ] **Step 7: Add View All link to MegaMenu**

In `components/nav/MegaMenu.tsx`, after the closing `</div>` of the `grid grid-cols-2` div but before the closing `</div>` of `max-w-7xl mx-auto`, add:

```tsx
<div className="mt-4 pt-4 border-t border-[rgba(245,240,232,0.08)] text-right">
  <Link
    href="/arms"
    className="text-[var(--color-gold)] text-[9px] font-semibold tracking-[0.15em] uppercase
               hover:underline underline-offset-4"
    tabIndex={isOpen ? undefined : -1}
    {...(onClose ? { onClick: onClose } : {})}
  >
    View all 10 ARMs →
  </Link>
</div>
```

- [ ] **Step 8: Run MegaMenu test — expect PASS**

```bash
npm test -- tests/unit/MegaMenu.test.tsx
```

Expected: all tests pass (existing 5 + new 1 = 6 passing)

- [ ] **Step 9: Run full test suite**

```bash
npm test
```

Expected: all existing tests continue to pass

- [ ] **Step 10: Commit**

```bash
git add components/nav/Navigation.tsx components/nav/MegaMenu.tsx \
        tests/unit/Navigation.test.tsx tests/unit/MegaMenu.test.tsx
git commit -m "fix: nav links /about/kraken-method + MegaMenu view all /arms"
```

---

## Task 2: ArmIndexGrid component + /arms page

**Files:**
- Create: `components/arms/ArmIndexGrid.tsx`
- Create: `app/arms/page.tsx`
- Create: `tests/unit/ArmIndexGrid.test.tsx`

**Context:** The `/arms` index page shows all 10 ARMs in a 2-column card grid. Each card has a left accent bar in the ARM's color, the ARM number, name, descriptor, `resultDescription` snippet (2-line clamp), and a `Explore [entity] →` link to `/arms/[slug]`. The page is a server RSC — no client state. `ArmIndexGrid` receives the `ARMS` array as a prop so it's testable in isolation.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/ArmIndexGrid.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { ArmIndexGrid } from '@/components/arms/ArmIndexGrid'
import { ARMS } from '@/lib/arm-data'

describe('ArmIndexGrid', () => {
  it('renders all 10 ARM names', () => {
    render(<ArmIndexGrid arms={ARMS} />)
    ARMS.forEach((arm) => {
      expect(screen.getByText(arm.name)).toBeInTheDocument()
    })
  })

  it('renders 10 Explore links pointing to correct slugs', () => {
    render(<ArmIndexGrid arms={ARMS} />)
    ARMS.forEach((arm) => {
      const link = screen.getByRole('link', { name: new RegExp(`explore ${arm.entity}`, 'i') })
      expect(link).toHaveAttribute('href', `/arms/${arm.slug}`)
    })
  })

  it('renders each ARM descriptor', () => {
    render(<ArmIndexGrid arms={ARMS} />)
    expect(screen.getByText(ARMS[0].descriptor)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to confirm it fails**

```bash
npm test -- tests/unit/ArmIndexGrid.test.tsx
```

Expected: FAIL — `Cannot find module '@/components/arms/ArmIndexGrid'`

- [ ] **Step 3: Create ArmIndexGrid component**

Create `components/arms/ArmIndexGrid.tsx`:

```tsx
import Link from 'next/link'
import type { Arm } from '@/lib/arm-data'

interface ArmIndexGridProps {
  arms: Arm[]
}

export function ArmIndexGrid({ arms }: ArmIndexGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))',
        gap: '16px',
      }}
    >
      {arms.map((arm) => (
        <div
          key={arm.id}
          style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px',
            overflow: 'hidden',
            transition: 'border-color 200ms',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLDivElement).style.borderColor =
              'rgba(255,255,255,0.2)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLDivElement).style.borderColor =
              'rgba(255,255,255,0.08)'
          }}
        >
          {/* Left accent bar */}
          <div style={{ width: '3px', background: arm.color, flexShrink: 0 }} />

          {/* Card content */}
          <div style={{ padding: '24px', flex: 1 }}>
            {/* Number + entity */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: arm.color,
                }}
              >
                ARM {arm.id.toString().padStart(2, '0')}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: arm.color,
                  opacity: 0.7,
                }}
              >
                {arm.entity}
              </span>
            </div>

            {/* Name */}
            <h2
              style={{
                fontFamily: 'var(--font-clash)',
                fontWeight: 700,
                fontSize: '20px',
                color: 'var(--color-parchment)',
                marginBottom: '4px',
              }}
            >
              {arm.name}
            </h2>

            {/* Descriptor */}
            <p
              style={{
                fontSize: '12px',
                color: 'rgba(245,240,232,0.5)',
                marginBottom: '12px',
              }}
            >
              {arm.descriptor}
            </p>

            {/* resultDescription — 2-line clamp */}
            <p
              style={{
                fontSize: '13px',
                color: 'rgba(245,240,232,0.65)',
                lineHeight: 1.6,
                marginBottom: '16px',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {arm.resultDescription}
            </p>

            {/* CTA link */}
            <Link
              href={`/arms/${arm.slug}`}
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: arm.color,
                textDecoration: 'none',
              }}
            >
              Explore {arm.entity} →
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Run test — expect PASS**

```bash
npm test -- tests/unit/ArmIndexGrid.test.tsx
```

Expected: 3 tests pass

- [ ] **Step 5: Create /arms page**

Create `app/arms/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { ARMS } from '@/lib/arm-data'
import { ArmIndexGrid } from '@/components/arms/ArmIndexGrid'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'The Portfolio — 10 ARMs',
  description:
    'All ten Adaptive Reach Movements. Every ARM operates independently. Every ARM feeds the whole.',
}

export default function ArmsIndexPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: 'var(--bg-base)', padding: '120px 24px 80px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              marginBottom: '16px',
            }}
          >
            The Portfolio
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-clash)',
              fontWeight: 800,
              fontSize: 'clamp(32px, 5vw, 56px)',
              color: 'var(--color-parchment)',
              marginBottom: '16px',
            }}
          >
            Ten Arms. One Body.
          </h1>
          <p
            style={{
              fontSize: '16px',
              fontWeight: 300,
              color: 'rgba(245,240,232,0.55)',
              maxWidth: '560px',
              lineHeight: 1.6,
              marginBottom: '32px',
            }}
          >
            Every ARM operates independently. Every ARM feeds the whole. Find the one that fits
            your next move.
          </p>
          <Button tier="primary" href="/quiz">
            Find Your ARM →
          </Button>
        </div>
      </section>

      {/* ARM Grid */}
      <section style={{ background: 'var(--bg-surface)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <ArmIndexGrid arms={ARMS} />
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ background: 'var(--bg-base)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', textAlign: 'center' }}>
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(245,240,232,0.5)',
              marginBottom: '20px',
            }}
          >
            Not sure which ARM fits?
          </p>
          <Button tier="secondary" href="/quiz">
            Take the ARM Quiz →
          </Button>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 6: Run full test suite**

```bash
npm test
```

Expected: all tests pass (no regressions)

- [ ] **Step 7: Commit**

```bash
git add components/arms/ArmIndexGrid.tsx app/arms/page.tsx \
        tests/unit/ArmIndexGrid.test.tsx
git commit -m "feat: /arms index page with 10-ARM grid"
```

---

## Task 3: ArmDetailHero + CrossArmLinks + /arms/[slug] page

**Files:**
- Create: `components/arms/ArmDetailHero.tsx`
- Create: `components/arms/CrossArmLinks.tsx`
- Create: `app/arms/[slug]/page.tsx`
- Create: `tests/unit/ArmDetailPage.test.tsx`

**Context:** The ARM detail page is a template shell — it renders the ARM's existing data with placeholder sections for "Services Offered" and "Who This Is For" that will be filled post-launch. `generateStaticParams` pre-builds all 10 slug routes at build time. In Next.js 16, `params` is `Promise<{ slug: string }>` — must be awaited in both `generateMetadata` and the page component.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/ArmDetailPage.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { ArmDetailHero } from '@/components/arms/ArmDetailHero'
import { CrossArmLinks } from '@/components/arms/CrossArmLinks'
import { ARMS } from '@/lib/arm-data'

const vpm = ARMS[0] // Vantage Point Media

describe('ArmDetailHero', () => {
  it('renders the ARM name as h1', () => {
    render(<ArmDetailHero arm={vpm} />)
    expect(screen.getByRole('heading', { level: 1, name: vpm.name })).toBeInTheDocument()
  })

  it('renders the ARM descriptor', () => {
    render(<ArmDetailHero arm={vpm} />)
    expect(screen.getByText(vpm.descriptor)).toBeInTheDocument()
  })

  it('renders the ARM number badge', () => {
    render(<ArmDetailHero arm={vpm} />)
    expect(screen.getByText('ARM 01')).toBeInTheDocument()
  })
})

describe('CrossArmLinks', () => {
  it('renders 9 links — all ARMs except the current one', () => {
    render(<CrossArmLinks currentSlug={vpm.slug} />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(9)
  })

  it('does not render a link for the current ARM', () => {
    render(<CrossArmLinks currentSlug={vpm.slug} />)
    expect(screen.queryByText(vpm.name)).not.toBeInTheDocument()
  })

  it('each sibling ARM links to its /arms/[slug] path', () => {
    render(<CrossArmLinks currentSlug={vpm.slug} />)
    const d2g = ARMS[1]
    const link = screen.getByRole('link', { name: new RegExp(d2g.name, 'i') })
    expect(link).toHaveAttribute('href', `/arms/${d2g.slug}`)
  })
})
```

- [ ] **Step 2: Run to confirm it fails**

```bash
npm test -- tests/unit/ArmDetailPage.test.tsx
```

Expected: FAIL — `Cannot find module '@/components/arms/ArmDetailHero'`

- [ ] **Step 3: Create ArmDetailHero component**

Create `components/arms/ArmDetailHero.tsx`:

```tsx
import type { Arm } from '@/lib/arm-data'

interface ArmDetailHeroProps {
  arm: Arm
}

export function ArmDetailHero({ arm }: ArmDetailHeroProps) {
  return (
    <section style={{ background: 'var(--bg-base)', paddingBottom: '80px' }}>
      {/* Top accent line */}
      <div style={{ height: '4px', background: arm.color, width: '100%' }} />

      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '80px 24px 0' }}>
        {/* ARM number badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: `${arm.color}26`,
            border: `1px solid ${arm.color}4D`,
            borderRadius: '4px',
            padding: '4px 10px',
            marginBottom: '24px',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: arm.color,
            }}
          >
            ARM {arm.id.toString().padStart(2, '0')}
          </span>
        </div>

        {/* Entity label */}
        <p
          style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: arm.color,
            marginBottom: '12px',
          }}
        >
          {arm.entity}
        </p>

        {/* ARM name */}
        <h1
          style={{
            fontFamily: 'var(--font-clash)',
            fontWeight: 800,
            fontSize: 'clamp(36px, 5vw, 52px)',
            color: 'var(--color-parchment)',
            marginBottom: '12px',
          }}
        >
          {arm.name}
        </h1>

        {/* Descriptor */}
        <p
          style={{
            fontSize: '14px',
            color: 'rgba(245,240,232,0.55)',
            fontWeight: 300,
          }}
        >
          {arm.descriptor}
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create CrossArmLinks component**

Create `components/arms/CrossArmLinks.tsx`:

```tsx
import Link from 'next/link'
import { ARMS } from '@/lib/arm-data'

interface CrossArmLinksProps {
  currentSlug: string
}

export function CrossArmLinks({ currentSlug }: CrossArmLinksProps) {
  const siblings = ARMS.filter((a) => a.slug !== currentSlug)

  return (
    <section style={{ background: 'var(--bg-base)', padding: '80px 24px' }}>
      <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
        <p
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(245,240,232,0.4)',
            marginBottom: '24px',
          }}
        >
          Explore the Other Arms
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '12px',
          }}
        >
          {siblings.map((arm) => (
            <Link
              key={arm.id}
              href={`/arms/${arm.slug}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '12px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '6px',
                textDecoration: 'none',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: arm.color,
                  flexShrink: 0,
                  marginTop: '5px',
                }}
              />
              <div>
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--color-parchment)',
                    marginBottom: '2px',
                  }}
                >
                  {arm.name}
                </p>
                <p
                  style={{
                    fontSize: '10px',
                    color: 'rgba(245,240,232,0.4)',
                  }}
                >
                  {arm.descriptor}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Run tests — expect PASS**

```bash
npm test -- tests/unit/ArmDetailPage.test.tsx
```

Expected: 6 tests pass

- [ ] **Step 6: Create /arms/[slug] page**

Create `app/arms/[slug]/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ARMS, getArmBySlug } from '@/lib/arm-data'
import { ArmDetailHero } from '@/components/arms/ArmDetailHero'
import { CrossArmLinks } from '@/components/arms/CrossArmLinks'
import { Button } from '@/components/ui/Button'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return ARMS.map((arm) => ({ slug: arm.slug }))
}

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

  return (
    <>
      <ArmDetailHero arm={arm} />

      {/* About */}
      <section style={{ background: 'var(--bg-surface)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: arm.color,
              marginBottom: '20px',
            }}
          >
            About This Arm
          </p>
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(245,240,232,0.75)',
              lineHeight: 1.75,
              maxWidth: '680px',
            }}
          >
            {arm.resultDescription}
          </p>
        </div>
      </section>

      {/* Services Offered — template placeholder */}
      <section style={{ background: 'var(--bg-base)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: arm.color,
              marginBottom: '32px',
            }}
          >
            What We Do
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                style={{
                  borderLeft: `2px solid ${arm.color}`,
                  paddingLeft: '16px',
                }}
              >
                <p
                  style={{
                    fontSize: '13px',
                    color: 'rgba(245,240,232,0.35)',
                    fontStyle: 'italic',
                  }}
                >
                  — Service area coming soon.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who This Is For — template placeholder */}
      <section style={{ background: 'var(--bg-surface)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: arm.color,
              marginBottom: '32px',
            }}
          >
            Who This Is For
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3].map((n) => (
              <li
                key={n}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '13px',
                  color: 'rgba(245,240,232,0.35)',
                  fontStyle: 'italic',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: arm.color,
                    opacity: 0.4,
                    flexShrink: 0,
                  }}
                />
                Operator profile coming soon.
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CrossArmLinks currentSlug={arm.slug} />

      {/* CTA */}
      <section style={{ background: 'var(--bg-surface)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', textAlign: 'center' }}>
          <h2
            style={{
              fontFamily: 'var(--font-clash)',
              fontWeight: 700,
              fontSize: '28px',
              color: 'var(--color-parchment)',
              marginBottom: '12px',
            }}
          >
            Ready to activate?
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(245,240,232,0.5)',
              marginBottom: '28px',
            }}
          >
            The ARM quiz matches you to the right entry point.
          </p>
          <Button tier="primary" href="/quiz">
            Take the ARM Quiz →
          </Button>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 7: Run full test suite**

```bash
npm test
```

Expected: all tests pass

- [ ] **Step 8: Commit**

```bash
git add components/arms/ArmDetailHero.tsx components/arms/CrossArmLinks.tsx \
        app/arms/[slug]/page.tsx tests/unit/ArmDetailPage.test.tsx
git commit -m "feat: /arms/[slug] detail page — template shell with 10 static routes"
```

---

## Task 4: KrakenDoctrine component + /about/kraken-method page

**Files:**
- Create: `components/about/KrakenDoctrine.tsx`
- Create: `app/about/kraken-method/page.tsx`
- Create: `tests/unit/KrakenDoctrine.test.tsx`

**Context:** The Kraken Method page has three content sections: 6 Principles (expanded from homepage cards with body copy), 7 Decision Filters (placeholder content with TODO), and ARM Anatomy (6-part structure). All data is hard-coded in `KrakenDoctrine.tsx`. The principle data matches `KrakenPrinciples.tsx` exactly — same 6 entries, same colors. Do NOT import or reuse `KrakenPrinciples` — this page needs a taller, single-column variant with body copy added.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/KrakenDoctrine.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { KrakenDoctrine } from '@/components/about/KrakenDoctrine'

describe('KrakenDoctrine', () => {
  it('renders 6 principle cards', () => {
    const { container } = render(<KrakenDoctrine />)
    const cards = container.querySelectorAll('[data-principle]')
    expect(cards).toHaveLength(6)
  })

  it('renders all 6 principle names', () => {
    render(<KrakenDoctrine />)
    expect(screen.getByText("Position Don't Chase")).toBeInTheDocument()
    expect(screen.getByText('Extend Simultaneously')).toBeInTheDocument()
    expect(screen.getByText('Capture Through Contact')).toBeInTheDocument()
    expect(screen.getByText('Every Arm Feeds the Body')).toBeInTheDocument()
    expect(screen.getByText('Depth Before Breadth')).toBeInTheDocument()
    expect(screen.getByText('Body Is the Differentiator')).toBeInTheDocument()
  })

  it('renders 7 decision filter items', () => {
    const { container } = render(<KrakenDoctrine />)
    const filters = container.querySelectorAll('[data-filter]')
    expect(filters).toHaveLength(7)
  })

  it('renders 6 anatomy items', () => {
    const { container } = render(<KrakenDoctrine />)
    const items = container.querySelectorAll('[data-anatomy]')
    expect(items).toHaveLength(6)
  })
})
```

- [ ] **Step 2: Run to confirm it fails**

```bash
npm test -- tests/unit/KrakenDoctrine.test.tsx
```

Expected: FAIL — `Cannot find module '@/components/about/KrakenDoctrine'`

- [ ] **Step 3: Create KrakenDoctrine component**

Create `components/about/KrakenDoctrine.tsx`:

```tsx
const PRINCIPLES = [
  {
    number: '01',
    name: "Position Don't Chase",
    descriptor: 'Authority through positioning',
    accent: '#E8541A',
    body: "VPG builds authority through content, partnerships, and market positioning — not by pursuing every opportunity. The business that defines the category controls the conversation.",
  },
  {
    number: '02',
    name: 'Extend Simultaneously',
    descriptor: 'All arms move at once',
    accent: '#00B4CB',
    body: "Every new client activates all applicable ARMs from day one, not sequentially. The compounding effect of multiple arms working in parallel is the Kraken's structural advantage.",
  },
  {
    number: '03',
    name: 'Capture Through Contact',
    descriptor: 'Sustained engagement converts',
    accent: '#C9960C',
    body: "Consistent, high-value contact converts prospects into clients and clients into advocates. Engagement isn't a tactic — it's the mechanism.",
  },
  {
    number: '04',
    name: 'Every Arm Feeds the Body',
    descriptor: 'Cross-referral as reflex',
    accent: '#3B6D11',
    body: "Cross-referral between ARMs is a reflex, not an afterthought. When one ARM serves a client, every other applicable ARM is evaluated and offered.",
  },
  {
    number: '05',
    name: 'Depth Before Breadth',
    descriptor: 'Master a market before expanding',
    accent: '#5B3FA8',
    body: "VPG masters a market before expanding into the next one. Shallow presence in five markets is worth less than dominant presence in one.",
  },
  {
    number: '06',
    name: 'Body Is the Differentiator',
    descriptor: 'The system is the advantage',
    accent: '#C9960C',
    body: "No single ARM is the product — the integrated operating system is. Competitors can copy a service; they cannot copy an organism.",
  },
]

const FILTERS = [
  "Does this build authority or chase attention?",
  "Can all applicable ARMs be activated?",
  "Is there a clear path to sustained engagement?",
  "Does this feed back into the portfolio body?",
  "Have we earned depth in this market?",
  "Is our system — not our price — the differentiator?",
  "Is this faith-rooted and results-verified?",
]

const ANATOMY = [
  { number: '01', part: 'Market Position', description: 'The specific niche the ARM owns' },
  { number: '02', part: 'Delivery Method', description: 'How the ARM executes for clients' },
  { number: '03', part: 'Revenue Model', description: 'How the ARM generates and shares revenue' },
  { number: '04', part: 'Body Integration', description: 'How it cross-refers and feeds other ARMs' },
  { number: '05', part: 'IPA Activation', description: 'How partners earn from this ARM' },
  { number: '06', part: 'Tech Stack', description: 'Proprietary tools or platforms the ARM uses' },
]

export function KrakenDoctrine() {
  return (
    <>
      {/* 6 Principles */}
      <section style={{ background: 'var(--bg-surface)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              marginBottom: '40px',
            }}
          >
            The Six Principles
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {PRINCIPLES.map((p) => (
              <article
                key={p.number}
                data-principle
                aria-label={`Principle ${p.number}: ${p.name}`}
                style={{
                  borderLeft: `3px solid ${p.accent}`,
                  paddingLeft: '24px',
                  paddingTop: '4px',
                  paddingBottom: '4px',
                }}
              >
                <p
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: p.accent,
                    marginBottom: '8px',
                  }}
                >
                  {p.number}
                </p>
                <h3
                  style={{
                    fontFamily: 'var(--font-clash)',
                    fontWeight: 700,
                    fontSize: '22px',
                    color: 'var(--color-parchment)',
                    marginBottom: '4px',
                  }}
                >
                  {p.name}
                </h3>
                <p
                  style={{
                    fontSize: '12px',
                    color: 'rgba(245,240,232,0.5)',
                    marginBottom: '12px',
                  }}
                >
                  {p.descriptor}
                </p>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(245,240,232,0.7)',
                    lineHeight: 1.7,
                    maxWidth: '680px',
                  }}
                >
                  {p.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7 Decision Filters */}
      {/* TODO: replace placeholder filter copy with actual Kraken doctrine */}
      <section style={{ background: 'var(--bg-base)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              marginBottom: '12px',
            }}
          >
            The Seven Filters
          </p>
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(245,240,232,0.5)',
              maxWidth: '560px',
              lineHeight: 1.6,
              marginBottom: '40px',
            }}
          >
            Before every engagement, VPG runs seven questions. If a move fails more than two, it
            doesn&apos;t happen.
          </p>
          <ol style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {FILTERS.map((filter, i) => (
              <li
                key={i}
                data-filter
                style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-clash)',
                    fontWeight: 800,
                    fontSize: '28px',
                    color: 'rgba(201,150,12,0.25)',
                    lineHeight: 1,
                    flexShrink: 0,
                    width: '36px',
                  }}
                >
                  {(i + 1).toString().padStart(2, '0')}
                </span>
                <p
                  style={{
                    fontSize: '15px',
                    color: 'rgba(245,240,232,0.75)',
                    lineHeight: 1.5,
                    paddingTop: '4px',
                  }}
                >
                  {filter}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ARM Anatomy */}
      <section style={{ background: 'var(--bg-surface)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              marginBottom: '12px',
            }}
          >
            Anatomy of an ARM
          </p>
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(245,240,232,0.5)',
              maxWidth: '560px',
              lineHeight: 1.6,
              marginBottom: '40px',
            }}
          >
            Every ARM shares the same six-part structure. Different market. Same organism.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            {ANATOMY.map((item) => (
              <div
                key={item.number}
                data-anatomy
                style={{
                  borderLeft: '2px solid rgba(201,150,12,0.3)',
                  paddingLeft: '16px',
                }}
              >
                <p
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    color: 'rgba(201,150,12,0.6)',
                    marginBottom: '6px',
                  }}
                >
                  {item.number}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-clash)',
                    fontWeight: 700,
                    fontSize: '16px',
                    color: 'var(--color-parchment)',
                    marginBottom: '4px',
                  }}
                >
                  {item.part}
                </p>
                <p style={{ fontSize: '12px', color: 'rgba(245,240,232,0.5)' }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
npm test -- tests/unit/KrakenDoctrine.test.tsx
```

Expected: 4 tests pass

- [ ] **Step 5: Create /about/kraken-method page**

Create `app/about/kraken-method/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { KrakenDoctrine } from '@/components/about/KrakenDoctrine'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'The Kraken Method',
  description:
    'The proprietary operating philosophy behind every VPG engagement. Six principles. Seven decision filters. One organism.',
}

export default function KrakenMethodPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: 'var(--bg-base)', padding: '120px 24px 80px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-gold)',
              marginBottom: '16px',
            }}
          >
            The Operating System
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-clash)',
              fontWeight: 800,
              fontSize: 'clamp(32px, 5vw, 56px)',
              color: 'var(--color-parchment)',
              marginBottom: '16px',
            }}
          >
            The Kraken Method
          </h1>
          <p
            style={{
              fontSize: '16px',
              fontWeight: 300,
              color: 'rgba(245,240,232,0.55)',
              maxWidth: '560px',
              lineHeight: 1.6,
            }}
          >
            The proprietary operating philosophy behind every VPG engagement. Six principles. Seven
            decision filters. One organism.
          </p>
        </div>
      </section>

      <KrakenDoctrine />

      {/* CTA */}
      <section style={{ background: 'var(--bg-base)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', textAlign: 'center' }}>
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(245,240,232,0.6)',
              marginBottom: '24px',
            }}
          >
            Find your ARM entry point.
          </p>
          <Button tier="primary" href="/quiz">
            Take the ARM Quiz →
          </Button>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 6: Run full test suite**

```bash
npm test
```

Expected: all tests pass

- [ ] **Step 7: Commit**

```bash
git add components/about/KrakenDoctrine.tsx app/about/kraken-method/page.tsx \
        tests/unit/KrakenDoctrine.test.tsx
git commit -m "feat: /about/kraken-method page with 6 principles, 7 filters, ARM anatomy"
```

---

## Task 5: GhlFormPlaceholder + EventsGrid + /events page

**Files:**
- Create: `components/events/GhlFormPlaceholder.tsx`
- Create: `components/events/EventsGrid.tsx`
- Create: `app/events/page.tsx`
- Create: `tests/unit/EventsGrid.test.tsx`

**Context:** `/events` has three sections: Power Hour (id="power-hour", two-column, GHL form placeholder on the right), Annual Events (VPG Summit Q4 + IPA Partner Summit Q2), and a quiz CTA. `GhlFormPlaceholder` is a standalone component so it can be swapped for a real GHL embed by replacing one import. `EventsGrid` renders just the two annual event cards and is tested independently.

- [ ] **Step 1: Write the failing test**

Create `tests/unit/EventsGrid.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { EventsGrid } from '@/components/events/EventsGrid'
import { GhlFormPlaceholder } from '@/components/events/GhlFormPlaceholder'

describe('EventsGrid', () => {
  it('renders both annual event names', () => {
    render(<EventsGrid />)
    expect(screen.getByText('VPG Summit')).toBeInTheDocument()
    expect(screen.getByText('IPA Partner Summit')).toBeInTheDocument()
  })

  it('renders Q4 and Q2 quarter labels', () => {
    render(<EventsGrid />)
    expect(screen.getByText(/Q4/)).toBeInTheDocument()
    expect(screen.getByText(/Q2/)).toBeInTheDocument()
  })

  it('renders Dallas TX location for both events', () => {
    render(<EventsGrid />)
    const locations = screen.getAllByText(/Dallas, TX/)
    expect(locations).toHaveLength(2)
  })
})

describe('GhlFormPlaceholder', () => {
  it('renders the label prop', () => {
    render(<GhlFormPlaceholder label="Reserve Your Spot" />)
    expect(screen.getByText('Reserve Your Spot')).toBeInTheDocument()
  })

  it('renders the fallback email link', () => {
    render(<GhlFormPlaceholder label="Reserve Your Spot" />)
    const link = screen.getByRole('link', { name: /email us/i })
    expect(link).toHaveAttribute('href', 'mailto:info@vantagepointgroup.com')
  })
})
```

- [ ] **Step 2: Run to confirm it fails**

```bash
npm test -- tests/unit/EventsGrid.test.tsx
```

Expected: FAIL — `Cannot find module '@/components/events/EventsGrid'`

- [ ] **Step 3: Create GhlFormPlaceholder**

Create `components/events/GhlFormPlaceholder.tsx`:

```tsx
interface GhlFormPlaceholderProps {
  label: string
}

export function GhlFormPlaceholder({ label }: GhlFormPlaceholderProps) {
  return (
    <div
      style={{
        background: 'rgba(91,63,168,0.06)',
        border: '1px dashed rgba(91,63,168,0.3)',
        borderRadius: '6px',
        padding: '32px 24px',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-clash)',
          fontWeight: 700,
          fontSize: '14px',
          color: 'var(--color-parchment)',
          marginBottom: '8px',
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: '12px',
          color: 'rgba(245,240,232,0.4)',
          lineHeight: 1.6,
        }}
      >
        Registration form coming soon.{' '}
        <a
          href="mailto:info@vantagepointgroup.com"
          style={{ color: '#5B3FA8', textDecoration: 'underline' }}
        >
          Email us to reserve your spot.
        </a>
      </p>
      {/* TODO: replace with GHL iframe embed once form URL is available */}
    </div>
  )
}
```

- [ ] **Step 4: Create EventsGrid**

Create `components/events/EventsGrid.tsx`:

```tsx
const ANNUAL_EVENTS = [
  {
    name: 'VPG Summit',
    quarter: 'Q4',
    location: 'Dallas, TX',
    color: '#E8541A',
    description:
      'The annual operator summit. Two days of execution strategy, ARM deep-dives, and direct access to the VPG principals.',
  },
  {
    name: 'IPA Partner Summit',
    quarter: 'Q2',
    location: 'Dallas, TX',
    color: '#3B6D11',
    description:
      'The annual gathering for IPA Certified and Premier partners. Certification reviews, commission reviews, and new ARM previews.',
  },
]

export function EventsGrid() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: '20px',
      }}
    >
      {ANNUAL_EVENTS.map((event) => (
        <div
          key={event.name}
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '6px',
            overflow: 'hidden',
          }}
        >
          {/* Top color bar */}
          <div style={{ height: '4px', background: event.color }} />

          <div style={{ padding: '28px' }}>
            <h3
              style={{
                fontFamily: 'var(--font-clash)',
                fontWeight: 700,
                fontSize: '20px',
                color: 'var(--color-parchment)',
                marginBottom: '10px',
              }}
            >
              {event.name}
            </h3>

            {/* Quarter + location badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '4px',
                padding: '4px 10px',
                marginBottom: '16px',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  color: event.color,
                  letterSpacing: '0.1em',
                }}
              >
                {event.quarter}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  color: 'rgba(245,240,232,0.5)',
                }}
              >
                · {event.location}
              </span>
            </div>

            <p
              style={{
                fontSize: '13px',
                color: 'rgba(245,240,232,0.6)',
                lineHeight: 1.65,
                marginBottom: '20px',
              }}
            >
              {event.description}
            </p>

            <a
              href="#"
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: event.color,
                textDecoration: 'none',
              }}
            >
              Notify Me →
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Run tests — expect PASS**

```bash
npm test -- tests/unit/EventsGrid.test.tsx
```

Expected: 5 tests pass

- [ ] **Step 6: Create /events page**

Create `app/events/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { EventsGrid } from '@/components/events/EventsGrid'
import { GhlFormPlaceholder } from '@/components/events/GhlFormPlaceholder'
import { Button } from '@/components/ui/Button'


export const metadata: Metadata = {
  title: 'Events',
  description:
    'Monthly Power Hours, the annual VPG Summit, and the IPA Partner Summit. Operator-only. Results-first.',
}

export default function EventsPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: 'var(--bg-base)', padding: '120px 24px 80px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-violet)',
              marginBottom: '16px',
            }}
          >
            Events
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-clash)',
              fontWeight: 800,
              fontSize: 'clamp(32px, 5vw, 56px)',
              color: 'var(--color-parchment)',
              marginBottom: '16px',
            }}
          >
            Where the Body Gathers
          </h1>
          <p
            style={{
              fontSize: '16px',
              fontWeight: 300,
              color: 'rgba(245,240,232,0.55)',
              maxWidth: '560px',
              lineHeight: 1.6,
            }}
          >
            Monthly Power Hours, the annual VPG Summit, and the IPA Partner Summit.
            Operator-only. Results-first.
          </p>
        </div>
      </section>

      {/* Power Hour */}
      <section
        id="power-hour"
        style={{ background: 'var(--bg-surface)', padding: '80px 24px' }}
      >
        <div
          style={{
            maxWidth: '1120px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '48px',
            alignItems: 'start',
          }}
        >
          {/* Left — info */}
          <div>
            <div
              style={{
                display: 'inline-block',
                background: 'var(--color-violet)',
                color: '#fff',
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                padding: '3px 10px',
                borderRadius: '3px',
                marginBottom: '16px',
              }}
            >
              Monthly
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-clash)',
                fontWeight: 700,
                fontSize: '28px',
                color: 'var(--color-parchment)',
                marginBottom: '8px',
              }}
            >
              VPG Power Hour
            </h2>

            <p
              style={{
                fontSize: '12px',
                color: 'rgba(245,240,232,0.45)',
                marginBottom: '16px',
                letterSpacing: '0.05em',
              }}
            >
              Virtual · First Thursday of Every Month
            </p>

            <p
              style={{
                fontSize: '14px',
                color: 'rgba(245,240,232,0.65)',
                lineHeight: 1.7,
                marginBottom: '24px',
                maxWidth: '460px',
              }}
            >
              One hour. One ARM in focus. Operators, partners, and VPG principals on the same
              call. No slides — just execution.
            </p>

            <Button tier="entity" entityColor="#5B3FA8" href="#power-hour">
              Register Below →
            </Button>
          </div>

          {/* Right — form placeholder */}
          <GhlFormPlaceholder label="Reserve Your Spot" />
        </div>
      </section>

      {/* Annual Events */}
      <section style={{ background: 'var(--bg-base)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-orange)',
              marginBottom: '32px',
            }}
          >
            Annual Events
          </p>
          <EventsGrid />
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--bg-surface)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', textAlign: 'center' }}>
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(245,240,232,0.5)',
              marginBottom: '20px',
            }}
          >
            Not sure which ARM to focus on?
          </p>
          <Button tier="primary" href="/quiz">
            Take the ARM Quiz →
          </Button>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 7: Run full test suite**

```bash
npm test
```

Expected: all tests pass

- [ ] **Step 8: Commit**

```bash
git add components/events/GhlFormPlaceholder.tsx components/events/EventsGrid.tsx \
        app/events/page.tsx tests/unit/EventsGrid.test.tsx
git commit -m "feat: /events page with Power Hour, annual events, GHL placeholder"
```

---

## Final verification

- [ ] **Run the full test suite one last time**

```bash
npm test
```

Expected: all tests pass, no regressions against existing suite

- [ ] **TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Final commit if any loose files**

If TypeScript check required any fixes, commit them:

```bash
git add -p
git commit -m "fix: TypeScript cleanup for interior pages"
```
