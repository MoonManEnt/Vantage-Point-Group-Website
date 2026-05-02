import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import MissionSection from '@/components/sections/MissionSection'

describe('MissionSection', () => {
  it('renders the OUR PURPOSE label', () => {
    render(<MissionSection />)
    expect(screen.getByText('OUR PURPOSE')).toBeInTheDocument()
  })

  it('renders the mission blockquote text', () => {
    render(<MissionSection />)
    expect(
      screen.getByText(/To give people who are serious about building/),
    ).toBeInTheDocument()
  })

  it('renders "actually do it" in emphasized text', () => {
    render(<MissionSection />)
    const strong = screen.getByText('actually do it')
    expect(strong.tagName).toBe('STRONG')
  })

  it('renders the proof bar stat 10 with label ACTIVE ARMS', () => {
    render(<MissionSection />)
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('ACTIVE ARMS')).toBeInTheDocument()
  })

  it('renders proof bar stat 5 with label MARKETS', () => {
    render(<MissionSection />)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('MARKETS')).toBeInTheDocument()
  })

  it('renders proof bar stat 26 with label FEDERAL STATUTES', () => {
    render(<MissionSection />)
    expect(screen.getByText('26')).toBeInTheDocument()
    expect(screen.getByText('FEDERAL STATUTES')).toBeInTheDocument()
  })

  it('renders proof bar stat IPA with label PARTNER NETWORK', () => {
    render(<MissionSection />)
    expect(screen.getByText('PARTNER NETWORK')).toBeInTheDocument()
  })
})
