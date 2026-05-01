import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ARMQuizSection from '@/components/quiz/ARMQuizSection'

vi.mock('@/components/quiz/ARMQuiz', () => ({
  ARMQuiz: () => <div data-testid="arm-quiz-widget" />,
}))

describe('ARMQuizSection', () => {
  it('renders the ARM ROUTING QUIZ label', () => {
    render(<ARMQuizSection />)
    expect(screen.getByText('ARM ROUTING QUIZ')).toBeInTheDocument()
  })

  it('renders the section headline', () => {
    render(<ARMQuizSection />)
    expect(screen.getByText("Where does your business stand?")).toBeInTheDocument()
  })

  it('renders the intro body copy', () => {
    render(<ARMQuizSection />)
    expect(screen.getByText(/4 questions/)).toBeInTheDocument()
  })

  it('renders the ARMQuiz widget', () => {
    render(<ARMQuizSection />)
    expect(screen.getByTestId('arm-quiz-widget')).toBeInTheDocument()
  })
})
