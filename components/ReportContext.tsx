'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { ValidationResult } from '@/lib/types'

interface ReportState {
  results: ValidationResult[] | null
  analyzedUrl: string
  setReport: (results: ValidationResult[], url: string) => void
}

const ReportContext = createContext<ReportState>({
  results: null,
  analyzedUrl: '',
  setReport: () => {},
})

export function ReportProvider({ children }: { children: ReactNode }) {
  const [results, setResults] = useState<ValidationResult[] | null>(null)
  const [analyzedUrl, setAnalyzedUrl] = useState('')

  return (
    <ReportContext.Provider value={{
      results,
      analyzedUrl,
      setReport: (r, u) => { setResults(r); setAnalyzedUrl(u) },
    }}>
      {children}
    </ReportContext.Provider>
  )
}

export const useReport = () => useContext(ReportContext)
