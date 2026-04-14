import { describe, it, expect } from 'vitest'
import { ARMS, getArmBySlug, getArmById, ENTITY_CARD_ARMS } from '@/lib/arm-data'

describe('arm-data', () => {
  it('has exactly 10 ARMs', () => {
    expect(ARMS).toHaveLength(10)
  })

  it('every ARM has required fields with correct types', () => {
    for (const arm of ARMS) {
      expect(arm.id, `ARM ${arm.id} missing id`).toBeTypeOf('number')
      expect(arm.name, `ARM ${arm.id} missing name`).toBeTypeOf('string')
      expect(arm.slug, `ARM ${arm.id} missing slug`).toBeTypeOf('string')
      expect(arm.color, `ARM ${arm.id} missing color`).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(arm.descriptor, `ARM ${arm.id} missing descriptor`).toBeTypeOf('string')
      expect(arm.hoverCopy, `ARM ${arm.id} missing hoverCopy`).toBeTypeOf('string')
      expect(arm.entity, `ARM ${arm.id} missing entity`).toBeTypeOf('string')
    }
  })

  it('all slugs are unique', () => {
    const slugs = ARMS.map((a) => a.slug)
    expect(new Set(slugs).size).toBe(10)
  })

  it('all IDs are 1–10 with no duplicates', () => {
    const ids = ARMS.map((a) => a.id).sort((a, b) => a - b)
    expect(ids).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('getArmBySlug returns correct arm', () => {
    const arm = getArmBySlug('dispute2go')
    expect(arm?.id).toBe(2)
  })

  it('getArmById returns correct arm', () => {
    const arm = getArmById(7)
    expect(arm?.slug).toBe('integrity-partner-alliance')
  })

  it('getArmBySlug returns undefined for unknown slug', () => {
    expect(getArmBySlug('nonexistent')).toBeUndefined()
  })

  it('ENTITY_CARD_ARMS has exactly 3 items (VPM, D2G, IPA)', () => {
    expect(ENTITY_CARD_ARMS).toHaveLength(3)
    const ids = ENTITY_CARD_ARMS.map((a) => a.id)
    expect(ids).toContain(1)
    expect(ids).toContain(2)
    expect(ids).toContain(7)
  })
})
