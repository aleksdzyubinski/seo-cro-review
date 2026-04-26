import type { ValidationResult } from '@/lib/types'

export function validate200Response(statusCode: number): ValidationResult {
  const pass = statusCode === 200 || statusCode === 201
  return {
    rule: '200-response',
    status: pass ? 'pass' : 'fail',
    message: pass
      ? `Site responded with HTTP ${statusCode}`
      : `Site responded with HTTP ${statusCode} — expected 200 or 201`,
  }
}
