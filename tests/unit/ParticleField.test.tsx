import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ParticleField } from '@/components/hero/ParticleField'

describe('ParticleField', () => {
  it('renders 14 particle spans by default', () => {
    const { container } = render(<ParticleField />)
    expect(container.querySelectorAll('span')).toHaveLength(14)
  })

  it('renders a custom count when count prop is passed', () => {
    const { container } = render(<ParticleField count={6} />)
    expect(container.querySelectorAll('span')).toHaveLength(6)
  })

  it('outer wrapper has aria-hidden="true"', () => {
    const { container } = render(<ParticleField />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })
})
