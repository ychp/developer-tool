import { useEffect } from 'react'

interface KeyboardShortcuts {
  [key: string]: () => void
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const modifiers = [
        e.ctrlKey || e.metaKey ? 'Ctrl' : '',
        e.shiftKey ? 'Shift' : '',
        e.altKey ? 'Alt' : '',
      ].filter(Boolean)

      const key = e.key.toLowerCase()
      const shortcutKey = [...modifiers, key].filter(Boolean).join('+')

      const handler = shortcuts[shortcutKey]
      if (handler) {
        e.preventDefault()
        handler()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}
