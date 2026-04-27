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
        className="relative w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15 text-3xl text-red-400">
            ✗
          </div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
        </div>

        <div className="mb-6 rounded-xl border border-red-700/40 bg-red-950/30 px-5 py-4">
          {statusCode !== undefined && (
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Status Code
              </span>
              <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-sm font-bold text-red-400">
                {statusCode}
              </span>
            </div>
          )}
          <p className="text-sm text-slate-300">{message}</p>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-xl bg-slate-800 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white"
        >
          Close
        </button>
      </div>
    </div>
  )
}
