'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { MosaicV } from '@/components/ui/MosaicV'
import { MegaMenu } from '@/components/nav/MegaMenu'
import { MobileOverlay } from '@/components/nav/MobileOverlay'
import { NavCTA } from '@/components/nav/NavCTA'

const NAV_LINKS = [
  { label: 'Partners', href: '/partners' },
  { label: 'The Kraken Method', href: '/kraken-method' },
  { label: 'Events', href: '/events' },
  { label: 'About', href: '/about' },
]

const LINK_BASE =
  'text-[rgba(245,240,232,0.6)] hover:text-[var(--color-parchment)] ' +
  'text-[11px] font-medium tracking-[0.08em] uppercase ' +
  'transition-colors duration-150'

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const navRef = useRef<HTMLElement>(null)
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Stable callback refs to avoid stale closures in effects
  const closeMegaRef = useRef(() => setMegaOpen(false))
  useEffect(() => {
    closeMegaRef.current = () => setMegaOpen(false)
  })

  // Scroll threshold handler
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Click-outside detection for mega menu
  useEffect(() => {
    if (!megaOpen) return
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        closeMegaRef.current()
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [megaOpen])

  const handlePortfolioClick = useCallback(() => {
    setMegaOpen((prev) => !prev)
  }, [])

  const handleNavMouseLeave = useCallback(() => {
    if (hoverTimerRef.current !== null) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
    closeMegaRef.current()
  }, [])

  const handlePortfolioMouseEnter = useCallback(() => {
    hoverTimerRef.current = setTimeout(() => {
      setMegaOpen(true)
    }, 300)
  }, [])

  const handlePortfolioMouseLeave = useCallback(() => {
    if (hoverTimerRef.current !== null) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
  }, [])

  const closeMobile = useCallback(() => setMobileOpen(false), [])
  const openMobile = useCallback(() => setMobileOpen(true), [])

  return (
    <>
      <header
        ref={navRef}
        onMouseLeave={handleNavMouseLeave}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: '64px',
        }}
        className={[
          'flex items-center transition-colors duration-300',
          scrolled
            ? 'bg-[var(--color-navy)] backdrop-blur-md'
            : 'bg-transparent',
        ].join(' ')}
      >
        <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between h-full">
          {/* Left: Logo */}
          <Link
            href="/"
            aria-label="Vantage Point Group — go to homepage"
            className="flex items-center shrink-0"
          >
            <MosaicV lockup="horizontal" size={28} />
          </Link>

          {/* Center: Desktop nav links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-6"
          >
            {/* Portfolio — button that toggles MegaMenu */}
            <button
              type="button"
              aria-label="Portfolio"
              aria-expanded={megaOpen}
              aria-haspopup="menu"
              onClick={handlePortfolioClick}
              onMouseEnter={handlePortfolioMouseEnter}
              onMouseLeave={handlePortfolioMouseLeave}
              className={`${LINK_BASE} flex items-center gap-1`}
            >
              Portfolio
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                aria-hidden="true"
                className={`transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`}
              >
                <path
                  d="M2 3.5L5 6.5L8 3.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Secondary nav links */}
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={href} href={href} className={LINK_BASE}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Right: CTA + hamburger */}
          <div className="flex items-center gap-3">
            <NavCTA />
            <button
              type="button"
              aria-label="Open menu"
              onClick={openMobile}
              className="md:hidden flex items-center justify-center w-9 h-9 text-[var(--color-parchment)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <line
                  x1="3"
                  y1="6"
                  x2="17"
                  y2="6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="3"
                  y1="10"
                  x2="17"
                  y2="10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <line
                  x1="3"
                  y1="14"
                  x2="17"
                  y2="14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* MegaMenu — rendered inside header, below the bar */}
        <MegaMenu isOpen={megaOpen} onClose={closeMegaRef.current} />
      </header>

      {/* MobileOverlay — sibling to header */}
      <MobileOverlay isOpen={mobileOpen} onClose={closeMobile} />
    </>
  )
}
