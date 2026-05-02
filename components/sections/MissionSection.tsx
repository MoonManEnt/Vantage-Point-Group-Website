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
