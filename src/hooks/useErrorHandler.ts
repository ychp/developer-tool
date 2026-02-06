import { useState } from 'react'

export function useErrorHandler() {
  const [error, setError] = useState('')
  const [hasError, setHasError] = useState(false)

  const runWithErrorHandling = async (fn: () => Promise<void> | void, errorMessage?: string) => {
    try {
      await fn()
      setError('')
      setHasError(false)
      return true
    } catch (err) {
      const message = errorMessage || (err instanceof Error ? err.message : '未知错误')
      setError(message)
      setHasError(true)
      return false
    }
  }

  const clearError = () => {
    setError('')
    setHasError(false)
  }

  return { error, hasError, setError, runWithErrorHandling, clearError }
}
