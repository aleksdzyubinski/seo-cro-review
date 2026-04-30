'use client'

import { useReport } from '@/components/ReportContext'
import type { ValidationResult } from '@/lib/types'

const ruleTitles: Record<string, string> = {
  'h1-tag':                'H1 Tag',
  '200-response':          'HTTP Response Code',
  'cloudflare':            'Cloudflare CDN',
  'magento-version':       'Magento Version',
  'robots':                'Robots.txt Sitemap',
  'x-magento-cache-debug': 'Full Page Cache',
  'meta-pixel':            'Meta Pixel',
}

function toReportItem(r: ValidationResult) {
  return {
    title:   ruleTitles[r.rule] ?? r.rule,
    message: r.message,
    details: r.details ?? '',
    result:  r.status === 'pass' ? 'pass' : 'fail',
  }
}

export default function DownloadReportButton() {
  const { results, analyzedUrl } = useReport()

  if (!results) return null

  async function handleClick() {
    const template = await fetch('/report-template.html').then(r => r.text())

    const hostname  = new URL(analyzedUrl).hostname
    const date      = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    const passCount = results!.filter(r => r.status === 'pass').length
    const failCount = results!.filter(r => r.status !== 'pass').length

    fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: analyzedUrl, timestamp: new Date().toISOString(), results: Object.fromEntries(results!.map(r => [r.rule, toReportItem(r)])) }),
    })

    const html = template
      .replace(/\{\{WEBSITE_NAME\}\}/g,  hostname)
      .replace(/\{\{ANALYZED_URL\}\}/g,  analyzedUrl)
      .replace(/\{\{DATE\}\}/g,          date)
      .replace(/\{\{PASS_COUNT\}\}/g,    String(passCount))
      .replace(/\{\{FAIL_COUNT\}\}/g,    String(failCount))
      .replace('{{RESULTS}}',            JSON.stringify(Object.fromEntries(results!.map(r => [r.rule, toReportItem(r)])), null, 2))

    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(html)
    win.document.close()
  }

  return (
    <button
      onClick={handleClick}
      className="rounded-full border border-white px-4 py-1.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/15 cursor-pointer"
    >
      Download Report
    </button>
  )
}
