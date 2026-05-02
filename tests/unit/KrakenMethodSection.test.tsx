import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import KrakenMethodSection from '@/components/sections/KrakenMethodSection'

vi.mock('@/components/sections/KrakenPrinciples', () => ({
  KrakenPrinciples: () => <div data-testid="kraken-principles" />,
}))

describe('KrakenMethodSection', () => {
  it('renders the section label THE OPERATING SYSTEM', () => {
    render(<KrakenMethodSection />)
    expect(screen.getByText('THE OPERATING SYSTEM')).toBeInTheDocument()
  })

  it('renders the h2 The Kraken Method', () => {
    render(<KrakenMethodSection />)
    expect(screen.getByRole('heading', { name: 'The Kraken Method' })).toBeInTheDocument()
  })

  it('renders the subhead body copy', () => {
    render(<KrakenMethodSection />)
    expect(
      screen.getByText(
        'The proprietary operating philosophy behind every VPG engagement. Six principles. Seven decision filters. One organism.',
      ),
    ).toBeInTheDocument()
  })

  it('renders the doctrine CTA link', () => {
    render(<KrakenMethodSection />)
    const cta = screen.getByRole('link', { name: /Read the Full Doctrine/i })
    expect(cta).toHaveAttribute('href', '/about/kraken-method')
  })

  it('renders the KrakenPrinciples child', () => {
    render(<KrakenMethodSection />)
    expect(screen.getByTestId('kraken-principles')).toBeInTheDocument()
  })
})
