import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { KrakenPrinciples } from '@/components/sections/KrakenPrinciples'

vi.mock('@/lib/gsap', () => ({
  gsap: {
    context: vi.fn().mockImplementation((fn: () => void) => {
      if (typeof fn === 'function') fn()
      return { revert: vi.fn() }
    }),
    fromTo: vi.fn(),
  },
  ScrollTrigger: { create: vi.fn() },
}))

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false, media: query,
      addEventListener: vi.fn(), removeEventListener: vi.fn(),
    })),
  })
})

describe('KrakenPrinciples', () => {
  it('renders all 6 principle numbers', () => {
    render(<KrakenPrinciples />)
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('02')).toBeInTheDocument()
    expect(screen.getByText('03')).toBeInTheDocument()
    expect(screen.getByText('04')).toBeInTheDocument()
    expect(screen.getByText('05')).toBeInTheDocument()
    expect(screen.getByText('06')).toBeInTheDocument()
  })

  it('renders all 6 principle names', () => {
    render(<KrakenPrinciples />)
    expect(screen.getByText("Position Don't Chase")).toBeInTheDocument()
    expect(screen.getByText('Extend Simultaneously')).toBeInTheDocument()
    expect(screen.getByText('Capture Through Contact')).toBeInTheDocument()
    expect(screen.getByText('Every Arm Feeds the Body')).toBeInTheDocument()
    expect(screen.getByText('Depth Before Breadth')).toBeInTheDocument()
    expect(screen.getByText('Body Is the Differentiator')).toBeInTheDocument()
  })

  it('renders all 6 principle descriptors', () => {
    render(<KrakenPrinciples />)
    expect(screen.getByText('Authority through positioning')).toBeInTheDocument()
    expect(screen.getByText('All arms move at once')).toBeInTheDocument()
    expect(screen.getByText('Sustained engagement converts')).toBeInTheDocument()
    expect(screen.getByText('Cross-referral as reflex')).toBeInTheDocument()
    expect(screen.getByText('Master a market before expanding')).toBeInTheDocument()
    expect(screen.getByText('The system is the advantage')).toBeInTheDocument()
  })

  it('renders exactly 6 principle cards', () => {
    const { container } = render(<KrakenPrinciples />)
    const cards = container.querySelectorAll('[data-principle-card]')
    expect(cards.length).toBe(6)
  })
})
