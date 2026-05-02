import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import ArmBentoSection from '@/components/sections/ArmBentoSection'

vi.mock('@/components/sections/ArmBentoGrid', () => ({
  ArmBentoGrid: () => <div data-testid="arm-bento-grid" />,
}))

describe('ArmBentoSection', () => {
  it('renders section label THE PORTFOLIO', () => {
    render(<ArmBentoSection />)
    expect(screen.getByText('THE PORTFOLIO')).toBeInTheDocument()
  })

  it('renders the h2 headline', () => {
    render(<ArmBentoSection />)
    expect(
      screen.getByText('Ten Arms. One Body. Every angle covered.'),
    ).toBeInTheDocument()
  })

  it('renders the subheadline', () => {
    render(<ArmBentoSection />)
    expect(
      screen.getByText('Each ARM operates independently. All of them feed the body.'),
    ).toBeInTheDocument()
  })

  it('renders the ArmBentoGrid child', () => {
    render(<ArmBentoSection />)
    expect(screen.getByTestId('arm-bento-grid')).toBeInTheDocument()
  })
})
