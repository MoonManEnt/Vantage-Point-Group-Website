import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ARMS, getArmBySlug } from '@/lib/arm-data'
import { ArmDetailHero } from '@/components/arms/ArmDetailHero'
import { CrossArmLinks } from '@/components/arms/CrossArmLinks'
import { Button } from '@/components/ui/Button'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return ARMS.map((arm) => ({ slug: arm.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const arm = getArmBySlug(slug)
  if (!arm) return {}
  return { title: arm.name, description: arm.resultDescription }
}

export default async function ArmDetailPage({ params }: Props) {
  const { slug } = await params
  const arm = getArmBySlug(slug)
  if (!arm) notFound()

  return (
    <>
      <ArmDetailHero arm={arm} />

      <section style={{ background: 'var(--bg-surface)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: arm.color,
              marginBottom: '20px',
            }}
          >
            About This Arm
          </p>
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(245,240,232,0.75)',
              lineHeight: 1.75,
              maxWidth: '680px',
            }}
          >
            {arm.resultDescription}
          </p>
        </div>
      </section>

      {/* Services Offered — template placeholder */}
      {/* TODO: populate arm-data.ts with services[] array */}
      <section style={{ background: 'var(--bg-base)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: arm.color,
              marginBottom: '32px',
            }}
          >
            What We Do
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {[1, 2, 3].map((n) => (
              <div key={n} style={{ borderLeft: `2px solid ${arm.color}`, paddingLeft: '16px' }}>
                <p style={{ fontSize: '13px', color: 'rgba(245,240,232,0.35)', fontStyle: 'italic' }}>
                  — Service area coming soon.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who This Is For — template placeholder */}
      {/* TODO: populate arm-data.ts with idealFor[] array */}
      <section style={{ background: 'var(--bg-surface)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: arm.color,
              marginBottom: '32px',
            }}
          >
            Who This Is For
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[1, 2, 3].map((n) => (
              <li
                key={n}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '13px',
                  color: 'rgba(245,240,232,0.35)',
                  fontStyle: 'italic',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: arm.color,
                    opacity: 0.4,
                    flexShrink: 0,
                  }}
                />
                Operator profile coming soon.
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CrossArmLinks currentSlug={arm.slug} />

      <section style={{ background: 'var(--bg-surface)', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto', textAlign: 'center' }}>
          <h2
            style={{
              fontFamily: 'var(--font-clash)',
              fontWeight: 700,
              fontSize: '28px',
              color: 'var(--color-parchment)',
              marginBottom: '12px',
            }}
          >
            Ready to activate?
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(245,240,232,0.5)', marginBottom: '28px' }}>
            The ARM quiz matches you to the right entry point.
          </p>
          <Button tier="primary" href="/quiz">
            Take the ARM Quiz →
          </Button>
        </div>
      </section>
    </>
  )
}
