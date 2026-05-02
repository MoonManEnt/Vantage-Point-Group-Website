import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import SiteFooter from '@/components/sections/SiteFooter'
import { ARMS } from '@/lib/arm-data'

describe('SiteFooter', () => {
  it('renders VPG brand name', () => {
    render(<SiteFooter />)
    const vpgEls = screen.getAllByText('VPG')
    expect(vpgEls.length).toBeGreaterThan(0)
  })

  it('renders the tagline', () => {
    render(<SiteFooter />)
    expect(screen.getByText(/Faith-rooted/)).toBeInTheDocument()
    expect(screen.getByText(/Results-driven/)).toBeInTheDocument()
    expect(screen.getByText(/Built to last/)).toBeInTheDocument()
  })

  it('renders the PORTFOLIO column heading', () => {
    render(<SiteFooter />)
    expect(screen.getByText('PORTFOLIO')).toBeInTheDocument()
  })

  it('renders all 10 ARM name links in the portfolio column', () => {
    render(<SiteFooter />)
    ARMS.forEach((arm) => {
      const links = screen.getAllByRole('link', { name: arm.name })
      expect(links.length).toBeGreaterThan(0)
    })
  })

  it('renders ARM 1 link pointing to /arms/vantage-point-media', () => {
    render(<SiteFooter />)
    const links = screen.getAllByRole('link', { name: 'Vantage Point Media' })
    const portfolioLink = links.find((l) => l.getAttribute('href') === '/arms/vantage-point-media')
    expect(portfolioLink).toBeTruthy()
  })

  it('renders the ENTITIES column heading', () => {
    render(<SiteFooter />)
    expect(screen.getByText('ENTITIES')).toBeInTheDocument()
  })

  it('renders the Dispute2Go entity link pointing to /arms/dispute2go', () => {
    render(<SiteFooter />)
    const links = screen.getAllByRole('link', { name: 'Dispute2Go' })
    const d2gLink = links.find((l) => l.getAttribute('href') === '/arms/dispute2go')
    expect(d2gLink).toBeTruthy()
  })

  it('renders the IPA entity link pointing to /partners', () => {
    render(<SiteFooter />)
    const link = screen.getByRole('link', { name: 'IPA' })
    expect(link).toHaveAttribute('href', '/partners')
  })

  it('renders the COMPANY column heading', () => {
    render(<SiteFooter />)
    expect(screen.getByText('COMPANY')).toBeInTheDocument()
  })

  it('renders the copyright strip', () => {
    render(<SiteFooter />)
    expect(
      screen.getByText(/© 2026 Vantage Point Group/),
    ).toBeInTheDocument()
  })

  it('renders social links with correct aria-labels', () => {
    render(<SiteFooter />)
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Instagram' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'X' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'YouTube' })).toBeInTheDocument()
  })

  it('social links open in new tab with rel noopener', () => {
    render(<SiteFooter />)
    const linkedIn = screen.getByRole('link', { name: 'LinkedIn' })
    expect(linkedIn).toHaveAttribute('target', '_blank')
    expect(linkedIn).toHaveAttribute('rel', 'noopener')
  })
})
