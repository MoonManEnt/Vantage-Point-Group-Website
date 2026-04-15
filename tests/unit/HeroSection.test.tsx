import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import HeroSection from '@/components/hero/HeroSection'

// Mock GSAP — context must call its callback so useEffect code runs
vi.mock('@/lib/gsap', () => ({
  gsap: {
    context: vi.fn().mockImplementation((fn: () => void) => {
      if (typeof fn === 'function') fn()
      return { revert: vi.fn() }
    }),
    set: vi.fn(),
    timeline: vi.fn(() => ({ to: vi.fn().mockReturnThis() })),
    to: vi.fn(() => ({ kill: vi.fn() })),
  },
  ScrollTrigger: {
    create: vi.fn(),
  },
}))

// Mock next/image — renders a plain <img> in tests
vi.mock('next/image', () => ({
  default: ({ alt, src, ...props }: { alt: string; src: string; [key: string]: unknown }) => (
    <img alt={alt} src={src} {...(props as React.ImgHTMLAttributes<HTMLImageElement>)} />
  ),
}))

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  })
})

describe('HeroSection', () => {
  it('renders all three headline lines', () => {
    render(<HeroSection />)
    expect(screen.getByText('Serious Builders.')).toBeInTheDocument()
    expect(screen.getByText(/Purpose\./)).toBeInTheDocument()
    expect(screen.getByText('Ten Movements Forward.')).toBeInTheDocument()
  })

  it('"Kingdom" text is rendered inside the headline', () => {
    render(<HeroSection />)
    expect(screen.getByText('Kingdom')).toBeInTheDocument()
  })

  it('CTA button links to #arm-quiz', () => {
    render(<HeroSection />)
    const cta = screen.getByRole('link', { name: /find your arm/i })
    expect(cta).toHaveAttribute('href', '#arm-quiz')
  })

  it('Mosaic V image has descriptive alt text', () => {
    render(<HeroSection />)
    expect(screen.getByAltText('Mosaic V — VPG brand mark')).toBeInTheDocument()
  })

  it('ParticleField wrapper is aria-hidden', () => {
    render(<HeroSection />)
    const hidden = document.querySelector('[aria-hidden="true"]')
    expect(hidden).toBeInTheDocument()
  })
})
