# VantagePointGroup.com — Website Design Spec
**Date:** 2026-03-29
**Status:** Approved for implementation planning
**Project:** `/Users/reginaldsmith/vpg-website/`

---

## 1. Project Overview

VantagePointGroup.com is the parent authority hub for a 10-ARM faith-rooted portfolio company based in Dallas, TX. The site must establish VPG as a globally competitive, generationally significant brand — competing visually and strategically with the world's best portfolio and consulting websites.

**Primary goal:** Establish brand authority and route visitors to the correct ARM within their first 90 seconds on the site.

**Secondary goals:**
- IPA partner recruitment
- Entity-level conversion (VPM, D2G, IPA)
- SEO authority across 5 geographic markets
- Social preview engineering (OG, Facebook, Instagram, TikTok, iMessage, Android RCS)

---

## 2. Brand Identity

### The Mosaic V
- Stained-glass geometric mosaic "V" logo — the primary brand mark
- 6 lockup configurations: Horizontal, Stacked, Wordmark Only, Mark Only, Compact, Endorsed
- Dark mode is the **primary** expression; light mode is secondary

### Mosaic Palette

| Role | Name | Hex |
|---|---|---|
| Anchor | Carrot Orange | `#E8541A` |
| Anchor | Cyan | `#00B4CB` |
| Anchor | Charcoal | `#2C2C2A` |
| Anchor | Forest Green | `#3B6D11` |
| Expansion | Cathedral Gold | `#C9960C` |
| Expansion | Royal Violet | `#5B3FA8` |
| Expansion | Midnight Navy | `#0D1B2A` |
| Expansion | Parchment | `#F5F0E8` |

### Color Ownership by Entity
- **VPG Parent:** Complete mosaic — all 8 colors
- **Vantage Point Media (ARM 1):** `#E8541A` (Carrot Orange) + `#5E5FA6` (violet)
- **Dispute2Go (ARM 2):** `#00B4CB` (Cyan) + `#0D1B2A` (Midnight Navy)
- **Integrity Partner Alliance (ARM 7):** `#3B6D11` (Forest Green) + `#C9960C` (Cathedral Gold)

### ARM Badge Colors (10 ARMs)

| ARM | Entity | Color |
|---|---|---|
| 1 | Vantage Point Media | `#E8541A` |
| 2 | Dispute2Go | `#00B4CB` |
| 3 | VPG Capital & Funding | `#C9960C` |
| 4 | GTM & Sales Consulting | `#5B3FA8` |
| 5 | VPG Academy | `#3B6D11` |
| 6 | VPG Ventures | `#C9960C` |
| 7 | Integrity Partner Alliance | `#3B6D11` |
| 8 | VPG AI & Technology (AMELIA) | `#00B4CB` |
| 9 | VPG Influence & Public Affairs | `#5B3FA8` |
| 10 | VPG Global Expansion | `#E8541A` |

---

## 3. Typography

| Role | Font | Notes |
|---|---|---|
| Display / Headlines | **Clash Display** | Variable font, weights 300–700, geometric premium feel |
| Body / UI | **Inter** | All weights, excellent small-size readability |
| Labels / Caps | **Inter Uppercase** | Letter-spacing 3–4px, used for section labels and ARM badges |

---

## 4. Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Animation:** GSAP (ScrollTrigger, entrance animations) + Three.js (particle field, 3D parallax)
- **Database:** PostgreSQL via Prisma (ARM quiz results, IPA signups)
- **Auth:** NextAuth.js
- **Payments:** Stripe (IPA partner tiers)
- **CRM:** GoHighLevel (Year 1 operational backbone; white-label potential)
- **SEO:** next-seo, schema markup, multi-domain architecture

---

## 5. Navigation

### Desktop
- **Behavior:** Transparent on load → Midnight Navy (`#0D1B2A`) + `backdrop-blur` at 80px scroll
- **Sticky:** Yes
- **Left:** Mosaic V mark (Mark Only lockup) — links to homepage
- **Center links:** Portfolio ▾ · Partners · The Kraken Method · Events · About
- **Right CTA:** "FIND YOUR ARM" button — Carrot Orange `#E8541A`, border-radius 3px
- **Portfolio mega-menu:** 10-ARM grid, 2 columns × 5 rows, each ARM card with badge color and brief descriptor. Triggers on hover (300ms delay) or click.

### Mobile
- Full-screen overlay on hamburger open
- Midnight Navy background, full ARM list
- CTA button anchored to bottom of overlay

---

## 6. Homepage Sections

### Section 1 — Hero (Full Viewport)

**Layout:** Full viewport height, centered, dark mode
**Background:** Midnight Navy `#0D1B2A` with radial gradient at 50% 40% in Royal Violet at 12% opacity

**Mosaic V Animation (Radiate — Level II):**
1. Page load: Mosaic V fragments materialize from void and assemble (GSAP stagger, 50ms per panel, ease: `power3.out`)
2. Assembled state: Living particle field emanates from the V — motes in all 8 brand colors drift outward (Three.js, ~200 particles, low velocity)
3. Ambient: Subtle 3D axis rotation (imperceptible, ~0.3° swing on a 6-second loop)
4. Interaction: Mouse movement creates parallax depth offset across mosaic panels (max 8px displacement)
5. Scroll: Particles contract back into the V; V scales and translates into the nav mark position (GSAP ScrollTrigger pin + scrub)

**Copy (exact):**
- Eyebrow (small caps, 9px, letter-spacing 4px, opacity 40%): `VANTAGE POINT GROUP`
- Headline: `The infrastructure behind` + `serious builders.` (weight 300/800 split, 26px desktop, 20px mobile)
- Subhead (11px, letter-spacing 1px, opacity 45%): `10 Adaptive Reach Movements. One operating system. Faith-rooted. Results-driven.`
- Scroll indicator: `↓ SCROLL` in small caps, opacity 30%, animated pulse

**CTA:** Single centered CTA — `FIND YOUR ARM →` (ghost button: 1px border `rgba(245,240,232,0.2)`, text `#F5F0E8`, padding 9px 22px, letter-spacing 2px, border-radius 3px). Links to ARM Quiz (Section 2) via smooth scroll.

**Mobile:** Particles disabled. Fragment assembly retained. 3D rotation retained. Headline scale reduced.

---

### Section 2 — ARM Routing Quiz

**Background:** `#111a26` (slightly lighter than hero for depth separation)
**Layout:** Two-column — intro copy left, interactive quiz widget right

**Intro copy:**
- Label: `SECTION 2 · ARM ROUTING QUIZ` (internal dev label, not shown on site)
- Headline: `Where does your business stand?`
- Body: "4 questions. 90 seconds. We route you to the exact ARM that solves your specific problem — and show you how the other 9 compound it."

**Quiz widget:**
- 4 questions, single-choice each
- Progress indicator (1 of 4)
- Question 1: "What best describes your biggest obstacle right now?" — options: Revenue + Sales / Credit + Capital Access / Brand + Visibility / Infrastructure + Scale
- On completion: ARM badge animates in with matched ARM name, brief description, and CTA to that ARM's page
- Data stored in PostgreSQL (anonymous by default, name/email opt-in on result screen)
- GoHighLevel webhook on completion for CRM pipeline entry

**Animation:** Selected option highlights with ARM accent color. Transition between questions: horizontal slide (GSAP, 200ms).

---

### Section 3 — 10 ARM Bento Grid

**Background:** Charcoal `#2C2C2A`
**Layout:** 5-column × 2-row grid, equal cards

**Card design:**
- Background: Midnight Navy `#0D1B2A`
- Border: 1px solid, ARM accent color at 30% opacity
- Border-radius: 6px
- Content: ARM number (badge color, 8px, letter-spacing 2px) + ARM name (bold, 10px, Parchment) + 3-word descriptor (opacity 50%, 8px)
- Hover state: Border brightens to 80% opacity, card lifts (translateY -3px), ARM name color shifts to accent color, brief description expands (max-height animation, GSAP)

**Section header:**
- Label: `THE PORTFOLIO` (small caps, Cathedral Gold `#C9960C`, letter-spacing 3px)
- Headline: `Ten Arms. One Body. Every angle covered.`

**Animation:** Scroll-triggered stagger — each card fades in and slides up 20px, 80ms stagger between cards. Triggered when section is 30% in viewport.

**Links:** Each card links to `/arms/[slug]` (e.g., `/arms/dispute2go`, `/arms/vpm`)

---

### Section 4 — The Kraken Method

**Background:** Midnight Navy `#0D1B2A`
**Layout:** Full-width, two sub-sections: intro (centered) + 6-principle grid (3 × 2)

**Intro:**
- Label: `THE OPERATING SYSTEM` (Cathedral Gold, letter-spacing 3px)
- Headline: `The Kraken Method`
- Subhead: "The proprietary operating philosophy behind every VPG engagement. Six principles. Seven decision filters. One organism."
- CTA: `Read the Full Doctrine →` (links to `/about/kraken-method`)

**6 Principles grid (3 × 2):**

| # | Principle | Accent Color |
|---|---|---|
| 01 | Position Don't Chase | `#E8541A` |
| 02 | Extend Simultaneously | `#00B4CB` |
| 03 | Capture Through Contact | `#C9960C` |
| 04 | Every Arm Feeds the Body | `#3B6D11` |
| 05 | Depth Before Breadth | `#5B3FA8` |
| 06 | Body Is the Differentiator | `#E8541A` |

Each principle: 2px left border in accent color, principle number in accent (8px bold, letter-spacing 2px), principle name (Parchment, 10px bold), one-line descriptor (opacity 50%, 8px).

**Animation:** Each principle card reveals on scroll with a 100ms stagger (GSAP ScrollTrigger, fade + slide-right 16px).

---

### Section 5 — Entity Cards

**Background:** `#111a26`
**Layout:** 3-column equal cards

**Three cards (VPM · D2G · IPA):**
- Each card: Midnight Navy background, 1px border in entity accent color at 35% opacity, border-radius 8px, padding 20px
- 20px accent color bar at top of card (3px height)
- ARM number label (entity accent, 8px, letter-spacing 2px, opacity 70%)
- Entity name (Parchment, 14px, bold)
- 2-sentence description (body copy, opacity 50%)
- CTA link (entity accent color, 8px bold, arrow)
- Hover: Card border brightens, subtle scale (1.01), CTA underline reveals

**Copy:**
- **VPM:** "Brand strategy, content production, and distribution for businesses ready to become authorities in their market."
- **D2G:** "AI-native credit dispute platform. AMELIA references 26 federal statutes to build your case. Tri-bureau. Automated. Built for results."
- **IPA:** "The referral network that compounds everything. Associate → Certified → Premier. 8–15% commission on every ARM you activate."

---

### Section 6 — Mission + Social Proof Bar

**Background:** Midnight Navy `#0D1B2A`
**Layout:** Centered, full-width

**Mission quote (exact from FieldEdition v2):**
> "To give people who are serious about building something real the tools, the team, the infrastructure, and the perspective they need to actually do it — creating wealth that stays in families, jobs that stay in communities, and a standard of work that outlasts any single engagement."

`actually do it` — Carrot Orange, bold.

**Proof bar (4 stats, horizontal, divider lines between):**
- `10` — ACTIVE ARMS
- `5` — MARKETS
- `26` — FEDERAL STATUTES
- `IPA` — PARTNER NETWORK

Dividers: 1px `rgba(255,255,255,0.06)`, top and bottom of bar.

---

### Section 7 — IPA Partner Recruitment Strip

**Background:** Linear gradient — `rgba(59,109,17,0.15)` → `rgba(201,150,12,0.1)` at 135°
**Border:** 1px solid `rgba(59,109,17,0.3)`
**Layout:** Two-column — copy left, CTA right

**Copy:**
- Label: `INTEGRITY PARTNER ALLIANCE` (Cathedral Gold, 9px, letter-spacing 3px)
- Headline: `Every arm you activate earns.`
- Body: "Join the IPA and build a referral income stream across all 10 ARMs. Associate · Certified · Premier. Faith-rooted. Results-verified."

**CTA:** `BECOME A PARTNER →` — Forest Green `#3B6D11` background, Parchment text, bold, 10px, letter-spacing 1px, border-radius 4px. Links to `/partners`.

---

### Section 8 — Events + Power Hour CTA

**Background:** Midnight Navy `#0D1B2A`
**Border:** 1px solid `rgba(91,63,168,0.25)`
**Layout:** Two-column — monthly Power Hour left, annual events right

**Content:**
- Left: `VPG Power Hour` — Monthly live Q&A. CTA: `Register →`
- Right: `VPG Summit Q4` and `IPA Partner Summit Q2` — Dallas TX. CTA: `View Events →`

Links to `/events`.

---

### Section 9 — Footer

**Background:** `#0a1118` (darkest layer — depth)
**Layout:** 4-column + bottom strip

**Columns:**
1. Mosaic V mark (Mark Only, small) + 3-line brand tagline: "Faith-rooted. / Results-driven. / Built to last."
2. **PORTFOLIO** — all 10 ARM short names in two lines
3. **ENTITIES** — Vantage Point Media / Dispute2Go / Integrity Partner Alliance
4. **COMPANY** — About · The Kraken Method / Events · Partners / Dallas, TX · 5 Markets

**Bottom strip:**
- Left: `© 2026 Vantage Point Group. All rights reserved.`
- Right: Social icons — LinkedIn · Instagram · X · YouTube (linked)
- Divider: 1px `rgba(255,255,255,0.05)`

---

## 7. Interior Pages (Phase 1)

| Path | Purpose |
|---|---|
| `/about/kraken-method` | Full Kraken Method doctrine, 7 decision filters, ARM anatomy |
| `/partners` | IPA partner program — tier breakdown, commission structure, application form |
| `/arms` | Full 10-ARM index with ARM cards |
| `/arms/[slug]` | Individual ARM page (VPM, D2G, IPA, etc.) |
| `/events` | Events calendar, Power Hour registration |
| `/industries/[vertical]` | 16 industry vertical pages (from engagement process doc) |

---

## 8. Animation Stack Summary

| Layer | Tool | Usage |
|---|---|---|
| Entrance / scroll | GSAP ScrollTrigger | Section reveals, stagger, pin |
| Mosaic V particle field | Three.js | ~200 particles, brand colors |
| 3D parallax / rotation | Three.js | Hero Mosaic V, mouse tracking |
| Transitions | GSAP | Page transitions, quiz slide, hover states |
| Scroll-to-nav transform | GSAP ScrollTrigger | Hero V → nav mark morphing |

**Performance rules:**
- Three.js scene: lazy-loaded, only active when hero is in viewport
- Particles: disabled on mobile (`window.matchMedia('(max-width: 768px)')`)
- All animations: `will-change: transform` on animated elements, GPU compositing only
- Reduced motion: Full GSAP/Three.js disabled for `prefers-reduced-motion: reduce`

---

## 9. SEO Architecture

### Meta / OG Tags (per page)
- `og:title`, `og:description`, `og:image` (1200×630, dark mode brand card)
- `og:type`: `website` (homepage), `article` (blog/content)
- Twitter Card: `summary_large_image`
- Facebook: `og:image` optimized (1200×630)
- iMessage / Android RCS: `og:image` square crop at 600×600 also provided

### Favicon Suite
- `favicon.ico` (32×32, Mosaic V mark)
- `apple-touch-icon.png` (180×180)
- `favicon-16x16.png`, `favicon-32x32.png`
- `android-chrome-192x192.png`, `android-chrome-512x512.png`
- `site.webmanifest` (dark theme color: `#0D1B2A`)

### Schema Markup
- `Organization` schema on homepage
- `LocalBusiness` schema for Texas market (primary)
- `FAQPage` schema on ARM pages
- `BreadcrumbList` on all interior pages

### Multi-domain strategy
- `VantagePointGroup.com` — parent hub (this spec)
- `VantagePointMedia.com` — ARM 1 entity site
- `Dispute2Go.com` — ARM 2 entity site (existing, to be reconciled)
- `VPGAcademy.com` — ARM 5 entity site

### Target keywords (homepage)
- "business consulting Dallas TX"
- "credit dispute AI platform"
- "revenue strategy consulting"
- "partner referral network"
- "Vantage Point Group"
- "The Kraken Method"
- + 20 long-tail per entity page

---

## 10. Conversion Architecture

### Primary conversion: ARM Quiz completion
- 4-question quiz → ARM match → entity CTA
- GoHighLevel webhook on completion → pipeline entry
- Optional email capture on result screen

### Secondary conversions
- IPA partner application (Section 7 strip + `/partners` page)
- Entity page CTAs (VPM discovery call, D2G free account, IPA application)
- Event registrations (Power Hour monthly)

### Tracking
- Google Analytics 4 (event: `arm_quiz_completed`, `partner_cta_clicked`, `entity_cta_clicked`)
- Meta Pixel (conversion events for paid social)
- GoHighLevel CRM tracking (UTM params preserved through quiz to pipeline)

---

## 11. Build Phasing

### Phase 1 — VantagePointGroup.com (this spec)
Priority: **First**. Parent hub must be live before entity sites launch.

### Phase 2 — VantagePointMedia.com
ARM 1 entity site. Carrot Orange + Royal Violet brand world.

### Phase 3 — Dispute2Go.com reconciliation
Reconcile existing D2G design with Mosaic Palette (Cyan + Midnight Navy). AMELIA UI.

### Phase 4 — VPGAcademy.com
ARM 5 entity site. Course/content-forward architecture.

---

## 12. Design Inspiration Sources (absorbed)

Sites reviewed for design direction:
- Awwwards, Godly, Landing Love (animation-forward dark mode references)
- The Brand Identity (identity + brand system references)
- Bentogrids (bento grid pattern references)
- Navbar Gallery (navigation pattern references)
- Details Matter, Hoverstat.es (micro-interaction references)
- Siteinspire, Lapa Ninja (layout and typography references)

Key trend signals applied:
- Dark mode dominant (578 of 1,978 animation-focused sites reviewed)
- Fragment/particle hero as premium differentiator
- Bento grids for multi-product portfolio display
- Mega menus with visual content for complex nav structures
- Single primary CTA in hero (no competing actions above fold)

---

## 13. Open Items (pre-build)

- [ ] Confirm hero headline copy with founder ("The infrastructure behind serious builders." — pending approval)
- [ ] GoHighLevel account setup + webhook endpoint configuration
- [ ] Mosaic V SVG asset export from brand guide (all 6 lockups as optimized SVG files)
- [ ] Font licensing: Clash Display (free for web via Fontshare)
- [ ] Domain DNS configuration for VantagePointGroup.com
- [ ] `.gitignore` — add `.superpowers/` to project `.gitignore`
