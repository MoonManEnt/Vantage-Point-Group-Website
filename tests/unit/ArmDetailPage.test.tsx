import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { ArmDetailHero } from '@/components/arms/ArmDetailHero'
import { CrossArmLinks } from '@/components/arms/CrossArmLinks'
import { ARMS } from '@/lib/arm-data'

const vpm = ARMS[0]!

describe('ArmDetailHero', () => {
  it('renders the ARM name as h1', () => {
    render(<ArmDetailHero arm={vpm} />)
    expect(screen.getByRole('heading', { level: 1, name: vpm.name })).toBeInTheDocument()
  })

  it('renders the ARM descriptor', () => {
    render(<ArmDetailHero arm={vpm} />)
    expect(screen.getByText(vpm.descriptor)).toBeInTheDocument()
  })

  it('renders the ARM number badge', () => {
    render(<ArmDetailHero arm={vpm} />)
    expect(screen.getByText('ARM 01')).toBeInTheDocument()
  })
})

describe('CrossArmLinks', () => {
  it('renders 9 links — all ARMs except the current one', () => {
    render(<CrossArmLinks currentSlug={vpm.slug} />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(9)
  })

  it('does not render a link for the current ARM', () => {
    render(<CrossArmLinks currentSlug={vpm.slug} />)
    expect(screen.queryByText(vpm.name)).not.toBeInTheDocument()
  })

  it('each sibling ARM links to its /arms/[slug] path', () => {
    render(<CrossArmLinks currentSlug={vpm.slug} />)
    const d2g = ARMS[1]!
    const link = screen.getByRole('link', { name: new RegExp(d2g.name, 'i') })
    expect(link).toHaveAttribute('href', `/arms/${d2g.slug}`)
  })
})
