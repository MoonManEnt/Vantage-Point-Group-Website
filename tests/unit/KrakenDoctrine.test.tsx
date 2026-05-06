import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { KrakenDoctrine } from '@/components/about/KrakenDoctrine'

describe('KrakenDoctrine', () => {
  it('renders 6 principle cards', () => {
    const { container } = render(<KrakenDoctrine />)
    const cards = container.querySelectorAll('[data-principle]')
    expect(cards).toHaveLength(6)
  })

  it('renders all 6 principle names', () => {
    render(<KrakenDoctrine />)
    expect(screen.getByText("Position Don't Chase")).toBeInTheDocument()
    expect(screen.getByText('Extend Simultaneously')).toBeInTheDocument()
    expect(screen.getByText('Capture Through Contact')).toBeInTheDocument()
    expect(screen.getByText('Every Arm Feeds the Body')).toBeInTheDocument()
    expect(screen.getByText('Depth Before Breadth')).toBeInTheDocument()
    expect(screen.getByText('Body Is the Differentiator')).toBeInTheDocument()
  })

  it('renders 7 decision filter items', () => {
    const { container } = render(<KrakenDoctrine />)
    const filters = container.querySelectorAll('[data-filter]')
    expect(filters).toHaveLength(7)
  })

  it('renders 6 anatomy items', () => {
    const { container } = render(<KrakenDoctrine />)
    const items = container.querySelectorAll('[data-anatomy]')
    expect(items).toHaveLength(6)
  })
})
