'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ARMS } from '@/lib/arm-data'

interface MegaMenuProps {
  isOpen: boolean
  onClose?: () => void
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  useEffect(() => { onCloseRef.current = onClose })

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current?.()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onCloseRef.current?.()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen])

  return (
    <div
      ref={containerRef}
      role="menu"
      aria-hidden={!isOpen}
      className={[
        'absolute top-full left-0 right-0',
        'bg-[var(--color-navy)] border-t border-[rgba(245,240,232,0.1)]',
        'transition-all duration-150 ease-out',
        isOpen
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-2 pointer-events-none',
      ].join(' ')}
    >
      <div className="max-w-7xl mx-auto px-8 py-6">
        <p className="text-[var(--color-gold)] text-[9px] font-semibold tracking-[0.2em] uppercase mb-4">
          The Portfolio
        </p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-0">
          {ARMS.map((arm) => (
            <Link
              key={arm.id}
              href={`/arms/${arm.slug}`}
              role="menuitem"
              aria-label={`ARM ${arm.id}: ${arm.name}`}
              tabIndex={isOpen ? undefined : -1}
              className="group flex items-start gap-3 py-2.5 border-b border-[rgba(245,240,232,0.05)]
                         hover:border-[rgba(245,240,232,0.2)] transition-colors duration-150"
              {...(onClose ? { onClick: onClose } : {})}
            >
              <span
                className="mt-0.5 text-[8px] font-bold tracking-[0.2em] uppercase shrink-0 w-10"
                style={{ color: arm.color }}
              >
                ARM {arm.id}
              </span>
              <div>
                <p className="text-[var(--color-parchment)] text-[11px] font-semibold
                              group-hover:text-white transition-colors duration-150">
                  {arm.name}
                </p>
                <p className="text-[rgba(245,240,232,0.4)] text-[9px] mt-0.5">{arm.descriptor}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
