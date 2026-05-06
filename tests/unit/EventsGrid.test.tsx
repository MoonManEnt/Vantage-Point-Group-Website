import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { EventsGrid } from '@/components/events/EventsGrid'
import { GhlFormPlaceholder } from '@/components/events/GhlFormPlaceholder'

describe('EventsGrid', () => {
  it('renders both annual event names', () => {
    render(<EventsGrid />)
    expect(screen.getByText('VPG Summit')).toBeInTheDocument()
    expect(screen.getByText('IPA Partner Summit')).toBeInTheDocument()
  })

  it('renders Q4 and Q2 quarter labels', () => {
    render(<EventsGrid />)
    expect(screen.getByText(/Q4/)).toBeInTheDocument()
    expect(screen.getByText(/Q2/)).toBeInTheDocument()
  })

  it('renders Dallas TX location for both events', () => {
    render(<EventsGrid />)
    const locations = screen.getAllByText(/Dallas, TX/)
    expect(locations).toHaveLength(2)
  })
})

describe('GhlFormPlaceholder', () => {
  it('renders the label prop', () => {
    render(<GhlFormPlaceholder label="Reserve Your Spot" />)
    expect(screen.getByText('Reserve Your Spot')).toBeInTheDocument()
  })

  it('renders the fallback email link', () => {
    render(<GhlFormPlaceholder label="Reserve Your Spot" />)
    const link = screen.getByRole('link', { name: /email us/i })
    expect(link).toHaveAttribute('href', 'mailto:info@vantagepointgroup.com')
  })
})
