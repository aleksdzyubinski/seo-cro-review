export interface ValidationResult {
  rule: string
  status: 'pass' | 'fail' | 'error'
  message: string
  details?: string
}
