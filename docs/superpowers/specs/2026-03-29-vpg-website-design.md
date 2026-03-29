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

**Phase 1 scope:** VantagePointGroup.com homepage + listed interior pages only. See Section 11 for phasing.

---

## 2. Brand Identity

### The Mosaic V
- Stained-glass geometric mosaic "V" logo — the primary brand mark
- 6 lockup configurations: Horizontal, Stacked, Wordmark Only, Mark Only, Compact, Endorsed
- Dark mode is the **primary** expression; light mode is secondary
- SVG assets: All 6 lockups must be exported as optimized SVG from brand guide before build begins

### Mosaic Palette (authoritative hex values)

| Role | Name | Token | Hex |
|---|---|---|---|
| Anchor | Carrot Orange | `--color-orange` | `#E8541A` |
| Anchor | Cyan | `--color-cyan` | `#00B4CB` |
| Anchor | Charcoal | `--color-charcoal` | `#2C2C2A` |
| Anchor | Forest Green | `--color-green` | `#3B6D11` |
| Expansion | Cathedral Gold | `--color-gold` | `#C9960C` |
| Expansion | Royal Violet | `--color-violet` | `#5B3FA8` |
| Expansion | Midnight Navy | `--color-navy` | `#0D1B2A` |
| Expansion | Parchment | `--color-parchment` | `#F5F0E8` |

### Background Depth Scale (define as Tailwind tokens)

| Name | Token | Hex | Usage |
|---|---|---|---|
| Midnight Navy | `--bg-base` | `#0D1B2A` | Primary background |
| Midnight Ink | `--bg-surface` | `#111a26` | Elevated sections (ARM Quiz, Entity Cards) |
| Midnight Deep | `--bg-footer` | `#0a1118` | Footer — darkest layer |

These are intentional tonal variants for depth separation between sections. They are **not** the same color.

### Color Ownership by Entity

| Entity | Primary | Secondary |
|---|---|---|
| VPG Parent | All 8 mosaic colors | — |
| Vantage Point Media (ARM 1) | `#E8541A` (Carrot Orange) | `#5B3FA8` (Royal Violet) |
| Dispute2Go (ARM 2) | `#00B4CB` (Cyan) | `#0D1B2A` (Midnight Navy) |
| Integrity Partner Alliance (ARM 7) | `#3B6D11` (Forest Green) | `#C9960C` (Cathedral Gold) |

> **Note:** VPM secondary is `#5B3FA8` (Royal Violet from the mosaic palette). An earlier working draft referenced `#5E5FA6` — that value is incorrect. Use `#5B3FA8` everywhere.

### ARM Badge Colors (10 ARMs)

| ARM | Entity | Color | Hex |
|---|---|---|---|
| 1 | Vantage Point Media | Carrot Orange | `#E8541A` |
| 2 | Dispute2Go | Cyan | `#00B4CB` |
| 3 | VPG Capital & Funding | Cathedral Gold | `#C9960C` |
| 4 | GTM & Sales Consulting | Royal Violet | `#5B3FA8` |
| 5 | VPG Academy | Forest Green | `#3B6D11` |
| 6 | VPG Ventures | Cathedral Gold | `#C9960C` |
| 7 | Integrity Partner Alliance | Forest Green | `#3B6D11` |
| 8 | VPG AI & Technology (AMELIA) | Cyan | `#00B4CB` |
| 9 | VPG Influence & Public Affairs | Royal Violet | `#5B3FA8` |
| 10 | VPG Global Expansion | Carrot Orange | `#E8541A` |

> **Homepage entity cards (Section 5):** Only 3 ARMs have dedicated entity cards on the homepage: ARM 1 (VPM), ARM 2 (D2G), ARM 7 (IPA). These are the three primary client-facing entities. All 10 ARMs appear in the bento grid (Section 3) and the mega-menu nav. ARM 4 (GTM Consulting) is a service/function of the parent body, not a standalone entity with its own homepage card.

---

## 3. Typography

| Role | Font | Weights | Notes |
|---|---|---|---|
| Display / Headlines | **Clash Display** | 300, 400, 500, 600, 700 | Variable font via Fontshare (free for web). Geometric, premium. |
| Body / UI | **Inter** | 300, 400, 500, 600, 700 | Google Fonts or self-hosted. All weights. |
| Labels / Caps | **Inter Uppercase** | 600, 700 | Letter-spacing 3–4px. Used for section labels, ARM badges, nav links. |

**Font loading strategy:** `font-display: swap` for both fonts. Define system fallback stack:
- Clash Display fallback: `'Helvetica Neue', Arial, sans-serif`
- Inter fallback: `system-ui, -apple-system, sans-serif`

---

## 4. Button Hierarchy

All interactive CTAs follow this three-tier system. Standardized `border-radius: 3px` everywhere unless noted.

| Tier | Name | Style | Usage |
|---|---|---|---|
| **Primary** | Solid CTA | Background: `#E8541A`, Text: `#ffffff`, padding: `10px 24px`, font: Inter 700 10px letter-spacing 1px | "FIND YOUR ARM", nav CTA, hero CTA on ARM result screen |
| **Secondary** | Ghost CTA | Background: transparent, Border: `1px solid rgba(245,240,232,0.2)`, Text: `#F5F0E8`, padding: `9px 22px`, font: Inter 500 11px letter-spacing 2px | Hero "FIND YOUR ARM →" (pre-quiz), modal/overlay CTAs |
| **Entity CTA** | Solid Accent | Background: entity accent color, Text: `#ffffff` or `#F5F0E8`, padding: `10px 20px` | IPA strip (Forest Green), entity card links use text-only variant |
| **Tertiary** | Text-only | No border or background, Color: entity/section accent, hover: underline reveals | "Explore VPM →", "Read the Full Doctrine →" — inline text CTAs |

---

## 5. Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Animation:** GSAP 3 (ScrollTrigger plugin) + Three.js r160 (particle field, 3D parallax)
- **Database:** PostgreSQL via Prisma (ARM quiz results, IPA signups, event registrations)
- **Auth:** NextAuth.js
- **Payments:** Stripe (IPA partner tier subscriptions)
- **CRM:** GoHighLevel (Year 1 operational backbone; GHL webhook receives quiz completions)
- **SEO:** next-seo, next-sitemap, schema markup, multi-domain architecture
- **Analytics:** Google Analytics 4, Meta Pixel

---

## 6. Navigation

### Desktop
- **Behavior:** Transparent on load → `#0D1B2A` + `backdrop-blur-md` at 80px scroll threshold (GSAP `onUpdate` on ScrollTrigger)
- **Sticky:** Yes (`position: sticky; top: 0; z-index: 50`)
- **Height:** 64px
- **Left:** Mosaic V mark (Mark Only lockup, 36px height) — links to `/`
- **Center links:** `Portfolio ▾` · `Partners` · `The Kraken Method` · `Events` · `About` (Inter 500, 11px, letter-spacing 1px, `rgba(245,240,232,0.6)`, hover: `#F5F0E8`)
- **Right CTA:** `FIND YOUR ARM` — Primary Tier button (see Section 4). Links to ARM Quiz anchor `#arm-quiz`.
- **Portfolio mega-menu:** 10-ARM grid, 2 columns × 5 rows. Triggers on hover (`300ms` delay via `setTimeout`) or keyboard focus. Each ARM card: ARM badge number (accent color) + ARM name + 3-word descriptor. Animated open: fade + translateY(-8px), `150ms ease-out`. Close on click-away or `Escape` key. Full ARIA `role="menu"` implementation.

### Mobile (< 768px)
- Hamburger icon (right side of nav, 24×18px three-line, Parchment color)
- Full-screen overlay on open: `position: fixed; inset: 0; z-index: 100; background: #0D1B2A`
- Overlay animation: GSAP `fromTo` opacity 0→1, translateX 100%→0, `300ms power3.out`
- Full ARM list (accordion style — tap ARM name to expand brief descriptor)
- Primary CTA button (`FIND YOUR ARM`) anchored to bottom of overlay
- Close: X button top-right or swipe-right gesture

---

## 7. Homepage Sections

### Section 1 — Hero (Full Viewport)

**Layout:** `height: 100vh; min-height: 600px`, centered content, dark mode
**Background:** `#0D1B2A` with `radial-gradient(ellipse 60% 50% at 50% 40%, rgba(91,63,168,0.12) 0%, transparent 70%)`

**Mosaic V Animation (Radiate — Level II):**

*Load sequence:*
1. Page ready: Mosaic V panels start at `opacity: 0, scale: 0.85`
2. GSAP `staggerFrom`: each of the 7 SVG polygon panels animates to `opacity: 1, scale: 1` with `stagger: 0.05s`, `ease: power3.out`, `duration: 0.6s`
3. Total assembly time: ~0.7s

*Assembled state (Three.js particle field):*
- Canvas overlaid behind Mosaic V SVG, `pointer-events: none`
- ~200 particles, each as a `THREE.Points` geometry with `THREE.PointsMaterial`
- Particle color: randomly assigned from all 8 brand hex values
- Size: `2–8px` (random per particle, `sizeAttenuation: true`)
- Emission: radial from V centroid, 360° spread
- Speed: `20–60px/sec` (random per particle, constant velocity)
- Lifetime: `3–5s` per particle (random), fades to `opacity: 0` over final `1s` of lifetime, then resets to origin
- Loop: continuous while hero is in viewport
- Three.js `AnimationFrame` cancelled when `IntersectionObserver` reports hero out of viewport

*Ambient rotation:*
- Mosaic V SVG: `transform: rotateY(0.3deg)` on a 6s sine-wave loop via GSAP `repeat: -1, yoyo: true`

*Mouse parallax:*
- Event: `mousemove` on document
- Calculation: `normalX = (mouseX / windowWidth - 0.5) * 2` (range -1 to 1)
- Applied: `translateX: normalX * 8px, translateY: normalY * 8px` on Mosaic V element, `ease: power1.out`, `duration: 0.8` (smooth tracking)
- Axis: Both X and Y

*Scroll-to-nav morph (GSAP ScrollTrigger):*
```
ScrollTrigger.create({
  trigger: '#hero',
  start: 'top top',
  end: '50% top',
  scrub: 0.5,
  animation: gsap.to('#mosaic-v-hero', {
    scale: navMarkSize / heroSize,  // e.g., 0.25
    x: navMarkX - heroCenterX,      // translate to nav mark position
    y: navMarkY - heroCenterY,
    ease: 'power3.inOut'
  })
})
```
- Nav Mosaic V mark starts at `opacity: 0` and fades in as hero V fades out at `scrub` 0.5 crossover
- Particle field: particles contract (reverse velocity, `duration: 0.5s`) when scroll > 20% of hero

*Mobile (< 768px):*
- Three.js canvas disabled
- Mouse parallax disabled
- Fragment assembly retained (same GSAP stagger)
- Ambient rotation retained
- Scroll morph retained

**Copy:**
- Eyebrow: `VANTAGE POINT GROUP` (Inter 700, 9px, letter-spacing 4px, `rgba(245,240,232,0.4)`, `text-transform: uppercase`)
- Headline line 1: `The infrastructure behind` (Clash Display 300, 42px desktop / 28px mobile, `#F5F0E8`)
- Headline line 2: `serious builders.` (Clash Display 800, 42px desktop / 28px mobile, `#F5F0E8`)
- Subhead: `10 Adaptive Reach Movements. One operating system. Faith-rooted. Results-driven.` (Inter 400, 13px, letter-spacing 1px, `rgba(245,240,232,0.45)`, `max-width: 380px`)
- Scroll indicator: `↓ SCROLL` (Inter 600, 9px, letter-spacing 2px, `rgba(245,240,232,0.3)`, GSAP opacity pulse `0.3→0.6` on 2s loop)

**CTA:** Single Secondary Tier ghost button — `FIND YOUR ARM →` . Smooth scroll to `#arm-quiz` (Section 2). No competing CTAs above fold.

---

### Section 2 — ARM Routing Quiz

**ID:** `arm-quiz`
**Background:** `#111a26` (Midnight Ink — surface elevation above hero)
**Layout:** Two-column — intro copy left (40%), quiz widget right (60%). Stacks to single column on mobile.

**Intro copy:**
- Label: `ARM ROUTING QUIZ` (Inter 700, 9px, letter-spacing 3px, `#C9960C`, uppercase)
- Headline: `Where does your business stand?` (Clash Display 700, 28px, `#F5F0E8`)
- Body: "4 questions. 90 seconds. We route you to the exact ARM that solves your specific problem — and show you how the other 9 compound it." (Inter 400, 13px, `rgba(245,240,232,0.5)`, line-height 1.7)

**Quiz — All 4 questions and options:**

| Q | Question | Options |
|---|---|---|
| 1 | "What best describes your biggest obstacle right now?" | Revenue + Sales · Credit + Capital Access · Brand + Visibility · Infrastructure + Scale |
| 2 | "What stage is your business at?" | Just starting ($0–$50K) · Growing ($50K–$500K) · Scaling ($500K–$5M) · Established ($5M+) |
| 3 | "What's your primary goal in the next 90 days?" | Land more clients · Fix credit / access capital · Build brand authority · Build systems + team |
| 4 | "How do you prefer to work?" | DIY with tools · Guided coaching · Done-with-you · Full delegation |

**ARM Routing Matrix:**

| Q1 | Q3 Override | Q4 Override | Routed ARM |
|---|---|---|---|
| Credit + Capital Access | any | any | **ARM 2 (Dispute2Go)** |
| Revenue + Sales | Land more clients | Full delegation | **ARM 4 (GTM Consulting)** |
| Revenue + Sales | Land more clients | DIY / Guided | **ARM 1 (VPM)** |
| Brand + Visibility | any | any | **ARM 1 (VPM)** |
| Infrastructure + Scale | Build systems | DIY / Guided | **ARM 5 (Academy)** |
| Infrastructure + Scale | Build systems | Done-with-you / Full delegation | **ARM 6 (Ventures)** |
| Infrastructure + Scale | Land more clients | any | **ARM 4 (GTM Consulting)** |
| Revenue + Sales | Fix credit | any | **ARM 3 (Capital)** |
| Default fallback | — | — | **ARM 7 (IPA) — "Let's talk. There's an arm for this."** |

Logic: Q1 is the primary router. Q3 and Q4 break ties. Q2 (stage) is stored but only used for GoHighLevel pipeline segmentation, not routing.

**Result screen:**
1. ARM badge number animates in (GSAP scale from 0.5, opacity 0 → 1, `duration: 0.6s, ease: elastic.out(1, 0.6)`)
2. ARM name + 2-sentence description
3. Primary CTA: `Explore [ARM Name] →` (solid Primary Tier button, links to `/arms/[slug]`)
4. Secondary CTA: `See all 10 ARMs →` (Tertiary text-only, links to `/arms`)
5. **Opt-in form (inline, below CTAs):**
   - Label: "Want your personalized VPG playbook emailed to you?" (Inter 400, 11px, `rgba(245,240,232,0.5)`)
   - Fields: Email input (single field, placeholder: "your@email.com")
   - CTA: `Send my playbook` (Primary Tier button, smaller: padding 8px 16px)
   - Skip: `No thanks, I'll explore on my own →` (Tertiary text-only, `rgba(245,240,232,0.3)`, font-size 10px)
   - If skip: Go directly to ARM page
   - If submit: GoHighLevel webhook fires with `{ arm_id, email, q1, q2, q3, q4, stage }`, then redirect to ARM page
   - If skip (no email): Anonymous GHL contact created with `{ arm_id, q1_answer, q2_answer, q3_answer, q4_answer }` only

**Quiz widget UX:**
- Progress indicator: `QUESTION 1 OF 4` (Inter 600, 9px, letter-spacing 2px, `rgba(245,240,232,0.4)`)
- Option style: 1px border `rgba(245,240,232,0.15)`, border-radius 4px, padding 8px 12px, Inter 500 11px
- Selected option: border color = routed ARM accent color, background `rgba(accent, 0.08)`, text = accent color
- Question transition: GSAP `fromTo` translateX `100%→0`, `duration: 0.2s, ease: power2.out`

---

### Section 3 — 10 ARM Bento Grid

**Background:** Charcoal `#2C2C2A`
**Section header:**
- Label: `THE PORTFOLIO` (Inter 700, 9px, letter-spacing 3px, `#C9960C`, uppercase)
- Headline: `Ten Arms. One Body. Every angle covered.` (Clash Display 700, 32px desktop)
- Subhead: "Each ARM operates independently. All of them feed the body." (Inter 300, 13px, `rgba(245,240,232,0.5)`)

**Grid responsive breakpoints:**
```
Desktop (1024px+):   5 columns × 2 rows (grid-template-columns: repeat(5, 1fr))
Tablet (768–1023px): 3 columns (grid-template-columns: repeat(3, 1fr))
Mobile (< 768px):    2 columns (grid-template-columns: repeat(2, 1fr))
```
Gap: 8px all breakpoints. `grid-auto-rows: 1fr` for consistent card height.

**Card design:**
- Background: `#0D1B2A`
- Border: `1px solid rgba(ARM_ACCENT, 0.3)` (CSS custom property per card)
- Border-radius: 6px
- Padding: 14px
- Content: ARM badge (ARM_ACCENT, Inter 700, 8px, letter-spacing 2px) + ARM name (Clash Display 600, 12px, `#F5F0E8`) + descriptor (3 words max, Inter 400, 9px, `rgba(245,240,232,0.5)`)
- **Hidden expanded copy per ARM** (revealed on hover):

| ARM | 3-Word Descriptor | Expanded Copy (hover, max 15 words) |
|---|---|---|
| 1 | Brand · Content · Distribution | "Become the authority in your market. We build the content machine." |
| 2 | AI Credit Disputes | "AMELIA disputes tri-bureau. 26 federal statutes. No guesswork." |
| 3 | Funding · Capital Access | "Capital strategy, business credit stacking, and lender-ready positioning." |
| 4 | Sales · Revenue Strategy | "GTM architecture, pipeline design, and revenue execution for B2B." |
| 5 | Education · Training | "The curriculum behind the Kraken. Learn, certify, execute." |
| 6 | Equity · Portfolio Ops | "Co-invest, co-build, co-own. VPG Ventures takes equity positions." |
| 7 | Integrity Partner Alliance | "Refer once. Earn across all 10 arms. Build recurring income." |
| 8 | Proprietary AI · Tech | "AMELIA is the first ARM 8 product. More IP in development." |
| 9 | Advocacy · Public Affairs | "Narrative control, civic influence, and public positioning." |
| 10 | International Markets | "VPG's expansion playbook for operators ready to go global." |

**Hover state:** Border opacity `0.3 → 0.8`, card `translateY(-3px)`, ARM name color → accent color, expanded copy `max-height: 0 → 60px` (GSAP `height` tween, `duration: 0.3s, ease: power2.out`)

**Scroll animation:** GSAP ScrollTrigger, trigger at section 30% in viewport, each card: `opacity: 0, y: 24px` → `opacity: 1, y: 0`, `duration: 0.5s`, stagger: `0.08s` (medium stagger rule), `ease: power2.out`

**Reduced motion:** All cards appear at full opacity simultaneously on section enter. No stagger, no translateY.

**Links:** Each card links to `/arms/[slug]`.

---

### Section 4 — The Kraken Method

**Background:** `#0D1B2A` (Midnight Navy)
**Layout:** Full-width, top: centered intro block; bottom: 3×2 principle grid

**Intro:**
- Label: `THE OPERATING SYSTEM` (Inter 700, 9px, letter-spacing 3px, `#C9960C`, uppercase)
- Headline: `The Kraken Method` (Clash Display 800, 36px)
- Subhead: "The proprietary operating philosophy behind every VPG engagement. Six principles. Seven decision filters. One organism." (Inter 300, 14px, `rgba(245,240,232,0.5)`)
- CTA: `Read the Full Doctrine →` (Tertiary text-only, links to `/about/kraken-method`)

**6 Principles (3×2 grid):**

| # | Principle | Descriptor | Accent | Note |
|---|---|---|---|---|
| 01 | Position Don't Chase | Authority through positioning | `#E8541A` | — |
| 02 | Extend Simultaneously | All arms move at once | `#00B4CB` | — |
| 03 | Capture Through Contact | Sustained engagement converts | `#C9960C` | — |
| 04 | Every Arm Feeds the Body | Cross-referral as reflex | `#3B6D11` | — |
| 05 | Depth Before Breadth | Master a market before expanding | `#5B3FA8` | — |
| 06 | Body Is the Differentiator | The system is the advantage | `#C9960C` | Cathedral Gold (intentional — 01 opens in Orange, 06 closes in Gold, bookending the cycle) |

> Principles 01 and 06 do NOT share the same color. 06 uses Cathedral Gold `#C9960C`, not Carrot Orange `#E8541A`. This is intentional to bookend the 6-principle cycle.

Each principle card: `2px solid ARM accent` left border, principle number (accent, Inter 700, 8px, letter-spacing 2px), principle name (Clash Display 600, 12px, `#F5F0E8`), descriptor (Inter 400, 9px, `rgba(245,240,232,0.5)`)

**Scroll animation:** GSAP ScrollTrigger, each card: `opacity: 0, x: -16px` → `opacity: 1, x: 0`, `duration: 0.5s`, stagger: `0.1s` (slow stagger rule), `ease: power2.out`. Trigger at section 20% in viewport.

---

### Section 5 — Entity Cards

**Background:** `#111a26` (Midnight Ink)
**Layout:** 3-column equal cards. Stacks to 1 column on mobile (< 768px).

**Three entity cards (VPM · D2G · IPA):**
- Card: `#0D1B2A` background, `1px solid rgba(ENTITY_ACCENT, 0.35)` border, `border-radius: 8px`, padding: `20px`
- Accent bar: `4px height × 32px width`, `background: ENTITY_ACCENT`, `border-radius: 2px`, margin-bottom `12px`
- ARM label: `ENTITY_ACCENT`, Inter 700, 8px, letter-spacing 2px, opacity 70%
- Entity name: Clash Display 700, 16px, `#F5F0E8`
- Description: Inter 400, 11px, `rgba(245,240,232,0.5)`, line-height 1.7
- CTA: Tertiary text-only, entity accent color, Inter 700, 9px, arrow
- Hover: Border opacity `0.35 → 0.8`, `scale: 1.01`, transition `200ms`

**Copy (final):**
- **VPM:** "Brand strategy, content production, and distribution for businesses ready to become authorities in their market."
- **D2G:** "AI-native credit dispute platform. AMELIA references 26 federal statutes to build your case. Tri-bureau. Automated. Built for results."
- **IPA:** "The referral network that compounds everything. Associate • Certified • Premier. 8–15% commission on every ARM you activate."

**Punctuation standard:** Use `•` (bullet/middot) as the separator for tier lists throughout the spec. Not `·` (interpunct) and not `→`.

---

### Section 6 — Mission + Social Proof Bar

**Background:** `#0D1B2A` (Midnight Navy)
**Layout:** Centered, full-width, `max-width: 680px margin: auto`

**Label:** `OUR PURPOSE` (Inter 700, 9px, letter-spacing 3px, `rgba(245,240,232,0.4)`, uppercase)

**Mission quote (verbatim from VPG FieldEdition v2):**
> "To give people who are serious about building something real the tools, the team, the infrastructure, and the perspective they need to **actually do it** — creating wealth that stays in families, jobs that stay in communities, and a standard of work that outlasts any single engagement."

`actually do it` — rendered in `#E8541A` (Carrot Orange), Clash Display 700 (inline bold override).

**Proof bar (4 stats, horizontal):**

| Stat | Label |
|---|---|
| `10` | ACTIVE ARMS |
| `5` | MARKETS |
| `26` | FEDERAL STATUTES |
| `IPA` | PARTNER NETWORK |

Bar dividers: `1px solid rgba(255,255,255,0.06)` top and bottom. Stat values: Clash Display 800, 24px. Labels: Inter 700, 8px, letter-spacing 2px, `rgba(245,240,232,0.4)`.

---

### Section 7 — IPA Partner Recruitment Strip

**Background:** `linear-gradient(135deg, rgba(59,109,17,0.15) 0%, rgba(201,150,12,0.10) 100%)`
**Border:** `1px solid rgba(59,109,17,0.3)`
**Padding:** 40px
**Layout:** Two-column — copy left (60%), CTA right (40%). Stacks on mobile.

**IPA Partner Tier Brief (for this strip — full detail on `/partners` page):**

| Tier | Entry Requirement | Commission |
|---|---|---|
| Associate | Apply + complete onboarding | 8% on referred ARM revenue |
| Certified | $10K+ referred revenue + certification | 12% on all ARM revenue |
| Premier | $50K+ referred revenue + 5 active clients | 15% on all ARM revenue + equity consideration |

> Full tier spec, application form, and certification curriculum are defined in a separate IPA Program spec (`/partners` page — deferred to Phase 1 interior page work).

**Copy:**
- Label: `INTEGRITY PARTNER ALLIANCE` (Inter 700, 9px, letter-spacing 3px, `#C9960C`, uppercase)
- Headline: `Every arm you activate earns.` (Clash Display 700, 28px, `#F5F0E8`)
- Body: "Join the IPA and build a referral income stream across all 10 ARMs. Associate • Certified • Premier. Faith-rooted. Results-verified." (Inter 400, 13px, `rgba(245,240,232,0.6)`)

**CTA:** Entity CTA Tier button — `BECOME A PARTNER →` (Forest Green `#3B6D11` background, `#F5F0E8` text, Inter 700, 10px, letter-spacing 1px, `border-radius: 4px`, padding `12px 24px`). Links to `/partners`.

---

### Section 8 — Events + Power Hour CTA

**Background:** `#0D1B2A`
**Border:** `1px solid rgba(91,63,168,0.25)`
**Layout:** Two-column. Single column on mobile.

**Left — Power Hour (monthly):**
- Label: `MONTHLY` (Inter 700, 8px, letter-spacing 2px, `#5B3FA8`)
- Headline: `VPG Power Hour` (Clash Display 700, 18px, `#F5F0E8`)
- Body: "Live monthly Q&A with the VPG team. Bring your business, credit, or partner questions." (Inter 400, 11px, `rgba(245,240,232,0.5)`)
- CTA: `Register →` (Tertiary text-only, `#5B3FA8`) → links to `/events#power-hour`, which contains an embedded GoHighLevel form (email + first name capture)

**Right — Annual Events:**
- Label: `ANNUAL` (Inter 700, 8px, letter-spacing 2px, `#E8541A`)
- Events listed:
  - `VPG Summit` — Q4, Dallas TX (Clash Display 600, 14px)
  - `IPA Partner Summit` — Q2, Dallas TX (Clash Display 600, 14px)
- CTA: `View All Events →` (Tertiary text-only, `#E8541A`) → links to `/events`

---

### Section 9 — Footer

**Background:** `#0a1118` (Midnight Deep — darkest layer)
**Layout:** 4-column grid + bottom strip. Collapses to 2-column on tablet, 1-column on mobile.

**Column 1 — Brand:**
- Mosaic V Mark Only lockup (28px height, SVG)
- Tagline (Inter 300, 12px, `rgba(245,240,232,0.3)`, line-height 1.8):
  ```
  Faith-rooted.
  Results-driven.
  Built to last.
  ```

**Column 2 — PORTFOLIO:**
- All 10 ARM short names in 5 pairs (ARM 1 + 2, 3 + 4, etc.)
- Inter 400, 9px, `rgba(245,240,232,0.3)`, line-height 2

**Column 3 — ENTITIES:**
- Vantage Point Media
- Dispute2Go
- Integrity Partner Alliance

**Column 4 — COMPANY:**
- About · The Kraken Method
- Events · Partners
- Dallas, TX · 5 Markets

**Bottom strip (separated by `1px solid rgba(255,255,255,0.05)`):**
- Left: `© 2026 Vantage Point Group. All rights reserved.` (Inter 400, 9px, `rgba(245,240,232,0.25)`)
- Right: Social icon links — LinkedIn · Instagram · X · YouTube (SVG icons, 16px, `rgba(245,240,232,0.3)`, hover: `#F5F0E8`)

---

## 8. Animation Stack

### Library Reference

| Layer | Tool | Version |
|---|---|---|
| Scroll entrance / pin | GSAP ScrollTrigger | `gsap ^3.12` |
| Mosaic V particle field | Three.js | `three r160` |
| 3D parallax / rotation | Three.js | `three r160` |
| Quiz transitions | GSAP core | `gsap ^3.12` |
| Hero V → nav morph | GSAP ScrollTrigger | `gsap ^3.12` |

### Stagger Hierarchy

| Speed | Interval | Used For |
|---|---|---|
| Fast | `50ms` | Hero fragment assembly, particle emission |
| Medium | `80ms` | Card grids, bento layouts |
| Slow | `100ms` | Principle cards, complex multi-element reveals |

### Performance Rules
- Three.js scene: dynamic import (`import('three')`), only initialized when `IntersectionObserver` reports hero in viewport
- `will-change: transform` applied only during active animations, removed after completion (`gsap.set(el, { willChange: 'auto' })`)
- All animated elements: GPU compositing only (no `top/left` transforms — only `translate3d`)
- Particle canvas: `z-index: 1`, Mosaic V SVG: `z-index: 2`, copy: `z-index: 3`
- Clash Display font: preloaded via `<link rel="preload">` for the weight used in the hero headline
- Three.js bundle: `~150KB gzipped` — acceptable given it only loads with hero visibility

### Reduced Motion (complete spec)
`@media (prefers-reduced-motion: reduce)` and JS check: `window.matchMedia('(prefers-reduced-motion: reduce)').matches`

| Feature | Normal | Reduced Motion |
|---|---|---|
| Three.js particle field | Active | Disabled, canvas not initialized |
| Three.js 3D rotation | Active | Disabled |
| GSAP stagger | Staggered reveal | All elements appear simultaneously (stagger: 0) |
| GSAP scroll morph (V → nav) | Scrub animation | Snapped to final state at scroll > 10% |
| Hover states | Transform + color | Color change only (no scale, no translateY) |
| Quiz question transitions | Slide horizontal | Instant cross-fade (`duration: 0`) |
| All durations | As specified | `0.1s` max (effectively instant) |

---

## 9. Accessibility (WCAG 2.1 AA)

- **Color contrast:** All body text meets 4.5:1 against background. Large text (≥18px bold) meets 3:1. Verify `rgba(245,240,232,0.5)` body copy on `#0D1B2A` — if contrast fails at 0.5 opacity, use `rgba(245,240,232,0.6)` minimum.
- **Focus states:** `outline: 2px solid #E8541A; outline-offset: 3px` on all interactive elements. Never `outline: none` without a visible alternative.
- **Keyboard navigation:** Tab order follows visual layout. ARM quiz fully operable via keyboard. Mega-menu: opens on Enter/Space, closes on Escape. Focus trapped inside mobile overlay when open.
- **ARIA:**
  - `<nav aria-label="Main navigation">`
  - `<button aria-expanded="false/true">` on mega-menu trigger and mobile hamburger
  - `<ul role="menu">` / `<li role="menuitem">` in mega-menu
  - Mosaic V SVG: `<svg aria-label="Vantage Point Group logo" role="img">`
  - Three.js canvas: `<canvas aria-hidden="true">`
  - ARM quiz: `role="form"`, `aria-live="polite"` on question container, `aria-selected` on quiz options
- **Skip link:** `<a href="#main-content" class="sr-only focus:not-sr-only">Skip to main content</a>` as first element in `<body>`
- **Alt text strategy:** All decorative SVGs use `aria-hidden="true"`. All informational images use descriptive `alt` text. ARM badge numbers use `aria-label="ARM [N]: [Entity Name]"`.

---

## 10. Performance Budget

| Metric | Target |
|---|---|
| Lighthouse Performance | ≥ 85 |
| First Contentful Paint | < 1.8s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| Time to Interactive | < 3.5s |
| Total JS bundle (initial) | < 200KB gzipped |
| Three.js (lazy chunk) | ~150KB gzipped (loaded deferred) |
| Font loading | `font-display: swap` |

Reserve `<link rel="preload">` for: Clash Display variable font (hero weight), Inter 400 (body), critical CSS.

---

## 11. SEO Architecture

### Meta / OG Tags (per page)
- `og:title` — page-specific, max 60 chars
- `og:description` — 150–160 chars, action-oriented
- `og:image` — `1200×630px` design: Mosaic V mark (centered-left), headline copy (centered), dark background `#0D1B2A`. Also provide `600×600px` square crop (same layout, Mosaic V larger, less copy) for iMessage and Android RCS previews.
- `og:type`: `website` (homepage), `article` (blog/content pages)
- `twitter:card`: `summary_large_image`
- `twitter:site`: `@VantagePointGrp` (confirm handle)
- Facebook: `og:image` 1200×630 (same as OG standard)
- Canonical: `<link rel="canonical">` on all pages

### Favicon Suite
- `favicon.svg` — Mosaic V mark, dark background, with `<style>@media(prefers-color-scheme:dark){...}</style>` for dark/light mode adaptation
- `favicon.ico` — 32×32 fallback (IE/old browser)
- `apple-touch-icon.png` — 180×180
- `favicon-16x16.png`, `favicon-32x32.png`
- `android-chrome-192x192.png`, `android-chrome-512x512.png`
- `site.webmanifest` — `theme_color: "#0D1B2A"`, `background_color: "#0D1B2A"`, `display: "standalone"`

### Schema Markup
- `Organization` schema on homepage (name, url, logo, sameAs social links, address)
- `LocalBusiness` schema for Texas market (primary)
- `FAQPage` schema on ARM pages and Kraken Method page
- `BreadcrumbList` on all interior pages
- `Event` schema on events page for Power Hour and Summit

### Multi-domain strategy
- `VantagePointGroup.com` — parent hub (this spec)
- `VantagePointMedia.com` — ARM 1 entity site (Phase 2)
- `Dispute2Go.com` — ARM 2 entity site (Phase 3 — existing, to be reconciled)
- `VPGAcademy.com` — ARM 5 entity site (Phase 4)

### Target keywords (homepage)
- "business consulting Dallas TX"
- "credit dispute AI platform"
- "revenue strategy consulting"
- "partner referral network"
- "Vantage Point Group"
- "The Kraken Method"
- + 20 long-tail keywords per ARM entity page (defined in entity page specs)

---

## 12. Conversion Architecture

### Primary conversion: ARM Quiz completion (Section 2)
- 4-question quiz → ARM match → entity CTA
- GoHighLevel webhook on completion (with or without email opt-in)
- GHL pipeline: `VPG Website Leads` → stage: `ARM Quiz Completed`
- UTM params preserved through quiz to GHL pipeline entry

### Secondary conversions
- IPA partner application (`/partners` page — GoHighLevel form embed)
- Entity page CTAs (VPM: discovery call, D2G: free account, IPA: application)
- Event registrations (Power Hour: GoHighLevel form embed at `/events#power-hour`)

### Analytics Event Schema (GA4 + Meta Pixel)

**GA4 Events:**
```
arm_quiz_started
  - params: source (hero_cta | nav_cta | direct)

arm_quiz_question_answered
  - params: question_number (1-4), answer_text, answer_index (0-3)

arm_quiz_completed
  - params: routed_arm_id (1-10), routed_arm_name, time_spent_seconds, email_provided (bool)

partner_cta_clicked
  - params: section (section_7_strip | entity_card | nav | footer), arm_id (7)

entity_cta_clicked
  - params: entity (vpm | d2g | ipa), section, destination_url

nav_arm_mega_menu_opened
  - params: trigger (hover | click | keyboard)

nav_arm_mega_menu_arm_clicked
  - params: arm_id (1-10), arm_name
```

**Meta Pixel:**
- `Lead` event on quiz completion with email
- `ViewContent` event on entity card hover > 3s
- `InitiateCheckout` equivalent on `/partners` application form open

---

## 13. Interior Pages (Phase 1)

These pages ship with the homepage in Phase 1. Full content specs are deferred to a separate interior pages spec. Minimum structure:

| Path | Purpose | Minimum Sections |
|---|---|---|
| `/about/kraken-method` | Full Kraken doctrine — 6 principles, 7 decision filters, ARM anatomy | Hero + 3 content sections + CTA to ARM quiz |
| `/partners` | IPA program — tier breakdown (Associate/Certified/Premier), commission structure, application form | Hero + Tier table + Benefits + GoHighLevel form embed |
| `/arms` | Full 10-ARM index with ARM cards | Hero + 10-ARM bento grid (expanded) + CTA to quiz |
| `/arms/[slug]` | Individual ARM page for each of 10 ARMs | Hero + ARM description + cross-ARM links + CTA |
| `/events` | Events calendar — Power Hour registration, Summit info | Hero + Event cards + GoHighLevel form embed |

> `/industries/[vertical]` (16 pages) and individual entity sites (VPM, D2G, IPA) are deferred to Phases 2–4.

---

## 14. Build Phasing

| Phase | Site | Priority |
|---|---|---|
| 1 | VantagePointGroup.com (this spec) | **First** — parent hub live before entity sites |
| 2 | VantagePointMedia.com | ARM 1 entity site. Carrot Orange + Royal Violet brand world. |
| 3 | Dispute2Go.com reconciliation | Reconcile existing D2G design with Mosaic Palette. AMELIA UI. |
| 4 | VPGAcademy.com | ARM 5 entity site. Course/content-forward architecture. |

---

## 15. Localization

Phase 1: **English only.**
Phase 2: Spanish language support for Texas/DFW market (`/es/` route prefix, Next.js i18n routing). No other languages in current roadmap.

---

## 16. Pre-Build Checklist (Open Items)

- [ ] Confirm hero headline copy: "The infrastructure behind serious builders." — founder approval needed
- [ ] GoHighLevel: Create account, configure webhook endpoint, set up `VPG Website Leads` pipeline
- [ ] Mosaic V SVG export: All 6 lockups as optimized SVG from brand guide (Reginald to provide files)
- [ ] Clash Display font: Downloaded from Fontshare, confirmed license covers web use
- [ ] Inter font: Confirm self-hosting vs Google Fonts CDN preference
- [ ] DNS: Domain DNS configured for VantagePointGroup.com → Vercel deployment
- [ ] ARM quiz routing: Confirm routing matrix with Reginald (especially Revenue + Sales tie-break logic)
- [ ] Twitter handle: Confirm `@VantagePointGrp` is the correct handle for OG tags
- [ ] `.gitignore`: `.superpowers/` already added to project `.gitignore` ✅
- [ ] OG image: Design and export at 1200×630 and 600×600 (square) before launch

---

## 17. Design Inspiration Reference

Sites reviewed for design direction:
- **Awwwards, Godly, Landing Love** — animation-forward dark mode references; 578 of 1,978 animation-focused sites use dark mode
- **The Brand Identity** — identity + brand system references
- **Bentogrids** — bento grid pattern references for 10-ARM layout
- **Navbar Gallery** — mega-menu and navigation pattern references
- **Details Matter, Hoverstat.es** — micro-interaction and hover state references
- **Siteinspire, Lapa Ninja** — layout and typography references

**Key pattern decisions derived from research:**
- Dark mode dominant for premium portfolio positioning
- Fragment/particle hero as primary differentiator at award-winning tier
- Bento grids as the canonical multi-product portfolio layout
- Mega menus with visual content for complex navigation structures
- Single primary CTA in hero (no competing actions above fold)
- Ghost button in hero (solid feels heavy against particle field background)
