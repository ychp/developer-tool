import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Hash, Copy, Check, Trash2 } from 'lucide-react'
import MD5 from 'crypto-js/md5'
import SHA1 from 'crypto-js/sha1'
import SHA256 from 'crypto-js/sha256'
import SHA512 from 'crypto-js/sha512'

type HashType = 'md5' | 'sha1' | 'sha256' | 'sha512'

export function HashGenerator() {
  const [input, setInput] = useState('')
  const [hashType, setHashType] = useState<HashType>('md5')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const generateHash = () => {
    if (!input) {
      setOutput('')
      return
    }

    let hash = ''
    switch (hashType) {
      case 'md5':
        hash = MD5(input).toString()
        break
      case 'sha1':
        hash = SHA1(input).toString()
        break
      case 'sha256':
        hash = SHA256(input).toString()
        break
      case 'sha512':
        hash = SHA512(input).toString()
        break
    }
    setOutput(hash)
  }

  const copyToClipboard = async () => {
    if (output) {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const clear = () => {
    setInput('')
    setOutput('')
  }

  const allHashes = input ? {
    md5: MD5(input).toString(),
    sha1: SHA1(input).toString(),
    sha256: SHA256(input).toString(),
    sha512: SHA512(input).toString(),
  } : null

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Hash className="h-8 w-8" />
          哈希生成器
        </h1>
        <p className="text-muted-foreground">
          生成 MD5、SHA1、SHA256、SHA512 哈希值
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>输入文本</CardTitle>
          <CardDescription>输入要生成哈希的文本</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入文本..."
            className="min-h-[120px] font-mono text-sm"
          />
          <div className="flex gap-2">
            <Button onClick={generateHash} className="flex-1">
              生成哈希
            </Button>
            <Button onClick={clear} variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>算法选择</CardTitle>
          <CardDescription>选择哈希算法</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['md5', 'sha1', 'sha256', 'sha512'] as HashType[]).map((type) => (
              <Button
                key={type}
                onClick={() => setHashType(type)}
                variant={hashType === type ? 'default' : 'outline'}
                className="font-mono text-sm uppercase"
              >
                {type}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {output && (
        <Card>
          <CardHeader>
            <CardTitle>{hashType.toUpperCase()} 结果</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted font-mono text-sm break-all">
              {output}
            </div>
            <Button
              onClick={copyToClipboard}
              variant={copied ? "outline" : "default"}
              className="w-full"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  复制结果
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {allHashes && (
        <Card>
          <CardHeader>
            <CardTitle>所有哈希值</CardTitle>
            <CardDescription>当前输入的所有哈希算法结果</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(allHashes).map(([type, value]) => (
                <div key={type} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium uppercase">{type}</span>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(value)
                      }}
                      variant="ghost"
                      size="sm"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="p-3 rounded bg-muted font-mono text-xs break-all">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
