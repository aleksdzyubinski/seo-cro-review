import type { ValidationResult } from '@/lib/types'

export function validateCloudflare(headers: Record<string, string>): ValidationResult {
  const indicators: string[] = []

  if (headers['cf-ray']) indicators.push('CF-Ray header')
  if (headers['server']?.toLowerCase() === 'cloudflare') indicators.push('Server: cloudflare')
  if (headers['cf-cache-status']) indicators.push('CF-Cache-Status header')
  if (headers['cf-apo-via']) indicators.push('CF-APO header')
  if (headers['set-cookie']?.match(/__cf_bm|_cfuvid|cf_clearance/)) indicators.push('Cloudflare cookie')

  const detected = indicators.length > 0

  return {
    rule: 'cloudflare',
    status: detected ? 'pass' : 'fail',
    message: detected ? 'Site is behind Cloudflare CDN' : 'Site is not using Cloudflare CDN',
    details: detected ? `Detected via: ${indicators.join(', ')}` : 'No Cloudflare response headers found.',
  }
}
