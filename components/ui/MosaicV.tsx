import React from 'react'

type Lockup = 'mark' | 'horizontal' | 'stacked' | 'wordmark' | 'compact' | 'endorsed'

interface MosaicVProps extends React.SVGProps<SVGSVGElement> {
  lockup?: Lockup
  size?: number
  className?: string
  'aria-label'?: string
}

// 7 panels of the Mosaic V stained-glass geometric mark (90×90 viewBox)
const PANELS = [
  { points: '5,8 30,8 45,50',   fill: '#E8541A' },
  { points: '30,8 45,8 45,50',  fill: '#C9960C' },
  { points: '45,8 52,8 45,50',  fill: '#3B6D11' },
  { points: '52,8 68,8 45,50',  fill: '#5B3FA8' },
  { points: '68,8 85,8 45,50',  fill: '#00B4CB' },
  { points: '5,8 45,50 20,82',  fill: '#2C2C2A', opacity: 0.5 },
  { points: '85,8 45,50 70,82', fill: '#2C2C2A', opacity: 0.5 },
]

// Hairline lead lines (stained-glass separators)
const LEAD_LINES = [
  { x1: 5,  y1: 8, x2: 45, y2: 50 },
  { x1: 30, y1: 8, x2: 45, y2: 50 },
  { x1: 45, y1: 8, x2: 45, y2: 50 },
  { x1: 52, y1: 8, x2: 45, y2: 50 },
  { x1: 68, y1: 8, x2: 45, y2: 50 },
  { x1: 85, y1: 8, x2: 45, y2: 50 },
]

function MarkOnly({
  size = 40,
  label,
  className,
  ...rest
}: {
  size?: number
  label?: string | undefined
  className?: string | undefined
} & Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height'>) {
  const accessible = label != null
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 90 90"
      fill="none"
      role={accessible ? 'img' : undefined}
      aria-label={accessible ? label : undefined}
      aria-hidden={accessible ? undefined : 'true'}
      className={className}
      {...rest}
    >
      {PANELS.map((p, i) => (
        <polygon
          key={i}
          points={p.points}
          fill={p.fill}
          opacity={p.opacity ?? 1}
        />
      ))}
      {LEAD_LINES.map((l, i) => (
        <line
          key={i}
          x1={l.x1} y1={l.y1}
          x2={l.x2} y2={l.y2}
          stroke="#F5F0E8"
          strokeWidth="0.4"
          opacity="0.3"
        />
      ))}
    </svg>
  )
}

export function MosaicV({
  lockup = 'mark',
  size = 40,
  className,
  'aria-label': ariaLabel,
  ...rest
}: MosaicVProps) {
  if (lockup === 'mark') {
    return <MarkOnly size={size} label={ariaLabel} className={className} {...rest} />
  }

  if (lockup === 'horizontal' || lockup === 'endorsed') {
    return (
      <div
        className={`flex items-center gap-2 ${className ?? ''}`}
        role={ariaLabel ? 'img' : undefined}
        aria-label={ariaLabel}
      >
        <MarkOnly size={size} aria-hidden="true" />
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '11px',
            letterSpacing: '3px',
            fontWeight: 600,
            color: 'var(--color-parchment)',
            textTransform: 'uppercase' as const,
          }}
        >
          VANTAGE POINT GROUP
        </span>
      </div>
    )
  }

  if (lockup === 'compact') {
    return (
      <div
        className={`flex items-center gap-1.5 ${className ?? ''}`}
        role={ariaLabel ? 'img' : undefined}
        aria-label={ariaLabel}
      >
        <MarkOnly size={Math.round(size * 0.75)} aria-hidden="true" />
        <span
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '9px',
            letterSpacing: '2px',
            fontWeight: 600,
            color: 'var(--color-parchment)',
            textTransform: 'uppercase' as const,
          }}
        >
          VPG
        </span>
      </div>
    )
  }

  // stacked / wordmark
  return (
    <div
      className={`flex flex-col items-center gap-1 ${className ?? ''}`}
      role="img"
      aria-label={ariaLabel ?? 'Vantage Point Group'}
    >
      <MarkOnly size={size} aria-hidden="true" />
      <span
        style={{
          fontFamily: 'var(--font-inter)',
          fontSize: '9px',
          letterSpacing: '3px',
          fontWeight: 600,
          color: 'var(--color-parchment)',
          textTransform: 'uppercase' as const,
        }}
      >
        VANTAGE POINT GROUP
      </span>
    </div>
  )
}
