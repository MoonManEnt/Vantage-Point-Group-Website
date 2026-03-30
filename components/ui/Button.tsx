import Link from 'next/link'
import { clsx } from 'clsx'
import React from 'react'

export type ButtonTier = 'primary' | 'secondary' | 'entity' | 'tertiary'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tier?: ButtonTier
  href?: string
  entityColor?: string
  children: React.ReactNode
  className?: string
}

const BASE =
  'inline-flex items-center justify-center font-semibold uppercase ' +
  'tracking-widest transition-all duration-200 ' +
  'focus-visible:outline-none focus-visible:ring-2 ' +
  'focus-visible:ring-[var(--color-orange)] focus-visible:ring-offset-2 ' +
  'focus-visible:ring-offset-[var(--bg-base)] ' +
  'disabled:opacity-40 disabled:cursor-not-allowed ' +
  'rounded-[3px]'

const TIER_STYLES: Record<ButtonTier, string> = {
  primary:
    'bg-[var(--color-orange)] text-white px-6 py-2.5 text-[10px] tracking-[0.1em] hover:opacity-90',
  secondary:
    'bg-transparent border border-[rgba(245,240,232,0.2)] text-[var(--color-parchment)] ' +
    'px-[22px] py-[9px] text-[11px] tracking-[0.15em] hover:border-[rgba(245,240,232,0.4)]',
  entity:
    'text-white px-5 py-2.5 text-[10px] tracking-[0.1em] hover:opacity-90',
  tertiary:
    'bg-transparent text-inherit text-[10px] tracking-[0.08em] ' +
    'hover:underline underline-offset-4 px-0 py-0',
}

export function Button({
  tier = 'primary',
  href,
  entityColor,
  children,
  className,
  style,
  ...props
}: ButtonProps) {
  const classes = clsx(BASE, TIER_STYLES[tier], className)
  const inlineStyle =
    tier === 'entity' && entityColor
      ? { ...style, backgroundColor: entityColor }
      : style

  if (href) {
    return (
      <Link href={href} className={classes} style={inlineStyle}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} style={inlineStyle} {...props}>
      {children}
    </button>
  )
}
