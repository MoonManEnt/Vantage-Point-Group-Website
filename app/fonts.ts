import localFont from 'next/font/local'
import { Inter } from 'next/font/google'

export const clashDisplay = localFont({
  src: '../public/fonts/ClashDisplay-Variable.ttf',
  variable: '--font-clash',
  display: 'swap',
  preload: true,
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
  weight: '200 700',
})

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})
