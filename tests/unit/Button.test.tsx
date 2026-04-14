import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('renders primary tier', () => {
    render(<Button tier="primary">Find Your ARM</Button>)
    const btn = screen.getByRole('button', { name: /find your arm/i })
    expect(btn).toBeInTheDocument()
  })

  it('renders secondary tier as ghost (no background color inline)', () => {
    render(<Button tier="secondary">Enter</Button>)
    const btn = screen.getByRole('button', { name: /enter/i })
    expect(btn).toBeInTheDocument()
  })

  it('renders as anchor tag when href provided', () => {
    render(<Button tier="primary" href="/partners">Become a Partner</Button>)
    const link = screen.getByRole('link', { name: /become a partner/i })
    expect(link).toHaveAttribute('href', '/partners')
  })

  it('is disabled when disabled prop passed', () => {
    render(<Button tier="primary" disabled>Submit</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('applies entityColor as inline style for entity tier', () => {
    render(<Button tier="entity" entityColor="#3B6D11">Join IPA</Button>)
    const btn = screen.getByRole('button', { name: /join ipa/i })
    expect(btn.style.backgroundColor).toBe('rgb(59, 109, 17)')
  })
})
