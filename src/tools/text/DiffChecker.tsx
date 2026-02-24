import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FileDiff, Copy, Check, Trash2, ArrowLeftRight } from 'lucide-react'
import { diffLines, type Change } from 'diff'

export function DiffChecker() {
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')
  const [diff, setDiff] = useState<Change[]>([])
  const [copied, setCopied] = useState(false)

  const compare = () => {
    if (!text1 && !text2) return
    
    const changes = diffLines(text1, text2)
    setDiff(changes)
  }

  const clear = () => {
    setText1('')
    setText2('')
    setDiff([])
  }

  const swap = () => {
    const temp = text1
    setText1(text2)
    setText2(temp)
    setDiff([])
  }

  const copyToClipboard = async () => {
    const result = diff.map(part => {
      const prefix = part.added ? '+ ' : part.removed ? '- ' : '  '
      return prefix + part.value
    }).join('')
    
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderDiff = () => {
    return diff.map((part, idx) => {
      let bgColor = 'bg-transparent'
      let textColor = 'text-foreground'
      let prefix = ''

      if (part.added) {
        bgColor = 'bg-green-500/20'
        textColor = 'text-green-700 dark:text-green-300'
        prefix = '+ '
      } else if (part.removed) {
        bgColor = 'bg-red-500/20'
        textColor = 'text-red-700 dark:text-red-300'
        prefix = '- '
      }

      const lines = part.value.split('\n').filter(line => line !== '')

      return lines.map((line, lineIdx) => (
        <div
          key={`${idx}-${lineIdx}`}
          className={`px-4 py-1 font-mono text-sm ${bgColor} ${textColor}`}
        >
          <span className="select-none mr-2 opacity-50">{prefix}</span>
          <span>{line}</span>
        </div>
      ))
    })
  }

  const stats = {
    additions: diff.filter(d => d.added).reduce((acc, d) => acc + d.value.split('\n').filter(l => l).length, 0),
    deletions: diff.filter(d => d.removed).reduce((acc, d) => acc + d.value.split('\n').filter(l => l).length, 0),
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileDiff className="h-8 w-8" />
          文本差异对比
        </h1>
        <p className="text-muted-foreground">
          比较两段文本的差异
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>原文</CardTitle>
            <CardDescription>输入原始文本</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="输入原始文本..."
              className="min-h-[250px] font-mono text-sm"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>新文</CardTitle>
                <CardDescription>输入修改后的文本</CardDescription>
              </div>
              <Button onClick={swap} variant="outline" size="icon" title="交换内容">
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="输入修改后的文本..."
              className="min-h-[250px] font-mono text-sm"
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button onClick={compare} className="flex-1">
          <FileDiff className="mr-2 h-4 w-4" />
          对比差异
        </Button>
        {diff.length > 0 && (
          <>
            <Button onClick={copyToClipboard} variant="outline">
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
            <Button onClick={clear} variant="ghost">
              <Trash2 className="mr-2 h-4 w-4" />
              清空
            </Button>
          </>
        )}
      </div>

      {diff.length > 0 && (
        <>
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-green-500/20"></span>
              <span className="text-green-700 dark:text-green-300">新增 {stats.additions} 行</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-red-500/20"></span>
              <span className="text-red-700 dark:text-red-300">删除 {stats.deletions} 行</span>
            </span>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>对比结果</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-background overflow-auto max-h-[500px]">
                {renderDiff()}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
