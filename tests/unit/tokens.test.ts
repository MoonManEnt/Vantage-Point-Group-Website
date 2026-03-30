import { describe, it, expect } from 'vitest'
import * as fs from 'fs'

const REQUIRED_TOKENS = [
  '--color-orange',
  '--color-cyan',
  '--color-charcoal',
  '--color-green',
  '--color-gold',
  '--color-violet',
  '--color-navy',
  '--color-parchment',
  '--bg-base',
  '--bg-surface',
  '--bg-footer',
]

describe('Design tokens', () => {
  it('all required CSS tokens are defined in globals.css', () => {
    const css = fs.readFileSync('app/globals.css', 'utf8')
    for (const token of REQUIRED_TOKENS) {
      expect(css, `Missing token: ${token}`).toContain(token)
    }
  })

  it('font variable references are present in globals.css', () => {
    const css = fs.readFileSync('app/globals.css', 'utf8')
    expect(css).toContain('--font-clash')
    expect(css).toContain('--font-inter')
  })
})
