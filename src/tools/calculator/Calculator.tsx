import { useState, useEffect, useCallback, useMemo } from 'react'
import { Calculator as CalculatorIcon, History, Trash2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface HistoryItem {
  expression: string
  result: string
}

export function Calculator() {
  const [expression, setExpression] = useState('')
  const [display, setDisplay] = useState('0')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [error, setError] = useState<string | null>(null)
  const [lastResult, setLastResult] = useState<string | null>(null)

  const evaluateExpression = useCallback((expr: string): number => {
    const cleanExpr = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**')

    try {
      const result = Function('"use strict"; return (' + cleanExpr + ')')()
      return result
    } catch (e) {
      setError('表达式错误')
      return NaN
    }
  }, [])

  const calculate = useCallback(() => {
    setError(null)

    if (!expression || expression.trim() === '') {
      return
    }

    const result = evaluateExpression(expression)

    if (isNaN(result)) {
      setDisplay('Error')
      return
    }

    if (!isFinite(result)) {
      setDisplay('Infinity')
      return
    }

    const resultStr = String(result)
    setDisplay(resultStr)
    setLastResult(resultStr)

    setHistory(prev => [{ expression, result: resultStr }, ...prev].slice(0, 20))
    setExpression('')
  }, [expression, evaluateExpression])

  const inputDigit = useCallback(
    (digit: string) => {
      setError(null)

      if (lastResult !== null && expression === '') {
        setLastResult(null)
        setExpression(digit)
        setDisplay(digit)
      } else {
        const newExpression = expression === '' ? digit : expression + digit
        setExpression(newExpression)
        setDisplay(newExpression)
      }
    },
    [expression, lastResult]
  )

  const inputOperator = useCallback(
    (op: string) => {
      setError(null)

      if (lastResult !== null && expression === '') {
        setLastResult(null)
        setExpression(display + op)
        setDisplay(display + op)
        return
      }

      const lastChar = expression.slice(-1)
      if (['+', '-', '×', '÷', '^'].includes(lastChar)) {
        const newExpression = expression.slice(0, -1) + op
        setExpression(newExpression)
        setDisplay(newExpression)
      } else {
        const newExpression = expression + op
        setExpression(newExpression)
        setDisplay(newExpression)
      }
    },
    [expression, display, lastResult]
  )

  const inputDecimal = useCallback(() => {
    setError(null)

    const parts = expression.split(/[\+\-\×\÷\^]/)
    const lastPart = parts[parts.length - 1]

    if (lastPart && lastPart.indexOf('.') === -1) {
      const newExpression = expression === '' ? '0.' : expression + '.'
      setExpression(newExpression)
      setDisplay(newExpression)
    } else if (expression === '') {
      setExpression('0.')
      setDisplay('0.')
    }
  }, [expression])

  const clear = useCallback(() => {
    setExpression('')
    setDisplay('0')
    setError(null)
    setLastResult(null)
  }, [])

  const deleteLast = useCallback(() => {
    setError(null)

    if (expression.length > 0) {
      const newExpression = expression.slice(0, -1)
      setExpression(newExpression)
      setDisplay(newExpression === '' ? '0' : newExpression)
    } else {
      setDisplay('0')
    }
  }, [expression])

  const toggleSign = useCallback(() => {
    setError(null)
    const parts = expression.split(/[\+\-\×\÷\^]/)
    const lastPart = parts[parts.length - 1]

    if (lastPart && lastPart !== '') {
      const operators = expression.split(new RegExp(lastPart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'))
      const operator = operators[operators.length - 1]

      let newExpression = ''
      if (operator.endsWith('-')) {
        newExpression = expression.slice(0, -lastPart.length - 1) + '+' + lastPart
      } else if (operator.endsWith('+')) {
        newExpression = expression.slice(0, -lastPart.length - 1) + '-' + lastPart
      } else {
        newExpression = expression.slice(0, -lastPart.length) + '-' + lastPart
      }

      setExpression(newExpression)
      setDisplay(newExpression)
    }
  }, [expression])

  const inputPercent = useCallback(() => {
    setError(null)
    const parts = expression.split(/[\+\-\×\÷\^]/)
    const lastPart = parts[parts.length - 1]

    if (lastPart && lastPart !== '') {
      const value = parseFloat(lastPart)
      if (!isNaN(value)) {
        const percentValue = value / 100
        const newExpression = expression.slice(0, -lastPart.length) + percentValue.toString()
        setExpression(newExpression)
        setDisplay(newExpression)
      }
    }
  }, [expression])

  const square = useCallback(() => {
    setError(null)

    if (expression === '' && lastResult !== null) {
      const value = parseFloat(lastResult)
      const result = value * value
      const resultStr = String(result)
      setDisplay(resultStr)
      setHistory(prev => [{ expression: `${lastResult}²`, result: resultStr }, ...prev].slice(0, 20))
      setLastResult(resultStr)
      return
    }

    const parts = expression.split(/[\+\-\×\÷\^]/)
    const lastPart = parts[parts.length - 1]

    if (lastPart && lastPart !== '') {
      const value = parseFloat(lastPart)
      if (!isNaN(value)) {
        const result = value * value
        const newExpression = expression.slice(0, -lastPart.length) + result.toString()
        setExpression(newExpression)
        setDisplay(newExpression)
      }
    }
  }, [expression, lastResult])

  const squareRoot = useCallback(() => {
    setError(null)

    if (expression === '' && lastResult !== null) {
      const value = parseFloat(lastResult)
      if (value < 0) {
        setError('负数不能开平方根')
        return
      }
      const result = Math.sqrt(value)
      const resultStr = String(result)
      setDisplay(resultStr)
      setHistory(prev => [{ expression: `√${lastResult}`, result: resultStr }, ...prev].slice(0, 20))
      setLastResult(resultStr)
      return
    }

    const parts = expression.split(/[\+\-\×\÷\^]/)
    const lastPart = parts[parts.length - 1]

    if (lastPart && lastPart !== '') {
      const value = parseFloat(lastPart)
      if (value < 0) {
        setError('负数不能开平方根')
        return
      }
      const result = Math.sqrt(value)
      const newExpression = expression.slice(0, -lastPart.length) + result.toString()
      setExpression(newExpression)
      setDisplay(newExpression)
    }
  }, [expression, lastResult])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        inputDigit(e.key)
      } else if (e.key === '.') {
        inputDecimal()
      } else if (e.key === '+') {
        inputOperator('+')
      } else if (e.key === '-') {
        inputOperator('-')
      } else if (e.key === '*') {
        e.preventDefault()
        inputOperator('×')
      } else if (e.key === '/') {
        e.preventDefault()
        inputOperator('÷')
      } else if (e.key === '^') {
        inputOperator('^')
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault()
        calculate()
      } else if (e.key === 'Escape') {
        clear()
      } else if (e.key === 'Backspace') {
        deleteLast()
      } else if (e.key === '%') {
        inputPercent()
      }
    },
    [inputDigit, inputDecimal, inputOperator, calculate, clear, deleteLast, inputPercent]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  const displayValue = useMemo(() => {
    if (error) {
      return 'Error'
    }

    if (display === '' || display === '0') {
      return '0'
    }

    return display
  }, [display, error])

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">科学计算器</h1>
        <p className="text-slate-600 dark:text-slate-400">
          支持完整表达式输入，按 = 号计算结果
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="mb-4">
              <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 mb-2 min-h-[80px] flex flex-col justify-end items-end">
                {error && (
                  <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm w-full mb-2">
                    {error}
                  </div>
                )}
                <div className="text-4xl font-bold text-slate-900 dark:text-slate-100 break-all text-right">
                  {displayValue}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              <Button
                variant="outline"
                onClick={clear}
                className="h-14 text-lg font-semibold bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
              >
                C
              </Button>
              <Button
                variant="outline"
                onClick={deleteLast}
                className="h-14 text-lg font-semibold"
              >
                DEL
              </Button>
              <Button
                variant="outline"
                onClick={inputPercent}
                className="h-14 text-lg font-semibold"
              >
                %
              </Button>
              <Button
                variant="outline"
                onClick={toggleSign}
                className="h-14 text-lg font-semibold"
              >
                ±
              </Button>
              <Button
                variant="outline"
                onClick={() => inputOperator('+')}
                className="h-14 text-lg font-semibold bg-sky-100 hover:bg-sky-200 dark:bg-sky-900/30 dark:hover:bg-sky-900/50 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800"
              >
                +
              </Button>

              <Button
                variant="outline"
                onClick={() => inputDigit('7')}
                className="h-14 text-lg font-semibold"
              >
                7
              </Button>
              <Button
                variant="outline"
                onClick={() => inputDigit('8')}
                className="h-14 text-lg font-semibold"
              >
                8
              </Button>
              <Button
                variant="outline"
                onClick={() => inputDigit('9')}
                className="h-14 text-lg font-semibold"
              >
                9
              </Button>
              <Button
                variant="outline"
                onClick={() => inputOperator('-')}
                className="h-14 text-lg font-semibold bg-sky-100 hover:bg-sky-200 dark:bg-sky-900/30 dark:hover:bg-sky-900/50 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800"
              >
                -
              </Button>
              <Button
                variant="outline"
                onClick={squareRoot}
                className="h-14 text-lg font-semibold bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800"
              >
                √
              </Button>

              <Button
                variant="outline"
                onClick={() => inputDigit('4')}
                className="h-14 text-lg font-semibold"
              >
                4
              </Button>
              <Button
                variant="outline"
                onClick={() => inputDigit('5')}
                className="h-14 text-lg font-semibold"
              >
                5
              </Button>
              <Button
                variant="outline"
                onClick={() => inputDigit('6')}
                className="h-14 text-lg font-semibold"
              >
                6
              </Button>
              <Button
                variant="outline"
                onClick={() => inputOperator('×')}
                className="h-14 text-lg font-semibold bg-sky-100 hover:bg-sky-200 dark:bg-sky-900/30 dark:hover:bg-sky-900/50 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800"
              >
                ×
              </Button>
              <Button
                variant="outline"
                onClick={square}
                className="h-14 text-lg font-semibold bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800"
              >
                x²
              </Button>

              <Button
                variant="outline"
                onClick={() => inputDigit('1')}
                className="h-14 text-lg font-semibold"
              >
                1
              </Button>
              <Button
                variant="outline"
                onClick={() => inputDigit('2')}
                className="h-14 text-lg font-semibold"
              >
                2
              </Button>
              <Button
                variant="outline"
                onClick={() => inputDigit('3')}
                className="h-14 text-lg font-semibold"
              >
                3
              </Button>
              <Button
                variant="outline"
                onClick={() => inputOperator('÷')}
                className="h-14 text-lg font-semibold bg-sky-100 hover:bg-sky-200 dark:bg-sky-900/30 dark:hover:bg-sky-900/50 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800"
              >
                ÷
              </Button>
              <Button
                variant="outline"
                onClick={() => inputOperator('^')}
                className="h-14 text-lg font-semibold bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800"
              >
                xʸ
              </Button>

              <Button
                variant="outline"
                onClick={() => inputDigit('0')}
                className="h-14 text-lg font-semibold col-span-2"
              >
                0
              </Button>
              <Button
                variant="outline"
                onClick={inputDecimal}
                className="h-14 text-lg font-semibold"
              >
                .
              </Button>
              <Button
                onClick={calculate}
                className="h-14 col-span-2 text-lg font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
              >
                =
              </Button>
            </div>
          </Card>

          <Card className="mt-6 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CalculatorIcon className="w-5 h-5 text-sky-500" />
              键盘快捷键
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">0-9</kbd>
                <span className="text-slate-600 dark:text-slate-400">数字</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">+ - * /</kbd>
                <span className="text-slate-600 dark:text-slate-400">运算</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">Enter</kbd>
                <span className="text-slate-600 dark:text-slate-400">等于</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">Esc</kbd>
                <span className="text-slate-600 dark:text-slate-400">清除</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">Backspace</kbd>
                <span className="text-slate-600 dark:text-slate-400">删除</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">.</kbd>
                <span className="text-slate-600 dark:text-slate-400">小数点</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">%</kbd>
                <span className="text-slate-600 dark:text-slate-400">百分比</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <History className="w-5 h-5 text-sky-500" />
                历史记录
              </h2>
              {history.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
                  title="清空历史"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
                暂无计算历史
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    onClick={() => {
                      setExpression('')
                      setDisplay(item.result)
                      setLastResult(item.result)
                    }}
                  >
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      {item.expression}
                    </div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      = {item.result}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">使用提示</h2>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300">
                <strong>提示：</strong>支持完整表达式输入，如 2+3×4
              </div>
              <ul className="list-disc list-inside space-y-1">
                <li>输入完整表达式后按 = 计算</li>
                <li>支持运算符优先级</li>
                <li>点击历史记录可使用结果</li>
                <li>最多保留 20 条历史记录</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
