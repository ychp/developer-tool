import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Lock, Copy, Check, AlertCircle } from 'lucide-react'

interface JwtHeader {
  alg?: string
  typ?: string
  [key: string]: any
}

interface JwtPayload {
  iss?: string
  sub?: string
  aud?: string | string[]
  exp?: number
  nbf?: number
  iat?: number
  jti?: string
  [key: string]: any
}

export function JwtDecoder() {
  const [input, setInput] = useState('')
  const [header, setHeader] = useState<JwtHeader | null>(null)
  const [payload, setPayload] = useState<JwtPayload | null>(null)
  const [signature, setSignature] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const decodeJwt = () => {
    setError('')
    setHeader(null)
    setPayload(null)
    setSignature('')

    if (!input.trim()) return

    try {
      const parts = input.split('.')
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. Expected 3 parts separated by dots.')
      }

      const [headerB64, payloadB64, sig] = parts

      const decodeBase64 = (str: string) => {
        try {
          const padded = str.replace(/-/g, '+').replace(/_/g, '/')
          const decoded = atob(padded)
          return JSON.parse(decoded)
        } catch {
          return null
        }
      }

      const decodedHeader = decodeBase64(headerB64)
      const decodedPayload = decodeBase64(payloadB64)

      if (!decodedHeader || !decodedPayload) {
        throw new Error('Failed to decode JWT parts. Invalid base64 encoding.')
      }

      setHeader(decodedHeader)
      setPayload(decodedPayload)
      setSignature(sig)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decode JWT')
    }
  }

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'N/A'
    return new Date(timestamp * 1000).toLocaleString()
  }

  const isExpired = (exp?: number) => {
    if (!exp) return null
    return Date.now() / 1000 > exp
  }

  const copyToClipboard = async (value: any, key: string) => {
    await navigator.clipboard.writeText(JSON.stringify(value, null, 2))
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Lock className="h-8 w-8" />
          JWT 解码器
        </h1>
        <p className="text-muted-foreground">
          解码 JSON Web Token，查看 Header 和 Payload
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>输入 JWT</CardTitle>
          <CardDescription>粘贴你的 JWT token</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            className="min-h-[100px] font-mono text-sm"
          />
          <Button onClick={decodeJwt} className="w-full">
            解码 JWT
          </Button>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">解码失败</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {header && payload && (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Header</CardTitle>
                  <Button
                    onClick={() => copyToClipboard(header, 'header')}
                    variant="ghost"
                    size="sm"
                  >
                    {copied === 'header' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto">
                  {JSON.stringify(header, null, 2)}
                </pre>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Payload</CardTitle>
                  <Button
                    onClick={() => copyToClipboard(payload, 'payload')}
                    variant="ghost"
                    size="sm"
                  >
                    {copied === 'payload' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {payload.exp && (
                  <div className={`p-3 rounded-lg ${isExpired(payload.exp) ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-700 dark:text-green-300'}`}>
                    <p className="text-sm font-medium">
                      {isExpired(payload.exp) ? '⚠️ Token 已过期' : '✓ Token 有效'}
                    </p>
                    <p className="text-xs mt-1">
                      过期时间: {formatDate(payload.exp)}
                    </p>
                  </div>
                )}
                <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto">
                  {JSON.stringify(payload, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Signature</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg font-mono text-sm break-all">
                {signature}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
