import type { ValidationResult } from '@/lib/types'

export function validateMetaPixel(html: string): ValidationResult {
  const hasInit        = /fbq\s*\(\s*['"]init['"]/i.test(html)
  const hasScript      = /connect\.facebook\.net\/[^"']*\/fbevents\.js/i.test(html)
  const hasNoscript    = /facebook\.com\/tr\?/i.test(html)

  const detected = hasInit || hasScript || hasNoscript

  if (!detected) {
    return {
      rule: 'meta-pixel',
      status: 'fail',
      message: 'Meta Pixel not found on this page',
      details: 'No Facebook Pixel initialization or fbevents.js script was detected in the page HTML.',
    }
  }

  const indicators: string[] = []
  if (hasInit)     indicators.push('fbq("init") call')
  if (hasScript)   indicators.push('fbevents.js script')
  if (hasNoscript) indicators.push('noscript pixel fallback')

  return {
    rule: 'meta-pixel',
    status: 'pass',
    message: 'Meta Pixel is installed',
    details: `Detected via: ${indicators.join(', ')}`,
  }
}
