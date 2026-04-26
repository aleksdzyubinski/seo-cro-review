import ValidationCard from '@/components/ValidationCard'
import type { ValidationResult } from '@/lib/types'

export default function H1ValidatorCard({ result }: { result: ValidationResult }) {
  return <ValidationCard title="H1 Tag" result={result} />
}
