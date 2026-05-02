import Link from 'next/link'
import { ARMS } from '@/lib/arm-data'

const ENTITY_LINKS = [
  { name: 'Vantage Point Media', href: '/arms/vantage-point-media' },
  { name: 'Dispute2Go', href: '/arms/dispute2go' },
  { name: 'IPA', href: '/partners' },
]

const COMPANY_LINKS = [
  { name: 'About', href: '/about' },
  { name: 'The Kraken Method', href: '/about/kraken-method' },
  { name: 'Events', href: '/events' },
  { name: 'Partners', href: '/partners' },
]

const SOCIAL_LINKS = [
  { name: 'LinkedIn', href: 'https://linkedin.com' },
  { name: 'Instagram', href: 'https://instagram.com' },
  { name: 'X', href: 'https://x.com' },
  { name: 'YouTube', href: 'https://youtube.com' },
]

const navLinkStyle = {
  fontSize: '9px',
  color: 'rgba(245,240,232,0.3)',
  textDecoration: 'none',
  display: 'block',
  marginBottom: '6px',
  transition: 'color 0.15s',
} as const

const colHeadingStyle = {
  fontSize: '9px',
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.2em',
  color: 'rgba(245,240,232,0.4)',
  marginBottom: '12px',
}

export default function SiteFooter() {
  return (
    <footer
      id="footer"
      aria-label="Site footer"
      className="py-16 px-6"
      style={{ background: 'var(--bg-footer)' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Col 1 — Brand */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-clash)',
                fontWeight: 700,
                fontSize: '18px',
                color: 'var(--color-parchment)',
                marginBottom: '10px',
              }}
            >
              VPG
            </p>
            <p
              style={{
                fontWeight: 300,
                fontSize: '12px',
                color: 'rgba(245,240,232,0.3)',
                lineHeight: 1.7,
                whiteSpace: 'pre-line',
              }}
            >
              {'Faith-rooted.\nResults-driven.\nBuilt to last.'}
            </p>
          </div>

          {/* Col 2 — Portfolio */}
          <div>
            <p style={colHeadingStyle}>PORTFOLIO</p>
            {ARMS.map((arm) => (
              <Link
                key={arm.id}
                href={`/arms/${arm.slug}`}
                style={navLinkStyle}
              >
                {arm.name}
              </Link>
            ))}
          </div>

          {/* Col 3 — Entities */}
          <div>
            <p style={colHeadingStyle}>ENTITIES</p>
            {ENTITY_LINKS.map((link) => (
              <Link key={link.name} href={link.href} style={navLinkStyle}>
                {link.name}
              </Link>
            ))}
          </div>

          {/* Col 4 — Company */}
          <div>
            <p style={colHeadingStyle}>COMPANY</p>
            {COMPANY_LINKS.map((link) => (
              <Link key={link.name} href={link.href} style={navLinkStyle}>
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: '24px',
            marginTop: '40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <p
            style={{
              fontSize: '9px',
              color: 'rgba(245,240,232,0.25)',
            }}
          >
            © 2026 Vantage Point Group. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener"
                aria-label={social.name}
                style={{
                  fontSize: '9px',
                  color: 'rgba(245,240,232,0.3)',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
