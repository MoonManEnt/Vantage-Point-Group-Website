'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import type { Arm } from '@/lib/arm-data'

interface ArmBentoGridProps {
  arms: Arm[]
}

export function ArmBentoGrid({ arms }: ArmBentoGridProps) {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        gridRef.current ? Array.from(gridRef.current.children) : [],
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 70%',
          },
        },
      )
    })

    return () => ctx.revert()
  }, [])

  function handleEnter(e: React.MouseEvent<HTMLAnchorElement>, arm: Arm) {
    const el = e.currentTarget
    el.style.borderColor = `${arm.color}CC`
    el.style.transform = 'translateY(-3px)'
    const nameEl = el.querySelector<HTMLElement>('[data-arm-name]')
    if (nameEl) nameEl.style.color = arm.color
    const hoverEl = el.querySelector<HTMLElement>('[data-hover-copy]')
    if (hoverEl) hoverEl.style.maxHeight = '60px'
  }

  function handleLeave(e: React.MouseEvent<HTMLAnchorElement>, arm: Arm) {
    const el = e.currentTarget
    el.style.borderColor = `${arm.color}4D`
    el.style.transform = 'translateY(0)'
    const nameEl = el.querySelector<HTMLElement>('[data-arm-name]')
    if (nameEl) nameEl.style.color = 'var(--color-parchment)'
    const hoverEl = el.querySelector<HTMLElement>('[data-hover-copy]')
    if (hoverEl) hoverEl.style.maxHeight = '0px'
  }

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2"
    >
      {arms.map((arm) => (
        <Link
          key={arm.id}
          href={`/arms/${arm.slug}`}
          aria-label={arm.name}
          onMouseEnter={(e) => handleEnter(e, arm)}
          onMouseLeave={(e) => handleLeave(e, arm)}
          style={{
            background: '#0D1B2A',
            border: `1px solid ${arm.color}4D`,
            borderRadius: '6px',
            padding: '14px',
            display: 'block',
            transition: 'border-color 0.2s, transform 0.2s',
          }}
        >
          <p
            style={{
              color: arm.color,
              fontSize: '9px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '4px',
            }}
          >
            ARM {arm.id}
          </p>
          <p
            data-arm-name
            style={{
              fontFamily: 'var(--font-clash)',
              fontWeight: 600,
              fontSize: '12px',
              color: 'var(--color-parchment)',
              marginBottom: '4px',
              transition: 'color 0.2s',
            }}
          >
            {arm.name}
          </p>
          <p
            style={{
              fontSize: '9px',
              color: 'rgba(245,240,232,0.5)',
              lineHeight: 1.4,
            }}
          >
            {arm.descriptor}
          </p>
          <p
            data-hover-copy
            style={{
              fontSize: '9px',
              color: 'var(--color-parchment)',
              lineHeight: 1.4,
              maxHeight: '0px',
              overflow: 'hidden',
              transition: 'max-height 0.25s ease',
              marginTop: '6px',
            }}
          >
            {arm.hoverCopy}
          </p>
        </Link>
      ))}
    </div>
  )
}
