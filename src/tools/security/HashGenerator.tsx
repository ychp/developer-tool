import { useState, useEffect } from 'react'
import { Hash } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ToolPageHeader } from '@/components/tool/ToolPageHeader'
import { CopyButton } from '@/components/tool/CopyButton'
import MD5 from 'crypto-js/md5'
import SHA1 from 'crypto-js/sha1'
import SHA256 from 'crypto-js/sha256'
import SHA512 from 'crypto-js/sha512'

type HashType = 'md5' | 'sha1' | 'sha256' | 'sha512'

export function HashGenerator() {
  const [input, setInput] = useState('')
  const [hashType, setHashType] = useState<HashType>('md5')
  const [output, setOutput] = useState('')

  const allHashes = input ? {
    md5: MD5(input).toString(),
    sha1: SHA1(input).toString(),
    sha256: SHA256(input).toString(),
    sha512: SHA512(input).toString(),
  } : null

  useEffect(() => {
    if (input && hashType) {
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
    } else {
      setOutput('')
    }
  }, [input, hashType])

  return (
    <div className="space-y-6">
      <ToolPageHeader
        icon={<Hash className="h-8 w-8" />}
        title="哈希生成器"
        description="生成 MD5、SHA1、SHA256、SHA512 哈希值"
      />

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
            <button
              onClick={() => setHashType('md5')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                hashType === 'md5'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              MD5
            </button>
            <button
              onClick={() => setHashType('sha1')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                hashType === 'sha1'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              SHA1
            </button>
            <button
              onClick={() => setHashType('sha256')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                hashType === 'sha256'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              SHA256
            </button>
            <button
              onClick={() => setHashType('sha512')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                hashType === 'sha512'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              SHA512
            </button>
          </div>
        </CardContent>
      </Card>

      {allHashes && (
        <Card>
          <CardHeader>
            <CardTitle>所有哈希值</CardTitle>
            <CardDescription>当前输入的所有哈希值</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(allHashes).map(([type, hash]) => (
              <div key={type} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium uppercase">{type}</span>
                  <CopyButton text={hash} size="sm" variant="ghost" />
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <code className="text-sm break-all font-mono">{hash}</code>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>输出结果</CardTitle>
          <CardDescription>选中的哈希算法结果</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={output}
            readOnly
            placeholder="哈希值将显示在这里"
            className="min-h-[120px] font-mono text-sm"
          />
          <div className="flex gap-2">
            <CopyButton text={output} className="flex-1" defaultLabel="复制哈希值" copiedLabel="已复制" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
