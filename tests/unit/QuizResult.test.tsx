import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuizResult } from '@/components/quiz/QuizResult'

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
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  })
})

const defaultProps = {
  armId: 1,
  answers: { q1: 'Revenue + Sales', q2: 'Scaling ($500K–$5M)', q3: 'Land more clients', q4: 'DIY with tools' },
  onEmailSubmit: vi.fn(),
  onSkip: vi.fn(),
}

describe('QuizResult', () => {
  it('renders the ARM badge label', () => {
    render(<QuizResult {...defaultProps} />)
    expect(screen.getByText('ARM 1')).toBeInTheDocument()
  })

  it('renders the ARM name', () => {
    render(<QuizResult {...defaultProps} />)
    expect(screen.getByText('Vantage Point Media')).toBeInTheDocument()
  })

  it('renders the result description', () => {
    render(<QuizResult {...defaultProps} />)
    expect(screen.getByText(/We build the content machine/)).toBeInTheDocument()
  })

  it('renders the primary Explore CTA linking to the ARM page', () => {
    render(<QuizResult {...defaultProps} />)
    const cta = screen.getByRole('link', { name: /explore vantage point media/i })
    expect(cta).toHaveAttribute('href', '/arms/vantage-point-media')
  })

  it('renders the See all 10 ARMs link', () => {
    render(<QuizResult {...defaultProps} />)
    const link = screen.getByRole('link', { name: /see all 10 arms/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/arms')
  })

  it('renders the email input and submit button', () => {
    render(<QuizResult {...defaultProps} />)
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send my playbook/i })).toBeInTheDocument()
  })

  it('calls onEmailSubmit with trimmed email on form submit', async () => {
    const onEmailSubmit = vi.fn()
    render(<QuizResult {...defaultProps} onEmailSubmit={onEmailSubmit} />)
    await userEvent.type(screen.getByPlaceholderText('your@email.com'), 'test@example.com')
    await userEvent.click(screen.getByRole('button', { name: /send my playbook/i }))
    expect(onEmailSubmit).toHaveBeenCalledWith('test@example.com')
  })

  it('calls onSkip when the no thanks button is clicked', async () => {
    const onSkip = vi.fn()
    render(<QuizResult {...defaultProps} onSkip={onSkip} />)
    await userEvent.click(screen.getByRole('button', { name: /no thanks/i }))
    expect(onSkip).toHaveBeenCalledTimes(1)
  })
})
