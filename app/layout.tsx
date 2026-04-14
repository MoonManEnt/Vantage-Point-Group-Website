import type { Metadata } from 'next'
import { clashDisplay, inter } from './fonts'
import './globals.css'
import { Navigation } from '@/components/nav/Navigation'

export const metadata: Metadata = {
  title: {
    default: 'Vantage Point Group',
    template: '%s | Vantage Point Group',
  },
  description:
    'The infrastructure behind serious builders. 10 Adaptive Reach Movements. One operating system. Faith-rooted. Results-driven.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vantagepointgroup.com'
  ),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${clashDisplay.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="sr-only">
          Skip to main content
        </a>
        <Navigation />
        <main id="main-content" className="flex flex-col flex-1">
          {children}
        </main>
      </body>
    </html>
  )
}
