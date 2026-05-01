'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { gsap } from '@/lib/gsap'
import { routeArm } from '@/lib/arm-routing'
import { getArmById } from '@/lib/arm-data'
import { QuizOption } from './QuizOption'
import { QuizResult } from './QuizResult'

const QUESTIONS = [
  {
    text: 'What best describes your biggest obstacle right now?',
    options: ['Revenue + Sales', 'Credit + Capital Access', 'Brand + Visibility', 'Infrastructure + Scale'],
  },
  {
    text: 'What stage is your business at?',
    options: ['Just starting ($0–$50K)', 'Growing ($50K–$500K)', 'Scaling ($500K–$5M)', 'Established ($5M+)'],
  },
  {
    text: "What's your primary goal in the next 90 days?",
    options: ['Land more clients', 'Fix credit / access capital', 'Build brand authority', 'Build systems + team'],
  },
  {
    text: 'How do you prefer to work?',
    options: ['DIY with tools', 'Guided coaching', 'Done-with-you', 'Full delegation'],
  },
]

type Answers = { q1: string; q2: string; q3: string; q4: string }

function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    ;(window as Window & { gtag: (...args: unknown[]) => void }).gtag('event', name, params)
  }
}

export function ARMQuiz() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Partial<Answers>>({})
  const [routedArmId, setRoutedArmId] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const startTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    trackEvent('arm_quiz_started', { source: 'direct' })
  }, [])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !containerRef.current || routedArmId !== null) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.2, ease: 'power2.out' },
      )
    })
    return () => ctx.revert()
  }, [currentQuestion, routedArmId])

  function handleOptionClick(optionText: string, questionIndex: number) {
    const key = `q${questionIndex + 1}` as keyof Answers
    const updated = { ...answers, [key]: optionText }
    setAnswers(updated)

    const optionIndex = QUESTIONS[questionIndex]!.options.indexOf(optionText)
    trackEvent('arm_quiz_question_answered', {
      question_number: questionIndex + 1,
      answer_text: optionText,
      answer_index: optionIndex,
    })

    if (questionIndex < 3) {
      setCurrentQuestion(questionIndex + 1)
    } else {
      const armId = routeArm(updated.q1 ?? '', updated.q3 ?? '', updated.q4 ?? '')
      setRoutedArmId(armId)
    }
  }

  async function handleEmailSubmit(email: string) {
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000)
    await fetch('/api/quiz-complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ armId: routedArmId, email, ...answers }),
    })
    trackEvent('arm_quiz_completed', {
      routed_arm_id: routedArmId,
      routed_arm_name: getArmById(routedArmId!)?.name ?? '',
      time_spent_seconds: timeSpent,
      email_provided: true,
    })
    router.push(`/arms/${getArmById(routedArmId!)?.slug ?? 'integrity-partner-alliance'}`)
  }

  async function handleSkip() {
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000)
    await fetch('/api/quiz-complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ armId: routedArmId, ...answers }),
    })
    trackEvent('arm_quiz_completed', {
      routed_arm_id: routedArmId,
      routed_arm_name: getArmById(routedArmId!)?.name ?? '',
      time_spent_seconds: timeSpent,
      email_provided: false,
    })
    router.push(`/arms/${getArmById(routedArmId!)?.slug ?? 'integrity-partner-alliance'}`)
  }

  if (routedArmId !== null) {
    return (
      <QuizResult
        armId={routedArmId}
        answers={answers as Answers}
        onEmailSubmit={handleEmailSubmit}
        onSkip={handleSkip}
      />
    )
  }

  const q = QUESTIONS[currentQuestion]
  if (!q) return null

  return (
    <div ref={containerRef}>
      <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-[rgba(245,240,232,0.4)]">
        QUESTION {currentQuestion + 1} OF 4
      </p>
      <p className="mb-6 font-[family-name:var(--font-clash)] font-semibold text-[18px] leading-snug text-[var(--color-parchment)]">
        {q.text}
      </p>
      <div className="flex flex-col gap-2" role="form" aria-label={q.text} aria-live="polite">
        {q.options.map((option) => (
          <QuizOption
            key={option}
            text={option}
            selected={answers[`q${currentQuestion + 1}` as keyof Answers] === option}
            onClick={() => handleOptionClick(option, currentQuestion)}
          />
        ))}
      </div>
    </div>
  )
}
