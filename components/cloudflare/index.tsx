import ValidationCard from '@/components/ValidationCard'
import type { ValidationResult } from '@/lib/types'

export default function CloudflareCard({ result }: { result: ValidationResult }) {
  return <ValidationCard title="Cloudflare CDN" result={result} />
}
