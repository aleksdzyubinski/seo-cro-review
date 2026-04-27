import ValidationCard from '@/components/ValidationCard'
import type { ValidationResult } from '@/lib/types'

export default function RobotsCard({ result }: { result: ValidationResult }) {
  return <ValidationCard title="Robots.txt Sitemap" result={result} />
}
