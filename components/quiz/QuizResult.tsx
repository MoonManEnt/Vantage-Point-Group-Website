'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { Button } from '@/components/ui/Button'
import { getArmById } from '@/lib/arm-data'

interface QuizResultProps {
  armId: number
  answers: { q1: string; q2: string; q3: string; q4: string }
  onEmailSubmit: (email: string) => void
  onSkip: () => void
}

export function QuizResult({ armId, onEmailSubmit, onSkip }: QuizResultProps) {
  const arm = getArmById(armId)
  const badgeRef = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !badgeRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        badgeRef.current,
        { scale: 0.5, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.6, ease: 'elastic.out(1, 0.6)' },
      )
    })
    return () => ctx.revert()
  }, [])

  if (!arm) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email.trim()) onEmailSubmit(email.trim())
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ARM badge */}
      <div ref={badgeRef}>
        <p
          className="text-[8px] font-bold uppercase tracking-[0.2em] mb-1 opacity-70"
          style={{ color: arm.color }}
        >
          ARM {arm.id}
        </p>
        <h3 className="font-[family-name:var(--font-clash)] font-bold text-[22px] leading-tight text-[var(--color-parchment)]">
          {arm.name}
        </h3>
      </div>

      {/* Result description */}
      <p className="text-[12px] leading-[1.7] text-[rgba(245,240,232,0.6)]">
        {arm.resultDescription}
      </p>

      {/* CTAs */}
      <div className="flex flex-col gap-2">
        <Button tier="primary" href={`/arms/${arm.slug}`}>
          Explore {arm.name} →
        </Button>
        <Button tier="tertiary" href="/arms" style={{ color: 'rgba(245,240,232,0.5)' }}>
          See all 10 ARMs →
        </Button>
      </div>

      {/* Email opt-in */}
      <div className="flex flex-col gap-3 pt-2 border-t border-[rgba(245,240,232,0.08)]">
        <p className="text-[11px] text-[rgba(245,240,232,0.5)]">
          Want your personalized VPG playbook emailed to you?
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full rounded-[3px] text-[12px] text-[var(--color-parchment)]"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(245,240,232,0.15)',
              padding: '9px 14px',
              caretColor: 'var(--color-orange)',
            }}
          />
          <Button tier="primary" type="submit" className="text-[9px] py-2">
            Send my playbook
          </Button>
        </form>
        <button
          type="button"
          onClick={onSkip}
          className="text-left text-[10px] text-[rgba(245,240,232,0.3)] hover:text-[rgba(245,240,232,0.5)] transition-colors"
        >
          No thanks, I&apos;ll explore on my own →
        </button>
      </div>
    </div>
  )
}
