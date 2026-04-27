import ValidationCard from '@/components/ValidationCard'
import type { ValidationResult } from '@/lib/types'

export default function MetaPixelCard({ result }: { result: ValidationResult }) {
  return <ValidationCard title="Meta Pixel" result={result} />
}
