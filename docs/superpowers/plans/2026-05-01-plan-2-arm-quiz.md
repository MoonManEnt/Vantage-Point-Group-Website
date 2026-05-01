# VPG Homepage — §2 ARM Routing Quiz — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the ARM Routing Quiz section — a 4-question state machine that routes visitors to their matching ARM, animates a result screen, captures email opt-in, writes results to PostgreSQL, and fires a GoHighLevel webhook.

**Scope:** §2 only. Plan 3 (`2026-05-01-plan-3-homepage-layout.md`) covers §3–§9.

**Architecture:** Pure routing logic lives in `lib/arm-routing.ts` (easily unit-tested, no React). The UI is split into three focused components: `QuizOption` (controlled option button), `QuizResult` (result screen + opt-in form), and `ARMQuiz` (state machine, owns GSAP transitions and API calls). `ARMQuizSection` is a server component wrapper providing the two-column layout and intro copy. The API route (`app/api/quiz-complete`) handles validation, Prisma write, and GoHighLevel webhook fire-and-forget. Prisma is set up fresh in Task 1 — no prior schema exists.

**Tech Stack:** Next.js 16.2.1 (App Router, Turbopack), React 19, TypeScript strict, Prisma 6 + PostgreSQL, GoHighLevel webhook (native fetch), GSAP 3 via `@/lib/gsap`, Tailwind CSS v4 (`var()` tokens), Vitest + @testing-library/react + userEvent, Playwright

---

## Prerequisites (complete before starting tasks)

The following must be in `.env.local` before Task 1:

```
DATABASE_URL="postgresql://user:password@localhost:5432/vpg"
GHL_WEBHOOK_URL="https://services.leadconnectorhq.com/hooks/your-webhook-id"
```

- PostgreSQL instance running and reachable at `DATABASE_URL`
- GoHighLevel account configured with `VPG Website Leads` pipeline and an inbound webhook endpoint

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `prisma/schema.prisma` | Create | QuizResult model |
| `lib/prisma.ts` | Create | PrismaClient singleton |
| `lib/arm-data.ts` | Modify | Add `resultDescription` field to `Arm` interface and all 10 ARM objects |
| `lib/arm-routing.ts` | Create | Pure function: `(q1, q3, q4) → armId` |
| `app/api/quiz-complete/route.ts` | Create | POST handler: validate → Prisma write → GHL webhook |
| `components/quiz/QuizOption.tsx` | Create | Controlled option button, no state |
| `components/quiz/QuizResult.tsx` | Create | Result screen: badge + description + CTAs + email opt-in |
| `components/quiz/ARMQuiz.tsx` | Create | `'use client'` state machine: questions → routing → result |
| `components/quiz/ARMQuizSection.tsx` | Create | Server component: two-column layout + intro copy |
| `app/page.tsx` | Modify | Replace `<section id="arm-quiz" ... />` with `<ARMQuizSection />` |
| `.env.local.example` | Modify | Add `DATABASE_URL` and `GHL_WEBHOOK_URL` entries |
| `tests/unit/arm-routing.test.ts` | Create | All 9 routing outcomes + default fallback |
| `tests/unit/QuizOption.test.tsx` | Create | Renders text, onClick, aria-pressed states |
| `tests/unit/QuizResult.test.tsx` | Create | ARM name/badge, CTAs, opt-in form, callbacks |
| `tests/unit/ARMQuiz.test.tsx` | Create | State machine: question progression, routing, result screen |
| `tests/unit/ARMQuizSection.test.tsx` | Create | Intro copy renders, ARMQuiz widget present |
| `tests/unit/api-quiz-complete.test.ts` | Create | DB write, GHL webhook, validation, email/no-email paths |
| `tests/e2e/quiz.spec.ts` | Create | Full quiz flow: 4 answers → result screen visible |

---

### Task 1: Prisma setup

**Files:**
- Create: `prisma/schema.prisma`
- Create: `lib/prisma.ts`
- Modify: `.env.local.example`

- [ ] **Step 1: Install Prisma**

```bash
cd /Users/reginaldsmith/vpg-website
npm install prisma @prisma/client
```

Expected: `prisma` and `@prisma/client` added to `package.json` and installed.

- [ ] **Step 2: Initialise Prisma**

```bash
npx prisma init --datasource-provider postgresql
```

Expected: `prisma/schema.prisma` and `.env` created. The generated `.env` will be deleted in Step 8 — we use `.env.local`.

- [ ] **Step 3: Write the schema**

Replace the full contents of `prisma/schema.prisma` with:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model QuizResult {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  armId     Int
  q1        String
  q2        String
  q3        String
  q4        String
  email     String?
}
```

- [ ] **Step 4: Generate the Prisma client**

```bash
npx prisma generate
```

Expected: `node_modules/@prisma/client` populated. Output includes `✔ Generated Prisma Client`.

- [ ] **Step 5: Run the migration**

```bash
npx prisma migrate dev --name init
```

Expected: `prisma/migrations/` created, `QuizResult` table created in the target DB.

- [ ] **Step 6: Create Prisma singleton**

Create `lib/prisma.ts`:

```ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

- [ ] **Step 7: Update .env.local.example**

Open `.env.local.example`. Append at the bottom:

```
# PostgreSQL — ARM Quiz results
DATABASE_URL="postgresql://user:password@localhost:5432/vpg"

# GoHighLevel — quiz completion webhook
GHL_WEBHOOK_URL="https://services.leadconnectorhq.com/hooks/your-webhook-id"
```

- [ ] **Step 8: Delete the generated .env file**

```bash
rm /Users/reginaldsmith/vpg-website/.env
```

Prisma init creates a `.env` with a placeholder `DATABASE_URL`. Delete it — we use `.env.local` only.

- [ ] **Step 9: Commit**

```bash
cd /Users/reginaldsmith/vpg-website
git add prisma/ lib/prisma.ts .env.local.example package.json package-lock.json
git commit -m "feat: add Prisma with QuizResult model and PostgreSQL datasource"
```

---

### Task 2: resultDescription in arm-data + routing matrix

**Files:**
- Modify: `lib/arm-data.ts`
- Create: `lib/arm-routing.ts`
- Test: `tests/unit/arm-routing.test.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/unit/arm-routing.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { routeArm } from '@/lib/arm-routing'

describe('routeArm', () => {
  it('routes Credit + Capital Access → ARM 2 regardless of Q3/Q4', () => {
    expect(routeArm('Credit + Capital Access', 'Land more clients', 'DIY with tools')).toBe(2)
    expect(routeArm('Credit + Capital Access', 'Build brand authority', 'Full delegation')).toBe(2)
  })

  it('routes Brand + Visibility → ARM 1 regardless of Q3/Q4', () => {
    expect(routeArm('Brand + Visibility', 'Land more clients', 'DIY with tools')).toBe(1)
    expect(routeArm('Brand + Visibility', 'Build systems + team', 'Full delegation')).toBe(1)
  })

  it('routes Revenue + Sales + Fix credit → ARM 3', () => {
    expect(routeArm('Revenue + Sales', 'Fix credit / access capital', 'DIY with tools')).toBe(3)
    expect(routeArm('Revenue + Sales', 'Fix credit / access capital', 'Full delegation')).toBe(3)
  })

  it('routes Revenue + Sales + Land more clients + Full delegation → ARM 4', () => {
    expect(routeArm('Revenue + Sales', 'Land more clients', 'Full delegation')).toBe(4)
  })

  it('routes Revenue + Sales + Land more clients + DIY/Guided → ARM 1', () => {
    expect(routeArm('Revenue + Sales', 'Land more clients', 'DIY with tools')).toBe(1)
    expect(routeArm('Revenue + Sales', 'Land more clients', 'Guided coaching')).toBe(1)
  })

  it('routes Infrastructure + Scale + Land more clients → ARM 4', () => {
    expect(routeArm('Infrastructure + Scale', 'Land more clients', 'Done-with-you')).toBe(4)
    expect(routeArm('Infrastructure + Scale', 'Land more clients', 'DIY with tools')).toBe(4)
  })

  it('routes Infrastructure + Scale + Build systems + DIY/Guided → ARM 5', () => {
    expect(routeArm('Infrastructure + Scale', 'Build systems + team', 'DIY with tools')).toBe(5)
    expect(routeArm('Infrastructure + Scale', 'Build systems + team', 'Guided coaching')).toBe(5)
  })

  it('routes Infrastructure + Scale + Build systems + Done-with-you/Full delegation → ARM 6', () => {
    expect(routeArm('Infrastructure + Scale', 'Build systems + team', 'Done-with-you')).toBe(6)
    expect(routeArm('Infrastructure + Scale', 'Build systems + team', 'Full delegation')).toBe(6)
  })

  it('returns ARM 7 as default fallback for unmatched combinations', () => {
    expect(routeArm('Revenue + Sales', 'Build brand authority', 'DIY with tools')).toBe(7)
    expect(routeArm('Infrastructure + Scale', 'Fix credit / access capital', 'Full delegation')).toBe(7)
    expect(routeArm('Revenue + Sales', 'Build systems + team', 'Done-with-you')).toBe(7)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd /Users/reginaldsmith/vpg-website
node_modules/.bin/vitest run tests/unit/arm-routing.test.ts
```

Expected: All 9 tests fail — `Cannot find module '@/lib/arm-routing'`

- [ ] **Step 3: Add resultDescription to lib/arm-data.ts**

Open `lib/arm-data.ts`. Add `resultDescription: string` to the `Arm` interface:

```ts
export interface Arm {
  id: number
  name: string
  slug: string
  entity: string
  color: string
  descriptor: string
  hoverCopy: string
  resultDescription: string          // ← add this line
  entityCard?: {
    description: string
    cta: string
    href: string
  }
}
```

Then add `resultDescription` to each ARM object inside the `ARMS` array:

```ts
// ARM 1 — Vantage Point Media
resultDescription: "We build the content machine that makes you the authority in your market. Brand strategy, content production, and distribution — all three, working as one.",

// ARM 2 — Dispute2Go
resultDescription: "AMELIA handles tri-bureau credit disputes using 26 federal statutes. AI-native, fully automated, and built to produce results.",

// ARM 3 — VPG Capital & Funding
resultDescription: "We build your capital stack from the ground up — credit stacking, lender-ready positioning, and funding strategy for scaling businesses.",

// ARM 4 — GTM & Sales Consulting
resultDescription: "GTM architecture, pipeline design, and revenue execution for B2B. We build the system that makes your sales motion repeatable.",

// ARM 5 — VPG Academy
resultDescription: "The curriculum behind the Kraken Method — learn the framework, earn the certification, and execute with our full playbook.",

// ARM 6 — VPG Ventures
resultDescription: "VPG Ventures takes equity positions in businesses we co-build. Co-invest, co-build, co-own — we're in it with you.",

// ARM 7 — Integrity Partner Alliance
resultDescription: "The Integrity Partner Alliance compounds across all 10 ARMs. Refer once, earn recurring commission on every ARM you activate.",

// ARM 8 — VPG AI & Technology
resultDescription: "AMELIA is the first ARM 8 product. More proprietary AI tools are in active development.",

// ARM 9 — VPG Influence & Public Affairs
resultDescription: "Narrative control, civic influence, and public positioning for operators building lasting market authority.",

// ARM 10 — VPG Global Expansion
resultDescription: "VPG's expansion playbook for operators ready to take their model into international markets.",
```

- [ ] **Step 4: Create lib/arm-routing.ts**

Create `lib/arm-routing.ts`:

```ts
export function routeArm(q1: string, q3: string, q4: string): number {
  if (q1 === 'Credit + Capital Access') return 2
  if (q1 === 'Brand + Visibility') return 1

  if (q1 === 'Revenue + Sales') {
    if (q3 === 'Fix credit / access capital') return 3
    if (q3 === 'Land more clients') {
      return q4 === 'Full delegation' ? 4 : 1
    }
    return 7
  }

  if (q1 === 'Infrastructure + Scale') {
    if (q3 === 'Land more clients') return 4
    if (q3 === 'Build systems + team') {
      return q4 === 'DIY with tools' || q4 === 'Guided coaching' ? 5 : 6
    }
    return 7
  }

  return 7
}
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
node_modules/.bin/vitest run tests/unit/arm-routing.test.ts
```

Expected: All 9 tests pass.

- [ ] **Step 6: Run full unit suite**

```bash
node_modules/.bin/vitest run
```

Expected: All previously passing tests still pass. The `arm-data.test.ts` suite tests `id`, `name`, `slug`, `color`, `descriptor`, `hoverCopy`, `entity` — the new `resultDescription` field is required by the TypeScript interface so TypeScript will catch any missing values at compile time, but the existing tests do not fail at runtime.

- [ ] **Step 7: Commit**

```bash
git add lib/arm-data.ts lib/arm-routing.ts tests/unit/arm-routing.test.ts
git commit -m "feat: add ARM routing matrix and resultDescription to arm-data"
```

---

### Task 3: /api/quiz-complete POST handler

**Files:**
- Create: `app/api/quiz-complete/route.ts`
- Test: `tests/unit/api-quiz-complete.test.ts`

- [ ] **Step 1: Write failing tests**

Create `tests/unit/api-quiz-complete.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { POST } from '@/app/api/quiz-complete/route'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    quizResult: {
      create: vi.fn().mockResolvedValue({ id: 'cuid123' }),
    },
  },
}))

beforeEach(() => {
  vi.stubEnv('GHL_WEBHOOK_URL', 'https://ghl.test/webhook')
  global.fetch = vi.fn().mockResolvedValue(
    new Response(JSON.stringify({ ok: true }), { status: 200 }),
  )
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.clearAllMocks()
})

async function makeRequest(body: Record<string, unknown>) {
  return POST(
    new Request('http://localhost/api/quiz-complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }) as never,
  )
}

const validBody = {
  armId: 1,
  q1: 'Revenue + Sales',
  q2: 'Scaling ($500K–$5M)',
  q3: 'Land more clients',
  q4: 'DIY with tools',
}

describe('POST /api/quiz-complete', () => {
  it('returns 200 with ok:true for a valid request', async () => {
    const res = await makeRequest(validBody)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.ok).toBe(true)
  })

  it('writes the quiz result to the database', async () => {
    const { prisma } = await import('@/lib/prisma')
    await makeRequest(validBody)
    expect(prisma.quizResult.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ armId: 1, q1: 'Revenue + Sales' }),
    })
  })

  it('fires the GHL webhook', async () => {
    await makeRequest(validBody)
    expect(fetch).toHaveBeenCalledWith('https://ghl.test/webhook', expect.objectContaining({ method: 'POST' }))
  })

  it('includes email in DB write and GHL payload when provided', async () => {
    const { prisma } = await import('@/lib/prisma')
    await makeRequest({ ...validBody, email: 'test@example.com' })
    expect(prisma.quizResult.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ email: 'test@example.com' }),
    })
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    const payload = JSON.parse(init.body)
    expect(payload.email).toBe('test@example.com')
  })

  it('stores null email when omitted', async () => {
    const { prisma } = await import('@/lib/prisma')
    await makeRequest(validBody)
    expect(prisma.quizResult.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ email: null }),
    })
  })

  it('returns 400 when required fields are missing', async () => {
    const res = await makeRequest({ armId: 1 })
    expect(res.status).toBe(400)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
node_modules/.bin/vitest run tests/unit/api-quiz-complete.test.ts
```

Expected: All 6 tests fail — `Cannot find module '@/app/api/quiz-complete/route'`

- [ ] **Step 3: Create the API route**

Create `app/api/quiz-complete/route.ts`:

```ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getArmById } from '@/lib/arm-data'

export async function POST(req: Request): Promise<NextResponse> {
  const body = await req.json()
  const { armId, email, q1, q2, q3, q4 } = body

  if (!armId || !q1 || !q2 || !q3 || !q4) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  await prisma.quizResult.create({
    data: {
      armId: Number(armId),
      q1: String(q1),
      q2: String(q2),
      q3: String(q3),
      q4: String(q4),
      email: email ? String(email) : null,
    },
  })

  // Fire GHL webhook — best-effort, non-blocking
  if (process.env.GHL_WEBHOOK_URL) {
    const arm = getArmById(Number(armId))
    fetch(process.env.GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        arm_id: armId,
        arm_name: arm?.name ?? '',
        email: email ?? null,
        q1,
        q2,
        q3,
        q4,
      }),
    }).catch((err) => console.error('GHL webhook error:', err))
  }

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
node_modules/.bin/vitest run tests/unit/api-quiz-complete.test.ts
```

Expected: All 6 tests pass.

- [ ] **Step 5: Run full unit suite**

```bash
node_modules/.bin/vitest run
```

Expected: All tests pass.

- [ ] **Step 6: Commit**

```bash
git add app/api/quiz-complete/route.ts tests/unit/api-quiz-complete.test.ts
git commit -m "feat: add /api/quiz-complete POST handler with Prisma and GHL webhook"
```

---

### Task 4: QuizOption component

**Files:**
- Create: `components/quiz/QuizOption.tsx`
- Test: `tests/unit/QuizOption.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/unit/QuizOption.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuizOption } from '@/components/quiz/QuizOption'

describe('QuizOption', () => {
  it('renders the option text', () => {
    render(<QuizOption text="Revenue + Sales" selected={false} onClick={vi.fn()} />)
    expect(screen.getByText('Revenue + Sales')).toBeInTheDocument()
  })

  it('has aria-pressed="true" when selected', () => {
    render(<QuizOption text="Revenue + Sales" selected={true} onClick={vi.fn()} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('has aria-pressed="false" when not selected', () => {
    render(<QuizOption text="Revenue + Sales" selected={false} onClick={vi.fn()} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<QuizOption text="Revenue + Sales" selected={false} onClick={onClick} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
node_modules/.bin/vitest run tests/unit/QuizOption.test.tsx
```

Expected: All 4 tests fail — `Cannot find module '@/components/quiz/QuizOption'`

- [ ] **Step 3: Create QuizOption**

Create `components/quiz/QuizOption.tsx`:

```tsx
'use client'

interface QuizOptionProps {
  text: string
  selected: boolean
  onClick: () => void
}

export function QuizOption({ text, selected, onClick }: QuizOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="w-full text-left rounded-[4px] transition-all duration-150 text-[11px] font-medium"
      style={{
        padding: '8px 12px',
        border: `1px solid ${selected ? 'var(--color-orange)' : 'rgba(245,240,232,0.15)'}`,
        background: selected ? 'rgba(232,84,26,0.08)' : 'transparent',
        color: selected ? 'var(--color-orange)' : 'var(--color-parchment)',
        letterSpacing: '0.02em',
      }}
    >
      {text}
    </button>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
node_modules/.bin/vitest run tests/unit/QuizOption.test.tsx
```

Expected: All 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add components/quiz/QuizOption.tsx tests/unit/QuizOption.test.tsx
git commit -m "feat: add QuizOption controlled option button"
```

---

### Task 5: QuizResult component

**Files:**
- Create: `components/quiz/QuizResult.tsx`
- Test: `tests/unit/QuizResult.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/unit/QuizResult.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuizResult } from '@/components/quiz/QuizResult'

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
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  })
})

const defaultProps = {
  armId: 1,
  answers: { q1: 'Revenue + Sales', q2: 'Scaling ($500K–$5M)', q3: 'Land more clients', q4: 'DIY with tools' },
  onEmailSubmit: vi.fn(),
  onSkip: vi.fn(),
}

describe('QuizResult', () => {
  it('renders the ARM badge label', () => {
    render(<QuizResult {...defaultProps} />)
    expect(screen.getByText('ARM 1')).toBeInTheDocument()
  })

  it('renders the ARM name', () => {
    render(<QuizResult {...defaultProps} />)
    expect(screen.getByText('Vantage Point Media')).toBeInTheDocument()
  })

  it('renders the result description', () => {
    render(<QuizResult {...defaultProps} />)
    expect(screen.getByText(/We build the content machine/)).toBeInTheDocument()
  })

  it('renders the primary Explore CTA linking to the ARM page', () => {
    render(<QuizResult {...defaultProps} />)
    const cta = screen.getByRole('link', { name: /explore vantage point media/i })
    expect(cta).toHaveAttribute('href', '/arms/vantage-point-media')
  })

  it('renders the See all 10 ARMs link', () => {
    render(<QuizResult {...defaultProps} />)
    expect(screen.getByRole('link', { name: /see all 10 arms/i })).toBeInTheDocument()
  })

  it('renders the email input and submit button', () => {
    render(<QuizResult {...defaultProps} />)
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send my playbook/i })).toBeInTheDocument()
  })

  it('calls onEmailSubmit with trimmed email on form submit', async () => {
    const onEmailSubmit = vi.fn()
    render(<QuizResult {...defaultProps} onEmailSubmit={onEmailSubmit} />)
    await userEvent.type(screen.getByPlaceholderText('your@email.com'), 'test@example.com')
    await userEvent.click(screen.getByRole('button', { name: /send my playbook/i }))
    expect(onEmailSubmit).toHaveBeenCalledWith('test@example.com')
  })

  it('calls onSkip when the no thanks button is clicked', async () => {
    const onSkip = vi.fn()
    render(<QuizResult {...defaultProps} onSkip={onSkip} />)
    await userEvent.click(screen.getByRole('button', { name: /no thanks/i }))
    expect(onSkip).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
node_modules/.bin/vitest run tests/unit/QuizResult.test.tsx
```

Expected: All 8 tests fail — `Cannot find module '@/components/quiz/QuizResult'`

- [ ] **Step 3: Create QuizResult**

Create `components/quiz/QuizResult.tsx`:

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { Button } from '@/components/ui/Button'
import { getArmById } from '@/lib/arm-data'

interface QuizResultProps {
  armId: number
  answers: { q1: string; q2: string; q3: string; q4: string }
  onEmailSubmit: (email: string) => void
  onSkip: () => void
}

export function QuizResult({ armId, onEmailSubmit, onSkip }: QuizResultProps) {
  const arm = getArmById(armId)
  const badgeRef = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !badgeRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        badgeRef.current,
        { scale: 0.5, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.6, ease: 'elastic.out(1, 0.6)' },
      )
    })
    return () => ctx.revert()
  }, [])

  if (!arm) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email.trim()) onEmailSubmit(email.trim())
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ARM badge */}
      <div ref={badgeRef}>
        <p
          className="text-[8px] font-bold uppercase tracking-[0.2em] mb-1 opacity-70"
          style={{ color: arm.color }}
        >
          ARM {arm.id}
        </p>
        <h3 className="font-[family-name:var(--font-clash)] font-bold text-[22px] leading-tight text-[var(--color-parchment)]">
          {arm.name}
        </h3>
      </div>

      {/* Result description */}
      <p className="text-[12px] leading-[1.7] text-[rgba(245,240,232,0.6)]">
        {arm.resultDescription}
      </p>

      {/* CTAs */}
      <div className="flex flex-col gap-2">
        <Button tier="primary" href={`/arms/${arm.slug}`}>
          Explore {arm.name} →
        </Button>
        <Button tier="tertiary" href="/arms" style={{ color: 'rgba(245,240,232,0.5)' }}>
          See all 10 ARMs →
        </Button>
      </div>

      {/* Email opt-in */}
      <div className="flex flex-col gap-3 pt-2 border-t border-[rgba(245,240,232,0.08)]">
        <p className="text-[11px] text-[rgba(245,240,232,0.5)]">
          Want your personalized VPG playbook emailed to you?
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full rounded-[3px] text-[12px] text-[var(--color-parchment)]"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(245,240,232,0.15)',
              padding: '9px 14px',
              caretColor: 'var(--color-orange)',
            }}
          />
          <Button tier="primary" type="submit" className="text-[9px] py-2">
            Send my playbook
          </Button>
        </form>
        <button
          type="button"
          onClick={onSkip}
          className="text-left text-[10px] text-[rgba(245,240,232,0.3)] hover:text-[rgba(245,240,232,0.5)] transition-colors"
        >
          No thanks, I&apos;ll explore on my own →
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
node_modules/.bin/vitest run tests/unit/QuizResult.test.tsx
```

Expected: All 8 tests pass.

- [ ] **Step 5: Run full unit suite**

```bash
node_modules/.bin/vitest run
```

Expected: All tests pass.

- [ ] **Step 6: Commit**

```bash
git add components/quiz/QuizResult.tsx tests/unit/QuizResult.test.tsx
git commit -m "feat: add QuizResult with badge animation and email opt-in"
```

---

### Task 6: ARMQuiz state machine

**Files:**
- Create: `components/quiz/ARMQuiz.tsx`
- Test: `tests/unit/ARMQuiz.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/unit/ARMQuiz.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ARMQuiz } from '@/components/quiz/ARMQuiz'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

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

vi.mock('@/components/quiz/QuizResult', () => ({
  QuizResult: ({ armId }: { armId: number }) => (
    <div data-testid="quiz-result">ARM {armId}</div>
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
  global.fetch = vi.fn().mockResolvedValue(
    new Response(JSON.stringify({ ok: true }), { status: 200 }),
  )
})

describe('ARMQuiz', () => {
  it('renders the first question on mount', () => {
    render(<ARMQuiz />)
    expect(screen.getByText(/What best describes your biggest obstacle/)).toBeInTheDocument()
  })

  it('shows QUESTION 1 OF 4 progress indicator on mount', () => {
    render(<ARMQuiz />)
    expect(screen.getByText('QUESTION 1 OF 4')).toBeInTheDocument()
  })

  it('renders all 4 options for question 1', () => {
    render(<ARMQuiz />)
    expect(screen.getByText('Revenue + Sales')).toBeInTheDocument()
    expect(screen.getByText('Credit + Capital Access')).toBeInTheDocument()
    expect(screen.getByText('Brand + Visibility')).toBeInTheDocument()
    expect(screen.getByText('Infrastructure + Scale')).toBeInTheDocument()
  })

  it('advances to question 2 after a Q1 option is clicked', async () => {
    render(<ARMQuiz />)
    await userEvent.click(screen.getByText('Revenue + Sales'))
    expect(screen.getByText('QUESTION 2 OF 4')).toBeInTheDocument()
    expect(screen.getByText(/What stage is your business/)).toBeInTheDocument()
  })

  it('shows the result screen after all 4 questions are answered', async () => {
    render(<ARMQuiz />)
    await userEvent.click(screen.getByText('Revenue + Sales'))
    await userEvent.click(screen.getByText('Scaling ($500K–$5M)'))
    await userEvent.click(screen.getByText('Land more clients'))
    await userEvent.click(screen.getByText('DIY with tools'))
    expect(screen.getByTestId('quiz-result')).toBeInTheDocument()
    // routeArm('Revenue + Sales', 'Land more clients', 'DIY with tools') = 1
    expect(screen.getByText('ARM 1')).toBeInTheDocument()
  })

  it('routes Credit + Capital Access to ARM 2', async () => {
    render(<ARMQuiz />)
    await userEvent.click(screen.getByText('Credit + Capital Access'))
    await userEvent.click(screen.getByText('Just starting ($0–$50K)'))
    await userEvent.click(screen.getByText('Fix credit / access capital'))
    await userEvent.click(screen.getByText('DIY with tools'))
    // routeArm('Credit + Capital Access', 'Fix credit / access capital', 'DIY with tools') = 2
    expect(screen.getByText('ARM 2')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
node_modules/.bin/vitest run tests/unit/ARMQuiz.test.tsx
```

Expected: All 5 tests fail — `Cannot find module '@/components/quiz/ARMQuiz'`

- [ ] **Step 3: Create ARMQuiz**

Create `components/quiz/ARMQuiz.tsx`:

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from '@/lib/gsap'
import { routeArm } from '@/lib/arm-routing'
import { getArmById } from '@/lib/arm-data'
import { QuizOption } from './QuizOption'
import { QuizResult } from './QuizResult'

const QUESTIONS = [
  {
    text: 'What best describes your biggest obstacle right now?',
    options: ['Revenue + Sales', 'Credit + Capital Access', 'Brand + Visibility', 'Infrastructure + Scale'],
  },
  {
    text: 'What stage is your business at?',
    options: ['Just starting ($0–$50K)', 'Growing ($50K–$500K)', 'Scaling ($500K–$5M)', 'Established ($5M+)'],
  },
  {
    text: "What's your primary goal in the next 90 days?",
    options: ['Land more clients', 'Fix credit / access capital', 'Build brand authority', 'Build systems + team'],
  },
  {
    text: 'How do you prefer to work?',
    options: ['DIY with tools', 'Guided coaching', 'Done-with-you', 'Full delegation'],
  },
]

type Answers = { q1: string; q2: string; q3: string; q4: string }

function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    ;(window as Window & { gtag: (...args: unknown[]) => void }).gtag('event', name, params)
  }
}

export function ARMQuiz() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Partial<Answers>>({})
  const [routedArmId, setRoutedArmId] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const startTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    trackEvent('arm_quiz_started', { source: 'direct' })
  }, [])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !containerRef.current || routedArmId !== null) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.2, ease: 'power2.out' },
      )
    })
    return () => ctx.revert()
  }, [currentQuestion, routedArmId])

  function handleOptionClick(optionText: string, questionIndex: number) {
    const key = `q${questionIndex + 1}` as keyof Answers
    const updated = { ...answers, [key]: optionText }
    setAnswers(updated)

    const optionIndex = QUESTIONS[questionIndex].options.indexOf(optionText)
    trackEvent('arm_quiz_question_answered', {
      question_number: questionIndex + 1,
      answer_text: optionText,
      answer_index: optionIndex,
    })

    if (questionIndex < 3) {
      setCurrentQuestion(questionIndex + 1)
    } else {
      const armId = routeArm(updated.q1 ?? '', updated.q3 ?? '', updated.q4 ?? '')
      setRoutedArmId(armId)
    }
  }

  async function handleEmailSubmit(email: string) {
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000)
    await fetch('/api/quiz-complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ armId: routedArmId, email, ...answers }),
    })
    trackEvent('arm_quiz_completed', {
      routed_arm_id: routedArmId,
      routed_arm_name: getArmById(routedArmId!)?.name ?? '',
      time_spent_seconds: timeSpent,
      email_provided: true,
    })
    router.push(`/arms/${getArmById(routedArmId!)?.slug ?? 'integrity-partner-alliance'}`)
  }

  async function handleSkip() {
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000)
    await fetch('/api/quiz-complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ armId: routedArmId, ...answers }),
    })
    trackEvent('arm_quiz_completed', {
      routed_arm_id: routedArmId,
      routed_arm_name: getArmById(routedArmId!)?.name ?? '',
      time_spent_seconds: timeSpent,
      email_provided: false,
    })
    router.push(`/arms/${getArmById(routedArmId!)?.slug ?? 'integrity-partner-alliance'}`)
  }

  if (routedArmId !== null) {
    return (
      <QuizResult
        armId={routedArmId}
        answers={answers as Answers}
        onEmailSubmit={handleEmailSubmit}
        onSkip={handleSkip}
      />
    )
  }

  const q = QUESTIONS[currentQuestion]

  return (
    <div ref={containerRef}>
      <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-[rgba(245,240,232,0.4)]">
        QUESTION {currentQuestion + 1} OF 4
      </p>
      <p className="mb-6 font-[family-name:var(--font-clash)] font-semibold text-[18px] leading-snug text-[var(--color-parchment)]">
        {q.text}
      </p>
      <div className="flex flex-col gap-2" role="form" aria-label={q.text} aria-live="polite">
        {q.options.map((option) => (
          <QuizOption
            key={option}
            text={option}
            selected={answers[key as keyof Answers] === option}
            onClick={() => handleOptionClick(option, currentQuestion)}
          />
        ))}
      </div>
    </div>
  )
}
```

Wait — there's a bug in the QuizOption `selected` prop. The expression `answers[key as keyof Answers]` uses `key` which is not in scope inside `.map()`. Fix it:

```tsx
// Inside the map, replace the selected prop with:
selected={answers[`q${currentQuestion + 1}` as keyof Answers] === option}
```

The full corrected `ARMQuiz.tsx` file — replace the map block with:

```tsx
      {q.options.map((option) => (
        <QuizOption
          key={option}
          text={option}
          selected={answers[`q${currentQuestion + 1}` as keyof Answers] === option}
          onClick={() => handleOptionClick(option, currentQuestion)}
        />
      ))}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
node_modules/.bin/vitest run tests/unit/ARMQuiz.test.tsx
```

Expected: All 5 tests pass.

- [ ] **Step 5: Run full unit suite**

```bash
node_modules/.bin/vitest run
```

Expected: All tests pass.

- [ ] **Step 6: Commit**

```bash
git add components/quiz/ARMQuiz.tsx tests/unit/ARMQuiz.test.tsx
git commit -m "feat: add ARMQuiz state machine with question progression and routing"
```

---

### Task 7: ARMQuizSection + wire into page.tsx

**Files:**
- Create: `components/quiz/ARMQuizSection.tsx`
- Modify: `app/page.tsx`
- Test: `tests/unit/ARMQuizSection.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `tests/unit/ARMQuizSection.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ARMQuizSection from '@/components/quiz/ARMQuizSection'

vi.mock('@/components/quiz/ARMQuiz', () => ({
  ARMQuiz: () => <div data-testid="arm-quiz-widget" />,
}))

describe('ARMQuizSection', () => {
  it('renders the ARM ROUTING QUIZ label', () => {
    render(<ARMQuizSection />)
    expect(screen.getByText('ARM ROUTING QUIZ')).toBeInTheDocument()
  })

  it('renders the section headline', () => {
    render(<ARMQuizSection />)
    expect(screen.getByText("Where does your business stand?")).toBeInTheDocument()
  })

  it('renders the intro body copy', () => {
    render(<ARMQuizSection />)
    expect(screen.getByText(/4 questions/)).toBeInTheDocument()
  })

  it('renders the ARMQuiz widget', () => {
    render(<ARMQuizSection />)
    expect(screen.getByTestId('arm-quiz-widget')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
node_modules/.bin/vitest run tests/unit/ARMQuizSection.test.tsx
```

Expected: All 4 tests fail — `Cannot find module '@/components/quiz/ARMQuizSection'`

- [ ] **Step 3: Create ARMQuizSection**

Create `components/quiz/ARMQuizSection.tsx`:

```tsx
import { ARMQuiz } from './ARMQuiz'

export default function ARMQuizSection() {
  return (
    <section
      id="arm-quiz"
      aria-label="ARM Routing Quiz"
      className="bg-[var(--bg-surface)] py-24 px-6"
    >
      <div className="mx-auto max-w-5xl flex flex-col md:flex-row gap-12 md:gap-16">
        {/* Intro copy — left column */}
        <div className="md:w-[40%] flex flex-col justify-center">
          <p className="mb-3 text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--color-gold)]">
            ARM ROUTING QUIZ
          </p>
          <h2 className="mb-4 font-[family-name:var(--font-clash)] font-bold text-[28px] leading-tight text-[var(--color-parchment)]">
            Where does your business stand?
          </h2>
          <p className="text-[13px] leading-[1.7] text-[rgba(245,240,232,0.5)]">
            4 questions. 90 seconds. We route you to the exact ARM that solves your specific
            problem — and show you how the other 9 compound it.
          </p>
        </div>

        {/* Quiz widget — right column */}
        <div className="md:w-[60%]">
          <ARMQuiz />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Update app/page.tsx**

Open `app/page.tsx`. Replace the `<section id="arm-quiz" ... />` self-closing tag with `<ARMQuizSection />` and add the import:

```tsx
import HeroSection from '@/components/hero/HeroSection'
import ARMQuizSection from '@/components/quiz/ARMQuizSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ARMQuizSection />
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

- [ ] **Step 5: Run all unit tests**

```bash
node_modules/.bin/vitest run
```

Expected: All tests pass.

- [ ] **Step 6: Verify in browser at http://localhost:3000**

Start dev server if not running:

```bash
cd /Users/reginaldsmith/vpg-website && npm run dev
```

Check the following at http://localhost:3000:
- Scroll past the hero — the quiz section appears with a darker background (`#111a26`)
- Left column: gold label "ARM ROUTING QUIZ", headline, and body copy
- Right column: "QUESTION 1 OF 4" progress indicator, first question text, 4 option buttons
- Clicking an option: button highlights in orange, question slides right-to-left transition to Q2
- Completing Q4: result screen animates in with ARM badge, description, and CTAs
- Opt-in form: email input and "Send my playbook" button render below the CTAs
- "No thanks" link visible below the form

- [ ] **Step 7: Commit**

```bash
git add components/quiz/ARMQuizSection.tsx app/page.tsx tests/unit/ARMQuizSection.test.tsx
git commit -m "feat: add ARMQuizSection and wire into page.tsx"
```

---

### Task 8: E2E quiz flow

**Files:**
- Create: `tests/e2e/quiz.spec.ts`

- [ ] **Step 1: Write E2E tests**

Create `tests/e2e/quiz.spec.ts`:

```ts
import { test, expect } from '@playwright/test'

test.describe('ARM Routing Quiz', () => {
  test('quiz section is visible on scroll', async ({ page }) => {
    await page.goto('/')
    await page.locator('#arm-quiz').scrollIntoViewIfNeeded()
    await expect(page.locator('#arm-quiz')).toBeVisible()
  })

  test('shows question 1 with all 4 options', async ({ page }) => {
    await page.goto('/')
    await page.locator('#arm-quiz').scrollIntoViewIfNeeded()
    await expect(page.getByText('QUESTION 1 OF 4')).toBeVisible()
    await expect(page.getByText('Revenue + Sales')).toBeVisible()
    await expect(page.getByText('Credit + Capital Access')).toBeVisible()
    await expect(page.getByText('Brand + Visibility')).toBeVisible()
    await expect(page.getByText('Infrastructure + Scale')).toBeVisible()
  })

  test('advances through all 4 questions and shows result screen', async ({ page }) => {
    await page.goto('/')
    await page.locator('#arm-quiz').scrollIntoViewIfNeeded()

    await page.getByText('Brand + Visibility').click()
    await expect(page.getByText('QUESTION 2 OF 4')).toBeVisible()

    await page.getByText('Scaling ($500K–$5M)').click()
    await expect(page.getByText('QUESTION 3 OF 4')).toBeVisible()

    await page.getByText('Land more clients').click()
    await expect(page.getByText('QUESTION 4 OF 4')).toBeVisible()

    await page.getByText('DIY with tools').click()

    // Brand + Visibility → ARM 1 (Vantage Point Media)
    await expect(page.getByText('Vantage Point Media')).toBeVisible()
    await expect(page.getByPlaceholder('your@email.com')).toBeVisible()
  })

  test('result screen shows the correct ARM for Credit + Capital Access', async ({ page }) => {
    await page.goto('/')
    await page.locator('#arm-quiz').scrollIntoViewIfNeeded()

    await page.getByText('Credit + Capital Access').click()
    await page.getByText('Just starting ($0–$50K)').click()
    await page.getByText('Fix credit / access capital').click()
    await page.getByText('Full delegation').click()

    // Credit + Capital Access → ARM 2 (Dispute2Go)
    await expect(page.getByText('Dispute2Go')).toBeVisible()
  })
})
```

- [ ] **Step 2: Run E2E tests**

```bash
cd /Users/reginaldsmith/vpg-website
node_modules/.bin/playwright test tests/e2e/quiz.spec.ts
```

Expected: All 4 tests pass. (Dev server must be running at http://localhost:3000.)

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/quiz.spec.ts
git commit -m "test: add E2E tests for ARM routing quiz flow"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Covered |
|---|---|
| 4-question quiz, one at a time | Task 6 — ARMQuiz state machine |
| GSAP question slide transition | Task 6 — `fromTo x: 80→0` on question change |
| ARM routing matrix (all 9 routes + fallback) | Task 2 — `routeArm()` + 9 unit tests |
| Q2 stored for GHL but not used in routing | Task 3 — `q2` included in DB write and GHL payload |
| Result screen: badge animation | Task 5 — `elastic.out(1, 0.6)` on `badgeRef` |
| Result screen: ARM name + description | Task 5 — `arm.name`, `arm.resultDescription` |
| Result screen: primary CTA + See all ARMs | Task 5 — both links render |
| Email opt-in form | Task 5 — input + submit + skip |
| GHL webhook fires on completion | Task 3 — POST in API route |
| GHL includes q1/q2/q3/q4/arm_id/arm_name/email | Task 3 — payload shape in route |
| Anonymous contact if skip (no email) | Task 6 — `handleSkip` fires without email |
| Prisma stores result | Task 3 — `prisma.quizResult.create` |
| GA4: arm_quiz_started | Task 6 — fires in mount `useEffect` |
| GA4: arm_quiz_question_answered (q_num, text, index) | Task 6 — fires in `handleOptionClick` |
| GA4: arm_quiz_completed (arm_id, arm_name, time, email_provided) | Task 6 — fires in `handleEmailSubmit` and `handleSkip` |
| Reduced motion: skip GSAP | Task 5, 6 — `matchMedia` guard on all GSAP |
| Section: `#111a26` background, two-column layout | Task 7 — `bg-[var(--bg-surface)]`, flex columns |
| Section label "ARM ROUTING QUIZ" in gold | Task 7 — `--color-gold` label |
| Progress indicator "QUESTION N OF 4" | Task 6 — dynamic progress string |
| Selected option: orange border + bg tint | Task 4 — `QuizOption` selected styles |
| Redirect to `/arms/[slug]` after completion | Task 6 — `router.push` in both handlers |

**Placeholder scan:** No TODOs, TBDs, or vague steps found.

**Type consistency:** `routeArm(q1, q3, q4)` — parameter order is consistent in Task 2 (definition), Task 6 (call site: `routeArm(updated.q1, updated.q3, updated.q4)`). `Answers` type uses `q1/q2/q3/q4` keys — consistent across Task 6 (state), Task 5 (props), Task 3 (API body).

---

**Next:** Plan 3 (`2026-05-01-plan-3-homepage-layout.md`) covers §3–§9 — ARM Bento Grid, Kraken Method, Entity Cards, Mission + Proof Bar, IPA Strip, Events, and Footer.
