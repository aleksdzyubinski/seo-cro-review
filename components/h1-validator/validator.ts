export interface ValidationResult {
  rule: string
  status: 'pass' | 'fail' | 'error'
  message: string
  details?: string
}

export function validateH1(html: string): ValidationResult {
  const matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)

  if (!matches) {
    return {
      rule: 'h1-tag',
      status: 'fail',
      message: 'No H1 tag found on the page',
      details: 'Every page should have exactly one H1 tag for proper SEO and accessibility.',
    }
  }

  if (matches.length > 1) {
    return {
      rule: 'h1-tag',
      status: 'fail',
      message: `Multiple H1 tags found (${matches.length})`,
      details: 'A page should have only one H1 tag. Multiple H1 tags can confuse search engines.',
    }
  }

  const content = matches[0].replace(/<[^>]+>/g, '').trim()

  return {
    rule: 'h1-tag',
    status: 'pass',
    message: 'Exactly one H1 tag found',
    details: content ? `Content: "${content}"` : undefined,
  }
}