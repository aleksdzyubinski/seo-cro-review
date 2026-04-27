import type { ValidationResult } from '@/lib/types'

async function fetchMagentoVersionText(origin: string): Promise<string | null> {
  try {
    const vRes = await fetch(`${origin}/magento_version`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SiteAudit/1.0)' },
      signal: AbortSignal.timeout(10_000),
    })
    if (vRes.ok) {
      const text = (await vRes.text()).trim()
      if (text) return text
    }
  } catch {
    // unreachable endpoint — treat as not Magento
  }
  return null
}

export async function validateMagentoVersion(origin: string): Promise<ValidationResult> {
  const text = await fetchMagentoVersionText(origin)

  if (!text) {
    return {
      rule: 'magento-version',
      status: 'error',
      message: 'Magento version could not be detected',
      details: 'The /magento_version endpoint was not found or returned an empty response.',
    }
  }

  // Parses responses like "Magento/2.4 (Community)" or "Magento/2.3.7-p4 (Enterprise)"
  const match = text.match(/Magento\/(\d+)\.(\d+)/i)
  if (!match) {
    return {
      rule: 'magento-version',
      status: 'error',
      message: 'Unexpected response from /magento_version',
      details: `Response: "${text.slice(0, 100)}"`,
    }
  }

  const major = parseInt(match[1], 10)
  const minor = parseInt(match[2], 10)

  if (major < 2 || (major === 2 && minor < 4)) {
    return {
      rule: 'magento-version',
      status: 'fail',
      message: `Magento version is outdated: ${text}`,
      details: 'Magento 2.4+ is required. Older versions no longer receive security patches.',
    }
  }

  return {
    rule: 'magento-version',
    status: 'pass',
    message: `Magento version is supported: ${text}`,
  }
}
