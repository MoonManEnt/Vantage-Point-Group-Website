import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import EventsSection from '@/components/sections/EventsSection'

describe('EventsSection', () => {
  it('renders the MONTHLY label', () => {
    render(<EventsSection />)
    expect(screen.getByText('MONTHLY')).toBeInTheDocument()
  })

  it('renders the VPG Power Hour heading', () => {
    render(<EventsSection />)
    expect(screen.getByRole('heading', { name: 'VPG Power Hour' })).toBeInTheDocument()
  })

  it('renders the Power Hour body copy', () => {
    render(<EventsSection />)
    expect(
      screen.getByText(/Live monthly Q&A with the VPG team/),
    ).toBeInTheDocument()
  })

  it('renders Register CTA linking to /events#power-hour', () => {
    render(<EventsSection />)
    const link = screen.getByRole('link', { name: /Register/i })
    expect(link).toHaveAttribute('href', '/events#power-hour')
  })

  it('renders the ANNUAL label', () => {
    render(<EventsSection />)
    expect(screen.getByText('ANNUAL')).toBeInTheDocument()
  })

  it('renders VPG Summit event entry', () => {
    render(<EventsSection />)
    expect(screen.getByText('VPG Summit')).toBeInTheDocument()
    expect(screen.getByText('Q4 · Dallas TX')).toBeInTheDocument()
  })

  it('renders IPA Partner Summit event entry', () => {
    render(<EventsSection />)
    expect(screen.getByText('IPA Partner Summit')).toBeInTheDocument()
    expect(screen.getByText('Q2 · Dallas TX')).toBeInTheDocument()
  })

  it('renders View All Events CTA linking to /events', () => {
    render(<EventsSection />)
    const link = screen.getByRole('link', { name: /View All Events/i })
    expect(link).toHaveAttribute('href', '/events')
  })
})
