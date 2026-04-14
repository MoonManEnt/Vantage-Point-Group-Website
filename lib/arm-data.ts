export interface Arm {
  id: number
  name: string
  slug: string
  entity: string
  color: string
  descriptor: string
  hoverCopy: string
  entityCard?: {
    description: string
    cta: string
    href: string
  }
}

export const ARMS: Arm[] = [
  {
    id: 1,
    name: 'Vantage Point Media',
    slug: 'vantage-point-media',
    entity: 'VPM',
    color: '#E8541A',
    descriptor: 'Brand · Content · Distribution',
    hoverCopy: 'Become the authority in your market. We build the content machine.',
    entityCard: {
      description:
        'Brand strategy, content production, and distribution for businesses ready to become authorities in their market.',
      cta: 'Explore VPM →',
      href: '/arms/vantage-point-media',
    },
  },
  {
    id: 2,
    name: 'Dispute2Go',
    slug: 'dispute2go',
    entity: 'D2G',
    color: '#00B4CB',
    descriptor: 'AI Credit Disputes',
    hoverCopy: 'AMELIA disputes tri-bureau. 26 federal statutes. No guesswork.',
    entityCard: {
      description:
        'AI-native credit dispute platform. AMELIA references 26 federal statutes to build your case. Tri-bureau. Automated. Built for results.',
      cta: 'Explore D2G →',
      href: '/arms/dispute2go',
    },
  },
  {
    id: 3,
    name: 'VPG Capital & Funding',
    slug: 'vpg-capital',
    entity: 'Capital',
    color: '#C9960C',
    descriptor: 'Funding · Capital Access',
    hoverCopy: 'Capital strategy, business credit stacking, and lender-ready positioning.',
  },
  {
    id: 4,
    name: 'GTM & Sales Consulting',
    slug: 'gtm-consulting',
    entity: 'GTM',
    color: '#5B3FA8',
    descriptor: 'Sales · Revenue Strategy',
    hoverCopy: 'GTM architecture, pipeline design, and revenue execution for B2B.',
  },
  {
    id: 5,
    name: 'VPG Academy',
    slug: 'vpg-academy',
    entity: 'Academy',
    color: '#3B6D11',
    descriptor: 'Education · Training',
    hoverCopy: 'The curriculum behind the Kraken. Learn, certify, execute.',
  },
  {
    id: 6,
    name: 'VPG Ventures',
    slug: 'vpg-ventures',
    entity: 'Ventures',
    color: '#C9960C',
    descriptor: 'Equity · Portfolio Ops',
    hoverCopy: 'Co-invest, co-build, co-own. VPG Ventures takes equity positions.',
  },
  {
    id: 7,
    name: 'Integrity Partner Alliance',
    slug: 'integrity-partner-alliance',
    entity: 'IPA',
    color: '#3B6D11',
    descriptor: 'Integrity Partner Alliance',
    hoverCopy: 'Refer once. Earn across all 10 arms. Build recurring income.',
    entityCard: {
      description:
        'The referral network that compounds everything. Associate • Certified • Premier. 8–15% commission on every ARM you activate.',
      cta: 'Become a Partner →',
      href: '/partners',
    },
  },
  {
    id: 8,
    name: 'VPG AI & Technology',
    slug: 'vpg-ai',
    entity: 'AMELIA',
    color: '#00B4CB',
    descriptor: 'Proprietary AI · Tech',
    hoverCopy: 'AMELIA is the first ARM 8 product. More IP in development.',
  },
  {
    id: 9,
    name: 'VPG Influence & Public Affairs',
    slug: 'vpg-influence',
    entity: 'Influence',
    color: '#5B3FA8',
    descriptor: 'Advocacy · Public Affairs',
    hoverCopy: 'Narrative control, civic influence, and public positioning.',
  },
  {
    id: 10,
    name: 'VPG Global Expansion',
    slug: 'vpg-global',
    entity: 'Global',
    color: '#E8541A',
    descriptor: 'International Markets',
    hoverCopy: "VPG's expansion playbook for operators ready to go global.",
  },
]

export function getArmBySlug(slug: string): Arm | undefined {
  return ARMS.find((a) => a.slug === slug)
}

export function getArmById(id: number): Arm | undefined {
  return ARMS.find((a) => a.id === id)
}

export const ENTITY_CARD_ARMS = ARMS.filter((a) => a.entityCard != null)
