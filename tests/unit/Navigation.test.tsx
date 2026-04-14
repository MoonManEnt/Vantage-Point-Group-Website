import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Navigation } from '@/components/nav/Navigation'

// Mock GSAP — not available in jsdom
vi.mock('@/lib/gsap', () => ({
  gsap: { to: vi.fn(), fromTo: vi.fn() },
  ScrollTrigger: { create: vi.fn() },
}))

describe('Navigation', () => {
  it('renders the Vantage Point Group logo link', () => {
    render(<Navigation />)
    const logoLink = screen.getByRole('link', { name: /vantage point group/i })
    expect(logoLink).toHaveAttribute('href', '/')
  })

  it('renders all 5 main nav items', () => {
    render(<Navigation />)
    expect(screen.getByRole('button', { name: /portfolio/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /partners/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /the kraken method/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /events/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
  })

  it('opens mega menu when Portfolio button is clicked', () => {
    render(<Navigation />)
    const portfolioBtn = screen.getByRole('button', { name: /portfolio/i })
    fireEvent.click(portfolioBtn)
    const menu = screen.getByRole('menu')
    expect(menu).toHaveAttribute('aria-hidden', 'false')
  })

  it('shows hamburger button', () => {
    render(<Navigation />)
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument()
  })
})
