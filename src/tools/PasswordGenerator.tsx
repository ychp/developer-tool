import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { KeySquare, Copy, Check, RefreshCw } from 'lucide-react'

export function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [refresh, setRefresh] = useState(0)
  const [copied, setCopied] = useState(false)

  const password = useMemo(() => {
    let chars = ''
    if (includeUppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (includeLowercase) chars += 'abcdefghijklmnopqrstuvwxyz'
    if (includeNumbers) chars += '0123456789'
    if (includeSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'

    if (!chars) return ''

    let result = ''
    const array = new Uint32Array(length)
    crypto.getRandomValues(array)
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length]
    }
    return result
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, refresh])

  const copyToClipboard = async () => {
    if (password) {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getPasswordStrength = () => {
    if (!password) return { label: '', color: '', score: 0 }

    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (password.length >= 16) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (score <= 2) return { label: '弱', color: 'bg-red-500', score }
    if (score <= 4) return { label: '中等', color: 'bg-yellow-500', score }
    if (score <= 5) return { label: '强', color: 'bg-green-500', score }
    return { label: '非常强', color: 'bg-green-600', score }
  }

  const strength = getPasswordStrength()

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-900 dark:text-slate-200">
          <span className="p-2 rounded-lg bg-gradient-to-br from-sky-500 to-blue-500 text-white">
            <KeySquare className="h-8 w-8" />
          </span>
          密码生成器
        </h1>
        <p className="text-muted-foreground text-slate-600 dark:text-slate-400">
          生成安全的随机密码
        </p>
      </div>

      <Card className="bg-white dark:bg-slate-950/60 backdrop-blur-xl border-slate-200 dark:border-slate-700/60 dark:shadow-2xl dark:shadow-black/40 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 dark:before:opacity-100 before:pointer-events-none">
        <CardHeader className="relative">
          <CardTitle className="text-slate-700 dark:text-slate-200">生成的密码</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 relative">
          <div className="p-4 rounded-lg bg-muted dark:bg-slate-950/70 backdrop-blur-md font-mono text-lg break-all text-center text-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60">
            {password || '请选择至少一种字符类型'}
          </div>
          <div className="flex gap-2">
              <Button onClick={() => setRefresh(r => r + 1)} className="flex-1 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white shadow-lg shadow-sky-500/30">
                <RefreshCw className="mr-2 h-4 w-4" />
                重新生成
              </Button>
            <Button
              onClick={copyToClipboard}
              disabled={!password}
              variant={copied ? 'outline' : 'default'}
              className={copied ? 'border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800' : 'bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white shadow-lg shadow-sky-500/30'}
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  复制
                </>
              )}
            </Button>
          </div>
          {password && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-700 dark:text-slate-300">
                <span>密码强度</span>
                <span className="font-medium">{strength.label}</span>
              </div>
              <div className="h-2 bg-muted dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${strength.color} transition-all`}
                  style={{ width: `${(strength.score / 7) * 100}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-slate-950/60 backdrop-blur-xl border-slate-200 dark:border-slate-700/60 dark:shadow-2xl dark:shadow-black/40 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 dark:before:opacity-100 before:pointer-events-none">
        <CardHeader className="relative">
          <CardTitle className="text-slate-700 dark:text-slate-200">选项</CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">自定义密码设置</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">密码长度</label>
              <span className="text-sm text-muted-foreground text-slate-500 dark:text-slate-400">{length}</span>
            </div>
            <Input
              type="range"
              min={4}
              max={64}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-sky-500"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-slate-700 dark:text-slate-300">大写字母 (A-Z)</span>
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="w-4 h-4 accent-sky-500"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-slate-700 dark:text-slate-300">小写字母 (a-z)</span>
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="w-4 h-4 accent-sky-500"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-slate-700 dark:text-slate-300">数字 (0-9)</span>
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="w-4 h-4 accent-sky-500"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer group">
              <span className="text-sm text-slate-700 dark:text-slate-300">特殊符号 (!@#$...)</span>
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="w-4 h-4 accent-sky-500"
              />
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
