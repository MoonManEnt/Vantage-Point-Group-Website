# Plan 3 — Homepage Layout §3–§9

**Date:** 2026-05-01
**Branch:** `plan-3-homepage-layout` (worktree: `.worktrees/plan-3-homepage-layout/`)
**Status:** READY TO EXECUTE

---

## Goal

Replace the seven stub `<section>` / `<footer>` elements in `app/page.tsx` with fully-implemented, tested components covering §3 ARM Bento Grid through §9 Site Footer. All components follow the authoritative design spec. Client components (§3, §4) use GSAP with `prefers-reduced-motion` guard. Server components (§5–§9) are pure RSC with no client directives.

---

## Architecture

```
components/
  sections/
    ArmBentoGrid.tsx        ← 'use client', GSAP + hover state
    ArmBentoSection.tsx     ← server wrapper
    KrakenPrinciples.tsx    ← 'use client', GSAP scroll animation
    KrakenMethodSection.tsx ← server wrapper
    EntityCardsSection.tsx  ← pure server
    MissionSection.tsx      ← pure server
    IpaStrip.tsx            ← pure server
    EventsSection.tsx       ← pure server
    SiteFooter.tsx          ← pure server

tests/unit/
  ArmBentoGrid.test.tsx
  ArmBentoSection.test.tsx
  KrakenPrinciples.test.tsx
  KrakenMethodSection.test.tsx
  EntityCardsSection.test.tsx
  MissionSection.test.tsx
  IpaStrip.test.tsx
  EventsSection.test.tsx
  SiteFooter.test.tsx
  HomePage.smoke.test.tsx
```

---

## Tech Stack

| Concern | Tool |
|---|---|
| Framework | Next.js 16.2.1 App Router (RSC-first) |
| UI | React 19, TypeScript strict |
| Styling | Tailwind CSS v4 (utility classes only) |
| Animation | GSAP 3 via `@/lib/gsap` |
| Tests | Vitest + @testing-library/react + userEvent |
| Font | Clash Display via CSS var `--font-clash`; Inter default |

---

## File Map

| Task | Component file | Test file |
|---|---|---|
| 1 | `components/sections/ArmBentoGrid.tsx` | `tests/unit/ArmBentoGrid.test.tsx` |
| 1 | `components/sections/ArmBentoSection.tsx` | `tests/unit/ArmBentoSection.test.tsx` |
| 2 | `components/sections/KrakenPrinciples.tsx` | `tests/unit/KrakenPrinciples.test.tsx` |
| 2 | `components/sections/KrakenMethodSection.tsx` | `tests/unit/KrakenMethodSection.test.tsx` |
| 3 | `components/sections/EntityCardsSection.tsx` | `tests/unit/EntityCardsSection.test.tsx` |
| 4 | `components/sections/MissionSection.tsx` | `tests/unit/MissionSection.test.tsx` |
| 5 | `components/sections/IpaStrip.tsx` | `tests/unit/IpaStrip.test.tsx` |
| 6 | `components/sections/EventsSection.tsx` | `tests/unit/EventsSection.test.tsx` |
| 7 | `components/sections/SiteFooter.tsx` | `tests/unit/SiteFooter.test.tsx` |
| 8 | `app/page.tsx` (edit) | `tests/unit/HomePage.smoke.test.tsx` |

---

## Shared GSAP Mock Pattern

Every test file that imports a client component using GSAP (`ArmBentoGrid`, `KrakenPrinciples`) must include this exact mock block at the top of the file:

```ts
vi.mock('@/lib/gsap', () => ({
  gsap: {
    context: vi.fn().mockImplementation((fn: () => void) => {
      if (typeof fn === 'function') fn()
      return { revert: vi.fn() }
    }),
    fromTo: vi.fn(),
  },
  ScrollTrigger: { create: vi.fn() },
}))
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false, media: query,
      addEventListener: vi.fn(), removeEventListener: vi.fn(),
    })),
  })
})
```

Server wrapper tests that render a child client component must mock it instead:

```ts
vi.mock('@/components/sections/ArmBentoGrid', () => ({
  ArmBentoGrid: () => <div data-testid="arm-bento-grid" />,
}))
vi.mock('@/components/sections/KrakenPrinciples', () => ({
  KrakenPrinciples: () => <div data-testid="kraken-principles" />,
}))
```

---

## Task 1 — ARM Bento Section (§3)

### Files

- `components/sections/ArmBentoGrid.tsx`
- `components/sections/ArmBentoSection.tsx`
- `tests/unit/ArmBentoGrid.test.tsx`
- `tests/unit/ArmBentoSection.test.tsx`

---

### Step 1.1 — Write failing test for ArmBentoGrid

**File:** `tests/unit/ArmBentoGrid.test.tsx`

```tsx
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { ArmBentoGrid } from '@/components/sections/ArmBentoGrid'
import { ARMS } from '@/lib/arm-data'

vi.mock('@/lib/gsap', () => ({
  gsap: {
    context: vi.fn().mockImplementation((fn: () => void) => {
      if (typeof fn === 'function') fn()
      return { revert: vi.fn() }
    }),
    fromTo: vi.fn(),
  },
  ScrollTrigger: { create: vi.fn() },
}))

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false, media: query,
      addEventListener: vi.fn(), removeEventListener: vi.fn(),
    })),
  })
})

describe('ArmBentoGrid', () => {
  it('renders all 10 ARM cards', () => {
    render(<ArmBentoGrid arms={ARMS} />)
    ARMS.forEach((arm) => {
      expect(screen.getByText(`ARM ${arm.id}`)).toBeInTheDocument()
    })
  })

  it('renders each ARM name', () => {
    render(<ArmBentoGrid arms={ARMS} />)
    ARMS.forEach((arm) => {
      expect(screen.getByText(arm.name)).toBeInTheDocument()
    })
  })

  it('renders each ARM descriptor', () => {
    render(<ArmBentoGrid arms={ARMS} />)
    ARMS.forEach((arm) => {
      expect(screen.getByText(arm.descriptor)).toBeInTheDocument()
    })
  })

  it('each card is a link to /arms/{slug}', () => {
    render(<ArmBentoGrid arms={ARMS} />)
    ARMS.forEach((arm) => {
      const link = screen.getByRole('link', { name: new RegExp(arm.name, 'i') })
      expect(link).toHaveAttribute('href', `/arms/${arm.slug}`)
    })
  })

  it('renders hover copy text (initially hidden via max-h-0)', () => {
    render(<ArmBentoGrid arms={ARMS} />)
    const hoverEl = screen.getAllByText(ARMS[0].hoverCopy)
    expect(hoverEl.length).toBeGreaterThan(0)
  })
})
```

**Run to verify it fails:**

```bash
cd /Users/reginaldsmith/vpg-website && npx vitest run tests/unit/ArmBentoGrid.test.tsx
```

Expected: `FAIL` — module not found.

---

### Step 1.2 — Implement ArmBentoGrid

**File:** `components/sections/ArmBentoGrid.tsx`

```tsx
'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import type { Arm } from '@/lib/arm-data'

interface ArmBentoGridProps {
  arms: Arm[]
}

export function ArmBentoGrid({ arms }: ArmBentoGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        gridRef.current ? Array.from(gridRef.current.children) : [],
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 70%',
          },
        },
      )
    })

    return () => ctx.revert()
  }, [])

  function handleEnter(e: React.MouseEvent<HTMLAnchorElement>, arm: Arm) {
    const el = e.currentTarget
    el.style.borderColor = `${arm.color}CC`
    el.style.transform = 'translateY(-3px)'
    const nameEl = el.querySelector<HTMLElement>('[data-arm-name]')
    if (nameEl) nameEl.style.color = arm.color
    const hoverEl = el.querySelector<HTMLElement>('[data-hover-copy]')
    if (hoverEl) hoverEl.style.maxHeight = '60px'
  }

  function handleLeave(e: React.MouseEvent<HTMLAnchorElement>, arm: Arm) {
    const el = e.currentTarget
    el.style.borderColor = `${arm.color}4D`
    el.style.transform = 'translateY(0)'
    const nameEl = el.querySelector<HTMLElement>('[data-arm-name]')
    if (nameEl) nameEl.style.color = 'var(--color-parchment)'
    const hoverEl = el.querySelector<HTMLElement>('[data-hover-copy]')
    if (hoverEl) hoverEl.style.maxHeight = '0px'
  }

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2"
    >
      {arms.map((arm) => (
        <Link
          key={arm.id}
          href={`/arms/${arm.slug}`}
          aria-label={arm.name}
          onMouseEnter={(e) => handleEnter(e, arm)}
          onMouseLeave={(e) => handleLeave(e, arm)}
          style={{
            background: '#0D1B2A',
            border: `1px solid ${arm.color}4D`,
            borderRadius: '6px',
            padding: '14px',
            display: 'block',
            transition: 'border-color 0.2s, transform 0.2s',
          }}
        >
          <p
            style={{
              color: arm.color,
              fontSize: '9px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '4px',
            }}
          >
            ARM {arm.id}
          </p>
          <p
            data-arm-name
            style={{
              fontFamily: 'var(--font-clash)',
              fontWeight: 600,
              fontSize: '12px',
              color: 'var(--color-parchment)',
              marginBottom: '4px',
              transition: 'color 0.2s',
            }}
          >
            {arm.name}
          </p>
          <p
            style={{
              fontSize: '9px',
              color: 'rgba(245,240,232,0.5)',
              lineHeight: 1.4,
            }}
          >
            {arm.descriptor}
          </p>
          <p
            data-hover-copy
            style={{
              fontSize: '9px',
              color: 'var(--color-parchment)',
              lineHeight: 1.4,
              maxHeight: '0px',
              overflow: 'hidden',
              transition: 'max-height 0.25s ease',
              marginTop: '6px',
            }}
          >
            {arm.hoverCopy}
          </p>
        </Link>
      ))}
    </div>
  )
}
```

**Run to verify it passes:**

```bash
cd /Users/reginaldsmith/vpg-website && npx vitest run tests/unit/ArmBentoGrid.test.tsx
```

Expected: `PASS` — 5 tests green.

---

### Step 1.3 — Write failing test for ArmBentoSection

**File:** `tests/unit/ArmBentoSection.test.tsx`

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import ArmBentoSection from '@/components/sections/ArmBentoSection'

vi.mock('@/components/sections/ArmBentoGrid', () => ({
  ArmBentoGrid: () => <div data-testid="arm-bento-grid" />,
}))

describe('ArmBentoSection', () => {
  it('renders section label THE PORTFOLIO', () => {
    render(<ArmBentoSection />)
    expect(screen.getByText('THE PORTFOLIO')).toBeInTheDocument()
  })

  it('renders the h2 headline', () => {
    render(<ArmBentoSection />)
    expect(
      screen.getByText('Ten Arms. One Body. Every angle covered.'),
    ).toBeInTheDocument()
  })

  it('renders the subheadline', () => {
    render(<ArmBentoSection />)
    expect(
      screen.getByText('Each ARM operates independently. All of them feed the body.'),
    ).toBeInTheDocument()
  })

  it('renders the ArmBentoGrid child', () => {
    render(<ArmBentoSection />)
    expect(screen.getByTestId('arm-bento-grid')).toBeInTheDocument()
  })
})
```

**Run to verify it fails:**

```bash
cd /Users/reginaldsmith/vpg-website && npx vitest run tests/unit/ArmBentoSection.test.tsx
```

Expected: `FAIL` — module not found.

---

### Step 1.4 — Implement ArmBentoSection

**File:** `components/sections/ArmBentoSection.tsx`

```tsx
import { ARMS } from '@/lib/arm-data'
import { ArmBentoGrid } from './ArmBentoGrid'

export default function ArmBentoSection() {
  return (
    <section
      id="arm-grid"
      aria-label="Portfolio"
      className="py-24 px-6"
      style={{ background: 'var(--color-charcoal)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <p
            style={{
              color: 'var(--color-gold)',
              fontSize: '9px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              marginBottom: '12px',
            }}
          >
            THE PORTFOLIO
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-clash)',
              fontWeight: 700,
              fontSize: '28px',
              color: 'var(--color-parchment)',
              marginBottom: '8px',
            }}
          >
            Ten Arms. One Body. Every angle covered.
          </h2>
          <p
            style={{
              fontSize: '13px',
              color: 'rgba(245,240,232,0.5)',
            }}
          >
            Each ARM operates independently. All of them feed the body.
          </p>
        </div>
        <ArmBentoGrid arms={ARMS} />
      </div>
    </section>
  )
}
```

**Run to verify it passes:**

```bash
cd /Users/reginaldsmith/vpg-website && npx vitest run tests/unit/ArmBentoSection.test.tsx
```

Expected: `PASS` — 4 tests green.

---

### Step 1.5 — Commit Task 1

```bash
cd /Users/reginaldsmith/vpg-website && git add components/sections/ArmBentoGrid.tsx components/sections/ArmBentoSection.tsx tests/unit/ArmBentoGrid.test.tsx tests/unit/ArmBentoSection.test.tsx && git commit -m "feat: ARM Bento Grid section §3 with GSAP scroll entrance"
```

---

## Task 2 — Kraken Method Section (§4)

### Files

- `components/sections/KrakenPrinciples.tsx`
- `components/sections/KrakenMethodSection.tsx`
- `tests/unit/KrakenPrinciples.test.tsx`
- `tests/unit/KrakenMethodSection.test.tsx`

---

### Step 2.1 — Write failing test for KrakenPrinciples

**File:** `tests/unit/KrakenPrinciples.test.tsx`

```tsx
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { KrakenPrinciples } from '@/components/sections/KrakenPrinciples'

vi.mock('@/lib/gsap', () => ({
  gsap: {
    context: vi.fn().mockImplementation((fn: () => void) => {
      if (typeof fn === 'function') fn()
      return { revert: vi.fn() }
    }),
    fromTo: vi.fn(),
  },
  ScrollTrigger: { create: vi.fn() },
}))

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false, media: query,
      addEventListener: vi.fn(), removeEventListener: vi.fn(),
    })),
  })
})

describe('KrakenPrinciples', () => {
  it('renders all 6 principle numbers', () => {
    render(<KrakenPrinciples />)
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('02')).toBeInTheDocument()
    expect(screen.getByText('03')).toBeInTheDocument()
    expect(screen.getByText('04')).toBeInTheDocument()
    expect(screen.getByText('05')).toBeInTheDocument()
    expect(screen.getByText('06')).toBeInTheDocument()
  })

  it('renders all 6 principle names', () => {
    render(<KrakenPrinciples />)
    expect(screen.getByText("Position Don't Chase")).toBeInTheDocument()
    expect(screen.getByText('Extend Simultaneously')).toBeInTheDocument()
    expect(screen.getByText('Capture Through Contact')).toBeInTheDocument()
    expect(screen.getByText('Every Arm Feeds the Body')).toBeInTheDocument()
    expect(screen.getByText('Depth Before Breadth')).toBeInTheDocument()
    expect(screen.getByText('Body Is the Differentiator')).toBeInTheDocument()
  })

  it('renders all 6 principle descriptors', () => {
    render(<KrakenPrinciples />)
    expect(screen.getByText('Authority through positioning')).toBeInTheDocument()
    expect(screen.getByText('All arms move at once')).toBeInTheDocument()
    expect(screen.getByText('Sustained engagement converts')).toBeInTheDocument()
    expect(screen.getByText('Cross-referral as reflex')).toBeInTheDocument()
    expect(screen.getByText('Master a market before expanding')).toBeInTheDocument()
    expect(screen.getByText('The system is the advantage')).toBeInTheDocument()
  })

  it('renders exactly 6 principle cards', () => {
    render(<KrakenPrinciples />)
    const cards = document.querySelectorAll('[data-principle-card]')
    expect(cards.length).toBe(6)
  })
})
```

**Run to verify it fails:**

```bash
cd /Users/reginaldsmith/vpg-website && npx vitest run tests/unit/KrakenPrinciples.test.tsx
```

Expected: `FAIL` — module not found.

---

### Step 2.2 — Implement KrakenPrinciples

**File:** `components/sections/KrakenPrinciples.tsx`

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

interface Principle {
  number: string
  name: string
  descriptor: string
  accent: string
}

const PRINCIPLES: Principle[] = [
  { number: '01', name: "Position Don't Chase", descriptor: 'Authority through positioning', accent: '#E8541A' },
  { number: '02', name: 'Extend Simultaneously', descriptor: 'All arms move at once', accent: '#00B4CB' },
  { number: '03', name: 'Capture Through Contact', descriptor: 'Sustained engagement converts', accent: '#C9960C' },
  { number: '04', name: 'Every Arm Feeds the Body', descriptor: 'Cross-referral as reflex', accent: '#3B6D11' },
  { number: '05', name: 'Depth Before Breadth', descriptor: 'Master a market before expanding', accent: '#5B3FA8' },
  { number: '06', name: 'Body Is the Differentiator', descriptor: 'The system is the advantage', accent: '#C9960C' },
]

export function KrakenPrinciples() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        gridRef.current ? Array.from(gridRef.current.children) : [],
        { opacity: 0, x: -16 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
          },
        },
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {PRINCIPLES.map((p) => (
        <div
          key={p.number}
          data-principle-card
          style={{
            borderLeft: `2px solid ${p.accent}`,
            paddingLeft: '12px',
            paddingTop: '8px',
            paddingBottom: '8px',
          }}
        >
          <p
            style={{
              color: p.accent,
              fontSize: '8px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '4px',
            }}
          >
            {p.number}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-clash)',
              fontWeight: 600,
              fontSize: '12px',
              color: 'var(--color-parchment)',
              marginBottom: '4px',
            }}
          >
            {p.name}
          </p>
          <p
            style={{
              fontSize: '9px',
              color: 'rgba(245,240,232,0.5)',
              lineHeight: 1.4,
            }}
          >
            {p.descriptor}
          </p>
        </div>
      ))}
    </div>
  )
}
```

**Run to verify it passes:**

```bash
cd /Users/reginaldsmith/vpg-website && npx vitest run tests/unit/KrakenPrinciples.test.tsx
```

Expected: `PASS` — 4 tests green.

---

### Step 2.3 — Write failing test for KrakenMethodSection

**File:** `tests/unit/KrakenMethodSection.test.tsx`

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import KrakenMethodSection from '@/components/sections/KrakenMethodSection'

vi.mock('@/components/sections/KrakenPrinciples', () => ({
  KrakenPrinciples: () => <div data-testid="kraken-principles" />,
}))

describe('KrakenMethodSection', () => {
  it('renders the section label THE OPERATING SYSTEM', () => {
    render(<KrakenMethodSection />)
    expect(screen.getByText('THE OPERATING SYSTEM')).toBeInTheDocument()
  })

  it('renders the h2 The Kraken Method', () => {
    render(<KrakenMethodSection />)
    expect(screen.getByRole('heading', { name: 'The Kraken Method' })).toBeInTheDocument()
  })

  it('renders the subhead body copy', () => {
    render(<KrakenMethodSection />)
    expect(
      screen.getByText(
        'The proprietary operating philosophy behind every VPG engagement. Six principles. Seven decision filters. One organism.',
      ),
    ).toBeInTheDocument()
  })

  it('renders the doctrine CTA link', () => {
    render(<KrakenMethodSection />)
    const cta = screen.getByRole('link', { name: /Read the Full Doctrine/i })
    expect(cta).toHaveAttribute('href', '/about/kraken-method')
  })

  it('renders the KrakenPrinciples child', () => {
    render(<KrakenMethodSection />)
    expect(screen.getByTestId('kraken-principles')).toBeInTheDocument()
  })
})
```

**Run to verify it fails:**

```bash
cd /Users/reginaldsmith/vpg-website && npx vitest run tests/unit/KrakenMethodSection.test.tsx
```

Expected: `FAIL` — module not found.

---

### Step 2.4 — Implement KrakenMethodSection

**File:** `components/sections/KrakenMethodSection.tsx`

```tsx
import { Button } from '@/components/ui/Button'
import { KrakenPrinciples } from './KrakenPrinciples'

export default function KrakenMethodSection() {
  return (
    <section
      id="kraken-method"
      aria-label="The Kraken Method"
      className="py-24 px-6"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p
            style={{
              color: 'var(--color-gold)',
              fontSize: '9px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              marginBottom: '12px',
            }}
          >
            THE OPERATING SYSTEM
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-clash)',
              fontWeight: 700,
              fontSize: '28px',
              color: 'var(--color-parchment)',
              marginBottom: '10px',
            }}
          >
            The Kraken Method
          </h2>
          <p
            style={{
              fontWeight: 300,
              fontSize: '14px',
              color: 'rgba(245,240,232,0.5)',
              marginBottom: '16px',
              maxWidth: '560px',
            }}
          >
            The proprietary operating philosophy behind every VPG engagement. Six principles. Seven decision filters. One organism.
          </p>
          <Button
            tier="tertiary"
            href="/about/kraken-method"
            style={{ color: 'var(--color-orange)' }}
          >
            Read the Full Doctrine →
          </Button>
        </div>
        <KrakenPrinciples />
      </div>
    </section>
  )
}
```

**Run to verify it passes:**

```bash
cd /Users/reginaldsmith/vpg-website && npx vitest run tests/unit/KrakenMethodSection.test.tsx
```

Expected: `PASS` — 5 tests green.

---

### Step 2.5 — Commit Task 2

```bash
cd /Users/reginaldsmith/vpg-website && git add components/sections/KrakenPrinciples.tsx components/sections/KrakenMethodSection.tsx tests/unit/KrakenPrinciples.test.tsx tests/unit/KrakenMethodSection.test.tsx && git commit -m "feat: Kraken Method section §4 with GSAP slide-in principles"
```

---

## Task 3 — Entity Cards Section (§5)

### Files

- `components/sections/EntityCardsSection.tsx`
- `tests/unit/EntityCardsSection.test.tsx`

---

### Step 3.1 — Write failing test for EntityCardsSection

**File:** `tests/unit/EntityCardsSection.test.tsx`

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import EntityCardsSection from '@/components/sections/EntityCardsSection'

describe('EntityCardsSection', () => {
  it('renders the section label FEATURED ENTITIES', () => {
    render(<EntityCardsSection />)
    expect(screen.getByText('FEATURED ENTITIES')).toBeInTheDocument()
  })

  it('renders the VPM entity label', () => {
    render(<EntityCardsSection />)
    expect(screen.getByText('VPM')).toBeInTheDocument()
  })

  it('renders the D2G entity label', () => {
    render(<EntityCardsSection />)
    expect(screen.getByText('D2G')).toBeInTheDocument()
  })

  it('renders the IPA entity label', () => {
    render(<EntityCardsSection />)
    expect(screen.getByText('IPA')).toBeInTheDocument()
  })

  it('renders the VPM entity name', () => {
    render(<EntityCardsSection />)
    expect(screen.getByText('Vantage Point Media')).toBeInTheDocument()
  })

  it('renders the D2G entity name', () => {
    render(<EntityCardsSection />)
    expect(screen.getByText('Dispute2Go')).toBeInTheDocument()
  })

  it('renders the IPA entity name', () => {
    render(<EntityCardsSection />)
    expect(screen.getByText('Integrity Partner Alliance')).toBeInTheDocument()
  })

  it('renders all 3 CTA links with correct hrefs', () => {
    render(<EntityCardsSection />)
    const vpmLink = screen.getByRole('link', { name: /Explore VPM/i })
    expect(vpmLink).toHaveAttribute('href', '/arms/vantage-point-media')
    const d2gLink = screen.getByRole('link', { name: /Explore D2G/i })
    expect(d2gLink).toHaveAttribute('href', '/arms/dispute2go')
    const ipaLink = screen.getByRole('link', { name: /Become a Partner/i })
    expect(ipaLink).toHaveAttribute('href', '/partners')
  })

  it('renders all 3 entity card descriptions', () => {
    render(<EntityCardsSection />)
    expect(
      screen.getByText(/Brand strategy, content production/),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/AI-native credit dispute platform/),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/The referral network that compounds/),
    ).toBeInTheDocument()
  })
})
```

**Run to verify it fails:**

```bash
cd /Users/reginaldsmith/vpg-website && npx vitest run tests/unit/EntityCardsSection.test.tsx
```

Expected: `FAIL` — module not found.

---

### Step 3.2 — Implement EntityCardsSection

**File:** `components/sections/EntityCardsSection.tsx`

```tsx
import { ENTITY_CARD_ARMS } from '@/lib/arm-data'
import { Button } from '@/components/ui/Button'

export default function EntityCardsSection() {
  return (
    <section
      id="entity-cards"
      aria-label="Entities"
      className="py-24 px-6"
      style={{ background: 'var(--bg-surface)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <p
            style={{
              color: 'var(--color-gold)',
              fontSize: '9px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              marginBottom: '12px',
            }}
          >
            FEATURED ENTITIES
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ENTITY_CARD_ARMS.map((arm) => (
            <div
              key={arm.id}
              className="hover:scale-[1.01] transition-all duration-200"
              style={{
                background: '#0D1B2A',
                border: `1px solid ${arm.color}59`,
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '4px',
                  background: arm.color,
                  marginBottom: '12px',
                }}
              />
              <p
                style={{
                  color: arm.color,
                  fontSize: '8px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  opacity: 0.7,
                  marginBottom: '6px',
                }}
              >
                {arm.entity}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-clash)',
                  fontWeight: 700,
                  fontSize: '16px',
                  color: 'var(--color-parchment)',
                  marginBottom: '10px',
                }}
              >
                {arm.name}
              </p>
              <p
                style={{
                  fontSize: '12px',
                  color: 'rgba(245,240,232,0.5)',
                  lineHeight: 1.6,
                  marginBottom: '16px',
                }}
              >
                {arm.entityCard!.description}
              </p>
              <Button
                tier="tertiary"
                href={arm.entityCard!.href}
                style={{ color: arm.color }}
              >
                {arm.entityCard!.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Run to verify it passes:**

```bash
cd /Users/reginaldsmith/vpg-website && npx vitest run tests/unit/EntityCardsSection.test.tsx
```

Expected: `PASS` — 9 tests green.

---

### Step 3.3 — Commit Task 3

```bash
cd /Users/reginaldsmith/vpg-website && git add components/sections/EntityCardsSection.tsx tests/unit/EntityCardsSection.test.tsx && git commit -m "feat: Entity Cards section §5 — VPM, D2G, IPA"
```

---

## Task 4 — Mission Section (§6)

### Files

- `components/sections/MissionSection.tsx`
- `tests/unit/MissionSection.test.tsx`

---

### Step 4.1 — Write failing test for MissionSection

**File:** `tests/unit/MissionSection.test.tsx`

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import MissionSection from '@/components/sections/MissionSection'

describe('MissionSection', () => {
  it('renders the OUR PURPOSE label', () => {
    render(<MissionSection />)
    expect(screen.getByText('OUR PURPOSE')).toBeInTheDocument()
  })

  it('renders the mission blockquote text', () => {
    render(<MissionSection />)
    expect(
      screen.getByText(/To give people who are serious about building/),
    ).toBeInTheDocument()
  })

  it('renders "actually do it" in emphasized text', () => {
    render(<MissionSection />)
    const strong = screen.getByText('actually do it')
    expect(strong.tagName).toBe('STRONG')
  })

  it('renders the proof bar stat 10 with label ACTIVE ARMS', () => {
    render(<MissionSection />)
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('ACTIVE ARMS')).toBeInTheDocument()
  })

  it('renders proof bar stat 5 with label MARKETS', () => {
    render(<MissionSection />)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('MARKETS')).toBeInTheDocument()
  })

  it('renders proof bar stat 26 with label FEDERAL STATUTES', () => {
    render(<MissionSection />)
    expect(screen.getByText('26')).toBeInTheDocument()
    expect(screen.getByText('FEDERAL STATUTES')).toBeInTheDocument()
  })

  it('renders proof bar stat IPA with label PARTNER NETWORK', () => {
    render(<MissionSection />)
    // IPA appears in proof bar (distinct from entity section)
    expect(screen.getByText('PARTNER NETWORK')).toBeInTheDocument()
  })
})
```

**Run to verify it fails:**

```bash
cd /Users/reginaldsmith/vpg-website && npx vitest run tests/unit/MissionSection.test.tsx
```

Expected: `FAIL` — module not found.

---

### Step 4.2 — Implement MissionSection

**File:** `components/sections/MissionSection.tsx`

```tsx
const PROOF_STATS = [
  { value: '10', label: 'ACTIVE ARMS' },
  { value: '5', label: 'MARKETS' },
  { value: '26', label: 'FEDERAL STATUTES' },
  { value: 'IPA', label: 'PARTNER NETWORK' },
]

export default function MissionSection() {
  return (
    <section
      id="mission"
      aria-label="Mission"
      className="py-24 px-6"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="max-w-[680px] mx-auto text-center">
        <p
          style={{
            fontWeight: 700,
            fontSize: '9px',
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            color: 'rgba(245,240,232,0.4)',
            marginBottom: '24px',
          }}
        >
          OUR PURPOSE
        </p>

        <blockquote
          style={{
            fontSize: '15px',
            lineHeight: 1.8,
            color: 'rgba(245,240,232,0.7)',
            marginBottom: '48px',
            fontStyle: 'normal',
          }}
        >
          To give people who are serious about building something real the tools, the team, the
          infrastructure, and the perspective they need to{' '}
          <strong
            style={{
              color: 'var(--color-orange)',
              fontFamily: 'var(--font-clash)',
              fontWeight: 700,
            }}
          >
            actually do it
          </strong>{' '}
          — creating wealth that stays in families, jobs that stay in communities, and a standard of
          work that outlasts any single engagement.
        </blockquote>

        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '24px',
            paddingBottom: '24px',
            display: 'flex',
            justifyContent: 'center',
            gap: '0',
          }}
        >
          {PROOF_STATS.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                flex: '1',
                textAlign: 'center',
                borderRight:
                  i < PROOF_STATS.length - 1
                    ? '1px solid rgba(255,255,255,0.06)'
                    : 'none',
                paddingLeft: '12px',
                paddingRight: '12px',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-clash)',
                  fontWeight: 800,
                  fontSize: '24px',
                  color: 'var(--color-parchment)',
                  marginBottom: '4px',
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontWeight: 700,
                  fontSize: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'rgba(245,240,232,0.4)',
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Run to verify it passes:**

```bash
cd /Users/reginaldsmith/vpg-website && npx vitest run tests/unit/MissionSection.test.tsx
```

Expected: `PASS` — 7 tests green.

---

### Step 4.3 — Commit Task 4

```bash
cd /Users/reginaldsmith/vpg-website && git add components/sections/MissionSection.tsx tests/unit/MissionSection.test.tsx && git commit -m "feat: Mission + Proof Bar section §6"
```

---

## Task 5 — IPA Strip (§7)

### Files

- `components/sections/IpaStrip.tsx`
- `tests/unit/IpaStrip.test.tsx`

---

### Step 5.1 — Write failing test for IpaStrip

**File:** `tests/unit/IpaStrip.test.tsx`

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import IpaStrip from '@/components/sections/IpaStrip'

describe('IpaStrip', () => {
  it('renders the INTEGRITY PARTNER ALLIANCE label', () => {
    render(<IpaStrip />)
    expect(screen.getByText('INTEGRITY PARTNER ALLIANCE')).toBeInTheDocument()
  })

  it('renders the h2 headline', () => {
    render(<IpaStrip />)
    expect(
      screen.getByRole('heading', { name: 'Every arm you activate earns.' }),
    ).toBeInTheDocument()
  })

  it('renders the body copy', () => {
    render(<IpaStrip />)
    expect(screen.getByText(/Join the IPA and build a referral income stream/)).toBeInTheDocument()
  })

  it('renders the BECOME A PARTNER CTA linking to /partners', () => {
    render(<IpaStrip />)
    const cta = screen.getByRole('link', { name: /BECOME A PARTNER/i })
    expect(cta).toHaveAttribute('href', '/partners')
  })
})
```

**Run to verify it fails:**

```bash
cd /Users/reginaldsmith/vpg-website && npx vitest run tests/unit/IpaStrip.test.tsx
```

Expected: `FAIL` — module not found.

---

### Step 5.2 — Implement IpaStrip

**File:** `components/sections/IpaStrip.tsx`

```tsx
import { Button } from '@/components/ui/Button'

export default function IpaStrip() {
  return (
    <section
      id="ipa-strip"
      aria-label="Partner Recruitment"
      className="py-10 px-6"
      style={{
        background:
          'linear-gradient(135deg, rgba(59,109,17,0.15) 0%, rgba(201,150,12,0.10) 100%)',
        border: '1px solid rgba(59,109,17,0.3)',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-center">
        <div style={{ flex: '0 0 60%' }}>
          <p
            style={{
              color: 'var(--color-gold)',
              fontSize: '9px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              marginBottom: '12px',
            }}
          >
            INTEGRITY PARTNER ALLIANCE
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-clash)',
              fontWeight: 700,
              fontSize: '28px',
              color: 'var(--color-parchment)',
              marginBottom: '12px',
            }}
          >
            Every arm you activate earns.
          </h2>
          <p
            style={{
              fontWeight: 400,
              fontSize: '13px',
              color: 'rgba(245,240,232,0.6)',
              lineHeight: 1.6,
            }}
          >
            Join the IPA and build a referral income stream across all 10 ARMs. Associate • Certified
            • Premier. Faith-rooted. Results-verified.
          </p>
        </div>
        <div style={{ flex: '0 0 40%', display: 'flex', justifyContent: 'center' }}>
          <Button
            tier="entity"
            href="/partners"
            entityColor="#3B6D11"
          >
            BECOME A PARTNER →
          </Button>
        </div>
      </div>
    </section>
  )
}
```

**Run to verify it passes:**

```bash
cd /Users/reginaldsmith/vpg-website && npx vitest run tests/unit/IpaStrip.test.tsx
```

Expected: `PASS` — 4 tests green.

---

### Step 5.3 — Commit Task 5

```bash
cd /Users/reginaldsmith/vpg-website && git add components/sections/IpaStrip.tsx tests/unit/IpaStrip.test.tsx && git commit -m "feat: IPA Strip section §7 — partner recruitment banner"
```

---

## Task 6 — Events Section (§8)

### Files

- `components/sections/EventsSection.tsx`
- `tests/unit/EventsSection.test.tsx`

---

### Step 6.1 — Write failing test for EventsSection

**File:** `tests/unit/EventsSection.test.tsx`

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import EventsSection from '@/components/sections/EventsSection'

describe('EventsSection', () => {
  it('renders the MONTHLY label', () => {
    render(<EventsSection />)
    expect(screen.getByText('MONTHLY')).toBeInTheDocument()
  })

  it('renders the VPG Power Hour heading', () => {
    render(<EventsSection />)
    expect(screen.getByRole('heading', { name: 'VPG Power Hour' })).toBeInTheDocument()
  })

  it('renders the Power Hour body copy', () => {
    render(<EventsSection />)
    expect(
      screen.getByText(/Live monthly Q&A with the VPG team/),
    ).toBeInTheDocument()
  })

  it('renders Register CTA linking to /events#power-hour', () => {
    render(<EventsSection />)
    const link = screen.getByRole('link', { name: /Register/i })
    expect(link).toHaveAttribute('href', '/events#power-hour')
  })

  it('renders the ANNUAL label', () => {
    render(<EventsSection />)
    expect(screen.getByText('ANNUAL')).toBeInTheDocument()
  })

  it('renders VPG Summit event entry', () => {
    render(<EventsSection />)
    expect(screen.getByText('VPG Summit')).toBeInTheDocument()
    expect(screen.getByText('Q4 · Dallas TX')).toBeInTheDocument()
  })

  it('renders IPA Partner Summit event entry', () => {
    render(<EventsSection />)
    expect(screen.getByText('IPA Partner Summit')).toBeInTheDocument()
    expect(screen.getByText('Q2 · Dallas TX')).toBeInTheDocument()
  })

  it('renders View All Events CTA linking to /events', () => {
    render(<EventsSection />)
    const link = screen.getByRole('link', { name: /View All Events/i })
    expect(link).toHaveAttribute('href', '/events')
  })
})
```

**Run to verify it fails:**

```bash
cd /Users/reginaldsmith/vpg-website && npx vitest run tests/unit/EventsSection.test.tsx
```

Expected: `FAIL` — module not found.

---

### Step 6.2 — Implement EventsSection

**File:** `components/sections/EventsSection.tsx`

```tsx
import { Button } from '@/components/ui/Button'

const ANNUAL_EVENTS = [
  { name: 'VPG Summit', detail: 'Q4 · Dallas TX' },
  { name: 'IPA Partner Summit', detail: 'Q2 · Dallas TX' },
]

export default function EventsSection() {
  return (
    <section
      id="events"
      aria-label="Events"
      className="py-16 px-6"
      style={{
        background: 'var(--bg-base)',
        borderTop: '1px solid rgba(91,63,168,0.25)',
        borderBottom: '1px solid rgba(91,63,168,0.25)',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
        {/* Left — Power Hour */}
        <div style={{ flex: 1 }}>
          <p
            style={{
              color: '#5B3FA8',
              fontSize: '9px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              marginBottom: '12px',
            }}
          >
            MONTHLY
          </p>
          <h3
            style={{
              fontFamily: 'var(--font-clash)',
              fontWeight: 700,
              fontSize: '20px',
              color: 'var(--color-parchment)',
              marginBottom: '10px',
            }}
          >
            VPG Power Hour
          </h3>
          <p
            style={{
              fontSize: '13px',
              color: 'rgba(245,240,232,0.5)',
              lineHeight: 1.6,
              marginBottom: '16px',
            }}
          >
            Live monthly Q&A with the VPG team. Bring your business, credit, or partner questions.
          </p>
          <Button
            tier="tertiary"
            href="/events#power-hour"
            style={{ color: '#5B3FA8' }}
          >
            Register →
          </Button>
        </div>

        {/* Right — Annual */}
        <div style={{ flex: 1 }}>
          <p
            style={{
              color: 'var(--color-orange)',
              fontSize: '9px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              marginBottom: '12px',
            }}
          >
            ANNUAL
          </p>
          <div style={{ marginBottom: '16px' }}>
            {ANNUAL_EVENTS.map((event) => (
              <div
                key={event.name}
                style={{
                  marginBottom: '12px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-clash)',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: 'var(--color-parchment)',
                    marginBottom: '2px',
                  }}
                >
                  {event.name}
                </p>
                <p
                  style={{
                    fontSize: '9px',
                    color: 'rgba(245,240,232,0.4)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  {event.detail}
                </p>
              </div>
            ))}
          </div>
          <Button
            tier="tertiary"
            href="/events"
            style={{ color: 'var(--color-orange)' }}
          >
            View All Events →
          </Button>
        </div>
      </div>
    </section>
  )
}
```

**Run to verify it passes:**

```bash
cd /Users/reginaldsmith/vpg-website && npx vitest run tests/unit/EventsSection.test.tsx
```

Expected: `PASS` — 8 tests green.

---

### Step 6.3 — Commit Task 6

```bash
cd /Users/reginaldsmith/vpg-website && git add components/sections/EventsSection.tsx tests/unit/EventsSection.test.tsx && git commit -m "feat: Events section §8 — Power Hour + annual events"
```

---

## Task 7 — Site Footer (§9)

### Files

- `components/sections/SiteFooter.tsx`
- `tests/unit/SiteFooter.test.tsx`

---

### Step 7.1 — Write failing test for SiteFooter

**File:** `tests/unit/SiteFooter.test.tsx`

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import SiteFooter from '@/components/sections/SiteFooter'
import { ARMS } from '@/lib/arm-data'

describe('SiteFooter', () => {
  it('renders VPG brand name', () => {
    render(<SiteFooter />)
    // The brand text appears in the footer col 1
    const vpgEls = screen.getAllByText('VPG')
    expect(vpgEls.length).toBeGreaterThan(0)
  })

  it('renders the tagline', () => {
    render(<SiteFooter />)
    expect(screen.getByText(/Faith-rooted/)).toBeInTheDocument()
    expect(screen.getByText(/Results-driven/)).toBeInTheDocument()
    expect(screen.getByText(/Built to last/)).toBeInTheDocument()
  })

  it('renders the PORTFOLIO column heading', () => {
    render(<SiteFooter />)
    expect(screen.getByText('PORTFOLIO')).toBeInTheDocument()
  })

  it('renders all 10 ARM name links in the portfolio column', () => {
    render(<SiteFooter />)
    ARMS.forEach((arm) => {
      const links = screen.getAllByRole('link', { name: arm.name })
      expect(links.length).toBeGreaterThan(0)
    })
  })

  it('renders ARM 1 link pointing to /arms/vantage-point-media', () => {
    render(<SiteFooter />)
    const links = screen.getAllByRole('link', { name: 'Vantage Point Media' })
    const portfolioLink = links.find((l) => l.getAttribute('href') === '/arms/vantage-point-media')
    expect(portfolioLink).toBeTruthy()
  })

  it('renders the ENTITIES column heading', () => {
    render(<SiteFooter />)
    expect(screen.getByText('ENTITIES')).toBeInTheDocument()
  })

  it('renders the Dispute2Go entity link pointing to /arms/dispute2go', () => {
    render(<SiteFooter />)
    const link = screen.getByRole('link', { name: 'Dispute2Go' })
    expect(link).toHaveAttribute('href', '/arms/dispute2go')
  })

  it('renders the IPA entity link pointing to /partners', () => {
    render(<SiteFooter />)
    const link = screen.getByRole('link', { name: 'IPA' })
    expect(link).toHaveAttribute('href', '/partners')
  })

  it('renders the COMPANY column heading', () => {
    render(<SiteFooter />)
    expect(screen.getByText('COMPANY')).toBeInTheDocument()
  })

  it('renders the copyright strip', () => {
    render(<SiteFooter />)
    expect(
      screen.getByText(/© 2026 Vantage Point Group/),
    ).toBeInTheDocument()
  })

  it('renders social links with correct aria-labels', () => {
    render(<SiteFooter />)
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Instagram' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'X' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'YouTube' })).toBeInTheDocument()
  })

  it('social links open in new tab with rel noopener', () => {
    render(<SiteFooter />)
    const linkedIn = screen.getByRole('link', { name: 'LinkedIn' })
    expect(linkedIn).toHaveAttribute('target', '_blank')
    expect(linkedIn).toHaveAttribute('rel', 'noopener')
  })
})
```

**Run to verify it fails:**

```bash
cd /Users/reginaldsmith/vpg-website && npx vitest run tests/unit/SiteFooter.test.tsx
```

Expected: `FAIL` — module not found.

---

### Step 7.2 — Implement SiteFooter

**File:** `components/sections/SiteFooter.tsx`

```tsx
import Link from 'next/link'
import { ARMS } from '@/lib/arm-data'

const ENTITY_LINKS = [
  { name: 'Vantage Point Media', href: '/arms/vantage-point-media' },
  { name: 'Dispute2Go', href: '/arms/dispute2go' },
  { name: 'IPA', href: '/partners' },
]

const COMPANY_LINKS = [
  { name: 'About', href: '/about' },
  { name: 'The Kraken Method', href: '/about/kraken-method' },
  { name: 'Events', href: '/events' },
  { name: 'Partners', href: '/partners' },
]

const SOCIAL_LINKS = [
  { name: 'LinkedIn', href: 'https://linkedin.com' },
  { name: 'Instagram', href: 'https://instagram.com' },
  { name: 'X', href: 'https://x.com' },
  { name: 'YouTube', href: 'https://youtube.com' },
]

const navLinkStyle = {
  fontSize: '9px',
  color: 'rgba(245,240,232,0.3)',
  textDecoration: 'none',
  display: 'block',
  marginBottom: '6px',
  transition: 'color 0.15s',
} as const

const colHeadingStyle = {
  fontSize: '9px',
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.2em',
  color: 'rgba(245,240,232,0.4)',
  marginBottom: '12px',
}

export default function SiteFooter() {
  return (
    <footer
      id="footer"
      aria-label="Site footer"
      className="py-16 px-6"
      style={{ background: 'var(--bg-footer)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Col 1 — Brand */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-clash)',
                fontWeight: 700,
                fontSize: '18px',
                color: 'var(--color-parchment)',
                marginBottom: '10px',
              }}
            >
              VPG
            </p>
            <p
              style={{
                fontWeight: 300,
                fontSize: '12px',
                color: 'rgba(245,240,232,0.3)',
                lineHeight: 1.7,
                whiteSpace: 'pre-line',
              }}
            >
              {'Faith-rooted.\nResults-driven.\nBuilt to last.'}
            </p>
          </div>

          {/* Col 2 — Portfolio */}
          <div>
            <p style={colHeadingStyle}>PORTFOLIO</p>
            {ARMS.map((arm) => (
              <Link
                key={arm.id}
                href={`/arms/${arm.slug}`}
                style={navLinkStyle}
              >
                {arm.name}
              </Link>
            ))}
          </div>

          {/* Col 3 — Entities */}
          <div>
            <p style={colHeadingStyle}>ENTITIES</p>
            {ENTITY_LINKS.map((link) => (
              <Link key={link.name} href={link.href} style={navLinkStyle}>
                {link.name}
              </Link>
            ))}
          </div>

          {/* Col 4 — Company */}
          <div>
            <p style={colHeadingStyle}>COMPANY</p>
            {COMPANY_LINKS.map((link) => (
              <Link key={link.name} href={link.href} style={navLinkStyle}>
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: '24px',
            marginTop: '40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <p
            style={{
              fontSize: '9px',
              color: 'rgba(245,240,232,0.25)',
            }}
          >
            © 2026 Vantage Point Group. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener"
                aria-label={social.name}
                style={{
                  fontSize: '9px',
                  color: 'rgba(245,240,232,0.3)',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
```

**Run to verify it passes:**

```bash
cd /Users/reginaldsmith/vpg-website && npx vitest run tests/unit/SiteFooter.test.tsx
```

Expected: `PASS` — 12 tests green.

---

### Step 7.3 — Commit Task 7

```bash
cd /Users/reginaldsmith/vpg-website && git add components/sections/SiteFooter.tsx tests/unit/SiteFooter.test.tsx && git commit -m "feat: Site Footer §9 — 4-col grid with social links"
```

---

## Task 8 — Wire page.tsx (§3–§9)

### Files

- `app/page.tsx` (edit)
- `tests/unit/HomePage.smoke.test.tsx`

---

### Step 8.1 — Write failing smoke test for HomePage

**File:** `tests/unit/HomePage.smoke.test.tsx`

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import HomePage from '@/app/page'

vi.mock('@/components/hero/HeroSection', () => ({
  default: () => <div data-testid="hero-section" />,
}))
vi.mock('@/components/quiz/ARMQuizSection', () => ({
  default: () => <div data-testid="arm-quiz-section" />,
}))
vi.mock('@/components/sections/ArmBentoSection', () => ({
  default: () => <div data-testid="arm-bento-section" />,
}))
vi.mock('@/components/sections/KrakenMethodSection', () => ({
  default: () => <div data-testid="kraken-method-section" />,
}))
vi.mock('@/components/sections/EntityCardsSection', () => ({
  default: () => <div data-testid="entity-cards-section" />,
}))
vi.mock('@/components/sections/MissionSection', () => ({
  default: () => <div data-testid="mission-section" />,
}))
vi.mock('@/components/sections/IpaStrip', () => ({
  default: () => <div data-testid="ipa-strip" />,
}))
vi.mock('@/components/sections/EventsSection', () => ({
  default: () => <div data-testid="events-section" />,
}))
vi.mock('@/components/sections/SiteFooter', () => ({
  default: () => <div data-testid="site-footer" />,
}))

describe('HomePage smoke test', () => {
  it('renders all 9 sections', () => {
    render(<HomePage />)
    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
    expect(screen.getByTestId('arm-quiz-section')).toBeInTheDocument()
    expect(screen.getByTestId('arm-bento-section')).toBeInTheDocument()
    expect(screen.getByTestId('kraken-method-section')).toBeInTheDocument()
    expect(screen.getByTestId('entity-cards-section')).toBeInTheDocument()
    expect(screen.getByTestId('mission-section')).toBeInTheDocument()
    expect(screen.getByTestId('ipa-strip')).toBeInTheDocument()
    expect(screen.getByTestId('events-section')).toBeInTheDocument()
    expect(screen.getByTestId('site-footer')).toBeInTheDocument()
  })
})
```

**Run to verify it fails:**

```bash
cd /Users/reginaldsmith/vpg-website && npx vitest run tests/unit/HomePage.smoke.test.tsx
```

Expected: `FAIL` — imports resolve but mocked sections are not found (stubs render `<section>` not `data-testid`).

---

### Step 8.2 — Edit app/page.tsx

Replace the entire file content with:

```tsx
import HeroSection from '@/components/hero/HeroSection'
import ARMQuizSection from '@/components/quiz/ARMQuizSection'
import ArmBentoSection from '@/components/sections/ArmBentoSection'
import KrakenMethodSection from '@/components/sections/KrakenMethodSection'
import EntityCardsSection from '@/components/sections/EntityCardsSection'
import MissionSection from '@/components/sections/MissionSection'
import IpaStrip from '@/components/sections/IpaStrip'
import EventsSection from '@/components/sections/EventsSection'
import SiteFooter from '@/components/sections/SiteFooter'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ARMQuizSection />
      <ArmBentoSection />
      <KrakenMethodSection />
      <EntityCardsSection />
      <MissionSection />
      <IpaStrip />
      <EventsSection />
      <SiteFooter />
    </>
  )
}
```

**Run to verify smoke test passes:**

```bash
cd /Users/reginaldsmith/vpg-website && npx vitest run tests/unit/HomePage.smoke.test.tsx
```

Expected: `PASS` — 1 test green.

---

### Step 8.3 — Run full test suite

```bash
cd /Users/reginaldsmith/vpg-website && npx vitest run
```

Expected: all unit tests pass. Zero failures.

---

### Step 8.4 — Commit Task 8

```bash
cd /Users/reginaldsmith/vpg-website && git add app/page.tsx tests/unit/HomePage.smoke.test.tsx && git commit -m "feat: wire page.tsx — replace all 7 stubs with §3–§9 sections"
```

---

## Self-Review Checklist

### 1. Spec Coverage

| Spec requirement | Covered |
|---|---|
| §3 ARM Bento Grid — charcoal bg, 10-card grid, ARM badges, names, descriptors | Task 1 |
| §3 Hover — border color `CC`, name color, translateY(-3px), hover copy reveal | Task 1 `ArmBentoGrid` |
| §3 GSAP `fromTo` `{opacity:0,y:24}` → `{opacity:1,y:0}`, stagger 0.08, ScrollTrigger top 70% | Task 1 `ArmBentoGrid` |
| §3 Reduced motion skip | Task 1 `ArmBentoGrid` |
| §3 Links to `/arms/{slug}` | Task 1 `ArmBentoGrid` |
| §3 Server wrapper with header copy | Task 1 `ArmBentoSection` |
| §4 Kraken Method — bg-base, label, h2, subhead, CTA doctrine link | Task 2 `KrakenMethodSection` |
| §4 6 principles — numbers, names, descriptors, accent border-left | Task 2 `KrakenPrinciples` |
| §4 GSAP `fromTo` `{opacity:0,x:-16}` → `{opacity:1,x:0}`, stagger 0.1, top 80% | Task 2 `KrakenPrinciples` |
| §5 3 entity cards — accent bar, entity label, name, description, CTA | Task 3 |
| §5 CSS-only hover scale-[1.01] | Task 3 |
| §6 OUR PURPOSE label, blockquote, `actually do it` strong orange | Task 4 |
| §6 Proof bar — 4 stats, Clash Display 800, dividers, top/bottom borders | Task 4 |
| §7 IPA Strip — gradient bg, green border, label, h2, body, entity CTA | Task 5 |
| §8 Events — Power Hour (purple), annual events (VPG Summit, IPA Partner Summit) | Task 6 |
| §9 Footer — 4 cols, 10 ARM links, entity links, company links, bottom strip, socials | Task 7 |
| page.tsx wired — 7 stubs replaced | Task 8 |

All 17 spec sections are covered. **0 gaps.**

---

### 2. Placeholder Scan

Searched entire document for: `TODO`, `TBD`, `similar to above`, `placeholder`, `...`, `/* implement */`, `// etc`.

Result: **0 placeholders found.** Every component and every test contains full implementation code.

---

### 3. Type Consistency

| Method / export name | Defined in | Referenced in test |
|---|---|---|
| `ArmBentoGrid` (named export) | `ArmBentoGrid.tsx` | `ArmBentoGrid.test.tsx` import `{ ArmBentoGrid }` |
| `ArmBentoGrid` mock | mock in `ArmBentoSection.test.tsx` | `vi.mock('@/components/sections/ArmBentoGrid', ...)` |
| `KrakenPrinciples` (named export) | `KrakenPrinciples.tsx` | `KrakenPrinciples.test.tsx` import `{ KrakenPrinciples }` |
| `KrakenPrinciples` mock | mock in `KrakenMethodSection.test.tsx` | `vi.mock('@/components/sections/KrakenPrinciples', ...)` |
| `EntityCardsSection` (default export) | `EntityCardsSection.tsx` | `EntityCardsSection.test.tsx` default import |
| `MissionSection` (default export) | `MissionSection.tsx` | `MissionSection.test.tsx` default import |
| `IpaStrip` (default export) | `IpaStrip.tsx` | `IpaStrip.test.tsx` default import |
| `EventsSection` (default export) | `EventsSection.tsx` | `EventsSection.test.tsx` default import |
| `SiteFooter` (default export) | `SiteFooter.tsx` | `SiteFooter.test.tsx` default import |
| `handleEnter` / `handleLeave` | `ArmBentoGrid.tsx` | uses `e.currentTarget.style.borderColor`, `e.currentTarget.querySelector('[data-arm-name]')` |
| `data-arm-name` attribute | `ArmBentoGrid.tsx` card name `<p>` | `handleEnter`/`handleLeave` querySelector |
| `data-hover-copy` attribute | `ArmBentoGrid.tsx` hover copy `<p>` | `handleEnter`/`handleLeave` querySelector |
| `data-principle-card` attribute | `KrakenPrinciples.tsx` card `<div>` | `KrakenPrinciples.test.tsx` `querySelectorAll` |
| `ENTITY_CARD_ARMS` | `lib/arm-data.ts` | `EntityCardsSection.tsx` |
| `ARMS` | `lib/arm-data.ts` | `ArmBentoGrid.tsx`, `SiteFooter.tsx`, `SiteFooter.test.tsx` |

All names are consistent across definitions, implementations, and tests. **0 mismatches.**
