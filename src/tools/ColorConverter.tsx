import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Palette, Copy, Check } from 'lucide-react'

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h = 0,
    s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      case b:
        h = ((r - g) / d + 4) / 6
        break
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } | null {
  h /= 360
  s /= 100
  l /= 100

  if (s === 0) {
    const gray = Math.round(l * 255)
    return { r: gray, g: gray, b: gray }
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  }
}

export function ColorConverter() {
  const [hex, setHex] = useState('#3B82F6')
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 })
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 })
  const [copied, setCopied] = useState<string | null>(null)

  const updateFromHex = (value: string) => {
    setHex(value)
    const rgb = hexToRgb(value)
    if (rgb) {
      setRgb(rgb)
      setHsl(rgbToHsl(rgb.r, rgb.g, rgb.b))
    }
  }

  const updateFromRgb = (r: number, g: number, b: number) => {
    setRgb({ r, g, b })
    setHex(rgbToHex(r, g, b))
    setHsl(rgbToHsl(r, g, b))
  }

  const updateFromHsl = (h: number, s: number, l: number) => {
    setHsl({ h, s, l })
    const rgb = hslToRgb(h, s, l)
    if (rgb) {
      setRgb(rgb)
      setHex(rgbToHex(rgb.r, rgb.g, rgb.b))
    }
  }

  const copyValue = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Palette className="h-8 w-8" />
          颜色转换
        </h1>
        <p className="text-muted-foreground">
          HEX、RGB、HSL 颜色格式互转
        </p>
      </div>

      <Card
        className="border-2"
        style={{
          backgroundColor: hex,
          borderColor: hex,
        }}
      >
        <CardContent className="pt-6">
          <p className="text-sm font-medium" style={{ color: parseInt(hex.slice(1), 16) > 0xffffff / 2 ? '#000' : '#fff' }}>
            当前颜色预览
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>HEX</CardTitle>
            <CardDescription>十六进制颜色</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <span className="text-muted-foreground">#</span>
              <Input
                value={hex.slice(1)}
                onChange={(e) => {
                  const value = e.target.value
                  if (/^[0-9A-Fa-f]{0,6}$/.test(value)) {
                    updateFromHex('#' + value.padStart(6, '0'))
                  }
                }}
                className="font-mono uppercase"
                maxLength={6}
              />
            </div>
            <Button
              onClick={() => copyValue(hex, 'hex')}
              variant="outline"
              className="w-full"
            >
              {copied === 'hex' ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  复制 HEX
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>RGB</CardTitle>
            <CardDescription>红绿蓝颜色</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="number"
                min={0}
                max={255}
                value={rgb.r}
                onChange={(e) => updateFromRgb(Number(e.target.value), rgb.g, rgb.b)}
                className="font-mono"
              />
              <Input
                type="number"
                min={0}
                max={255}
                value={rgb.g}
                onChange={(e) => updateFromRgb(rgb.r, Number(e.target.value), rgb.b)}
                className="font-mono"
              />
              <Input
                type="number"
                min={0}
                max={255}
                value={rgb.b}
                onChange={(e) => updateFromRgb(rgb.r, rgb.g, Number(e.target.value))}
                className="font-mono"
              />
            </div>
            <Button
              onClick={() => copyValue(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}
              variant="outline"
              className="w-full"
            >
              {copied === 'rgb' ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  复制 RGB
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>HSL</CardTitle>
            <CardDescription>色相饱和度亮度</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="number"
                min={0}
                max={360}
                value={hsl.h}
                onChange={(e) => updateFromHsl(Number(e.target.value), hsl.s, hsl.l)}
                className="font-mono"
              />
              <Input
                type="number"
                min={0}
                max={100}
                value={hsl.s}
                onChange={(e) => updateFromHsl(hsl.h, Number(e.target.value), hsl.l)}
                className="font-mono"
              />
              <Input
                type="number"
                min={0}
                max={100}
                value={hsl.l}
                onChange={(e) => updateFromHsl(hsl.h, hsl.s, Number(e.target.value))}
                className="font-mono"
              />
            </div>
            <Button
              onClick={() => copyValue(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl')}
              variant="outline"
              className="w-full"
            >
              {copied === 'hsl' ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  已复制
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  复制 HSL
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
