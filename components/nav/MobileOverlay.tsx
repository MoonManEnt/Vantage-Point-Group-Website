'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ARMS } from '@/lib/arm-data'
import { Button } from '@/components/ui/Button'

interface MobileOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileOverlay({ isOpen, onClose }: MobileOverlayProps) {
  const onCloseRef = useRef(onClose)
  useEffect(() => { onCloseRef.current = onClose })

  // Scroll lock
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      aria-hidden={!isOpen}
      className={[
        'fixed inset-0 z-[100]',
        'bg-[var(--color-navy)]',
        'flex flex-col',
        'transition-transform duration-300',
        isOpen ? 'translate-x-0' : 'translate-x-full',
      ].join(' ')}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(245,240,232,0.1)]">
        <span className="text-[var(--color-parchment)] text-[11px] font-semibold tracking-[0.2em] uppercase">
          Menu
        </span>
        <button
          aria-label="Close menu"
          tabIndex={isOpen ? undefined : -1}
          onClick={onClose}
          className="flex items-center justify-center w-8 h-8 text-[var(--color-parchment)]
                     hover:text-white transition-colors duration-150"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* ARM list */}
        <p className="text-[var(--color-gold)] text-[9px] font-semibold tracking-[0.2em] uppercase mb-3">
          The Portfolio
        </p>
        <nav aria-label="ARM links">
          {ARMS.map((arm) => (
            <Link
              key={arm.id}
              href={`/arms/${arm.slug}`}
              tabIndex={isOpen ? undefined : -1}
              onClick={onClose}
              className="flex items-start gap-3 py-3 border-b border-[rgba(245,240,232,0.06)]
                         hover:border-[rgba(245,240,232,0.2)] transition-colors duration-150"
            >
              <span
                className="mt-0.5 text-[8px] font-bold tracking-[0.2em] uppercase shrink-0 w-10"
                style={{ color: arm.color }}
              >
                ARM {arm.id}
              </span>
              <div>
                <p className="text-[var(--color-parchment)] text-[12px] font-semibold">
                  {arm.name}
                </p>
                <p className="text-[rgba(245,240,232,0.4)] text-[9px] mt-0.5">{arm.descriptor}</p>
              </div>
            </Link>
          ))}
        </nav>

        {/* Secondary nav */}
        <nav aria-label="Secondary links" className="mt-6 flex flex-col gap-1">
          {[
            { label: 'Partners', href: '/partners' },
            { label: 'The Kraken Method', href: '/kraken-method' },
            { label: 'Events', href: '/events' },
            { label: 'About', href: '/about' },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              tabIndex={isOpen ? undefined : -1}
              onClick={onClose}
              className="text-[rgba(245,240,232,0.6)] text-[11px] tracking-[0.1em] uppercase
                         py-2 hover:text-[var(--color-parchment)] transition-colors duration-150"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 py-5 border-t border-[rgba(245,240,232,0.1)]">
        <Button
          tier="primary"
          href="#arm-quiz"
          tabIndex={isOpen ? undefined : -1}
          className="w-full justify-center"
        >
          Find Your ARM
        </Button>
      </div>
    </div>
  )
}
