'use client'

import { useState } from 'react'
import type { ValidationResult } from '@/lib/types'
import H1ValidatorCard from '@/components/h1-validator'
import ResponseCodeCard from '@/components/200response'
import CloudflareCard from '@/components/cloudflare'
import MagentoVersionCard from '@/components/magentoVersion'
import RobotsCard from '@/components/robots'
import XMagentoCacheDebugCard from '@/components/xMagentoCacheDebug'
import ErrorPopup from '@/components/ErrorPopup'

const ruleComponents: Record<string, React.ComponentType<{ result: ValidationResult }>> = {
  'h1-tag': H1ValidatorCard,
  '200-response': ResponseCodeCard,
  'cloudflare': CloudflareCard,
  'magento-version': MagentoVersionCard,
  'robots': RobotsCard,
  'x-magento-cache-debug': XMagentoCacheDebugCard,
}

function ResultCard({ result }: { result: ValidationResult }) {
  const Component = ruleComponents[result.rule]
  if (Component) return <Component result={result} />

  const pass = result.status === 'pass'
  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        background:  pass ? 'var(--card-pass-bg)'    : 'var(--card-fail-bg)',
        borderColor: pass ? 'var(--card-pass-border)' : 'var(--card-fail-border)',
      }}
    >
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{result.message}</p>
    </div>
  )
}

interface PopupState {
  title: string
  subtitle: string
  statusCode?: number
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
        setPopup({
          title: 'Validation Stopped',
          subtitle: 'The site did not return an acceptable HTTP status code.',
          statusCode: data.statusCode,
          message: data.message,
        })
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
          title={popup.title}
          subtitle={popup.subtitle}
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
            className="t-input min-w-0 flex-1 rounded-xl border px-5 py-4 text-base outline-none ring-0 transition"
            style={{
              background:  'var(--input-bg)',
              borderColor: 'var(--input-border)',
              color:       'var(--text-primary)',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            className="t-btn shrink-0 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg transition"
            style={{ boxShadow: `0 10px 15px -3px var(--btn-shadow)` }}
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
          <div
            className="mt-6 rounded-xl border px-5 py-4 text-sm"
            style={{
              borderColor: 'var(--error-border)',
              background:  'var(--error-bg)',
              color:       'var(--error-fg)',
            }}
          >
            {error}
          </div>
        )}

        {results && (
          <div className="mt-8">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-subtle)' }}>
                  Results for
                </p>
                <p className="mt-0.5 truncate text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {analyzedUrl}
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                <span className="flex items-center gap-1.5 font-semibold" style={{ color: 'var(--icon-pass-fg)' }}>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full text-xs" style={{ background: 'var(--icon-pass-bg)' }}>✓</span>
                  {passCount} passed
                </span>
                <span className="flex items-center gap-1.5 font-semibold" style={{ color: 'var(--icon-fail-fg)' }}>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full text-xs" style={{ background: 'var(--icon-fail-bg)' }}>✗</span>
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
