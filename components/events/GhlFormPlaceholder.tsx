interface GhlFormPlaceholderProps {
  label: string
}

export function GhlFormPlaceholder({ label }: GhlFormPlaceholderProps) {
  return (
    <div
      style={{
        background: 'rgba(91,63,168,0.06)',
        border: '1px dashed rgba(91,63,168,0.3)',
        borderRadius: '6px',
        padding: '32px 24px',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontFamily: 'var(--font-clash)',
          fontWeight: 700,
          fontSize: '14px',
          color: 'var(--color-parchment)',
          marginBottom: '8px',
        }}
      >
        {label}
      </p>
      <p style={{ fontSize: '12px', color: 'rgba(245,240,232,0.4)', lineHeight: 1.6 }}>
        Registration form coming soon.{' '}
        <a
          href="mailto:info@vantagepointgroup.com"
          style={{ color: '#5B3FA8', textDecoration: 'underline' }}
        >
          Email us to reserve your spot.
        </a>
      </p>
      {/* TODO: replace with GHL iframe embed once form URL is available */}
    </div>
  )
}
