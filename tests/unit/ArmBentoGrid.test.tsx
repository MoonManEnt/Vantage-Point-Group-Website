import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { ArmBentoGrid } from '@/components/sections/ArmBentoGrid'
import { ARMS } from '@/lib/arm-data'

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

describe('ArmBentoGrid', () => {
  it('renders all 10 ARM cards', () => {
    render(<ArmBentoGrid arms={ARMS} />)
    ARMS.forEach((arm) => {
      expect(screen.getByText(`ARM ${arm.id}`)).toBeInTheDocument()
    })
  })

  it('renders each ARM name', () => {
    render(<ArmBentoGrid arms={ARMS} />)
    ARMS.forEach((arm) => {
      expect(screen.getByText(arm.name)).toBeInTheDocument()
    })
  })

  it('renders each ARM descriptor', () => {
    render(<ArmBentoGrid arms={ARMS} />)
    ARMS.forEach((arm) => {
      expect(screen.getByText(arm.descriptor)).toBeInTheDocument()
    })
  })

  it('each card is a link to /arms/{slug}', () => {
    render(<ArmBentoGrid arms={ARMS} />)
    ARMS.forEach((arm) => {
      const link = screen.getByRole('link', { name: new RegExp(arm.name, 'i') })
      expect(link).toHaveAttribute('href', `/arms/${arm.slug}`)
    })
  })

  it('renders hover copy text (initially hidden via max-h-0)', () => {
    render(<ArmBentoGrid arms={ARMS} />)
    const hoverEl = screen.getAllByText(ARMS[0]!.hoverCopy)
    expect(hoverEl.length).toBeGreaterThan(0)
  })
})
