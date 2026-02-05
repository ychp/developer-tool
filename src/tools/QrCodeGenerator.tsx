import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import QRCode from 'qrcode'
import { QrCode, Download } from 'lucide-react'

export function QrCodeGenerator() {
  const [text, setText] = useState('https://example.com')
  const [size, setSize] = useState(256)
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M')
  const [qrDataUrl, setQrDataUrl] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    generateQR()
  }, [text, size, fgColor, bgColor, level])

  const generateQR = async () => {
    try {
      const canvas = canvasRef.current
      if (!canvas) return

      await QRCode.toCanvas(canvas, text || ' ', {
        width: size,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: level,
      })
    } catch (error) {
      console.error('Error generating QR code:', error)
    }
  }

  const downloadQrCode = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `qrcode-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <QrCode className="h-8 w-8" />
          二维码生成器
        </h1>
        <p className="text-muted-foreground">
          生成自定义二维码，支持下载
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>内容</CardTitle>
            <CardDescription>输入要生成二维码的文本或链接</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">文本/URL</label>
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="输入文本或 URL..."
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">尺寸: {size}px</label>
              <Input
                type="range"
                min={128}
                max={512}
                step={32}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">前景色</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="flex-1 font-mono"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">背景色</label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">纠错级别</label>
              <div className="grid grid-cols-4 gap-2">
                {(['L', 'M', 'Q', 'H'] as const).map((l) => (
                  <Button
                    key={l}
                    onClick={() => setLevel(l)}
                    variant={level === l ? 'default' : 'outline'}
                    size="sm"
                    className="font-mono"
                  >
                    {l}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                L (7%), M (15%), Q (25%), H (30%)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>预览</CardTitle>
            <CardDescription>二维码预览</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center p-6 rounded-lg border" style={{ backgroundColor: bgColor }}>
              <canvas ref={canvasRef} style={{ display: 'block' }} />
            </div>
            <Button onClick={downloadQrCode} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              下载 PNG
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
