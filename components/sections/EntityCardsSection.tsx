import { ENTITY_CARD_ARMS } from '@/lib/arm-data'
import { Button } from '@/components/ui/Button'

export default function EntityCardsSection() {
  return (
    <section
      id="entity-cards"
      aria-label="Entities"
      className="py-24 px-6"
      style={{ background: 'var(--bg-surface)' }}
    >
      <div className="max-w-5xl mx-auto">
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
            FEATURED ENTITIES
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ENTITY_CARD_ARMS.map((arm) => (
            <div
              key={arm.id}
              className="hover:scale-[1.01] transition-all duration-200"
              style={{
                background: '#0D1B2A',
                border: `1px solid ${arm.color}59`,
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '4px',
                  background: arm.color,
                  marginBottom: '12px',
                }}
              />
              <p
                style={{
                  color: arm.color,
                  fontSize: '8px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  opacity: 0.7,
                  marginBottom: '6px',
                }}
              >
                {arm.entity}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-clash)',
                  fontWeight: 700,
                  fontSize: '16px',
                  color: 'var(--color-parchment)',
                  marginBottom: '10px',
                }}
              >
                {arm.name}
              </p>
              <p
                style={{
                  fontSize: '12px',
                  color: 'rgba(245,240,232,0.5)',
                  lineHeight: 1.6,
                  marginBottom: '16px',
                }}
              >
                {arm.entityCard!.description}
              </p>
              <Button
                tier="tertiary"
                href={arm.entityCard!.href}
                style={{ color: arm.color }}
              >
                {arm.entityCard!.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
