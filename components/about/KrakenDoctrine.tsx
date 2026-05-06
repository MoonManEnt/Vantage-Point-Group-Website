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

// TODO: replace with actual Kraken doctrine copy
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
                <p style={{ fontSize: '12px', color: 'rgba(245,240,232,0.5)', marginBottom: '12px' }}>
                  {p.descriptor}
                </p>
                <p style={{ fontSize: '14px', color: 'rgba(245,240,232,0.7)', lineHeight: 1.7, maxWidth: '680px' }}>
                  {p.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

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
                <p style={{ fontSize: '15px', color: 'rgba(245,240,232,0.75)', lineHeight: 1.5, paddingTop: '4px' }}>
                  {filter}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

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
                style={{ borderLeft: '2px solid rgba(201,150,12,0.3)', paddingLeft: '16px' }}
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
