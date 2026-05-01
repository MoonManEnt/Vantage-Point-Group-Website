// Q2 (business stage) is intentionally absent — stored for analytics but does not affect routing.
export function routeArm(q1: string, q3: string, q4: string): number {
  if (q1 === 'Credit + Capital Access') return 2
  if (q1 === 'Brand + Visibility') return 1

  if (q1 === 'Revenue + Sales') {
    if (q3 === 'Fix credit / access capital') return 3
    if (q3 === 'Land more clients') {
      return q4 === 'Full delegation' ? 4 : 1
    }
    return 7
  }

  if (q1 === 'Infrastructure + Scale') {
    if (q3 === 'Land more clients') return 4
    if (q3 === 'Build systems + team') {
      return q4 === 'DIY with tools' || q4 === 'Guided coaching' ? 5 : 6
    }
    return 7
  }

  return 7
}
