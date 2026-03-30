/**
 * GSAP singleton module.
 *
 * This is the ONLY file in the codebase that imports from 'gsap' directly.
 * All other files must import from '@/lib/gsap' instead.
 *
 * ScrollTrigger is registered once here, client-side only.
 */
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }
