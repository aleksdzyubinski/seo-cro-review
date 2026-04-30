import { readFile, writeFile } from 'fs/promises'
import path from 'path'

export interface LogEntry {
  url: string
  timestamp: string
  results: Record<string, {
    title: string
    message: string
    details: string
    result: string
  }>
}

export async function logResults(entry: LogEntry): Promise<void> {
  const now = new Date()
  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const yyyy = now.getFullYear()
  const filename = `${dd}-${mm}-${yyyy}.log`
  const filepath = path.join(process.cwd(), 'logs', filename)
  let entries: LogEntry[] = []
  try {
    const existing = await readFile(filepath, 'utf8')
    entries = JSON.parse(existing)
  } catch {
    // file doesn't exist yet or is empty
  }
  entries.push(entry)
  await writeFile(filepath, JSON.stringify(entries, null, 2))
}