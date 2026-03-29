# VPG Website — Plan 1: Foundation, Design System & Navigation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap a production-ready Next.js 14 App Router project with the full VPG design system (tokens, fonts, components) and a fully tested navigation (desktop mega-menu + mobile overlay + scroll behavior).

**Architecture:** Next.js 14 App Router, TypeScript strict mode, Tailwind CSS with custom design tokens, shadcn/ui for base primitives, Vitest + Testing Library for unit/component tests, Playwright for E2E. Navigation is a single `<Navigation>` component composed of `<MegaMenu>` (desktop) and `<MobileOverlay>` (mobile). GSAP registered globally in a `lib/gsap.ts` module — never imported ad-hoc.

**Tech Stack:** Next.js 14, TypeScript 5, Tailwind CSS 3, shadcn/ui, GSAP 3, Vitest, @testing-library/react, Playwright, Clash Display (Fontshare), Inter (self-hosted or Google Fonts)

---

## File Map

```
vpg-website/
├── package.json                          CREATE — all dependencies
├── next.config.ts                        CREATE — image domains, strict mode
├── tailwind.config.ts                    CREATE — design tokens as Tailwind theme
├── tsconfig.json                         CREATE — strict TS config
├── vitest.config.ts                      CREATE — vitest setup
├── playwright.config.ts                  CREATE — E2E config
├── .env.local.example                    CREATE — env var template
│
├── public/
│   ├── fonts/
│   │   └── ClashDisplay-Variable.woff2   PLACE — download from Fontshare
│   ├── favicon.svg                       CREATE — Mosaic V SVG with dark/light mode
│   ├── favicon.ico                       CREATE — 32×32 fallback
│   └── site.webmanifest                  CREATE — PWA manifest
│
├── app/
│   ├── globals.css                       CREATE — design tokens, base styles
│   ├── fonts.ts                          CREATE — next/font declarations
│   ├── layout.tsx                        CREATE — root layout (fonts, meta shell)
│   └── page.tsx                          CREATE — homepage shell (sections stubbed)
│
├── components/
│   ├── nav/
│   │   ├── Navigation.tsx                CREATE — root nav component
│   │   ├── MegaMenu.tsx                  CREATE — 10-ARM portfolio dropdown
│   │   ├── MobileOverlay.tsx             CREATE — full-screen mobile nav
│   │   └── NavCTA.tsx                    CREATE — "FIND YOUR ARM" button
│   └── ui/
│       ├── Button.tsx                    CREATE — 4-tier button system
│       └── MosaicV.tsx                   CREATE — SVG logo component (all 6 lockups)
│
├── lib/
│   ├── gsap.ts                           CREATE — GSAP + ScrollTrigger registration
│   └── arm-data.ts                       CREATE — 10-ARM static data (colors, slugs, copy)
│
└── tests/
    ├── setup.ts                          CREATE — vitest global setup
    ├── e2e/
    │   └── navigation.spec.ts            CREATE — Playwright E2E nav tests
    └── unit/
        ├── Button.test.tsx               CREATE
        ├── MosaicV.test.tsx              CREATE
        ├── Navigation.test.tsx           CREATE
        ├── MegaMenu.test.tsx             CREATE
        └── MobileOverlay.test.tsx        CREATE
```

---

## Task 1: Initialize Next.js 14 Project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `.env.local.example`

- [ ] **Step 1: Bootstrap the project**

```bash
cd /Users/reginaldsmith/vpg-website
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=no \
  --import-alias="@/*" \
  --no-git
```

When prompted: accept all defaults (Tailwind = yes, App Router = yes, src directory = no).

Expected: `package.json`, `app/`, `public/`, `tailwind.config.ts`, `next.config.ts`, `tsconfig.json` created.

- [ ] **Step 2: Install all project dependencies**

```bash
npm install gsap @gsap/react three @types/three
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @playwright/test
npm install next-seo clsx tailwind-merge
npx shadcn@latest init
```

When `shadcn init` prompts:
- Style: `Default`
- Base color: `Slate` (we'll override all tokens anyway)
- CSS variables: `yes`

- [ ] **Step 3: Configure tsconfig for strict mode**

Open `tsconfig.json`. Verify `"strict": true` is present. Add if missing:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

- [ ] **Step 4: Create .env.local.example**

Create `/Users/reginaldsmith/vpg-website/.env.local.example`:

```bash
# GoHighLevel
GHL_WEBHOOK_URL=https://hooks.gohighlevel.com/your-webhook-endpoint

# Analytics
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXXXX

# Site
NEXT_PUBLIC_SITE_URL=https://vantagepointgroup.com
```

Copy it to `.env.local` and fill in real values before running.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: initialize Next.js 14 project with dependencies"
```

---

## Task 2: Design Tokens + Tailwind Config

**Files:**
- Create: `app/globals.css` (full)
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Write failing test — verify CSS tokens exist at runtime**

Create `tests/unit/tokens.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'

// Token names we expect to be defined as CSS custom properties.
// This test runs in jsdom and reads computed styles to verify the
// tokens are actually injected — catches typos in globals.css.
const REQUIRED_TOKENS = [
  '--color-orange',
  '--color-cyan',
  '--color-charcoal',
  '--color-green',
  '--color-gold',
  '--color-violet',
  '--color-navy',
  '--color-parchment',
  '--bg-base',
  '--bg-surface',
  '--bg-footer',
]

describe('Design tokens', () => {
  it('all required CSS tokens are defined on :root', () => {
    // In jsdom, we cannot inject a real stylesheet, so we
    // validate by asserting the token names exist in globals.css source.
    // This is a build-time contract test.
    const fs = require('fs')
    const css = fs.readFileSync('app/globals.css', 'utf8')
    for (const token of REQUIRED_TOKENS) {
      expect(css, `Missing token: ${token}`).toContain(token)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run tests/unit/tokens.test.ts
```

Expected: FAIL — `app/globals.css` doesn't contain the tokens yet.

- [ ] **Step 3: Write globals.css with full design token set**

Replace contents of `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* ── Mosaic Palette ───────────────────────── */
    --color-orange:   #E8541A;
    --color-cyan:     #00B4CB;
    --color-charcoal: #2C2C2A;
    --color-green:    #3B6D11;
    --color-gold:     #C9960C;
    --color-violet:   #5B3FA8;
    --color-navy:     #0D1B2A;
    --color-parchment:#F5F0E8;

    /* ── Background Depth Scale ──────────────── */
    --bg-base:    #0D1B2A;   /* primary background */
    --bg-surface: #111a26;   /* elevated sections  */
    --bg-footer:  #0a1118;   /* footer — darkest   */

    /* ── shadcn/ui overrides ─────────────────── */
    --background:   var(--bg-base);
    --foreground:   var(--color-parchment);
    --border:       rgba(245, 240, 232, 0.12);
    --input:        rgba(255, 255, 255, 0.05);
    --ring:         var(--color-orange);
    --radius:       0.1875rem; /* 3px */
  }

  html {
    color-scheme: dark;
  }

  body {
    @apply bg-[--bg-base] text-[--color-parchment] antialiased;
    font-family: var(--font-inter), system-ui, -apple-system, sans-serif;
  }

  /* Skip link */
  .sr-only:focus-visible {
    @apply not-sr-only fixed top-2 left-2 z-[9999] bg-[--color-orange]
           text-white px-4 py-2 rounded text-sm font-semibold;
  }

  /* Focus visible — global */
  :focus-visible {
    outline: 2px solid var(--color-orange);
    outline-offset: 3px;
  }
}
```

- [ ] **Step 4: Write tailwind.config.ts with full token extension**

Replace `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        orange:   'var(--color-orange)',
        cyan:     'var(--color-cyan)',
        charcoal: 'var(--color-charcoal)',
        green:    'var(--color-green)',
        gold:     'var(--color-gold)',
        violet:   'var(--color-violet)',
        navy:     'var(--color-navy)',
        parchment:'var(--color-parchment)',
      },
      backgroundColor: {
        base:    'var(--bg-base)',
        surface: 'var(--bg-surface)',
        footer:  'var(--bg-footer)',
      },
      fontFamily: {
        clash: ['var(--font-clash)', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        inter: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        labels: '0.2em',  /* 3–4px at 12px = ~0.2em */
      },
      borderRadius: {
        DEFAULT: '3px',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 5: Set up Vitest config**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

Create `tests/setup.ts`:

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 6: Run token test to verify it passes**

```bash
npx vitest run tests/unit/tokens.test.ts
```

Expected: PASS — all required tokens found in `globals.css`.

- [ ] **Step 7: Commit**

```bash
git add app/globals.css tailwind.config.ts vitest.config.ts tests/
git commit -m "feat: add design tokens, Tailwind config, and test setup"
```

---

## Task 3: Font Setup (Clash Display + Inter)

**Files:**
- Create: `app/fonts.ts`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Download Clash Display**

```bash
# Download from Fontshare (free, web license included)
# Manual step: go to https://www.fontshare.com/fonts/clash-display
# Download "Variable Font" — save ClashDisplay-Variable.woff2 to:
mkdir -p public/fonts
# Place ClashDisplay-Variable.woff2 in public/fonts/
```

Verify the file is present:
```bash
ls public/fonts/
# Expected: ClashDisplay-Variable.woff2
```

- [ ] **Step 2: Write failing test — verify font CSS variables are set**

Add to `tests/unit/tokens.test.ts` (append inside the describe block):

```typescript
it('font family CSS variables are referenced in globals.css', () => {
  const fs = require('fs')
  const css = fs.readFileSync('app/globals.css', 'utf8')
  expect(css).toContain('--font-clash')
  expect(css).toContain('--font-inter')
})
```

Run:
```bash
npx vitest run tests/unit/tokens.test.ts
```
Expected: FAIL on the new assertion.

- [ ] **Step 3: Create fonts.ts**

Create `app/fonts.ts`:

```typescript
import localFont from 'next/font/local'
import { Inter } from 'next/font/google'

export const clashDisplay = localFont({
  src: '../public/fonts/ClashDisplay-Variable.woff2',
  variable: '--font-clash',
  display: 'swap',
  preload: true,
  fallback: ['"Helvetica Neue"', 'Arial', 'sans-serif'],
  weight: '200 700',
})

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})
```

- [ ] **Step 4: Update globals.css to reference font variables (add to :root)**

In `app/globals.css`, add inside `:root {}`:

```css
/* ── Font variables (set by next/font, referenced here for test) ── */
/* --font-clash and --font-inter are injected by Next.js at runtime  */
/* This comment anchors the contract test. */
```

Then update the `body` rule to reference both:

```css
body {
  @apply bg-[--bg-base] text-[--color-parchment] antialiased;
  font-family: var(--font-inter), system-ui, -apple-system, sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-clash), "Helvetica Neue", Arial, sans-serif;
}
```

Update `globals.css` to include the literal strings `--font-clash` and `--font-inter` so the test passes (they are the CSS variable names set by `next/font`).

- [ ] **Step 5: Create root layout**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { clashDisplay, inter } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Vantage Point Group',
    template: '%s | Vantage Point Group',
  },
  description:
    'The infrastructure behind serious builders. 10 Adaptive Reach Movements. One operating system. Faith-rooted. Results-driven.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vantagepointgroup.com'
  ),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${clashDisplay.variable} ${inter.variable}`}>
      <body>
        <a href="#main-content" className="sr-only">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 6: Run token test**

```bash
npx vitest run tests/unit/tokens.test.ts
```

Expected: PASS — `--font-clash` and `--font-inter` strings found in `globals.css`.

- [ ] **Step 7: Verify dev server boots**

```bash
npm run dev
```

Open `http://localhost:3000` — page should load with dark background. Check console for errors.
Stop server with `Ctrl+C`.

- [ ] **Step 8: Commit**

```bash
git add app/fonts.ts app/layout.tsx app/globals.css public/fonts/
git commit -m "feat: add Clash Display and Inter fonts via next/font"
```

---

## Task 4: ARM Data Module

**Files:**
- Create: `lib/arm-data.ts`
- Create: `tests/unit/arm-data.test.ts`

This module is the single source of truth for all 10-ARM static data. Every component (mega menu, bento grid, quiz result, footer) imports from here — never hardcodes ARM data inline.

- [ ] **Step 1: Write failing test**

Create `tests/unit/arm-data.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { ARMS, getArmBySlug, getArmById } from '@/lib/arm-data'

describe('arm-data', () => {
  it('has exactly 10 ARMs', () => {
    expect(ARMS).toHaveLength(10)
  })

  it('every ARM has required fields', () => {
    for (const arm of ARMS) {
      expect(arm.id, `ARM ${arm.id} missing id`).toBeTypeOf('number')
      expect(arm.name, `ARM ${arm.id} missing name`).toBeTypeOf('string')
      expect(arm.slug, `ARM ${arm.id} missing slug`).toBeTypeOf('string')
      expect(arm.color, `ARM ${arm.id} missing color`).toMatch(/^#[0-9A-F]{6}$/i)
      expect(arm.descriptor, `ARM ${arm.id} missing descriptor`).toBeTypeOf('string')
      expect(arm.hoverCopy, `ARM ${arm.id} missing hoverCopy`).toBeTypeOf('string')
      expect(arm.entity, `ARM ${arm.id} missing entity`).toBeTypeOf('string')
    }
  })

  it('all slugs are unique', () => {
    const slugs = ARMS.map((a) => a.slug)
    expect(new Set(slugs).size).toBe(10)
  })

  it('getArmBySlug returns correct arm', () => {
    const arm = getArmBySlug('dispute2go')
    expect(arm?.id).toBe(2)
  })

  it('getArmById returns correct arm', () => {
    const arm = getArmById(7)
    expect(arm?.slug).toBe('integrity-partner-alliance')
  })

  it('getArmBySlug returns undefined for unknown slug', () => {
    expect(getArmBySlug('nonexistent')).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run to verify it fails**

```bash
npx vitest run tests/unit/arm-data.test.ts
```

Expected: FAIL — module does not exist.

- [ ] **Step 3: Create lib/arm-data.ts**

Create `lib/arm-data.ts`:

```typescript
export interface Arm {
  id: number
  name: string
  slug: string
  entity: string      // short entity name for display
  color: string       // ARM accent hex color
  descriptor: string  // 3-word descriptor for bento card
  hoverCopy: string   // expanded copy revealed on hover (max 15 words)
  entityCard?: {      // only present for VPM, D2G, IPA (homepage entity cards)
    description: string
    cta: string
    href: string
  }
}

export const ARMS: Arm[] = [
  {
    id: 1,
    name: 'Vantage Point Media',
    slug: 'vantage-point-media',
    entity: 'VPM',
    color: '#E8541A',
    descriptor: 'Brand · Content · Distribution',
    hoverCopy: 'Become the authority in your market. We build the content machine.',
    entityCard: {
      description:
        'Brand strategy, content production, and distribution for businesses ready to become authorities in their market.',
      cta: 'Explore VPM →',
      href: '/arms/vantage-point-media',
    },
  },
  {
    id: 2,
    name: 'Dispute2Go',
    slug: 'dispute2go',
    entity: 'D2G',
    color: '#00B4CB',
    descriptor: 'AI Credit Disputes',
    hoverCopy: 'AMELIA disputes tri-bureau. 26 federal statutes. No guesswork.',
    entityCard: {
      description:
        'AI-native credit dispute platform. AMELIA references 26 federal statutes to build your case. Tri-bureau. Automated. Built for results.',
      cta: 'Explore D2G →',
      href: '/arms/dispute2go',
    },
  },
  {
    id: 3,
    name: 'VPG Capital & Funding',
    slug: 'vpg-capital',
    entity: 'Capital',
    color: '#C9960C',
    descriptor: 'Funding · Capital Access',
    hoverCopy: 'Capital strategy, business credit stacking, and lender-ready positioning.',
  },
  {
    id: 4,
    name: 'GTM & Sales Consulting',
    slug: 'gtm-consulting',
    entity: 'GTM',
    color: '#5B3FA8',
    descriptor: 'Sales · Revenue Strategy',
    hoverCopy: 'GTM architecture, pipeline design, and revenue execution for B2B.',
  },
  {
    id: 5,
    name: 'VPG Academy',
    slug: 'vpg-academy',
    entity: 'Academy',
    color: '#3B6D11',
    descriptor: 'Education · Training',
    hoverCopy: 'The curriculum behind the Kraken. Learn, certify, execute.',
  },
  {
    id: 6,
    name: 'VPG Ventures',
    slug: 'vpg-ventures',
    entity: 'Ventures',
    color: '#C9960C',
    descriptor: 'Equity · Portfolio Ops',
    hoverCopy: 'Co-invest, co-build, co-own. VPG Ventures takes equity positions.',
  },
  {
    id: 7,
    name: 'Integrity Partner Alliance',
    slug: 'integrity-partner-alliance',
    entity: 'IPA',
    color: '#3B6D11',
    descriptor: 'Integrity Partner Alliance',
    hoverCopy: 'Refer once. Earn across all 10 arms. Build recurring income.',
    entityCard: {
      description:
        'The referral network that compounds everything. Associate • Certified • Premier. 8–15% commission on every ARM you activate.',
      cta: 'Become a Partner →',
      href: '/partners',
    },
  },
  {
    id: 8,
    name: 'VPG AI & Technology',
    slug: 'vpg-ai',
    entity: 'AMELIA',
    color: '#00B4CB',
    descriptor: 'Proprietary AI · Tech',
    hoverCopy: 'AMELIA is the first ARM 8 product. More IP in development.',
  },
  {
    id: 9,
    name: 'VPG Influence & Public Affairs',
    slug: 'vpg-influence',
    entity: 'Influence',
    color: '#5B3FA8',
    descriptor: 'Advocacy · Public Affairs',
    hoverCopy: 'Narrative control, civic influence, and public positioning.',
  },
  {
    id: 10,
    name: 'VPG Global Expansion',
    slug: 'vpg-global',
    entity: 'Global',
    color: '#E8541A',
    descriptor: 'International Markets',
    hoverCopy: "VPG's expansion playbook for operators ready to go global.",
  },
]

export function getArmBySlug(slug: string): Arm | undefined {
  return ARMS.find((a) => a.slug === slug)
}

export function getArmById(id: number): Arm | undefined {
  return ARMS.find((a) => a.id === id)
}

export const ENTITY_CARD_ARMS = ARMS.filter((a) => a.entityCard != null)
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/unit/arm-data.test.ts
```

Expected: PASS — all 6 assertions green.

- [ ] **Step 5: Commit**

```bash
git add lib/arm-data.ts tests/unit/arm-data.test.ts
git commit -m "feat: add ARM data module with 10-ARM static data"
```

---

## Task 5: MosaicV SVG Component

**Files:**
- Create: `components/ui/MosaicV.tsx`
- Create: `tests/unit/MosaicV.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/unit/MosaicV.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MosaicV } from '@/components/ui/MosaicV'

describe('MosaicV', () => {
  it('renders an SVG with accessible label', () => {
    render(<MosaicV lockup="mark" aria-label="Vantage Point Group logo" />)
    const svg = screen.getByRole('img', { name: /vantage point group logo/i })
    expect(svg).toBeInTheDocument()
  })

  it('applies size prop as width and height', () => {
    render(<MosaicV lockup="mark" size={40} />)
    const svg = document.querySelector('svg')
    expect(svg).toHaveAttribute('width', '40')
    expect(svg).toHaveAttribute('height', '40')
  })

  it('renders wordmark lockup with text', () => {
    const { container } = render(<MosaicV lockup="horizontal" />)
    expect(container.textContent).toContain('VANTAGE POINT GROUP')
  })

  it('is decorative (aria-hidden) when no label provided', () => {
    render(<MosaicV lockup="mark" />)
    const svg = document.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })
})
```

- [ ] **Step 2: Run to verify they fail**

```bash
npx vitest run tests/unit/MosaicV.test.tsx
```

Expected: FAIL — component doesn't exist.

- [ ] **Step 3: Create MosaicV component**

Create `components/ui/MosaicV.tsx`:

```tsx
import React from 'react'

type Lockup = 'mark' | 'horizontal' | 'stacked' | 'wordmark' | 'compact' | 'endorsed'

interface MosaicVProps extends React.SVGProps<SVGSVGElement> {
  lockup?: Lockup
  size?: number
  className?: string
}

// The 7 polygon panels of the Mosaic V, each with its brand color.
// Coordinates are normalized to a 90×90 viewBox.
const PANELS = [
  { points: '5,8 30,8 45,50',   fill: '#E8541A' }, // left outer
  { points: '30,8 45,8 45,50',  fill: '#C9960C' }, // left inner
  { points: '45,8 52,8 45,50',  fill: '#3B6D11' }, // center
  { points: '52,8 68,8 45,50',  fill: '#5B3FA8' }, // right inner
  { points: '68,8 85,8 45,50',  fill: '#00B4CB' }, // right outer
  { points: '5,8 45,50 20,82',  fill: '#2C2C2A', opacity: 0.5 }, // left leg
  { points: '85,8 45,50 70,82', fill: '#2C2C2A', opacity: 0.5 }, // right leg
]

// Hairline separator lines between panels (stained-glass lead lines)
const LEAD_LINES = [
  { x1: 5,  y1: 8, x2: 45, y2: 50 },
  { x1: 30, y1: 8, x2: 45, y2: 50 },
  { x1: 45, y1: 8, x2: 45, y2: 50 },
  { x1: 52, y1: 8, x2: 45, y2: 50 },
  { x1: 68, y1: 8, x2: 45, y2: 50 },
  { x1: 85, y1: 8, x2: 45, y2: 50 },
]

function MarkSVG({
  size = 40,
  label,
  ...props
}: {
  size?: number
  label?: string
} & React.SVGProps<SVGSVGElement>) {
  const accessible = label != null
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 90 90"
      fill="none"
      role={accessible ? 'img' : undefined}
      aria-label={accessible ? label : undefined}
      aria-hidden={accessible ? undefined : 'true'}
      {...props}
    >
      {PANELS.map((p, i) => (
        <polygon
          key={i}
          points={p.points}
          fill={p.fill}
          opacity={p.opacity ?? 1}
        />
      ))}
      {LEAD_LINES.map((l, i) => (
        <line
          key={i}
          x1={l.x1} y1={l.y1}
          x2={l.x2} y2={l.y2}
          stroke="#F5F0E8"
          strokeWidth="0.4"
          opacity="0.3"
        />
      ))}
    </svg>
  )
}

export function MosaicV({
  lockup = 'mark',
  size = 40,
  className,
  'aria-label': ariaLabel,
  ...props
}: MosaicVProps) {
  const label = ariaLabel as string | undefined

  if (lockup === 'mark') {
    return <MarkSVG size={size} label={label} className={className} {...props} />
  }

  if (lockup === 'horizontal') {
    return (
      <div className={`flex items-center gap-2 ${className ?? ''}`}>
        <MarkSVG size={size} aria-hidden="true" />
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '11px',
            letterSpacing: '3px',
            fontWeight: 600,
            color: '#F5F0E8',
            textTransform: 'uppercase',
          }}
          aria-label={label ?? 'Vantage Point Group'}
        >
          VANTAGE POINT GROUP
        </span>
      </div>
    )
  }

  if (lockup === 'compact') {
    return (
      <div className={`flex items-center gap-1.5 ${className ?? ''}`}>
        <MarkSVG size={Math.round(size * 0.75)} label={label} />
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '9px',
            letterSpacing: '2px',
            fontWeight: 600,
            color: '#F5F0E8',
            textTransform: 'uppercase',
          }}
        >
          VPG
        </span>
      </div>
    )
  }

  // wordmark, stacked, endorsed — render mark with wordmark text
  return (
    <div
      className={`flex flex-col items-center gap-1 ${className ?? ''}`}
      role="img"
      aria-label={label ?? 'Vantage Point Group'}
    >
      <MarkSVG size={size} aria-hidden="true" />
      <span
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: '9px',
          letterSpacing: '3px',
          fontWeight: 600,
          color: '#F5F0E8',
          textTransform: 'uppercase',
        }}
      >
        VANTAGE POINT GROUP
      </span>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/unit/MosaicV.test.tsx
```

Expected: PASS — all 4 assertions green.

- [ ] **Step 5: Commit**

```bash
git add components/ui/MosaicV.tsx tests/unit/MosaicV.test.tsx
git commit -m "feat: add MosaicV SVG component with lockup variants"
```

---

## Task 6: Button Component

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `tests/unit/Button.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/unit/Button.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('renders primary tier with orange background class', () => {
    render(<Button tier="primary">Find Your ARM</Button>)
    const btn = screen.getByRole('button', { name: /find your arm/i })
    expect(btn).toHaveClass('bg-orange')
  })

  it('renders secondary tier as ghost button', () => {
    render(<Button tier="secondary">Find Your ARM →</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toHaveClass('bg-transparent')
  })

  it('renders as anchor when href provided', () => {
    render(<Button tier="primary" href="/partners">Become a Partner</Button>)
    const link = screen.getByRole('link', { name: /become a partner/i })
    expect(link).toHaveAttribute('href', '/partners')
  })

  it('forwards disabled state and prevents interaction', () => {
    render(<Button tier="primary" disabled>Submit</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

- [ ] **Step 2: Run to verify they fail**

```bash
npx vitest run tests/unit/Button.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Create Button component**

Create `components/ui/Button.tsx`:

```tsx
import Link from 'next/link'
import { clsx } from 'clsx'
import React from 'react'

type Tier = 'primary' | 'secondary' | 'entity' | 'tertiary'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tier?: Tier
  href?: string
  entityColor?: string   // hex — used for 'entity' tier background
  children: React.ReactNode
  className?: string
}

// Base styles shared across all tiers
const BASE =
  'inline-flex items-center justify-center font-inter font-semibold ' +
  'tracking-labels uppercase transition-all duration-200 rounded-[3px] ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange ' +
  'focus-visible:ring-offset-2 focus-visible:ring-offset-navy ' +
  'disabled:opacity-40 disabled:cursor-not-allowed'

const TIER_STYLES: Record<Tier, string> = {
  primary:
    'bg-orange text-white px-6 py-2.5 text-[10px] tracking-[0.1em] hover:opacity-90',
  secondary:
    'bg-transparent border border-parchment/20 text-parchment px-[22px] py-[9px] ' +
    'text-[11px] tracking-[0.15em] hover:border-parchment/40',
  entity:
    'text-white px-5 py-2.5 text-[10px] tracking-[0.1em] hover:opacity-90',
  tertiary:
    'bg-transparent text-inherit text-[10px] tracking-[0.08em] ' +
    'hover:underline underline-offset-4 px-0 py-0',
}

export function Button({
  tier = 'primary',
  href,
  entityColor,
  children,
  className,
  style,
  ...props
}: ButtonProps) {
  const classes = clsx(BASE, TIER_STYLES[tier], className)
  const inlineStyle =
    tier === 'entity' && entityColor
      ? { ...style, backgroundColor: entityColor }
      : style

  if (href) {
    return (
      <Link href={href} className={classes} style={inlineStyle}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} style={inlineStyle} {...props}>
      {children}
    </button>
  )
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run tests/unit/Button.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/ui/Button.tsx tests/unit/Button.test.tsx
git commit -m "feat: add Button component with 4-tier hierarchy"
```

---

## Task 7: GSAP Module

**Files:**
- Create: `lib/gsap.ts`

GSAP and ScrollTrigger must be registered exactly once. This module is the single import point. Never `import gsap from 'gsap'` anywhere else — always `import { gsap, ScrollTrigger } from '@/lib/gsap'`.

- [ ] **Step 1: Create lib/gsap.ts**

Create `lib/gsap.ts`:

```typescript
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger once at module load.
// This file is the ONLY place in the codebase that imports from 'gsap' directly.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }
```

- [ ] **Step 2: Verify TypeScript compiles cleanly**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/gsap.ts
git commit -m "feat: add GSAP module with ScrollTrigger registration"
```

---

## Task 8: Navigation — MegaMenu (Desktop)

**Files:**
- Create: `components/nav/MegaMenu.tsx`
- Create: `tests/unit/MegaMenu.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/unit/MegaMenu.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MegaMenu } from '@/components/nav/MegaMenu'

describe('MegaMenu', () => {
  it('is hidden by default', () => {
    render(<MegaMenu isOpen={false} />)
    const menu = screen.getByRole('menu')
    expect(menu).toHaveAttribute('aria-hidden', 'true')
  })

  it('shows all 10 ARM entries when open', () => {
    render(<MegaMenu isOpen={true} />)
    // All 10 ARM names should be present
    expect(screen.getByText('Vantage Point Media')).toBeInTheDocument()
    expect(screen.getByText('Dispute2Go')).toBeInTheDocument()
    expect(screen.getByText('VPG Global Expansion')).toBeInTheDocument()
    const items = screen.getAllByRole('menuitem')
    expect(items).toHaveLength(10)
  })

  it('each ARM links to its correct slug path', () => {
    render(<MegaMenu isOpen={true} />)
    const d2gLink = screen.getByRole('menuitem', { name: /dispute2go/i })
    expect(d2gLink.closest('a')).toHaveAttribute('href', '/arms/dispute2go')
  })

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn()
    render(<MegaMenu isOpen={true} onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })
})
```

- [ ] **Step 2: Run to verify they fail**

```bash
npx vitest run tests/unit/MegaMenu.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Create MegaMenu component**

Create `components/nav/MegaMenu.tsx`:

```tsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ARMS } from '@/lib/arm-data'

interface MegaMenuProps {
  isOpen: boolean
  onClose?: () => void
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  return (
    <div
      role="menu"
      aria-hidden={!isOpen}
      className={[
        'absolute top-full left-0 right-0',
        'bg-navy border-t border-parchment/10',
        'transition-all duration-150 ease-out',
        isOpen
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-2 pointer-events-none',
      ].join(' ')}
    >
      <div className="max-w-7xl mx-auto px-8 py-6">
        <p className="text-gold text-[9px] font-semibold tracking-labels uppercase mb-4">
          The Portfolio
        </p>
        {/* 2-column × 5-row grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-0">
          {ARMS.map((arm) => (
            <Link
              key={arm.id}
              href={`/arms/${arm.slug}`}
              role="menuitem"
              aria-label={`ARM ${arm.id}: ${arm.name}`}
              className="group flex items-start gap-3 py-2.5 border-b border-parchment/5
                         hover:border-parchment/20 transition-colors duration-150"
              onClick={onClose}
            >
              <span
                className="mt-0.5 text-[8px] font-bold tracking-labels uppercase shrink-0 w-10"
                style={{ color: arm.color }}
              >
                ARM {arm.id}
              </span>
              <div>
                <p className="text-parchment text-[11px] font-semibold group-hover:text-white
                              transition-colors duration-150">
                  {arm.name}
                </p>
                <p className="text-parchment/40 text-[9px] mt-0.5">{arm.descriptor}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run tests/unit/MegaMenu.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/nav/MegaMenu.tsx tests/unit/MegaMenu.test.tsx
git commit -m "feat: add MegaMenu with 10-ARM grid and keyboard nav"
```

---

## Task 9: Navigation — MobileOverlay

**Files:**
- Create: `components/nav/MobileOverlay.tsx`
- Create: `tests/unit/MobileOverlay.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/unit/MobileOverlay.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MobileOverlay } from '@/components/nav/MobileOverlay'

describe('MobileOverlay', () => {
  it('is not visible when closed', () => {
    render(<MobileOverlay isOpen={false} onClose={() => {}} />)
    const overlay = screen.getByRole('dialog')
    expect(overlay).toHaveAttribute('aria-hidden', 'true')
  })

  it('shows all 10 ARM names when open', () => {
    render(<MobileOverlay isOpen={true} onClose={() => {}} />)
    expect(screen.getByText('Dispute2Go')).toBeInTheDocument()
    expect(screen.getByText('VPG Global Expansion')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(<MobileOverlay isOpen={true} onClose={onClose} />)
    const closeBtn = screen.getByRole('button', { name: /close menu/i })
    fireEvent.click(closeBtn)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('has Find Your ARM CTA', () => {
    render(<MobileOverlay isOpen={true} onClose={() => {}} />)
    expect(screen.getByRole('link', { name: /find your arm/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to verify they fail**

```bash
npx vitest run tests/unit/MobileOverlay.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Create MobileOverlay component**

Create `components/nav/MobileOverlay.tsx`:

```tsx
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ARMS } from '@/lib/arm-data'
import { Button } from '@/components/ui/Button'

interface MobileOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileOverlay({ isOpen, onClose }: MobileOverlayProps) {
  // Trap scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      aria-hidden={!isOpen}
      className={[
        'fixed inset-0 z-[100] bg-navy flex flex-col',
        'transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]',
        isOpen ? 'translate-x-0' : 'translate-x-full',
      ].join(' ')}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-parchment/10">
        <span className="text-parchment/60 text-[9px] font-semibold tracking-labels uppercase">
          Navigation
        </span>
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="text-parchment/60 hover:text-parchment p-2 -mr-2 focus-visible:outline-none
                     focus-visible:ring-2 focus-visible:ring-orange rounded"
        >
          {/* X icon */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.5"
                  strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* ARM List */}
      <nav className="flex-1 overflow-y-auto px-6 py-4">
        <p className="text-gold text-[9px] font-semibold tracking-labels uppercase mb-3">
          The Portfolio
        </p>
        <ul className="space-y-0">
          {ARMS.map((arm) => (
            <li key={arm.id}>
              <Link
                href={`/arms/${arm.slug}`}
                onClick={onClose}
                className="flex items-center gap-3 py-3 border-b border-parchment/5
                           hover:border-parchment/20 transition-colors"
              >
                <span
                  className="text-[8px] font-bold tracking-labels uppercase w-10 shrink-0"
                  style={{ color: arm.color }}
                >
                  ARM {arm.id}
                </span>
                <span className="text-parchment text-[13px] font-medium">{arm.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Secondary nav links */}
        <div className="mt-6 space-y-3">
          {[
            { href: '/partners', label: 'Partners' },
            { href: '/about/kraken-method', label: 'The Kraken Method' },
            { href: '/events', label: 'Events' },
            { href: '/about', label: 'About' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="block text-parchment/60 text-[13px] hover:text-parchment
                         transition-colors py-1"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Bottom CTA */}
      <div className="px-6 py-6 border-t border-parchment/10">
        <Button tier="primary" href="#arm-quiz" className="w-full justify-center"
                onClick={onClose}>
          Find Your ARM
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run tests/unit/MobileOverlay.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/nav/MobileOverlay.tsx tests/unit/MobileOverlay.test.tsx
git commit -m "feat: add MobileOverlay with full-screen ARM list and CTA"
```

---

## Task 10: Navigation — Root Component + Scroll Behavior

**Files:**
- Create: `components/nav/Navigation.tsx`
- Create: `components/nav/NavCTA.tsx`
- Create: `tests/unit/Navigation.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/unit/Navigation.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Navigation } from '@/components/nav/Navigation'

// Mock GSAP (not available in jsdom)
vi.mock('@/lib/gsap', () => ({
  gsap: { to: vi.fn(), fromTo: vi.fn() },
  ScrollTrigger: { create: vi.fn() },
}))

describe('Navigation', () => {
  it('renders the Vantage Point Group logo link', () => {
    render(<Navigation />)
    const logoLink = screen.getByRole('link', { name: /vantage point group/i })
    expect(logoLink).toHaveAttribute('href', '/')
  })

  it('renders all 5 main nav links', () => {
    render(<Navigation />)
    expect(screen.getByRole('button', { name: /portfolio/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /partners/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /the kraken method/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /events/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
  })

  it('opens mega menu when Portfolio button is clicked', () => {
    render(<Navigation />)
    const portfolioBtn = screen.getByRole('button', { name: /portfolio/i })
    fireEvent.click(portfolioBtn)
    const menu = screen.getByRole('menu')
    expect(menu).toHaveAttribute('aria-hidden', 'false')
  })

  it('shows hamburger button on mobile breakpoint', () => {
    render(<Navigation />)
    const hamburger = screen.getByRole('button', { name: /open menu/i })
    expect(hamburger).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run to verify they fail**

```bash
npx vitest run tests/unit/Navigation.test.tsx
```

Expected: FAIL.

- [ ] **Step 3: Create NavCTA**

Create `components/nav/NavCTA.tsx`:

```tsx
import { Button } from '@/components/ui/Button'

export function NavCTA() {
  return (
    <Button tier="primary" href="#arm-quiz" className="hidden md:inline-flex">
      Find Your ARM
    </Button>
  )
}
```

- [ ] **Step 4: Create Navigation component**

Create `components/nav/Navigation.tsx`:

```tsx
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { MosaicV } from '@/components/ui/MosaicV'
import { MegaMenu } from '@/components/nav/MegaMenu'
import { MobileOverlay } from '@/components/nav/MobileOverlay'
import { NavCTA } from '@/components/nav/NavCTA'

const NAV_LINKS = [
  { href: '/partners', label: 'Partners' },
  { href: '/about/kraken-method', label: 'The Kraken Method' },
  { href: '/events', label: 'Events' },
  { href: '/about', label: 'About' },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const megaTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Scroll threshold: transparent → navy + blur at 80px
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mega menu when clicking outside
  useEffect(() => {
    if (!megaOpen) return
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMegaOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [megaOpen])

  const openMegaWithDelay = useCallback(() => {
    megaTimeoutRef.current = setTimeout(() => setMegaOpen(true), 300)
  }, [])

  const clearMegaDelay = useCallback(() => {
    if (megaTimeoutRef.current) clearTimeout(megaTimeoutRef.current)
  }, [])

  return (
    <>
      <header
        ref={navRef}
        className={[
          'fixed top-0 left-0 right-0 z-50 h-16',
          'transition-all duration-300',
          isScrolled
            ? 'bg-navy/95 backdrop-blur-md border-b border-parchment/10'
            : 'bg-transparent',
        ].join(' ')}
      >
        <nav
          aria-label="Main navigation"
          className="max-w-7xl mx-auto h-full flex items-center justify-between px-6 lg:px-8"
        >
          {/* Logo */}
          <Link href="/" aria-label="Vantage Point Group — go to homepage">
            <MosaicV lockup="horizontal" size={28} />
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-6" role="list">
            {/* Portfolio — triggers mega menu */}
            <li>
              <button
                aria-expanded={megaOpen}
                aria-haspopup="menu"
                aria-label="Portfolio"
                onMouseEnter={openMegaWithDelay}
                onMouseLeave={clearMegaDelay}
                onClick={() => setMegaOpen((v) => !v)}
                className="text-parchment/60 hover:text-parchment text-[11px] font-medium
                           tracking-[0.08em] uppercase transition-colors flex items-center gap-1"
              >
                Portfolio
                <svg width="8" height="5" viewBox="0 0 8 5" fill="none" aria-hidden="true">
                  <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.2"
                        strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </li>
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-parchment/60 hover:text-parchment text-[11px] font-medium
                             tracking-[0.08em] uppercase transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <NavCTA />

            {/* Hamburger — mobile only */}
            <button
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-parchment/70 hover:text-parchment p-2 -mr-2
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange rounded"
            >
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true">
                <path d="M0 1h22M0 8h22M0 15h22" stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </nav>

        {/* Mega menu — desktop */}
        <div
          onMouseEnter={clearMegaDelay}
          onMouseLeave={() => setMegaOpen(false)}
        >
          <MegaMenu
            isOpen={megaOpen}
            onClose={() => setMegaOpen(false)}
          />
        </div>
      </header>

      {/* Mobile overlay */}
      <MobileOverlay isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
```

- [ ] **Step 5: Run tests**

```bash
npx vitest run tests/unit/Navigation.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Add Navigation to root layout**

In `app/layout.tsx`, import and render `<Navigation />`:

```tsx
import { Navigation } from '@/components/nav/Navigation'

// Inside the <body> tag, before {children}:
<Navigation />
<main id="main-content">
  {children}
</main>
```

- [ ] **Step 7: Create homepage shell**

Replace `app/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <>
      {/* Section shells — filled in Plans 2 and 3 */}
      <section id="hero" className="min-h-screen bg-base" aria-label="Hero" />
      <section id="arm-quiz" className="bg-surface py-24" aria-label="ARM Routing Quiz" />
      <section id="arm-grid" className="bg-charcoal py-24" aria-label="Portfolio" />
      <section id="kraken-method" className="bg-base py-24" aria-label="The Kraken Method" />
      <section id="entity-cards" className="bg-surface py-24" aria-label="Entities" />
      <section id="mission" className="bg-base py-24" aria-label="Mission" />
      <section id="ipa-strip" className="py-16" aria-label="Partner Recruitment" />
      <section id="events" className="bg-base py-16" aria-label="Events" />
      <footer id="footer" className="bg-footer py-16" aria-label="Site footer" />
    </>
  )
}
```

- [ ] **Step 8: Full test run**

```bash
npx vitest run
```

Expected: All tests PASS.

- [ ] **Step 9: Build check**

```bash
npm run build
```

Expected: No TypeScript or build errors. Verify the nav renders at `http://localhost:3000` after `npm run dev`.

- [ ] **Step 10: Commit**

```bash
git add components/nav/ app/layout.tsx app/page.tsx
git commit -m "feat: add Navigation with mega menu, mobile overlay, and scroll behavior"
```

---

## Task 11: Playwright E2E — Navigation

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/navigation.spec.ts`

- [ ] **Step 1: Create Playwright config**

Create `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 14'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

- [ ] **Step 2: Write E2E tests**

Create `tests/e2e/navigation.spec.ts`:

```typescript
import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('nav is transparent on load, has bg after scroll', async ({ page }) => {
    await page.goto('/')
    const header = page.locator('header')

    // Initially transparent
    await expect(header).not.toHaveClass(/bg-navy/)

    // Scroll 100px
    await page.evaluate(() => window.scrollTo(0, 100))
    await page.waitForTimeout(350) // transition duration
    await expect(header).toHaveClass(/bg-navy/)
  })

  test('Portfolio button opens mega menu', async ({ page }) => {
    await page.goto('/')
    await page.click('button[aria-label="Portfolio"]')
    const menu = page.getByRole('menu')
    await expect(menu).toHaveAttribute('aria-hidden', 'false')
    await expect(page.getByText('Dispute2Go')).toBeVisible()
  })

  test('mobile hamburger opens full-screen overlay', async ({ page }) => {
    // Use mobile viewport
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    await page.click('button[aria-label="Open menu"]')
    const overlay = page.getByRole('dialog')
    await expect(overlay).not.toHaveClass(/translate-x-full/)
    await expect(page.getByText('VPG Global Expansion')).toBeVisible()
  })

  test('skip link is first focusable element', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    const focused = page.locator(':focus')
    await expect(focused).toHaveText(/skip to main content/i)
  })
})
```

- [ ] **Step 3: Install Playwright browsers**

```bash
npx playwright install chromium
```

- [ ] **Step 4: Run E2E tests**

```bash
npx playwright test
```

Expected: All 4 tests PASS on chromium and mobile.

- [ ] **Step 5: Add npm scripts to package.json**

In `package.json` scripts section, add:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:e2e": "playwright test",
"test:all": "vitest run && playwright test"
```

- [ ] **Step 6: Final commit**

```bash
git add playwright.config.ts tests/e2e/ package.json
git commit -m "feat: add Playwright E2E tests for navigation"
```

---

## Task 12: Site Webmanifest + Favicon Shell

**Files:**
- Create: `public/favicon.svg`
- Create: `public/site.webmanifest`
- Modify: `app/layout.tsx` (add favicon metadata)

- [ ] **Step 1: Create favicon.svg (Mosaic V mark)**

Create `public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 90" fill="none">
  <style>
    @media (prefers-color-scheme: dark) {
      .bg { fill: #0D1B2A; }
    }
    .bg { fill: #F5F0E8; }
  </style>
  <rect class="bg" width="90" height="90" rx="12"/>
  <polygon points="5,8 30,8 45,50" fill="#E8541A"/>
  <polygon points="30,8 45,8 45,50" fill="#C9960C"/>
  <polygon points="45,8 52,8 45,50" fill="#3B6D11"/>
  <polygon points="52,8 68,8 45,50" fill="#5B3FA8"/>
  <polygon points="68,8 85,8 45,50" fill="#00B4CB"/>
  <polygon points="5,8 45,50 20,82" fill="#2C2C2A" opacity="0.6"/>
  <polygon points="85,8 45,50 70,82" fill="#2C2C2A" opacity="0.6"/>
</svg>
```

- [ ] **Step 2: Create site.webmanifest**

Create `public/site.webmanifest`:

```json
{
  "name": "Vantage Point Group",
  "short_name": "VPG",
  "description": "The infrastructure behind serious builders.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0D1B2A",
  "theme_color": "#0D1B2A",
  "icons": [
    { "src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

> Note: `android-chrome-192x192.png` and `android-chrome-512x512.png` must be generated from the Mosaic V SVG. This is a manual step — generate using Squoosh, Figma export, or `sharp` CLI before launch.

- [ ] **Step 3: Add favicon metadata to layout.tsx**

In `app/layout.tsx`, update the `metadata` export:

```tsx
export const metadata: Metadata = {
  // ... existing fields ...
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  themeColor: '#0D1B2A',
}
```

- [ ] **Step 4: Commit**

```bash
git add public/favicon.svg public/site.webmanifest app/layout.tsx
git commit -m "feat: add favicon SVG and PWA webmanifest"
```

---

## Plan 1 Complete — Verification

- [ ] **Run all unit tests:**
  ```bash
  npx vitest run
  ```
  Expected: All tests PASS.

- [ ] **Run E2E tests:**
  ```bash
  npx playwright test
  ```
  Expected: All tests PASS.

- [ ] **Build production bundle:**
  ```bash
  npm run build
  ```
  Expected: No errors. Note the JS bundle size in the output — initial chunk should be well under 200KB.

- [ ] **Manual browser check:**
  ```bash
  npm run dev
  ```
  - [ ] Dark background loads instantly (no flash of white)
  - [ ] Nav is transparent on load
  - [ ] Nav gets dark bg + blur after scrolling 80px
  - [ ] Portfolio click opens mega menu with all 10 ARMs
  - [ ] Hamburger opens mobile overlay at < 768px width
  - [ ] Skip link appears on first Tab press
  - [ ] All links have visible focus rings (orange outline)

---

## What Plan 2 Will Build

The hero section: Mosaic V fragment assembly (GSAP), Three.js particle field (Radiate Level II), mouse parallax, and scroll-to-nav morph. Plan 2 requires Plan 1 to be complete.
