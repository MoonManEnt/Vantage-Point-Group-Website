'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { Button } from '@/components/ui/Button'
import { ParticleField } from './ParticleField'

export default function HeroSection() {
  const particlesRef = useRef<HTMLDivElement>(null)
  const contentRef   = useRef<HTMLDivElement>(null)
  const mosaicRef    = useRef<HTMLDivElement>(null)
  const glowRef      = useRef<HTMLDivElement>(null)
  const eyebrowRef   = useRef<HTMLParagraphElement>(null)
  const line1Ref     = useRef<HTMLSpanElement>(null)
  const line2Ref     = useRef<HTMLSpanElement>(null)
  const line3Ref     = useRef<HTMLSpanElement>(null)
  const taglineRef   = useRef<HTMLParagraphElement>(null)
  const ctaRef       = useRef<HTMLDivElement>(null)
  const floatTweens  = useRef<{ kill: () => void }[]>([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      gsap.set(particlesRef.current,  { opacity: 0 })
      gsap.set(mosaicRef.current,     { autoAlpha: 0, scale: 0.85 })
      gsap.set(glowRef.current,       { opacity: 0,   scale: 0.6  })
      gsap.set(eyebrowRef.current,    { autoAlpha: 0, y: 12       })
      gsap.set(
        [line1Ref.current, line2Ref.current, line3Ref.current],
        { autoAlpha: 0, x: -24 },
      )
      gsap.set(taglineRef.current, { autoAlpha: 0, y: 8 })
      gsap.set(ctaRef.current,     { autoAlpha: 0, y: 8 })

      const tl = gsap.timeline({
        onComplete() {
          floatTweens.current = [
            gsap.to(mosaicRef.current, {
              y: -14, duration: 5, ease: 'sine.inOut', repeat: -1, yoyo: true,
            }),
            gsap.to(glowRef.current, {
              scale: 1.12, duration: 5, ease: 'sine.inOut', repeat: -1, yoyo: true,
            }),
          ]
        },
      })

      tl.to(particlesRef.current,  { opacity: 1, duration: 1.2, ease: 'power2.out' }, 0)
        .to(mosaicRef.current,     { scale: 1, autoAlpha: 1, duration: 1.0, ease: 'power3.out' }, 0.2)
        .to(glowRef.current,       { scale: 1, opacity: 1,   duration: 1.4, ease: 'power2.out' }, 0.3)
        .to(eyebrowRef.current,    { y: 0, autoAlpha: 1,     duration: 0.5, ease: 'power2.out' }, 0.5)
        .to(
          [line1Ref.current, line2Ref.current, line3Ref.current],
          { x: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out', stagger: 0.12 },
          0.65,
        )
        .to(taglineRef.current, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.out' }, 1.0)
        .to(ctaRef.current,     { y: 0, autoAlpha: 1, duration: 0.5, ease: 'back.out(1.4)' }, 1.15)

      ScrollTrigger.create({
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        animation: gsap.timeline()
          .to(contentRef.current,   { autoAlpha: 0, y: -40 })
          .to(particlesRef.current, { autoAlpha: 0 }, '<50%'),
      })
    })

    return () => {
      ctx.revert()
      floatTweens.current.forEach(t => t.kill())
    }
  }, [])

  return (
    <section
      id="hero"
      aria-label="Hero"
      className="relative min-h-screen bg-[var(--bg-base)] flex flex-col lg:flex-row overflow-hidden"
    >
      <div ref={particlesRef} className="absolute inset-0 z-0">
        <ParticleField />
      </div>

      <div ref={contentRef} className="relative z-10 flex flex-col w-full lg:flex-row min-h-screen">

        <div className="flex items-center justify-center pt-24 pb-8 lg:order-2 lg:w-[45%] lg:py-0">
          <div className="relative flex items-center justify-center">
            <div
              ref={glowRef}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: '600px',
                height: '600px',
                background:
                  'radial-gradient(circle, rgba(201,150,12,0.12) 0%, rgba(232,84,26,0.06) 40%, transparent 70%)',
              }}
            />
            <div ref={mosaicRef} className="relative z-10">
              <Image
                src="/mosaic-v-hero.png"
                alt="Mosaic V — VPG brand mark"
                width={480}
                height={480}
                priority
                sizes="(max-width: 768px) 240px, (max-width: 1024px) 340px, 480px"
                className="object-contain w-[240px] md:w-[340px] lg:w-[480px] h-auto"
                style={{ filter: 'drop-shadow(0 0 30px rgba(201,150,12,0.4))' }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center px-6 pb-16 lg:order-1 lg:pl-16 lg:pr-8 lg:py-24">
          <p
            ref={eyebrowRef}
            className="mb-3 text-[11px] uppercase tracking-[0.2em] text-[var(--color-orange)]"
          >
            10 Adaptive Reach Movements
          </p>

          <h1 className="mb-4 font-[family-name:var(--font-clash)] font-extrabold uppercase leading-[1.05] tracking-[0.01em] text-[var(--color-parchment)] text-[38px] md:text-[52px] lg:text-[72px]">
            <span ref={line1Ref} className="block">Serious Builders.</span>
            <span ref={line2Ref} className="block">
              <span className="text-[var(--color-gold)]">Kingdom</span> Purpose.
            </span>
            <span ref={line3Ref} className="block">Ten Movements Forward.</span>
          </h1>

          <p
            ref={taglineRef}
            className="mb-8 text-[11px] uppercase tracking-[0.2em] leading-[2] text-[rgba(245,240,232,0.4)]"
          >
            Faith-Rooted · Excellence-Driven · Results-Accountable
          </p>

          <div ref={ctaRef}>
            <Button tier="primary" href="#arm-quiz" className="w-full sm:w-auto">
              Find Your ARM
            </Button>
          </div>
        </div>

      </div>
    </section>
  )
}
