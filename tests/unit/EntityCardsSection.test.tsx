import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import EntityCardsSection from '@/components/sections/EntityCardsSection'

describe('EntityCardsSection', () => {
  it('renders the section label FEATURED ENTITIES', () => {
    render(<EntityCardsSection />)
    expect(screen.getByText('FEATURED ENTITIES')).toBeInTheDocument()
  })

  it('renders the VPM entity label', () => {
    render(<EntityCardsSection />)
    expect(screen.getByText('VPM')).toBeInTheDocument()
  })

  it('renders the D2G entity label', () => {
    render(<EntityCardsSection />)
    expect(screen.getByText('D2G')).toBeInTheDocument()
  })

  it('renders the IPA entity label', () => {
    render(<EntityCardsSection />)
    expect(screen.getByText('IPA')).toBeInTheDocument()
  })

  it('renders the VPM entity name', () => {
    render(<EntityCardsSection />)
    expect(screen.getByText('Vantage Point Media')).toBeInTheDocument()
  })

  it('renders the D2G entity name', () => {
    render(<EntityCardsSection />)
    expect(screen.getByText('Dispute2Go')).toBeInTheDocument()
  })

  it('renders the IPA entity name', () => {
    render(<EntityCardsSection />)
    expect(screen.getByText('Integrity Partner Alliance')).toBeInTheDocument()
  })

  it('renders all 3 CTA links with correct hrefs', () => {
    render(<EntityCardsSection />)
    const vpmLink = screen.getByRole('link', { name: /Explore VPM/i })
    expect(vpmLink).toHaveAttribute('href', '/arms/vantage-point-media')
    const d2gLink = screen.getByRole('link', { name: /Explore D2G/i })
    expect(d2gLink).toHaveAttribute('href', '/arms/dispute2go')
    const ipaLink = screen.getByRole('link', { name: /Become a Partner/i })
    expect(ipaLink).toHaveAttribute('href', '/partners')
  })

  it('renders all 3 entity card descriptions', () => {
    render(<EntityCardsSection />)
    expect(
      screen.getByText(/Brand strategy, content production/),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/AI-native credit dispute platform/),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/The referral network that compounds/),
    ).toBeInTheDocument()
  })
})
