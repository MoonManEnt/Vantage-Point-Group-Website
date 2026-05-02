import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import IpaStrip from '@/components/sections/IpaStrip'

describe('IpaStrip', () => {
  it('renders the INTEGRITY PARTNER ALLIANCE label', () => {
    render(<IpaStrip />)
    expect(screen.getByText('INTEGRITY PARTNER ALLIANCE')).toBeInTheDocument()
  })

  it('renders the h2 headline', () => {
    render(<IpaStrip />)
    expect(
      screen.getByRole('heading', { name: 'Every arm you activate earns.' }),
    ).toBeInTheDocument()
  })

  it('renders the body copy', () => {
    render(<IpaStrip />)
    expect(screen.getByText(/Join the IPA and build a referral income stream/)).toBeInTheDocument()
  })

  it('renders the BECOME A PARTNER CTA linking to /partners', () => {
    render(<IpaStrip />)
    const cta = screen.getByRole('link', { name: /BECOME A PARTNER/i })
    expect(cta).toHaveAttribute('href', '/partners')
  })
})
