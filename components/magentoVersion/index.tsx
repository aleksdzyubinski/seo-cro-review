import ValidationCard from '@/components/ValidationCard'
import type { ValidationResult } from '@/lib/types'

export default function MagentoVersionCard({ result }: { result: ValidationResult }) {
  return <ValidationCard title="Magento Version" result={result} />
}
