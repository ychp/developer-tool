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
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <KeySquare className="h-8 w-8" />
          密码生成器
        </h1>
        <p className="text-muted-foreground">
          生成安全的随机密码
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>生成的密码</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted font-mono text-lg break-all text-center">
            {password || '请选择至少一种字符类型'}
          </div>
          <div className="flex gap-2">
              <Button onClick={() => setRefresh(r => r + 1)} className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                重新生成
              </Button>
            <Button
              onClick={copyToClipboard}
              disabled={!password}
              variant={copied ? 'outline' : 'default'}
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
              <div className="flex justify-between text-sm">
                <span>密码强度</span>
                <span className="font-medium">{strength.label}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${strength.color} transition-all`}
                  style={{ width: `${(strength.score / 7) * 100}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>选项</CardTitle>
          <CardDescription>自定义密码设置</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">密码长度</label>
              <span className="text-sm text-muted-foreground">{length}</span>
            </div>
            <Input
              type="range"
              min={4}
              max={64}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">大写字母 (A-Z)</span>
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="w-4 h-4"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">小写字母 (a-z)</span>
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="w-4 h-4"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">数字 (0-9)</span>
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="w-4 h-4"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">特殊符号 (!@#$...)</span>
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="w-4 h-4"
              />
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
