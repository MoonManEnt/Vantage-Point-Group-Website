'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

interface Principle {
  number: string
  name: string
  descriptor: string
  accent: string
}

const PRINCIPLES: Principle[] = [
  { number: '01', name: "Position Don't Chase", descriptor: 'Authority through positioning', accent: '#E8541A' },
  { number: '02', name: 'Extend Simultaneously', descriptor: 'All arms move at once', accent: '#00B4CB' },
  { number: '03', name: 'Capture Through Contact', descriptor: 'Sustained engagement converts', accent: '#C9960C' },
  { number: '04', name: 'Every Arm Feeds the Body', descriptor: 'Cross-referral as reflex', accent: '#3B6D11' },
  { number: '05', name: 'Depth Before Breadth', descriptor: 'Master a market before expanding', accent: '#5B3FA8' },
  { number: '06', name: 'Body Is the Differentiator', descriptor: 'The system is the advantage', accent: '#C9960C' },
]

export function KrakenPrinciples() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        gridRef.current ? Array.from(gridRef.current.children) : [],
        { opacity: 0, x: -16 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
          },
        },
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {PRINCIPLES.map((p) => (
        <div
          key={p.number}
          data-principle-card
          style={{
            borderLeft: `2px solid ${p.accent}`,
            paddingLeft: '12px',
            paddingTop: '8px',
            paddingBottom: '8px',
          }}
        >
          <p
            style={{
              color: p.accent,
              fontSize: '8px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '4px',
            }}
          >
            {p.number}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-clash)',
              fontWeight: 600,
              fontSize: '12px',
              color: 'var(--color-parchment)',
              marginBottom: '4px',
            }}
          >
            {p.name}
          </p>
          <p
            style={{
              fontSize: '9px',
              color: 'rgba(245,240,232,0.5)',
              lineHeight: 1.4,
            }}
          >
            {p.descriptor}
          </p>
        </div>
      ))}
    </div>
  )
}
