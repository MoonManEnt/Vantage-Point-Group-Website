import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MobileOverlay } from '@/components/nav/MobileOverlay'
import { ARMS } from '@/lib/arm-data'

describe('MobileOverlay', () => {
  it('is not visible when closed', () => {
    render(<MobileOverlay isOpen={false} onClose={() => {}} />)
    const overlay = screen.getByRole('dialog', { hidden: true })
    expect(overlay).toHaveAttribute('aria-hidden', 'true')
  })

  it('shows all 10 ARM names when open', () => {
    render(<MobileOverlay isOpen={true} onClose={() => {}} />)
    expect(screen.getByText('Dispute2Go')).toBeInTheDocument()
    expect(screen.getByText('VPG Global Expansion')).toBeInTheDocument()
    // Verify all ARM links rendered
    const armNav = screen.getByLabelText('ARM links')
    const armLinks = armNav.querySelectorAll('a')
    expect(armLinks).toHaveLength(ARMS.length)
    ARMS.forEach(arm => {
      expect(screen.queryAllByText(arm.name)).not.toHaveLength(0)
    })
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(<MobileOverlay isOpen={true} onClose={onClose} />)
    const closeBtn = screen.getByRole('button', { name: /close menu/i })
    fireEvent.click(closeBtn)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('has Find Your ARM CTA', () => {
    render(<MobileOverlay isOpen={true} onClose={() => {}} />)
    expect(screen.getByRole('link', { name: /find your arm/i })).toBeInTheDocument()
  })

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn()
    render(<MobileOverlay isOpen={true} onClose={onClose} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })
})
