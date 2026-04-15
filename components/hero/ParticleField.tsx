'use client'

interface ParticleFieldProps {
  count?: number
}

const DRIFT = ['particleDriftA', 'particleDriftB', 'particleDriftC'] as const

// 14 particles — 2 per ARM color + 2 neutral
const PARTICLES = [
  { top: '15%', left: '8%',  size: 2,   color: '#00B4CB',               dur: '7s',   delay: '0s'   },
  { top: '72%', left: '35%', size: 1.5, color: '#E8541A',               dur: '9s',   delay: '1.2s' },
  { top: '28%', left: '62%', size: 2,   color: '#C9960C',               dur: '6s',   delay: '2.4s' },
  { top: '55%', left: '80%', size: 1.5, color: '#5B3FA8',               dur: '8s',   delay: '0.6s' },
  { top: '82%', left: '18%', size: 2,   color: '#3B6D11',               dur: '7.5s', delay: '3s'   },
  { top: '10%', left: '52%', size: 1.5, color: '#00B4CB',               dur: '5.5s', delay: '1.8s' },
  { top: '44%', left: '90%', size: 2,   color: '#E8541A',               dur: '8.5s', delay: '2.1s' },
  { top: '38%', left: '42%', size: 1.5, color: '#C9960C',               dur: '6.5s', delay: '0.3s' },
  { top: '65%', left: '12%', size: 2,   color: '#5B3FA8',               dur: '9s',   delay: '1.5s' },
  { top: '8%',  left: '75%', size: 1.5, color: '#3B6D11',               dur: '7s',   delay: '3.6s' },
  { top: '50%', left: '25%', size: 2,   color: 'rgba(245,240,232,0.3)', dur: '6s',   delay: '0.9s' },
  { top: '20%', left: '88%', size: 1.5, color: 'rgba(245,240,232,0.3)', dur: '8s',   delay: '2.7s' },
  { top: '90%', left: '55%', size: 2,   color: 'rgba(0,180,203,0.25)',  dur: '5s',   delay: '1.1s' },
  { top: '33%', left: '5%',  size: 1.5, color: 'rgba(0,180,203,0.25)',  dur: '7.5s', delay: '4s'   },
] as const

export function ParticleField({ count = 14 }: ParticleFieldProps) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {PARTICLES.slice(0, count).map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animationName: DRIFT[i % 3],
            animationDuration: p.dur,
            animationDelay: p.delay,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            animationFillMode: 'both',
          }}
        />
      ))}
    </div>
  )
}
