import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ARMQuiz } from '@/components/quiz/ARMQuiz'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

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

vi.mock('@/components/quiz/QuizResult', () => ({
  QuizResult: ({ armId }: { armId: number }) => (
    <div data-testid="quiz-result">ARM {armId}</div>
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
  global.fetch = vi.fn().mockResolvedValue(
    new Response(JSON.stringify({ ok: true }), { status: 200 }),
  )
})

describe('ARMQuiz', () => {
  it('renders the first question on mount', () => {
    render(<ARMQuiz />)
    expect(screen.getByText(/What best describes your biggest obstacle/)).toBeInTheDocument()
  })

  it('shows QUESTION 1 OF 4 progress indicator on mount', () => {
    render(<ARMQuiz />)
    expect(screen.getByText('QUESTION 1 OF 4')).toBeInTheDocument()
  })

  it('renders all 4 options for question 1', () => {
    render(<ARMQuiz />)
    expect(screen.getByText('Revenue + Sales')).toBeInTheDocument()
    expect(screen.getByText('Credit + Capital Access')).toBeInTheDocument()
    expect(screen.getByText('Brand + Visibility')).toBeInTheDocument()
    expect(screen.getByText('Infrastructure + Scale')).toBeInTheDocument()
  })

  it('advances to question 2 after a Q1 option is clicked', async () => {
    render(<ARMQuiz />)
    await userEvent.click(screen.getByText('Revenue + Sales'))
    expect(screen.getByText('QUESTION 2 OF 4')).toBeInTheDocument()
    expect(screen.getByText(/What stage is your business/)).toBeInTheDocument()
  })

  it('shows the result screen after all 4 questions are answered', async () => {
    render(<ARMQuiz />)
    await userEvent.click(screen.getByText('Revenue + Sales'))
    await userEvent.click(screen.getByText('Scaling ($500K–$5M)'))
    await userEvent.click(screen.getByText('Land more clients'))
    await userEvent.click(screen.getByText('DIY with tools'))
    expect(screen.getByTestId('quiz-result')).toBeInTheDocument()
    // routeArm('Revenue + Sales', 'Land more clients', 'DIY with tools') = 1
    expect(screen.getByText('ARM 1')).toBeInTheDocument()
  })

  it('routes Credit + Capital Access to ARM 2', async () => {
    render(<ARMQuiz />)
    await userEvent.click(screen.getByText('Credit + Capital Access'))
    await userEvent.click(screen.getByText('Just starting ($0–$50K)'))
    await userEvent.click(screen.getByText('Fix credit / access capital'))
    await userEvent.click(screen.getByText('DIY with tools'))
    // routeArm('Credit + Capital Access', 'Fix credit / access capital', 'DIY with tools') = 2
    expect(screen.getByText('ARM 2')).toBeInTheDocument()
  })
})
