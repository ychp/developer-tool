import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { FileSpreadsheet, Download, Loader2, FlaskConical, FileJson, ShieldCheck } from 'lucide-react'
import * as XLSX from 'xlsx'

interface TableRow {
  [key: string]: string
}

export function TableViewer() {
  const [url, setUrl] = useState('')
  const [useProxy, setUseProxy] = useState(false)
  const [data, setData] = useState<TableRow[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')

  const parseCSV = (text: string): { headers: string[], rows: TableRow[] } => {
    const lines = text.split(/\r?\n/).filter(line => line.trim())
    if (lines.length === 0) {
      return { headers: [], rows: [] }
    }

    const parseLine = (line: string): string[] => {
      const result: string[] = []
      let current = ''
      let inQuotes = false
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        
        if (char === '"') {
          inQuotes = !inQuotes
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
      
      if (current) {
        result.push(current.trim())
      }
      
      return result
    }

    const headers = parseLine(lines[0])
    const rows: TableRow[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = parseLine(lines[i])
      if (values.length > 0) {
        const row: TableRow = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ''
        })
        rows.push(row)
      }
    }

    return { headers, rows }
  }

  const loadFromUrl = async () => {
    if (!url.trim()) {
      setError('请输入文件 URL')
      return
    }

    setLoading(true)
    setError('')
    setData([])
    setHeaders([])
    setFileName('')

    try {
      const corsProxies = [
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?',
      ]
      
      const fetchUrl = useProxy ? `${corsProxies[0]}${encodeURIComponent(url)}` : url
      
      const response = await fetch(fetchUrl)
      
      if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`)
      }

      const contentType = response.headers.get('content-type') || ''
      const isExcelFile = url.match(/\.(xlsx|xls)$/i) || contentType.includes('spreadsheet') || contentType.includes('excel')
      
      if (url.includes('.json') || contentType.includes('json')) {
        const jsonData = await response.json()
        const fileNameFromUrl = url.split('/').pop() || 'data.json'
        setFileName(fileNameFromUrl)
        
        if (Array.isArray(jsonData)) {
          if (jsonData.length > 0) {
            const headers = Object.keys(jsonData[0])
            setHeaders(headers)
            setData(jsonData)
          }
        } else if (typeof jsonData === 'object') {
          const headers = Object.keys(jsonData)
          setHeaders(headers)
          setData([jsonData])
        }
      } else if (isExcelFile) {
        const arrayBuffer = await response.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        const fileNameFromUrl = url.split('/').pop() || 'data.xlsx'
        setFileName(fileNameFromUrl)
        
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        const jsonData: TableRow[] = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: '' })
        
        if (jsonData.length > 0) {
          const excelHeaders = Object.keys(jsonData[0])
          setHeaders(excelHeaders)
          setData(jsonData)
        }
      } else {
        const text = await response.text()
        const fileNameFromUrl = url.split('/').pop() || 'data.csv'
        setFileName(fileNameFromUrl)
        
        const { headers: csvHeaders, rows } = parseCSV(text)
        setHeaders(csvHeaders)
        setData(rows)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '加载失败'
      if (useProxy) {
        setError(`${errorMessage}\n\n提示：代理加载较慢，建议关闭 CORS 代理重试。如果目标服务器支持 CORS（如 GitHub、jsDelivr 等），无需使用代理。`)
      } else {
        setError(`${errorMessage}\n\n提示：这可能是 CORS 跨域问题。请先确认：\n1. URL 是否正确且可公开访问\n2. 如果是跨域请求，可勾选"CORS 代理"重试（注意：代理较慢）`)
      }
      setData([])
      setHeaders([])
      setFileName('')
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    if (headers.length === 0 || data.length === 0) return

    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', fileName || 'export.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const loadTestData = () => {
    const testData = 'https://raw.githubusercontent.com/datasets/covid-19/main/data/countries-aggregated.csv'
    setUrl(testData)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileSpreadsheet className="h-8 w-8" />
          表格预览
        </h1>
        <p className="text-muted-foreground">
          在线预览 CSV、Excel 和 JSON 表格文件
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>文件 URL</CardTitle>
          <CardDescription>
          {error ? (
            <span className="text-destructive whitespace-pre-line">{error}</span>
          ) : (
            '输入 CSV、Excel (.xlsx, .xls) 或 JSON 文件的 URL 地址'
          )}
        </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b">
            <Checkbox
              id="use-proxy"
              checked={useProxy}
              onCheckedChange={(checked: boolean) => setUseProxy(checked)}
            />
            <label
              htmlFor="use-proxy"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4" />
              使用 CORS 代理（速度较慢，仅在跨域时使用）
            </label>
          </div>
          <div className="flex gap-2">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/data.csv"
              className="flex-1 font-mono text-sm"
              onKeyDown={(e) => e.key === 'Enter' && loadFromUrl()}
            />
            <Button onClick={loadFromUrl} disabled={loading || !url.trim()}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  加载中
                </>
              ) : (
                '加载'
              )}
            </Button>
            <Button onClick={loadTestData} variant="secondary" size="sm">
              <FlaskConical className="h-4 w-4 mr-1" />
              测试
            </Button>
          </div>
          
          {!url && (
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-medium">✨ 推荐数据源（支持 CORS，无需代理）：</p>
              <ul className="list-disc list-inside space-y-0.5 ml-2">
                <li>GitHub Raw: <code className="text-xs bg-muted px-1 rounded">raw.githubusercontent.com</code></li>
                <li>jsDelivr CDN: <code className="text-xs bg-muted px-1 rounded">cdn.jsdelivr.net</code> (国内推荐)</li>
                <li>Unpkg CDN: <code className="text-xs bg-muted px-1 rounded">unpkg.com</code></li>
              </ul>
            </div>
          )}

          {fileName && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <FileJson className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{fileName}</span>
                <span className="text-xs text-muted-foreground">
                  ({data.length} 行 × {headers.length} 列)
                </span>
              </div>
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                导出 CSV
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {data.length > 0 && headers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>表格内容</CardTitle>
            <CardDescription>
              显示前 100 行数据
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12 text-center">#</TableHead>
                    {headers.map((header, index) => (
                      <TableHead key={index}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.slice(0, 100).map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      <TableCell className="text-center text-muted-foreground text-xs">
                        {rowIndex + 1}
                      </TableCell>
                      {headers.map((header, cellIndex) => (
                        <TableCell key={cellIndex} className="max-w-xs truncate">
                          {row[header]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {data.length > 100 && (
              <p className="text-sm text-muted-foreground mt-4 text-center">
                仅显示前 100 行，共 {data.length} 行数据
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {data.length === 0 && !error && !loading && (
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-center">
              <FileSpreadsheet className="h-16 w-16 text-muted-foreground/20 mb-4" />
              <h3 className="text-lg font-semibold mb-2">暂无数据</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                输入表格文件的 URL 地址，点击"加载"按钮预览数据
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
