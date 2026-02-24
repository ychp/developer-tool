import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Hash, Check, X, Trash2 } from 'lucide-react'

interface MatchResult {
  match: string
  index: number
  groups: string[]
}

export function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [flags, setFlags] = useState('gm')
  const [testString, setTestString] = useState('')

  const { results, error } = useMemo(() => {
    if (!pattern || !testString) return { results: [], error: '' }

    try {
      const regex = new RegExp(pattern, flags)
      
      const matches: MatchResult[] = []
      const globalMatch = testString.matchAll(regex)
      
      for (const match of globalMatch) {
        matches.push({
          match: match[0],
          index: match.index ?? 0,
          groups: match.slice(1),
        })
      }
      
      return { results: matches, error: '' }
    } catch (err) {
      return { results: [], error: err instanceof Error ? err.message : 'Invalid regex' }
    }
  }, [pattern, flags, testString])

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ''))
    } else {
      setFlags(flags + flag)
    }
  }

  const clear = () => {
    setPattern('')
    setTestString('')
    setFlags('gm')
  }

  const hasResults = results.length > 0
  const noResults = !error && pattern && testString && !hasResults

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Hash className="h-8 w-8" />
          正则表达式测试
        </h1>
        <p className="text-muted-foreground">
          实时测试正则表达式，查看匹配结果
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>正则表达式</CardTitle>
          <CardDescription>输入正则表达式模式和测试文本</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-muted-foreground">/</span>
                <Input
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="输入正则表达式，如: \\b\\w+\\b"
                  className="font-mono"
                />
                <span className="text-sm text-muted-foreground">/</span>
                <span className="text-sm font-mono text-primary">{flags}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => toggleFlag('g')}
              variant={flags.includes('g') ? 'default' : 'outline'}
              size="sm"
            >
              g (global)
            </Button>
            <Button
              onClick={() => toggleFlag('m')}
              variant={flags.includes('m') ? 'default' : 'outline'}
              size="sm"
            >
              m (multiline)
            </Button>
            <Button
              onClick={() => toggleFlag('i')}
              variant={flags.includes('i') ? 'default' : 'outline'}
              size="sm"
            >
              i (ignore case)
            </Button>
            <Button
              onClick={() => toggleFlag('s')}
              variant={flags.includes('s') ? 'default' : 'outline'}
              size="sm"
            >
              s (dotAll)
            </Button>
            <Button onClick={clear} variant="ghost" size="sm">
              <Trash2 className="h-4 w-4 mr-1" />
              清空
            </Button>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive flex items-center gap-2">
                <X className="h-4 w-4" />
                {error}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>测试文本</CardTitle>
          <CardDescription>输入要测试的文本内容</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="在这里输入测试文本..."
            className="min-h-[150px] font-mono text-sm"
          />
        </CardContent>
      </Card>

      {hasResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              匹配结果 ({results.length} 个)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-green-500/10 border border-green-500/20"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <span className="font-mono text-sm font-medium text-green-700 dark:text-green-300">
                      {result.match}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      位置: {result.index}
                    </span>
                  </div>
                  {result.groups.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {result.groups.map((group, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-700 dark:text-green-300"
                        >
                          ${i + 1}: {group || '(empty)'}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {noResults && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <X className="h-4 w-4" />
              未找到匹配项
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
