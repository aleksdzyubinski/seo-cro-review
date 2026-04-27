import type { ValidationResult } from '@/lib/types'

export function validateXMagentoCacheDebug(headers: Record<string, string>): ValidationResult {
  const value = headers['x-magento-cache-debug']?.trim().toUpperCase()

  if (!value) {
    return {
      rule: 'x-magento-cache-debug',
      status: 'error',
      message: 'X-Magento-Cache-Debug header not found',
      details: 'The header is missing from the response. Full Page Cache may not be enabled.',
    }
  }

  if (value === 'HIT') {
    return {
      rule: 'x-magento-cache-debug',
      status: 'pass',
      message: 'Full Page Cache is active',
      details: 'X-Magento-Cache-Debug: HIT',
    }
  }

  return {
    rule: 'x-magento-cache-debug',
    status: 'fail',
    message: `Full Page Cache is not serving cached content`,
    details: `X-Magento-Cache-Debug: ${value}`,
  }
}
