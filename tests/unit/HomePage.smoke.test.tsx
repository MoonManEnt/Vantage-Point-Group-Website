import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import HomePage from '@/app/page'

vi.mock('@/components/hero/HeroSection', () => ({
  default: () => <div data-testid="hero-section" />,
}))
vi.mock('@/components/quiz/ARMQuizSection', () => ({
  default: () => <div data-testid="arm-quiz-section" />,
}))
vi.mock('@/components/sections/ArmBentoSection', () => ({
  default: () => <div data-testid="arm-bento-section" />,
}))
vi.mock('@/components/sections/KrakenMethodSection', () => ({
  default: () => <div data-testid="kraken-method-section" />,
}))
vi.mock('@/components/sections/EntityCardsSection', () => ({
  default: () => <div data-testid="entity-cards-section" />,
}))
vi.mock('@/components/sections/MissionSection', () => ({
  default: () => <div data-testid="mission-section" />,
}))
vi.mock('@/components/sections/IpaStrip', () => ({
  default: () => <div data-testid="ipa-strip" />,
}))
vi.mock('@/components/sections/EventsSection', () => ({
  default: () => <div data-testid="events-section" />,
}))
vi.mock('@/components/sections/SiteFooter', () => ({
  default: () => <div data-testid="site-footer" />,
}))

describe('HomePage smoke test', () => {
  it('renders all 9 sections', () => {
    render(<HomePage />)
    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
    expect(screen.getByTestId('arm-quiz-section')).toBeInTheDocument()
    expect(screen.getByTestId('arm-bento-section')).toBeInTheDocument()
    expect(screen.getByTestId('kraken-method-section')).toBeInTheDocument()
    expect(screen.getByTestId('entity-cards-section')).toBeInTheDocument()
    expect(screen.getByTestId('mission-section')).toBeInTheDocument()
    expect(screen.getByTestId('ipa-strip')).toBeInTheDocument()
    expect(screen.getByTestId('events-section')).toBeInTheDocument()
    expect(screen.getByTestId('site-footer')).toBeInTheDocument()
  })
})
