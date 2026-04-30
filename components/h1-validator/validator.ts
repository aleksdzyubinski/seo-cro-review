export interface ValidationResult {
  rule: string
  status: 'pass' | 'fail' | 'error'
  message: string
  details?: string
}

const KNOWN_HIDING_CLASSES = new Set([
  'sr-only', 'screen-reader-text', 'screen-reader-only',
  'visually-hidden', 'visuallyhidden', 'd-none', 'hide',
  'offscreen', 'off-screen',
])

const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
])

function extractCss(html: string): string {
  return (html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) ?? [])
    .map((s) => s.replace(/<\/?style[^>]*>/gi, ''))
    .join('\n')
}

function checkTagHidden(openTag: string, cssText: string): string | null {
  // HTML hidden attribute
  if (/\shidden[\s/>=]/i.test(openTag)) {
    return 'has the HTML "hidden" attribute'
  }

  // aria-hidden="true"
  if (/aria-hidden\s*=\s*["']true["']/i.test(openTag)) {
    return 'has aria-hidden="true"'
  }

  // Inline style checks
  const inlineStyle = openTag.match(/style\s*=\s*["']([^"']*)["']/i)?.[1]?.toLowerCase() ?? ''
  if (/display\s*:\s*none/.test(inlineStyle)) return 'has inline style "display: none"'
  if (/visibility\s*:\s*hidden/.test(inlineStyle)) return 'has inline style "visibility: hidden"'
  if (/opacity\s*:\s*0(?!\.)/.test(inlineStyle)) return 'has inline style "opacity: 0"'
  if (/font-size\s*:\s*0/.test(inlineStyle)) return 'has inline style "font-size: 0"'
  if (/clip\s*:\s*rect\s*\(\s*0/.test(inlineStyle)) return 'is clipped to zero size via inline style'

  // CSS class checks
  const classes = (openTag.match(/class\s*=\s*["']([^"']*)["']/i)?.[1] ?? '')
    .split(/\s+/)
    .filter(Boolean)

  if (!classes.length) return null

  for (const cls of classes) {
    if (KNOWN_HIDING_CLASSES.has(cls.toLowerCase())) {
      return `uses the CSS utility class "${cls}" which visually hides content`
    }
  }

  if (!cssText) return null

  for (const cls of classes) {
    const escaped = cls.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const ruleRe = new RegExp(`\\.${escaped}(?=[\\s,.:+~>[{/)])[^{]*\\{([^}]*)\\}`, 'gi')
    let m: RegExpExecArray | null
    while ((m = ruleRe.exec(cssText)) !== null) {
      const d = m[1].toLowerCase()
      if (/display\s*:\s*none/.test(d)) return `is hidden via CSS class ".${cls}" (display: none)`
      if (/visibility\s*:\s*hidden/.test(d)) return `is hidden via CSS class ".${cls}" (visibility: hidden)`
      if (/opacity\s*:\s*0(?!\.)/.test(d)) return `is hidden via CSS class ".${cls}" (opacity: 0)`
      if (/clip\s*:\s*rect\s*\(\s*0/.test(d)) return `is visually clipped to zero via CSS class ".${cls}"`
      if (/font-size\s*:\s*0/.test(d)) return `is hidden via CSS class ".${cls}" (font-size: 0)`
    }
  }

  return null
}

// Builds a stack of open ancestor tags by replaying all tags before the H1 position.
function getAncestorTags(html: string, h1Index: number, limit: number): string[] {
  const before = html.slice(0, h1Index)
  const stack: string[] = []
  const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:\s[^>]*)?)(\/?)>/g
  let m: RegExpExecArray | null

  while ((m = tagRe.exec(before)) !== null) {
    const fullTag = m[0]
    const isClosing = m[1] === '/'
    const tagName = m[2].toLowerCase()
    const isSelfClosing = m[4] === '/'

    if (isClosing) {
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].match(/^<([a-zA-Z][a-zA-Z0-9-]*)/)?.[1]?.toLowerCase() === tagName) {
          stack.splice(i, 1)
          break
        }
      }
    } else if (!isSelfClosing && !VOID_ELEMENTS.has(tagName)) {
      stack.push(fullTag)
    }
  }

  // Return the closest `limit` ancestors, nearest first
  return stack.slice(-limit).reverse()
}

export function validateH1(html: string): ValidationResult {
  const matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)

  if (!matches) {
    return {
      rule: 'h1-tag',
      status: 'fail',
      message: 'No H1 tag found on the page',
      details: 'Pages which have a missing <h1>, the content is empty or has a whitespace. The <h1> should describe the main title and purpose of the page and are considered to be one of the stronger on-page ranking signals.\n' +
          'Ensure important pages have concise, descriptive and unique headings to help users, and enable search engines to score and rank the page for relevant search queries.',
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

  const cssText = extractCss(html)
  const openTag = matches[0].match(/^<h1[^>]*>/i)?.[0] ?? ''

  // Check the H1 element itself
  const selfHidden = checkTagHidden(openTag, cssText)
  if (selfHidden) {
    return {
      rule: 'h1-tag',
      status: 'fail',
      message: 'H1 tag is present but hidden from view',
      details: `H1 ${selfHidden}`,
    }
  }

  // Check up to 10 ancestor elements
  const h1Index = html.search(/<h1[\s>]/i)
  if (h1Index !== -1) {
    const ancestors = getAncestorTags(html, h1Index, 10)
    for (const ancestor of ancestors) {
      const tagName = ancestor.match(/^<([a-zA-Z][a-zA-Z0-9-]*)/)?.[1] ?? 'element'
      const reason = checkTagHidden(ancestor, cssText)
      if (reason) {
        return {
          rule: 'h1-tag',
          status: 'fail',
          message: 'H1 tag is hidden by a parent element',
          details: `A parent <${tagName}> ${reason}`,
        }
      }
    }
  }

  // Check that H1 appears before any H2–H6 in the DOM
  const subHeadingMatch = html.match(/<(h[2-6])[\s>]/i)
  if (subHeadingMatch) {
    const subIndex = html.search(/<h[2-6][\s>]/i)
    if (subIndex < h1Index) {
      return {
        rule: 'h1-tag',
        status: 'fail',
        message: `H1 tag appears after a <${subHeadingMatch[1].toLowerCase()}> in the DOM`,
        details: 'H1 should be the first heading on the page. All H2–H6 tags must come after it.',
      }
    }
  }

  const content = matches[0].replace(/<[^>]+>/g, '').trim()

  return {
    rule: 'h1-tag',
    status: 'pass',
    message: 'Exactly one visible H1 tag found',
    details: content ? `Content: "${content}"` : undefined,
  }
}
