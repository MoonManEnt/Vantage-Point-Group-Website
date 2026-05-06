import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { ArmIndexGrid } from '@/components/arms/ArmIndexGrid'
import { ARMS } from '@/lib/arm-data'

describe('ArmIndexGrid', () => {
  it('renders all 10 ARM names', () => {
    render(<ArmIndexGrid arms={ARMS} />)
    ARMS.forEach((arm) => {
      expect(screen.getByText(arm.name)).toBeInTheDocument()
    })
  })

  it('renders 10 Explore links pointing to correct slugs', () => {
    render(<ArmIndexGrid arms={ARMS} />)
    ARMS.forEach((arm) => {
      const link = screen.getByRole('link', { name: new RegExp(`explore ${arm.entity}`, 'i') })
      expect(link).toHaveAttribute('href', `/arms/${arm.slug}`)
    })
  })

  it('renders each ARM descriptor', () => {
    render(<ArmIndexGrid arms={ARMS} />)
    expect(screen.getByText(ARMS[0]!.descriptor)).toBeInTheDocument()
  })
})
