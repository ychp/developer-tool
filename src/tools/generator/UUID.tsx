import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { KeySquare, Copy, Check, RefreshCw } from 'lucide-react'

type UUIDVersion = 'v4' | 'nil'

export function UUID() {
  const [uuids, setUuids] = useState<string[]>([])
  const [version, setVersion] = useState<UUIDVersion>('v4')
  const [count, setCount] = useState(1)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const generateUUID = () => {
    const newUuids: string[] = []
    for (let i = 0; i < count; i++) {
      if (version === 'v4') {
        newUuids.push(crypto.randomUUID())
      } else {
        newUuids.push('00000000-0000-0000-0000-000000000000')
      }
    }
    setUuids(newUuids)
  }

  const copyToClipboard = async (uuid: string, index: number) => {
    await navigator.clipboard.writeText(uuid)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const copyAll = async () => {
    if (uuids.length > 0) {
      await navigator.clipboard.writeText(uuids.join('\n'))
    }
  }

  const clear = () => {
    setUuids([])
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <KeySquare className="h-8 w-8" />
          UUID 生成器
        </h1>
        <p className="text-muted-foreground">
          生成各种版本的 UUID (Universally Unique Identifier)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>生成选项</CardTitle>
          <CardDescription>选择 UUID 版本和生成数量</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">UUID 版本</label>
              <select
                value={version}
                onChange={(e) => setVersion(e.target.value as UUIDVersion)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="v4">UUID v4 (随机)</option>
                <option value="nil">Nil UUID</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">生成数量</label>
              <Input
                type="number"
                min={1}
                max={100}
                value={count}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                className="font-mono"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={generateUUID} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              生成 UUID
            </Button>
            {uuids.length > 0 && (
              <Button onClick={clear} variant="outline">
                清空
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {uuids.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>生成结果</CardTitle>
                <CardDescription>共生成 {uuids.length} 个 UUID</CardDescription>
              </div>
              <Button onClick={copyAll} variant="outline" size="sm">
                <Copy className="mr-2 h-4 w-4" />
                复制全部
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uuids.map((uuid, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <code className="text-sm font-mono flex-1 overflow-hidden text-ellipsis">
                    {uuid}
                  </code>
                  <Button
                    onClick={() => copyToClipboard(uuid, index)}
                    variant="ghost"
                    size="sm"
                    className="shrink-0"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
