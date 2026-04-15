# VPG Hero Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full-viewport hero section with editorial split layout, cinematic GSAP entrance animations, ambient particle constellation, Mosaic V float loop, and ScrollTrigger scroll fade-out.

**Architecture:** Two new components — `ParticleField` (14 CSS-animated dots, purely presentational) and `HeroSection` (`'use client'`, owns all GSAP/ScrollTrigger logic and the complete layout). `HeroSection` is wired into `app/page.tsx` replacing the empty self-closing hero shell. All animations use the existing `lib/gsap.ts` singleton; a `prefers-reduced-motion` guard skips all GSAP if the user has requested reduced motion.

**Tech Stack:** Next.js 16.2.1 (Turbopack), React 19, TypeScript strict, GSAP 3 + ScrollTrigger (via `@/lib/gsap`), Tailwind CSS v4 (tokens via `var()`), Next.js `<Image>` with `priority`, Vitest + @testing-library/react, Playwright

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `app/globals.css` | Modify | Append three `@keyframes` particle drift animations |
| `components/hero/ParticleField.tsx` | Create | 14 CSS-animated dot constellation, `aria-hidden`, no refs |
| `components/hero/HeroSection.tsx` | Create | `'use client'` hero — layout, GSAP entrance, float loop, ScrollTrigger |
| `app/page.tsx` | Modify | Replace `<section id="hero" ... />` shell with `<HeroSection />` |
| `tests/unit/ParticleField.test.tsx` | Create | Unit: count prop, aria-hidden |
| `tests/unit/HeroSection.test.tsx` | Create | Unit: headline text, gold Kingdom, CTA href, image alt, particle wrapper |
| `tests/e2e/hero.spec.ts` | Create | E2E: hero visible, headline in DOM, CTA navigates |

---

### Task 1: Particle drift keyframes + ParticleField component

**Files:**
- Modify: `app/globals.css`
- Create: `components/hero/ParticleField.tsx`
- Test: `tests/unit/ParticleField.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/unit/ParticleField.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ParticleField } from '@/components/hero/ParticleField'

describe('ParticleField', () => {
  it('renders 14 particle spans by default', () => {
    const { container } = render(<ParticleField />)
    expect(container.querySelectorAll('span')).toHaveLength(14)
  })

  it('renders a custom count when count prop is passed', () => {
    const { container } = render(<ParticleField count={6} />)
    expect(container.querySelectorAll('span')).toHaveLength(6)
  })

  it('outer wrapper has aria-hidden="true"', () => {
    const { container } = render(<ParticleField />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd /Users/reginaldsmith/vpg-website/.worktrees/plan-1-foundation && node_modules/.bin/vitest run tests/unit/ParticleField.test.tsx
```

Expected: 3 failures — `Cannot find module '@/components/hero/ParticleField'`

- [ ] **Step 3: Add particle keyframes to globals.css**

Open `app/globals.css`. Append the following after the closing `}` of the `@layer base { }` block (after line 106):

```css
/* ─────────────────────────────────────────────────────────────────
   Particle Field — Ambient Dot Animations
   ───────────────────────────────────────────────────────────────── */
@keyframes particleDriftA {
  0%, 100% { transform: translate(0, 0);     opacity: 0.7; }
  33%       { transform: translate(8px, -10px); opacity: 1;   }
  66%       { transform: translate(-5px, 6px);  opacity: 0.5; }
}

@keyframes particleDriftB {
  0%, 100% { transform: translate(0, 0);      opacity: 0.5; }
  50%       { transform: translate(-8px, -8px); opacity: 0.9; }
}

@keyframes particleDriftC {
  0%, 100% { transform: translate(0, 0);    opacity: 0.6; }
  50%       { transform: translate(5px, -9px); opacity: 1;   }
}
```

- [ ] **Step 4: Create ParticleField component**

Create `components/hero/ParticleField.tsx`:

```tsx
'use client'

interface ParticleFieldProps {
  count?: number
}

const DRIFT = ['particleDriftA', 'particleDriftB', 'particleDriftC'] as const

// 14 particles — 2 per ARM color + 2 neutral
const PARTICLES = [
  { top: '15%', left: '8%',  size: 2,   color: '#00B4CB',               dur: '7s',   delay: '0s'   },
  { top: '72%', left: '35%', size: 1.5, color: '#E8541A',               dur: '9s',   delay: '1.2s' },
  { top: '28%', left: '62%', size: 2,   color: '#C9960C',               dur: '6s',   delay: '2.4s' },
  { top: '55%', left: '80%', size: 1.5, color: '#5B3FA8',               dur: '8s',   delay: '0.6s' },
  { top: '82%', left: '18%', size: 2,   color: '#3B6D11',               dur: '7.5s', delay: '3s'   },
  { top: '10%', left: '52%', size: 1.5, color: '#00B4CB',               dur: '5.5s', delay: '1.8s' },
  { top: '44%', left: '90%', size: 2,   color: '#E8541A',               dur: '8.5s', delay: '2.1s' },
  { top: '38%', left: '42%', size: 1.5, color: '#C9960C',               dur: '6.5s', delay: '0.3s' },
  { top: '65%', left: '12%', size: 2,   color: '#5B3FA8',               dur: '9s',   delay: '1.5s' },
  { top: '8%',  left: '75%', size: 1.5, color: '#3B6D11',               dur: '7s',   delay: '3.6s' },
  { top: '50%', left: '25%', size: 2,   color: 'rgba(245,240,232,0.3)', dur: '6s',   delay: '0.9s' },
  { top: '20%', left: '88%', size: 1.5, color: 'rgba(245,240,232,0.3)', dur: '8s',   delay: '2.7s' },
  { top: '90%', left: '55%', size: 2,   color: 'rgba(0,180,203,0.25)',  dur: '5s',   delay: '1.1s' },
  { top: '33%', left: '5%',  size: 1.5, color: 'rgba(0,180,203,0.25)',  dur: '7.5s', delay: '4s'   },
] as const

export function ParticleField({ count = 14 }: ParticleFieldProps) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {PARTICLES.slice(0, count).map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animationName: DRIFT[i % 3],
            animationDuration: p.dur,
            animationDelay: p.delay,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationFillMode: 'both',
          }}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
node_modules/.bin/vitest run tests/unit/ParticleField.test.tsx
```

Expected: 3 passing.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css components/hero/ParticleField.tsx tests/unit/ParticleField.test.tsx
git commit -m "feat: add ParticleField component and particle drift keyframes"
```

---

### Task 2: HeroSection component + unit tests

**Files:**
- Create: `components/hero/HeroSection.tsx`
- Test: `tests/unit/HeroSection.test.tsx`

**Context:** `HeroSection` is a `'use client'` component. It contains the full hero layout AND all GSAP animation logic. GSAP is mocked in unit tests (so tests check rendered markup only). The GSAP mock must invoke the context callback so the `useEffect` code runs against mocked fns without throwing.

- [ ] **Step 1: Write failing tests**

Create `tests/unit/HeroSection.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import HeroSection from '@/components/hero/HeroSection'

// Mock GSAP — context must call its callback so useEffect code runs
vi.mock('@/lib/gsap', () => ({
  gsap: {
    context: vi.fn().mockImplementation((fn: () => void) => {
      if (typeof fn === 'function') fn()
      return { revert: vi.fn() }
    }),
    set: vi.fn(),
    timeline: vi.fn(() => ({ to: vi.fn().mockReturnThis() })),
    to: vi.fn(() => ({ kill: vi.fn() })),
  },
  ScrollTrigger: {
    create: vi.fn(),
  },
}))

// Mock next/image — renders a plain <img> in tests
vi.mock('next/image', () => ({
  default: ({ alt, src, ...props }: { alt: string; src: string; [key: string]: unknown }) => (
    <img alt={alt} src={src} {...(props as React.ImgHTMLAttributes<HTMLImageElement>)} />
  ),
}))

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  })
})

describe('HeroSection', () => {
  it('renders all three headline lines', () => {
    render(<HeroSection />)
    expect(screen.getByText('Serious Builders.')).toBeInTheDocument()
    expect(screen.getByText(/Purpose\./)).toBeInTheDocument()
    expect(screen.getByText('Ten Movements Forward.')).toBeInTheDocument()
  })

  it('"Kingdom" text is rendered inside the headline', () => {
    render(<HeroSection />)
    expect(screen.getByText('Kingdom')).toBeInTheDocument()
  })

  it('CTA button links to #arm-quiz', () => {
    render(<HeroSection />)
    const cta = screen.getByRole('link', { name: /find your arm/i })
    expect(cta).toHaveAttribute('href', '#arm-quiz')
  })

  it('Mosaic V image has descriptive alt text', () => {
    render(<HeroSection />)
    expect(screen.getByAltText('Mosaic V — VPG brand mark')).toBeInTheDocument()
  })

  it('ParticleField wrapper is aria-hidden', () => {
    render(<HeroSection />)
    const hidden = document.querySelector('[aria-hidden="true"]')
    expect(hidden).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
node_modules/.bin/vitest run tests/unit/HeroSection.test.tsx
```

Expected: 5 failures — `Cannot find module '@/components/hero/HeroSection'`

- [ ] **Step 3: Create HeroSection component**

Create `components/hero/HeroSection.tsx`:

```tsx
'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { Button } from '@/components/ui/Button'
import { ParticleField } from './ParticleField'

export default function HeroSection() {
  // Refs for GSAP targets
  const particlesRef = useRef<HTMLDivElement>(null)
  const contentRef   = useRef<HTMLDivElement>(null)
  const mosaicRef    = useRef<HTMLDivElement>(null)
  const glowRef      = useRef<HTMLDivElement>(null)
  const eyebrowRef   = useRef<HTMLParagraphElement>(null)
  const line1Ref     = useRef<HTMLSpanElement>(null)
  const line2Ref     = useRef<HTMLSpanElement>(null)
  const line3Ref     = useRef<HTMLSpanElement>(null)
  const taglineRef   = useRef<HTMLParagraphElement>(null)
  const ctaRef       = useRef<HTMLDivElement>(null)

  // Float loop tweens need explicit cleanup (created in onComplete, outside ctx scope)
  const floatTweens  = useRef<{ kill: () => void }[]>([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // ── Initial hidden states ─────────────────────────────────────
      gsap.set(particlesRef.current,  { opacity: 0 })
      gsap.set(mosaicRef.current,     { autoAlpha: 0, scale: 0.85 })
      gsap.set(glowRef.current,       { opacity: 0,   scale: 0.6  })
      gsap.set(eyebrowRef.current,    { autoAlpha: 0, y: 12       })
      gsap.set(
        [line1Ref.current, line2Ref.current, line3Ref.current],
        { autoAlpha: 0, x: -24 },
      )
      gsap.set(taglineRef.current, { autoAlpha: 0, y: 8 })
      gsap.set(ctaRef.current,     { autoAlpha: 0, y: 8 })

      // ── Entrance timeline ─────────────────────────────────────────
      const tl = gsap.timeline({
        onComplete() {
          // Float loop starts after entrance (lives outside ctx — killed manually)
          floatTweens.current = [
            gsap.to(mosaicRef.current, {
              y: -14, duration: 5, ease: 'sine.inOut', repeat: -1, yoyo: true,
            }),
            gsap.to(glowRef.current, {
              scale: 1.12, duration: 5, ease: 'sine.inOut', repeat: -1, yoyo: true,
            }),
          ]
        },
      })

      tl.to(particlesRef.current,  { opacity: 1, duration: 1.2, ease: 'power2.out' }, 0)
        .to(mosaicRef.current,     { scale: 1, autoAlpha: 1, duration: 1.0, ease: 'power3.out' }, 0.2)
        .to(glowRef.current,       { scale: 1, opacity: 1,   duration: 1.4, ease: 'power2.out' }, 0.3)
        .to(eyebrowRef.current,    { y: 0, autoAlpha: 1,     duration: 0.5, ease: 'power2.out' }, 0.5)
        .to(
          [line1Ref.current, line2Ref.current, line3Ref.current],
          { x: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out', stagger: 0.12 },
          0.65,
        )
        .to(taglineRef.current, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, 1.0)
        .to(ctaRef.current,     { y: 0, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.4)' }, 1.15)

      // ── Scroll fade-out ───────────────────────────────────────────
      ScrollTrigger.create({
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        animation: gsap.timeline()
          .to(contentRef.current,  { autoAlpha: 0, y: -40 })
          .to(particlesRef.current, { autoAlpha: 0 }, '<50%'),
      })
    })

    return () => {
      ctx.revert()
      floatTweens.current.forEach(t => t.kill())
    }
  }, [])

  return (
    <section
      id="hero"
      aria-label="Hero"
      className="relative min-h-screen bg-[var(--bg-base)] flex flex-col lg:flex-row overflow-hidden"
    >
      {/* Particle constellation — behind everything */}
      <div ref={particlesRef} className="absolute inset-0 z-0">
        <ParticleField />
      </div>

      {/* Content wrapper — fades on scroll */}
      <div ref={contentRef} className="relative z-10 flex flex-col w-full lg:flex-row min-h-screen">

        {/* Mosaic V — top on mobile (order-1), right on desktop (order-2) */}
        <div className="flex items-center justify-center pt-24 pb-8 lg:order-2 lg:w-[45%] lg:py-0">
          <div className="relative flex items-center justify-center">
            {/* Glow ring */}
            <div
              ref={glowRef}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: '600px',
                height: '600px',
                background:
                  'radial-gradient(circle, rgba(201,150,12,0.12) 0%, rgba(232,84,26,0.06) 40%, transparent 70%)',
              }}
            />
            {/* Mosaic V render — wrapped for GSAP targeting */}
            <div ref={mosaicRef} className="relative z-10">
              <Image
                src="/mosaic-v-hero.png"
                alt="Mosaic V — VPG brand mark"
                width={480}
                height={480}
                priority
                sizes="(max-width: 768px) 240px, (max-width: 1024px) 340px, 480px"
                className="object-contain w-[240px] md:w-[340px] lg:w-[480px] h-auto"
                style={{ filter: 'drop-shadow(0 0 30px rgba(201,150,12,0.4))' }}
              />
            </div>
          </div>
        </div>

        {/* Left column — text + CTA */}
        <div className="flex flex-1 flex-col justify-center px-6 pb-16 lg:order-1 lg:pl-16 lg:pr-8 lg:py-24">
          <p
            ref={eyebrowRef}
            className="mb-3 text-[11px] uppercase tracking-[0.2em] text-[var(--color-orange)]"
          >
            10 Adaptive Reach Movements
          </p>

          <h1 className="mb-4 font-[family-name:var(--font-clash)] font-extrabold uppercase leading-[1.05] tracking-[0.01em] text-[var(--color-parchment)] text-[38px] md:text-[52px] lg:text-[72px]">
            <span ref={line1Ref} className="block">Serious Builders.</span>
            <span ref={line2Ref} className="block">
              <span className="text-[var(--color-gold)]">Kingdom</span> Purpose.
            </span>
            <span ref={line3Ref} className="block">Ten Movements Forward.</span>
          </h1>

          <p
            ref={taglineRef}
            className="mb-8 text-[11px] uppercase tracking-[0.2em] leading-[2] text-[rgba(245,240,232,0.4)]"
          >
            Faith-Rooted · Excellence-Driven · Results-Accountable
          </p>

          <div ref={ctaRef}>
            <Button tier="primary" href="#arm-quiz" className="w-full sm:w-auto">
              Find Your ARM
            </Button>
          </div>
        </div>

      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run HeroSection and ParticleField tests**

```bash
node_modules/.bin/vitest run tests/unit/HeroSection.test.tsx tests/unit/ParticleField.test.tsx
```

Expected: 8 passing.

- [ ] **Step 5: Run full unit test suite**

```bash
node_modules/.bin/vitest run
```

Expected: All previously passing tests still pass (Navigation, MegaMenu, MobileOverlay, Button, tokens, arm-data, MosaicV + 8 new).

- [ ] **Step 6: Commit**

```bash
git add components/hero/HeroSection.tsx tests/unit/HeroSection.test.tsx
git commit -m "feat: add HeroSection with GSAP entrance, float loop, and scroll fade-out"
```

---

### Task 3: Wire HeroSection into page.tsx + E2E tests

**Files:**
- Modify: `app/page.tsx`
- Create: `tests/e2e/hero.spec.ts`

- [ ] **Step 1: Write E2E tests**

Create `tests/e2e/hero.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

test.describe('Hero section', () => {
  test('hero section is visible on page load', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#hero')).toBeVisible()
  })

  test('all three headline lines are visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Serious Builders.')).toBeVisible()
    await expect(page.getByText('Kingdom')).toBeVisible()
    await expect(page.getByText('Ten Movements Forward.')).toBeVisible()
  })

  test('CTA link is visible and points to #arm-quiz', async ({ page }) => {
    await page.goto('/')
    const cta = page.getByRole('link', { name: /find your arm/i }).first()
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute('href', '#arm-quiz')
  })

  test('Mosaic V image is present in the DOM', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByAltText('Mosaic V — VPG brand mark')).toBeAttached()
  })
})
```

- [ ] **Step 2: Update page.tsx**

Open `app/page.tsx`. Replace the entire file content with:

```tsx
import HeroSection from '@/components/hero/HeroSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <section id="arm-quiz"      className="bg-[var(--bg-surface)] py-24"        aria-label="ARM Routing Quiz" />
      <section id="arm-grid"      className="bg-[var(--color-charcoal)] py-24"    aria-label="Portfolio" />
      <section id="kraken-method" className="bg-[var(--bg-base)] py-24"           aria-label="The Kraken Method" />
      <section id="entity-cards"  className="bg-[var(--bg-surface)] py-24"        aria-label="Entities" />
      <section id="mission"       className="bg-[var(--bg-base)] py-24"           aria-label="Mission" />
      <section id="ipa-strip"     className="py-16"                               aria-label="Partner Recruitment" />
      <section id="events"        className="bg-[var(--bg-base)] py-16"           aria-label="Events" />
      <footer  id="footer"        className="bg-[var(--bg-footer)] py-16"         aria-label="Site footer" />
    </>
  )
}
```

- [ ] **Step 3: Run full unit test suite**

```bash
node_modules/.bin/vitest run
```

Expected: All tests pass.

- [ ] **Step 4: Verify in browser at http://localhost:3000**

Check the following in the browser (dev server should already be running):

- Hero fills the full viewport height
- Left column: eyebrow (orange, uppercase), headline (three lines, "Kingdom" in gold), tagline (muted), CTA button (orange)
- Right column: Mosaic V render visible on desktop, appears above headline on mobile
- Particle dots visible as small colored specks across the background
- On page load: entrance animations play (particles fade in, Mosaic V scales up, headline slides in left-to-right)
- Mosaic V gently floats up and down after entrance
- Scrolling down: hero content fades and lifts while ARM Quiz section comes up underneath

- [ ] **Step 5: Run E2E tests**

```bash
node_modules/.bin/playwright test tests/e2e/hero.spec.ts
```

Expected: 4 passing.

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx tests/e2e/hero.spec.ts
git commit -m "feat: wire HeroSection into page.tsx, add hero E2E tests"
```
