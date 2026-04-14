import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MegaMenu } from '@/components/nav/MegaMenu'

describe('MegaMenu', () => {
  it('is hidden by default', () => {
    render(<MegaMenu isOpen={false} />)
    const menu = screen.getByRole('menu', { hidden: true })
    expect(menu).toHaveAttribute('aria-hidden', 'true')
  })

  it('shows all 10 ARM entries when open', () => {
    render(<MegaMenu isOpen={true} />)
    expect(screen.getByText('Vantage Point Media')).toBeInTheDocument()
    expect(screen.getByText('Dispute2Go')).toBeInTheDocument()
    expect(screen.getByText('VPG Global Expansion')).toBeInTheDocument()
    const items = screen.getAllByRole('menuitem')
    expect(items).toHaveLength(10)
  })

  it('each ARM links to its correct slug path', () => {
    render(<MegaMenu isOpen={true} />)
    const d2gLink = screen.getByRole('menuitem', { name: /dispute2go/i })
    expect(d2gLink).toHaveAttribute('href', '/arms/dispute2go')
  })

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn()
    render(<MegaMenu isOpen={true} onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when clicking outside the menu', () => {
    const onClose = vi.fn()
    render(
      <div>
        <MegaMenu isOpen={true} onClose={onClose} />
        <button data-testid="outside">outside</button>
      </div>
    )
    fireEvent.mouseDown(screen.getByTestId('outside'))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
