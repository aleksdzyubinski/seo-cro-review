'use client'

interface Props {
  title: string
  subtitle: string
  statusCode?: number
  message: string
  onClose: () => void
}

export default function ErrorPopup({ title, subtitle, statusCode, message, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-md rounded-2xl border p-8 shadow-2xl"
        style={{
          background:  'var(--popup-bg)',
          borderColor: 'var(--popup-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <div
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl"
            style={{ background: 'var(--icon-fail-bg)', color: 'var(--icon-fail-fg)' }}
          >
            ✗
          </div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
        </div>

        <div
          className="mb-6 rounded-xl border px-5 py-4"
          style={{
            background:  'var(--error-bg)',
            borderColor: 'var(--error-border)',
          }}
        >
          {statusCode !== undefined && (
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-subtle)' }}>
                Status Code
              </span>
              <span
                className="rounded-full px-2.5 py-0.5 text-sm font-bold"
                style={{ background: 'var(--icon-fail-bg)', color: 'var(--icon-fail-fg)' }}
              >
                {statusCode}
              </span>
            </div>
          )}
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{message}</p>
        </div>

        <button
          onClick={onClose}
          className="t-close w-full rounded-xl py-3 text-sm font-semibold transition"
          style={{
            background:  'var(--popup-close-bg)',
            color:       'var(--popup-close-fg)',
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}
