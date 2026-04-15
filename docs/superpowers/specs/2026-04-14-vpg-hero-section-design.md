# VPG Hero Section — Design Spec

**Date:** 2026-04-14  
**Status:** Approved  
**Replaces:** Empty `<section id="hero">` shell in `app/page.tsx`

---

## Summary

Full-viewport hero section for the Vantage Point Group website. Editorial B-split layout: copy and CTA on the left, Mosaic V 3D render on the right. Cinematic entrance animations via GSAP, ambient particle constellation, Mosaic V float loop, and ScrollTrigger fade-out on scroll.

**Locked decisions:**
- Layout: B — Editorial Split
- Headline: H-A — "Serious Builders. Kingdom Purpose. Ten Movements Forward."
- Motion: Level 3 — Cinematic & Immersive
- Scroll exit: C — Fade out (dissolve as next section rises)
- Build approach: GSAP + CSS Particles (Approach 1)

---

## 1. Component Architecture

### New files

**`components/hero/HeroSection.tsx`**  
`'use client'` component. Orchestrates the full hero: B-split layout, GSAP context and entrance timeline, ScrollTrigger fade-out, Mosaic V float loop. Imports `ParticleField`. Exported as default. Renders its own `<section id="hero" aria-label="Hero">` element — it is the section, not content inside it.

**`components/hero/ParticleField.tsx`**  
Purely presentational. Renders `count` (default 14) absolutely-positioned `<span>` elements. Each span has a unique `animation-delay` and `animation-duration` driven by its index. No GSAP, no refs. Marked `aria-hidden="true"`. Covers the full section via `position: absolute; inset: 0`.

### Unchanged files

- `app/page.tsx` — imports `HeroSection`, replaces the empty `<section id="hero" ... />` self-closing shell with `<HeroSection />`
- `lib/gsap.ts` — existing GSAP singleton, used as-is
- `components/ui/Button.tsx` — existing CTA button component

---

## 2. Visual Layout

### Desktop (≥ 1024px)

```
┌─────────────────────────────┬────────────────────────┐
│  LEFT COL (flex: 1)         │  RIGHT COL (45vw/560px)│
│  pl-16 pr-8 py-24           │  centered              │
│                             │                        │
│  [eyebrow]                  │     ╔══════════╗       │
│  [headline line 1]          │     ║ Mosaic V ║       │
│  [headline line 2]          │     ║  480×480 ║       │
│  [headline line 3]          │     ╚══════════╝       │
│  [tagline]                  │    (glow ring behind)  │
│  [CTA button]               │                        │
└─────────────────────────────┴────────────────────────┘
```

Section: `min-h-screen`, `bg-[var(--bg-base)]` (`#0D1B2A`).  
ParticleField: `position: absolute; inset: 0; z-index: 0`.  
Content: `z-index: 2`.

### Tablet (768–1023px)

Right column: `width: 40%`. Mosaic V: `340px × 340px`. Headline: 52px.

### Mobile (< 768px)

Single column, stacked vertically. Mosaic V moves **above** headline at `240px × 240px`. Headline: 38px. CTA: full-width.

---

## 3. Typography & Color

| Element | Font | Size (desktop) | Weight | Color | Letter-spacing |
|---|---|---|---|---|---|
| Eyebrow | System UI | 11px | 400 | `#E8541A` | 3px |
| Headline | Clash Display | 72px | 800 | `#F5F0E8` | 1px |
| "KINGDOM" accent | Clash Display | 72px | 800 | `#C9960C` | 1px |
| Tagline | System UI | 11px | 400 | `rgba(245,240,232,0.4)` | 3px |

Headline line-height: `1.05`. Tagline line-height: `2`.

Eyebrow copy: `10 ADAPTIVE REACH MOVEMENTS`  
Headline copy:
```
SERIOUS BUILDERS.
KINGDOM PURPOSE.
TEN MOVEMENTS FORWARD.
```
Tagline copy: `FAITH-ROOTED · EXCELLENCE-DRIVEN · RESULTS-ACCOUNTABLE`  
CTA copy: `Find Your ARM` → `href="#arm-quiz"`

---

## 4. Particle Field

14 `<span>` elements, `position: absolute`, `border-radius: 50%`.

Colors drawn from the Mosaic palette, distributed across 7 ARMs:

| Color | Hex | Count |
|---|---|---|
| Cyan | `#00B4CB` | 2 |
| Orange | `#E8541A` | 2 |
| Gold | `#C9960C` | 2 |
| Violet | `#5B3FA8` | 2 |
| Green | `#3B6D11` | 2 |
| Parchment | `rgba(245,240,232,0.3)` | 2 |
| Navy light | `rgba(0,180,203,0.25)` | 2 |

Each particle: `1.5–3px` diameter. CSS `@keyframes` with `transform: translate()` and `opacity` cycling. `animation-duration`: 5–9s per particle (index-based). `animation-delay`: 0–4s staggered. `animation-iteration-count: infinite`.

---

## 5. Animation Sequence

### 5.1 Entrance timeline (GSAP, fires on mount)

All targets initialised with `autoAlpha: 0` before timeline starts.

| Delay | Target | Animation | Duration | Ease |
|---|---|---|---|---|
| 0.0s | ParticleField wrapper | `opacity 0→1` | 1.2s | `power2.out` |
| 0.2s | Mosaic V `<Image>` | `scale 0.85→1, autoAlpha 0→1` | 1.0s | `power3.out` |
| 0.3s | Glow ring div | `scale 0.6→1, opacity 0→1` | 1.4s | `power2.out` |
| 0.5s | Eyebrow | `y 12→0, autoAlpha 0→1` | 0.5s | `power2.out` |
| 0.65s | Headline lines (×3) | `x -24→0, autoAlpha 0→1` | 0.6s, stagger 0.12s | `power3.out` |
| 1.0s | Tagline | `y 8→0, autoAlpha 0→1` | 0.5s | `power2.out` |
| 1.15s | CTA button | `y 8→0, autoAlpha 0→1` | 0.5s | `back.out(1.4)` |

### 5.2 Mosaic V float loop (after entrance, infinite)

```
gsap.to(mosaicRef.current, {
  y: -14,
  duration: 5,
  ease: 'sine.inOut',
  repeat: -1,
  yoyo: true,
})
gsap.to(glowRef.current, {
  scale: 1.12,
  duration: 5,
  ease: 'sine.inOut',
  repeat: -1,
  yoyo: true,
})
```

Both tweens start after entrance timeline completes (`onComplete` callback).

### 5.3 Scroll fade-out (ScrollTrigger)

```
ScrollTrigger.create({
  trigger: '#hero',
  start: 'top top',
  end: 'bottom top',
  scrub: true,
  animation: gsap.timeline()
    .to(contentWrapperRef.current, { autoAlpha: 0, y: -40 })
    .to(particlesRef.current, { autoAlpha: 0 }, '<50%'),
})
```

Content wrapper and particles fade independently — particles at half-speed, no y-shift, creating a dissolve rather than a hard scroll-off.

---

## 6. Accessibility & Performance

### Accessibility

- `<section id="hero" aria-label="Hero">` — already present in `page.tsx`
- `ParticleField`: `aria-hidden="true"`, `role` omitted (decorative)
- Mosaic V: `alt="Mosaic V — VPG brand mark"`, explicit `width={480}` and `height={480}`
- CTA: existing `<Button tier="primary">` component — already accessible
- **Reduced motion:** Check `window.matchMedia('(prefers-reduced-motion: reduce)')` before initialising GSAP context. If true: skip all tweens, render all elements at `autoAlpha: 1` immediately, skip float loop and ScrollTrigger

### Performance

- Mosaic V uses Next.js `<Image>` component with `priority` prop (LCP candidate, above the fold)
- `sizes` attribute: `"(max-width: 768px) 240px, (max-width: 1024px) 340px, 480px"`
- GSAP context cleaned up in `useEffect` return: `ctx.revert()`
- ScrollTrigger instance killed in cleanup: stored in ref, `.kill()` on unmount

---

## 7. Testing

### Unit tests (`tests/unit/HeroSection.test.tsx`)

1. Renders headline with all three lines present
2. "KINGDOM" word has gold color class applied
3. CTA button renders with `href="#arm-quiz"`
4. Mosaic V image has non-empty `alt` attribute
5. ParticleField has `aria-hidden="true"`

### Unit tests (`tests/unit/ParticleField.test.tsx`)

1. Renders default 14 particles
2. Accepts custom `count` prop
3. Container has `aria-hidden="true"`

### E2E tests (`tests/e2e/hero.spec.ts`)

1. Hero section is visible on page load
2. Headline text is present in the DOM
3. CTA button is visible and points to `#arm-quiz`
4. Clicking CTA scrolls to `#arm-quiz` section

---

## 8. Out of Scope

- ARM Quiz section (`#arm-quiz`) — separate plan
- Video background variant — not requested
- Hero A/B testing — not requested
- CMS-driven headline copy — not requested; copy is hardcoded

---

## Implementation Notes

- All Tailwind color references use `var()` syntax: `bg-[var(--bg-base)]`, not shorthand
- Font variable for Clash Display: `font-[family-name:var(--font-clash)]`
- No new dependencies required — GSAP and Next.js Image already present
