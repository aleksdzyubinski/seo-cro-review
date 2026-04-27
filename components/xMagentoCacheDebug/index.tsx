import ValidationCard from '@/components/ValidationCard'
import type { ValidationResult } from '@/lib/types'

export default function XMagentoCacheDebugCard({ result }: { result: ValidationResult }) {
  return <ValidationCard title="Full Page Cache" result={result} />
}
