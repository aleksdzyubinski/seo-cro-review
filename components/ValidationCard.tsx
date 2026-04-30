import type { ValidationResult } from '@/lib/types'

interface Props {
  title: string
  result: ValidationResult
}

export default function ValidationCard({ title, result }: Props) {
  const pass = result.status === 'pass'

  return (
    <div
      className="flex items-start gap-4 rounded-2xl border p-5 transition-colors"
      style={{
        background:   pass ? 'var(--card-pass-bg)'     : 'var(--card-fail-bg)',
        borderColor:  pass ? 'var(--card-pass-border)'  : 'var(--card-fail-border)',
      }}
    >
      <div
        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-bold"
        style={{
          background: pass ? 'var(--icon-pass-bg)' : 'var(--icon-fail-bg)',
          color:      pass ? 'var(--icon-pass-fg)' : 'var(--icon-fail-fg)',
        }}
      >
        {pass ? '✓' : '✗'}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</span>
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide"
            style={{
              background: pass ? 'var(--icon-pass-bg)' : 'var(--icon-fail-bg)',
              color:      pass ? 'var(--icon-pass-fg)' : 'var(--icon-fail-fg)',
            }}
          >
            {pass ? 'PASS' : 'FAIL'}
          </span>
        </div>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>{result.message}</p>
        {result.details && (
          <p className="mt-1 text-xs" style={{ color: 'var(--text-secondary)' }}>{result.details}</p>
        )}
      </div>
    </div>
  )
}
