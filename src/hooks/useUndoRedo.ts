import { useState, useCallback, useRef } from 'react'

export function useUndoRedo(initialValue: string = '') {
  const [value, setValue] = useState(initialValue)
  const historyRef = useRef<string[]>([initialValue])
  const [currentIndex, setCurrentIndex] = useState(0)

  const updateValue = useCallback((newValue: string) => {
    setValue(newValue)
    
    const newHistory = historyRef.current.slice(0, currentIndex + 1)
    newHistory.push(newValue)
    historyRef.current = newHistory
    setCurrentIndex(newHistory.length - 1)
  }, [currentIndex])

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1
      setCurrentIndex(newIndex)
      setValue(historyRef.current[newIndex])
    }
  }, [currentIndex])

  const redo = useCallback(() => {
    if (currentIndex < historyRef.current.length - 1) {
      const newIndex = currentIndex + 1
      setCurrentIndex(newIndex)
      setValue(historyRef.current[newIndex])
    }
  }, [currentIndex])

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < historyRef.current.length - 1

  const reset = useCallback((newValue: string = '') => {
    setValue(newValue)
    historyRef.current = [newValue]
    setCurrentIndex(0)
  }, [])

  return {
    value,
    setValue: updateValue,
    undo,
    redo,
    canUndo,
    canRedo,
    reset
  }
}
