import { describe, it, expect } from 'vitest'
import { routeArm } from '@/lib/arm-routing'

describe('routeArm', () => {
  it('routes Credit + Capital Access → ARM 2 regardless of Q3/Q4', () => {
    expect(routeArm('Credit + Capital Access', 'Land more clients', 'DIY with tools')).toBe(2)
    expect(routeArm('Credit + Capital Access', 'Build brand authority', 'Full delegation')).toBe(2)
  })

  it('routes Brand + Visibility → ARM 1 regardless of Q3/Q4', () => {
    expect(routeArm('Brand + Visibility', 'Land more clients', 'DIY with tools')).toBe(1)
    expect(routeArm('Brand + Visibility', 'Build systems + team', 'Full delegation')).toBe(1)
  })

  it('routes Revenue + Sales + Fix credit → ARM 3', () => {
    expect(routeArm('Revenue + Sales', 'Fix credit / access capital', 'DIY with tools')).toBe(3)
    expect(routeArm('Revenue + Sales', 'Fix credit / access capital', 'Full delegation')).toBe(3)
  })

  it('routes Revenue + Sales + Land more clients + Full delegation → ARM 4', () => {
    expect(routeArm('Revenue + Sales', 'Land more clients', 'Full delegation')).toBe(4)
  })

  it('routes Revenue + Sales + Land more clients + DIY/Guided → ARM 1', () => {
    expect(routeArm('Revenue + Sales', 'Land more clients', 'DIY with tools')).toBe(1)
    expect(routeArm('Revenue + Sales', 'Land more clients', 'Guided coaching')).toBe(1)
  })

  it('routes Infrastructure + Scale + Land more clients → ARM 4', () => {
    expect(routeArm('Infrastructure + Scale', 'Land more clients', 'Done-with-you')).toBe(4)
    expect(routeArm('Infrastructure + Scale', 'Land more clients', 'DIY with tools')).toBe(4)
  })

  it('routes Infrastructure + Scale + Build systems + DIY/Guided → ARM 5', () => {
    expect(routeArm('Infrastructure + Scale', 'Build systems + team', 'DIY with tools')).toBe(5)
    expect(routeArm('Infrastructure + Scale', 'Build systems + team', 'Guided coaching')).toBe(5)
  })

  it('routes Infrastructure + Scale + Build systems + Done-with-you/Full delegation → ARM 6', () => {
    expect(routeArm('Infrastructure + Scale', 'Build systems + team', 'Done-with-you')).toBe(6)
    expect(routeArm('Infrastructure + Scale', 'Build systems + team', 'Full delegation')).toBe(6)
  })

  it('returns ARM 7 as default fallback for unmatched combinations', () => {
    expect(routeArm('Revenue + Sales', 'Build brand authority', 'DIY with tools')).toBe(7)
    expect(routeArm('Infrastructure + Scale', 'Fix credit / access capital', 'Full delegation')).toBe(7)
    expect(routeArm('Revenue + Sales', 'Build systems + team', 'Done-with-you')).toBe(7)
  })
})
