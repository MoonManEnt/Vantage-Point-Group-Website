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
