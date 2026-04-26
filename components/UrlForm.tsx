'use client'

import { useState } from 'react'
import type { ValidationResult } from '@/lib/types'
import H1ValidatorCard from '@/components/h1-validator'
import ResponseCodeCard from '@/components/200response'
import CloudflareCard from '@/components/cloudflare'
import ErrorPopup from '@/components/ErrorPopup'

const ruleComponents: Record<string, React.ComponentType<{ result: ValidationResult }>> = {
  'h1-tag': H1ValidatorCard,
  '200-response': ResponseCodeCard,
  'cloudflare': CloudflareCard,
}

function ResultCard({ result }: { result: ValidationResult }) {
  const Component = ruleComponents[result.rule]
  if (Component) return <Component result={result} />

  const pass = result.status === 'pass'
  return (
    <div className={`rounded-2xl border p-5 ${pass ? 'border-emerald-700/40 bg-emerald-950/30' : 'border-red-700/40 bg-red-950/30'}`}>
      <p className="text-sm text-slate-300">{result.message}</p>
    </div>
  )
}

interface PopupState {
  statusCode: number
  message: string
}

export default function UrlForm() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ValidationResult[] | null>(null)
  const [error, setError] = useState('')
  const [analyzedUrl, setAnalyzedUrl] = useState('')
  const [popup, setPopup] = useState<PopupState | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResults(null)
    setError('')
    setPopup(null)

    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Validation failed')
        return
      }

      if (data.type === 'http_status_error') {
        setPopup({ statusCode: data.statusCode, message: data.message })
        return
      }

      setAnalyzedUrl(data.url)
      setResults(data.results)
    } catch {
      setError('Failed to reach the server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const passCount = results?.filter((r) => r.status === 'pass').length ?? 0
  const failCount = results?.filter((r) => r.status !== 'pass').length ?? 0

  return (
    <>
      {popup && (
        <ErrorPopup
          statusCode={popup.statusCode}
          message={popup.message}
          onClose={() => setPopup(null)}
        />
      )}

      <div className="w-full max-w-2xl">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
            className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-800/60 px-5 py-4 text-base text-white placeholder-slate-500 outline-none ring-0 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
          />
          <button
            type="submit"
            disabled={loading}
            className="shrink-0 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-900/30 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-900 disabled:text-blue-400"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
                Analyzing
              </span>
            ) : (
              'Start'
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 rounded-xl border border-red-700/50 bg-red-950/40 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {results && (
          <div className="mt-8">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Results for
                </p>
                <p className="mt-0.5 truncate text-sm font-medium text-slate-300">
                  {analyzedUrl}
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-xs">✓</span>
                  {passCount} passed
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-red-400">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500/20 text-xs">✗</span>
                  {failCount} failed
                </span>
              </div>
            </div>
            <div className="space-y-3">
              {results.map((result) => (
                <ResultCard key={result.rule} result={result} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
