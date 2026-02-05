import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ExternalLink, Image as ImageIcon } from 'lucide-react'

interface ImageLink {
  url: string
}

export function ImageLinkPreview() {
  const [inputText, setInputText] = useState('')
  const [imageLinks, setImageLinks] = useState<ImageLink[]>([])

  const parseLinks = () => {
    const lines = inputText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line)
    setImageLinks(lines.map((url) => ({ url })))
  }

  const loadDemo = () => {
    const demoImages = [
      'https://picsum.photos/400/300?random=1',
      'https://picsum.photos/400/300?random=2',
      'https://picsum.photos/400/300?random=3',
      'https://picsum.photos/400/300?random=4',
      'https://picsum.photos/400/300?random=5'
    ]
    setInputText(demoImages.join('\n'))
    setImageLinks(demoImages.map((url) => ({ url })))
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ImageIcon className="h-6 w-6" />
          图片链接预览
        </h1>
        <p className="text-sm text-muted-foreground">
          批量预览图片链接，支持多行输入
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">输入图片链接</CardTitle>
          <CardDescription className="text-xs">每行一个图片链接</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="请输入图片链接，换行分割&#10;https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            className="min-h-[150px] font-mono text-sm"
          />
          <div className="flex gap-2">
            <Button onClick={parseLinks} className="flex-1">
              生成预览
            </Button>
            <Button onClick={loadDemo} variant="outline">
              示例演示
            </Button>
          </div>
        </CardContent>
      </Card>

      {imageLinks.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">预览结果</CardTitle>
            <CardDescription className="text-xs">
              共 {imageLinks.length} 张图片
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">图片预览</TableHead>
                  <TableHead>图片链接</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {imageLinks.map((link, index) => (
                  <TableRow key={`${link.url}-${index}`}>
                    <TableCell>
                      <img
                        src={link.url}
                        alt={`图片预览 ${index + 1}`}
                        className="max-w-[160px] max-h-[160px] object-contain rounded-md border bg-background"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1 break-all"
                      >
                        {link.url}
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
