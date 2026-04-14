import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MosaicV } from '@/components/ui/MosaicV'

describe('MosaicV', () => {
  it('renders an SVG with accessible label when aria-label provided', () => {
    render(<MosaicV lockup="mark" aria-label="Vantage Point Group logo" />)
    const svg = screen.getByRole('img', { name: /vantage point group logo/i })
    expect(svg).toBeInTheDocument()
  })

  it('applies size prop as width and height', () => {
    const { container } = render(<MosaicV lockup="mark" size={40} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '40')
    expect(svg).toHaveAttribute('height', '40')
  })

  it('renders wordmark text in horizontal lockup', () => {
    const { container } = render(<MosaicV lockup="horizontal" />)
    expect(container.textContent).toContain('VANTAGE POINT GROUP')
  })

  it('is decorative (aria-hidden) when no label provided', () => {
    const { container } = render(<MosaicV lockup="mark" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })
})
