import { useState } from 'react'

export function useClipboard() {
  const [copied, setCopied] = useState(false)

  const copy = async (text: string) => {
    if (text) {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        return true
      } catch (err) {
        console.error('复制失败:', err)
        return false
      }
    }
    return false
  }

  return { copied, copy }
}
