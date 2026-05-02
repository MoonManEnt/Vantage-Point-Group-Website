import { Button } from '@/components/ui/Button'

export default function IpaStrip() {
  return (
    <section
      id="ipa-strip"
      aria-label="Partner Recruitment"
      className="py-10 px-6"
      style={{
        background:
          'linear-gradient(135deg, rgba(59,109,17,0.15) 0%, rgba(201,150,12,0.10) 100%)',
        border: '1px solid rgba(59,109,17,0.3)',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-center">
        <div style={{ flex: '0 0 60%' }}>
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
            INTEGRITY PARTNER ALLIANCE
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-clash)',
              fontWeight: 700,
              fontSize: '28px',
              color: 'var(--color-parchment)',
              marginBottom: '12px',
            }}
          >
            Every arm you activate earns.
          </h2>
          <p
            style={{
              fontWeight: 400,
              fontSize: '13px',
              color: 'rgba(245,240,232,0.6)',
              lineHeight: 1.6,
            }}
          >
            Join the IPA and build a referral income stream across all 10 ARMs. Associate • Certified
            • Premier. Faith-rooted. Results-verified.
          </p>
        </div>
        <div style={{ flex: '0 0 40%', display: 'flex', justifyContent: 'center' }}>
          <Button
            tier="entity"
            href="/partners"
            entityColor="#3B6D11"
          >
            BECOME A PARTNER →
          </Button>
        </div>
      </div>
    </section>
  )
}
