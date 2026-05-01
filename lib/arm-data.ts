export interface Arm {
  id: number
  name: string
  slug: string
  entity: string
  color: string
  descriptor: string
  hoverCopy: string
  resultDescription: string
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
    resultDescription:
      'We build the content machine that makes you the authority in your market. Brand strategy, content production, and distribution — all three, working as one.',
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
    resultDescription:
      'AMELIA handles tri-bureau credit disputes using 26 federal statutes. AI-native, fully automated, and built to produce results.',
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
    resultDescription:
      'We build your capital stack from the ground up — credit stacking, lender-ready positioning, and funding strategy for scaling businesses.',
  },
  {
    id: 4,
    name: 'GTM & Sales Consulting',
    slug: 'gtm-consulting',
    entity: 'GTM',
    color: '#5B3FA8',
    descriptor: 'Sales · Revenue Strategy',
    hoverCopy: 'GTM architecture, pipeline design, and revenue execution for B2B.',
    resultDescription:
      'GTM architecture, pipeline design, and revenue execution for B2B. We build the system that makes your sales motion repeatable.',
  },
  {
    id: 5,
    name: 'VPG Academy',
    slug: 'vpg-academy',
    entity: 'Academy',
    color: '#3B6D11',
    descriptor: 'Education · Training',
    hoverCopy: 'The curriculum behind the Kraken. Learn, certify, execute.',
    resultDescription:
      'The curriculum behind the Kraken Method — learn the framework, earn the certification, and execute with our full playbook.',
  },
  {
    id: 6,
    name: 'VPG Ventures',
    slug: 'vpg-ventures',
    entity: 'Ventures',
    color: '#C9960C',
    descriptor: 'Equity · Portfolio Ops',
    hoverCopy: 'Co-invest, co-build, co-own. VPG Ventures takes equity positions.',
    resultDescription:
      'VPG Ventures takes equity positions in businesses we co-build. Co-invest, co-build, co-own — we\'re in it with you.',
  },
  {
    id: 7,
    name: 'Integrity Partner Alliance',
    slug: 'integrity-partner-alliance',
    entity: 'IPA',
    color: '#3B6D11',
    descriptor: 'Integrity Partner Alliance',
    hoverCopy: 'Refer once. Earn across all 10 arms. Build recurring income.',
    resultDescription:
      'The Integrity Partner Alliance compounds across all 10 ARMs. Refer once, earn recurring commission on every ARM you activate.',
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
    resultDescription:
      'AMELIA is the first ARM 8 product. More proprietary AI tools are in active development.',
  },
  {
    id: 9,
    name: 'VPG Influence & Public Affairs',
    slug: 'vpg-influence',
    entity: 'Influence',
    color: '#5B3FA8',
    descriptor: 'Advocacy · Public Affairs',
    hoverCopy: 'Narrative control, civic influence, and public positioning.',
    resultDescription:
      'Narrative control, civic influence, and public positioning for operators building lasting market authority.',
  },
  {
    id: 10,
    name: 'VPG Global Expansion',
    slug: 'vpg-global',
    entity: 'Global',
    color: '#E8541A',
    descriptor: 'International Markets',
    hoverCopy: "VPG's expansion playbook for operators ready to go global.",
    resultDescription:
      "VPG's expansion playbook for operators ready to take their model into international markets.",
  },
]

export function getArmBySlug(slug: string): Arm | undefined {
  return ARMS.find((a) => a.slug === slug)
}

export function getArmById(id: number): Arm | undefined {
  return ARMS.find((a) => a.id === id)
}

export const ENTITY_CARD_ARMS = ARMS.filter((a) => a.entityCard != null)
