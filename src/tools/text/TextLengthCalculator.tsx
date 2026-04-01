import { useState, useMemo, useRef, useCallback } from 'react'
import { Trash2, Upload, Database, Hash, FileText, Ruler } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CopyButton } from '@/components/tool/CopyButton'

interface DatabaseType {
  name: string
  type: string
  maxLength: number
  description: string
  encoding?: string
  bytesPerChar: number
}

const databaseTypes: DatabaseType[] = [
  { name: 'MySQL', type: 'VARCHAR', maxLength: 65535, description: '最大 65,535 字符', encoding: 'utf8mb4', bytesPerChar: 4 },
  { name: 'MySQL', type: 'CHAR', maxLength: 255, description: '固定长度，最大 255', encoding: 'utf8mb4', bytesPerChar: 4 },
  { name: 'MySQL', type: 'TEXT', maxLength: 65535, description: '最大 64KB', encoding: 'utf8mb4', bytesPerChar: 4 },
  { name: 'MySQL', type: 'MEDIUMTEXT', maxLength: 16777215, description: '最大 16MB', encoding: 'utf8mb4', bytesPerChar: 4 },
  { name: 'MySQL', type: 'LONGTEXT', maxLength: 4294967295, description: '最大 4GB', encoding: 'utf8mb4', bytesPerChar: 4 },
  { name: 'PostgreSQL', type: 'VARCHAR(n)', maxLength: 10485760, description: '最大 10MB', encoding: 'UTF-8', bytesPerChar: 4 },
  { name: 'PostgreSQL', type: 'CHAR(n)', maxLength: 10485760, description: '最大 10MB', encoding: 'UTF-8', bytesPerChar: 4 },
  { name: 'PostgreSQL', type: 'TEXT', maxLength: Infinity, description: '无限制', encoding: 'UTF-8', bytesPerChar: 4 },
  { name: 'SQL Server', type: 'VARCHAR', maxLength: 8000, description: '最大 8,000 字符', encoding: 'Latin1/UTF-8', bytesPerChar: 1 },
  { name: 'SQL Server', type: 'NVARCHAR', maxLength: 4000, description: 'Unicode，最大 4,000', encoding: 'UTF-16', bytesPerChar: 2 },
  { name: 'SQL Server', type: 'VARCHAR(MAX)', maxLength: 2147483647, description: '最大 2GB', encoding: 'UTF-8', bytesPerChar: 1 },
  { name: 'SQL Server', type: 'TEXT', maxLength: 2147483647, description: '最大 2GB（已废弃）', encoding: 'Latin1', bytesPerChar: 1 },
  { name: 'Oracle', type: 'VARCHAR2', maxLength: 4000, description: '最大 4,000 字节', encoding: 'AL32UTF8', bytesPerChar: 4 },
  { name: 'Oracle', type: 'NVARCHAR2', maxLength: 2000, description: 'Unicode，最大 2,000', encoding: 'AL16UTF16', bytesPerChar: 2 },
  { name: 'Oracle', type: 'CLOB', maxLength: 4294967295, description: '最大 4GB', encoding: 'AL32UTF8', bytesPerChar: 4 },
  { name: 'SQLite', type: 'TEXT', maxLength: 1000000000, description: '最大 1GB', encoding: 'UTF-8', bytesPerChar: 4 },
]

export function TextLengthCalculator() {
  const [inputText, setInputText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
      e.preventDefault()
      textareaRef.current?.select()
    }
  }, [])

  const stats = useMemo(() => {
    const text = inputText
    const length = text.length
    const byteLength = new Blob([text]).size
    const lines = text.split('\n').length
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length
    const englishChars = (text.match(/[a-zA-Z]/g) || []).length
    const numbers = (text.match(/\d/g) || []).length
    const spaces = (text.match(/\s/g) || []).length
    // Emoji regex pattern covering various emoji ranges
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F018}-\u{1F270}]|[\u{238C}-\u{2454}]|[\u{20D0}-\u{20EF}]|[\u{2B50}]|[\u{2B55}]|[\u{FE0F}]|[\u{1F004}]|[\u{1F0CF}]|[\u{1F170}-\u{1F251}]|[\u{200D}]|[\u{1F3FB}-\u{1F3FF}]|[\u{E0020}-\u{E007F}]|[\u{20E3}]|[\u{FE0E}\u{FE0F}]/gu
    const emojis = (text.match(emojiRegex) || []).length
    const punctuation = length - chineseChars - englishChars - numbers - spaces - emojis

    return {
      length,
      byteLength,
      lines,
      words,
      chineseChars,
      englishChars,
      numbers,
      spaces,
      emojis,
      punctuation: Math.max(0, punctuation),
    }
  }, [inputText])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setInputText(content)
    }
    reader.readAsText(file)
  }

  const handleClear = () => {
    setInputText('')
  }

  const loadDemo = () => {
    const demoText = `这是一段示例文本，用于演示文本长度计算器的功能。🎉

Text length calculator demo:
- Characters: 字符数统计
- Words: 单词数统计  
- Lines: 行数统计
- Bytes: 字节数统计

数据库字段类型参考：
MySQL: VARCHAR(255), TEXT, LONGTEXT
PostgreSQL: VARCHAR, TEXT
SQL Server: NVARCHAR, VARCHAR(MAX)
Oracle: VARCHAR2, CLOB

1234567890
!@#$%^&*()

Emoji 测试: 😀 🎨 🔥 👍 🌟 ❤️ 🚀 💡

这段文本包含了中文、英文、数字、特殊符号和 Emoji 表情，可以用来测试各种统计功能。✨`
    setInputText(demoText)
  }

  const getStorageRecommendation = (length: number): string => {
    if (length <= 255) return 'VARCHAR(255) 或 CHAR'
    if (length <= 4000) return 'VARCHAR(4000) 或 NVARCHAR'
    if (length <= 65535) return 'TEXT 或 VARCHAR(MAX)'
    if (length <= 16777215) return 'MEDIUMTEXT'
    return 'LONGTEXT 或 CLOB'
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">文本长度计算器</h1>
        <p className="text-slate-600 dark:text-slate-400">
          计算文本字符数、字节数，并提供数据库存储类型建议
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5" />
              输入文本
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={loadDemo}>
                加载示例
              </Button>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".txt,.md,.json,.csv,.log,.xml,.html,.css,.js,.ts"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button variant="outline" size="sm" asChild>
                  <span className="flex items-center">
                    <Upload className="h-4 w-4 mr-1" />
                    上传文件
                  </span>
                </Button>
              </label>
              <Button variant="outline" size="sm" onClick={handleClear}>
                <Trash2 className="h-4 w-4 mr-1" />
                清空
              </Button>
            </div>
          </div>
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-64 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono text-sm resize-none"
            placeholder="在此输入或粘贴文本..."
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              字符数: {stats.length.toLocaleString()}
            </span>
            <CopyButton text={inputText} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Hash className="h-5 w-5" />
            统计结果
          </h2>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-sky-50 dark:bg-sky-900/20">
              <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                {stats.length.toLocaleString()}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">总字符数</div>
            </div>
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {stats.byteLength.toLocaleString()}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">字节数 (UTF-8)</div>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.words.toLocaleString()}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">单词数</div>
            </div>
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {stats.lines.toLocaleString()}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">行数</div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-medium mb-3">字符分布</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">中文字符</span>
                <span className="font-medium">{stats.chineseChars.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">英文字母</span>
                <span className="font-medium">{stats.englishChars.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">数字</span>
                <span className="font-medium">{stats.numbers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">空格</span>
                <span className="font-medium">{stats.spaces.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">标点符号</span>
                <span className="font-medium">{stats.punctuation.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Emoji 表情</span>
                <span className="font-medium">{stats.emojis.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Database className="h-5 w-5" />
          数据库存储类型参考
        </h2>
        
        {stats.length > 0 && (
          <div className="mb-6 p-4 rounded-lg bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800">
            <div className="flex items-center gap-2 mb-2">
              <Ruler className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              <span className="font-medium text-sky-700 dark:text-sky-300">存储建议</span>
            </div>
            <p className="text-sky-600 dark:text-sky-400">
              当前文本长度 <strong>{stats.length.toLocaleString()}</strong> 字符，
              建议使用 <strong>{getStorageRecommendation(stats.length)}</strong>
            </p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-2 px-3 font-medium text-slate-700 dark:text-slate-300">数据库</th>
                <th className="text-left py-2 px-3 font-medium text-slate-700 dark:text-slate-300">类型</th>
                <th className="text-left py-2 px-3 font-medium text-slate-700 dark:text-slate-300">编码</th>
                <th className="text-left py-2 px-3 font-medium text-slate-700 dark:text-slate-300">字节/字符</th>
                <th className="text-left py-2 px-3 font-medium text-slate-700 dark:text-slate-300">最大长度</th>
                <th className="text-left py-2 px-3 font-medium text-slate-700 dark:text-slate-300">说明</th>
                <th className="text-center py-2 px-3 font-medium text-slate-700 dark:text-slate-300">状态</th>
              </tr>
            </thead>
            <tbody>
              {databaseTypes.map((db, index) => {
                const isSuitable = stats.length <= db.maxLength
                const isNearLimit = stats.length > db.maxLength * 0.8 && isSuitable
                const estimatedBytes = stats.length * db.bytesPerChar
                const maxBytes = db.maxLength === Infinity ? Infinity : db.maxLength * db.bytesPerChar

                return (
                  <tr
                    key={index}
                    className={`border-b border-slate-100 dark:border-slate-800 ${
                      isSuitable ? '' : 'opacity-50'
                    }`}
                  >
                    <td className="py-2 px-3">{db.name}</td>
                    <td className="py-2 px-3 font-mono text-xs">{db.type}</td>
                    <td className="py-2 px-3 text-xs">{db.encoding}</td>
                    <td className="py-2 px-3 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {db.bytesPerChar}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <div>{db.maxLength === Infinity ? '∞' : db.maxLength.toLocaleString()} 字符</div>
                      {maxBytes !== Infinity && (
                        <div className="text-xs text-slate-400 dark:text-slate-500">
                          ≈ {(maxBytes / 1024).toFixed(0)}KB
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-3 text-slate-500 dark:text-slate-400">
                      <div>{db.description}</div>
                      {stats.length > 0 && isSuitable && (
                        <div className="text-xs mt-1">
                          <span className={estimatedBytes > maxBytes * 0.8 ? 'text-amber-500' : 'text-emerald-500'}>
                            预估: {(estimatedBytes / 1024).toFixed(2)}KB
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {isSuitable ? (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          isNearLimit
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                        }`}>
                          {isNearLimit ? '接近限制' : '可用'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          超出
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
