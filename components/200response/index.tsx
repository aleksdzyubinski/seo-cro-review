import type { ValidationResult } from '@/lib/types'

interface Props {
  result: ValidationResult
}

export default function ResponseCodeCard({ result }: Props) {
  const pass = result.status === 'pass'

  return (
    <div
      className={`flex items-start gap-4 rounded-2xl border p-5 transition-colors ${
        pass
          ? 'border-emerald-700/40 bg-emerald-950/30'
          : 'border-red-700/40 bg-red-950/30'
      }`}
    >
      <div
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base font-bold ${
          pass ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
        }`}
      >
        {pass ? '✓' : '✗'}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-white">HTTP Response Code</span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${
              pass
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            {pass ? 'PASS' : 'FAIL'}
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-300">{result.message}</p>
        {result.details && (
          <p className="mt-1 text-xs text-slate-500">{result.details}</p>
        )}
      </div>
    </div>
  )
}
