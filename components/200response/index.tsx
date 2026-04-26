import ValidationCard from '@/components/ValidationCard'
import type { ValidationResult } from '@/lib/types'

export default function ResponseCodeCard({ result }: { result: ValidationResult }) {
  return <ValidationCard title="HTTP Response Code" result={result} />
}
