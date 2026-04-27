import type { ValidationResult } from '@/lib/types'

export async function validateRobots(origin: string): Promise<ValidationResult> {
  let text: string
  try {
    const res = await fetch(`${origin}/robots.txt`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SiteAudit/1.0)' },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) {
      return {
        rule: 'robots',
        status: 'error',
        message: 'Could not retrieve robots.txt',
        details: `The /robots.txt endpoint returned HTTP ${res.status}.`,
      }
    }
    text = await res.text()
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return {
      rule: 'robots',
      status: 'error',
      message: 'Could not reach /robots.txt',
      details: message,
    }
  }

  // Collect all Sitemap: directives (case-insensitive)
  const sitemaps = [...text.matchAll(/^Sitemap:\s*(\S+)/gim)].map((m) => m[1])

  if (sitemaps.length === 0) {
    return {
      rule: 'robots',
      status: 'fail',
      message: 'robots.txt does not contain a Sitemap directive',
      details: 'Add "Sitemap: https://example.com/sitemap.xml" to help search engines discover your sitemap.',
    }
  }

  return {
    rule: 'robots',
    status: 'pass',
    message: `robots.txt declares ${sitemaps.length} sitemap${sitemaps.length > 1 ? 's' : ''}`,
    details: sitemaps.join(', '),
  }
}
