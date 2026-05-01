import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuizOption } from '@/components/quiz/QuizOption'

describe('QuizOption', () => {
  it('renders the option text', () => {
    render(<QuizOption text="Revenue + Sales" selected={false} onClick={vi.fn()} />)
    expect(screen.getByText('Revenue + Sales')).toBeInTheDocument()
  })

  it('has aria-pressed="true" when selected', () => {
    render(<QuizOption text="Revenue + Sales" selected={true} onClick={vi.fn()} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('has aria-pressed="false" when not selected', () => {
    render(<QuizOption text="Revenue + Sales" selected={false} onClick={vi.fn()} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<QuizOption text="Revenue + Sales" selected={false} onClick={onClick} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
