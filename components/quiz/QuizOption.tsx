'use client'

interface QuizOptionProps {
  text: string
  selected: boolean
  onClick: () => void
}

export function QuizOption({ text, selected, onClick }: QuizOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="w-full text-left rounded-[4px] transition-all duration-150 text-[11px] font-medium"
      style={{
        padding: '8px 12px',
        border: `1px solid ${selected ? 'var(--color-orange)' : 'rgba(245,240,232,0.15)'}`,
        background: selected ? 'rgba(232,84,26,0.08)' : 'transparent',
        color: selected ? 'var(--color-orange)' : 'var(--color-parchment)',
        letterSpacing: '0.02em',
      }}
    >
      {text}
    </button>
  )
}
