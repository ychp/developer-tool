import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Copy, Check } from 'lucide-react'

type OperationType = 'merge' | 'split'

export function StringJoinAndSplit() {
  const [operationType, setOperationType] = useState<OperationType>('merge')
  const [delimiter, setDelimiter] = useState(',')
  const [operateQuotes, setOperateQuotes] = useState(false)
  const [quotesType, setQuotesType] = useState('"')
  const [removeSpace, setRemoveSpace] = useState(true)
  const [removeDuplicate, setRemoveDuplicate] = useState(true)
  const [source, setSource] = useState('')
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)

  const splitText = (text: string, delimiter: string): string[] => {
    return text.split(delimiter).filter((item) => item.trim() !== '')
  }

  const processStringArray = (arr: string[]): string[] => {
    let processed = [...arr]

    if (operateQuotes) {
      if (operationType === 'merge') {
        processed = processed.map((item) => quotesType + item + quotesType)
      } else {
        processed = processed.map((item) => {
          let processedItem = item
          if (processedItem.startsWith(quotesType)) {
            processedItem = processedItem.substring(1)
          }
          if (processedItem.endsWith(quotesType)) {
            processedItem = processedItem.substring(0, processedItem.length - 1)
          }
          return processedItem
        })
      }
    }

    if (removeSpace) {
      processed = processed.map((item) => item.trim())
    }

    if (operationType === 'split' && removeDuplicate) {
      processed = [...new Set(processed)]
    }

    return processed
  }

  const handleOperate = () => {
    if (operationType === 'merge') {
      const lines = splitText(source, '\n')
      const processed = processStringArray(lines)
      setResult(processed.join(delimiter))
    } else {
      const items = splitText(source, delimiter)
      const processed = processStringArray(items)
      setResult(processed.join('\n'))
    }
  }

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(result)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">字符串合并拆分</h1>
        <p className="text-sm text-muted-foreground">
          多行文本合并为一行，或一行文本拆分为多行
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">配置选项</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">操作类型</label>
              <div className="flex gap-2">
                <Button
                  variant={operationType === 'merge' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setOperationType('merge')}
                >
                  合并
                </Button>
                <Button
                  variant={operationType === 'split' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setOperationType('split')}
                >
                  拆分
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">分隔符</label>
              <div className="flex gap-2">
                <Button
                  variant={delimiter === ',' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDelimiter(',')}
                >
                  逗号
                </Button>
                <Button
                  variant={delimiter === ';' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDelimiter(';')}
                >
                  分号
                </Button>
                <Button
                  variant={delimiter === '|' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDelimiter('|')}
                >
                  竖线
                </Button>
              </div>
            </div>

            {operateQuotes && (
              <div className="space-y-2">
                <label className="text-sm font-medium">引号类型</label>
                <div className="flex gap-2">
                  <Button
                    variant={quotesType === '"' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setQuotesType('"')}
                  >
                    双引号
                  </Button>
                  <Button
                    variant={quotesType === "'" ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setQuotesType("'")}
                  >
                    单引号
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={operateQuotes}
                onChange={(e) => setOperateQuotes(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span>{operationType === 'split' ? '去除首尾引号' : '追加首尾引号'}</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={removeSpace}
                onChange={(e) => setRemoveSpace(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span>去除首尾空格</span>
            </label>

            {operationType === 'split' && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={removeDuplicate}
                  onChange={(e) => setRemoveDuplicate(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <span>结果去重</span>
              </label>
            )}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleOperate} className="flex-1">
              执行转换
            </Button>
            <Button
              onClick={handleCopy}
              variant="outline"
              disabled={!result}
              className="min-w-[120px]"
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
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">原始文本</CardTitle>
            <CardDescription className="text-xs">
              {operationType === 'merge' ? '每行一个字符串，将合并为一行' : '使用分隔符分隔的字符串'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder={operationType === 'merge' ? 'apple\nbanana\norange' : 'apple,banana,orange'}
              className="min-h-[300px] font-mono text-sm"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">转换结果</CardTitle>
            <CardDescription className="text-xs">
              {operationType === 'merge' ? '合并后的一行文本' : '拆分后的多行文本'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={result}
              readOnly
              placeholder="点击执行转换查看结果"
              className="min-h-[300px] font-mono text-sm"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
