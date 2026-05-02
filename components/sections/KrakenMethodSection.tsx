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
