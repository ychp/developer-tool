import { useState, useEffect } from 'react'
import { HexColorPicker } from 'react-colorful'
import { Palette, Copy, Check, Trash2, Shuffle, History, Plus, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ToolPageHeader } from '@/components/tool/ToolPageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const STORAGE_KEY = 'color-history'

const PRESET_COLORS = {
  '基础色': [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'
  ],
  'Material': [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
    '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
    '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800'
  ],
  'Tailwind': [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
    '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
    '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF'
  ]
}

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

function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return '#000000'
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

function generateRandomColor(): string {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
}

function adjustBrightness(hex: string, percent: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  
  const adjust = (value: number) => {
    const adjusted = Math.round(value * (1 + percent / 100))
    return Math.max(0, Math.min(255, adjusted))
  }
  
  return rgbToHex(adjust(rgb.r), adjust(rgb.g), adjust(rgb.b))
}

export function ColorConverter() {
  const [hex, setHex] = useState('#3B82F6')
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 })
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 })
  const [copied, setCopied] = useState<string | null>(null)
  const [colorHistory, setColorHistory] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setColorHistory(JSON.parse(stored))
      }
    } catch {
      // Ignore storage errors
    }
  }, [])

  const addToHistory = (color: string) => {
    const newHistory = [color, ...colorHistory.filter(c => c !== color)].slice(0, 10)
    setColorHistory(newHistory)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
    } catch {
      // Ignore storage errors
    }
  }

  const updateFromHex = (value: string) => {
    setHex(value)
    const rgb = hexToRgb(value)
    if (rgb) {
      setRgb(rgb)
      setHsl(rgbToHsl(rgb.r, rgb.g, rgb.b))
      addToHistory(value)
    }
  }

  const updateFromRgb = (r: number, g: number, b: number) => {
    setRgb({ r, g, b })
    const hex = rgbToHex(r, g, b)
    setHex(hex)
    setHsl(rgbToHsl(r, g, b))
    addToHistory(hex)
  }

  const updateFromHsl = (h: number, s: number, l: number) => {
    setHsl({ h, s, l })
    const rgb = hslToRgb(h, s, l)
    if (rgb) {
      setRgb(rgb)
      setHex(rgbToHex(rgb.r, rgb.g, rgb.b))
      addToHistory(rgbToHex(rgb.r, rgb.g, rgb.b))
    }
  }

  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } | null => {
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

  const copyValue = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const generateRandom = () => {
    const randomColor = generateRandomColor()
    updateFromHex(randomColor)
  }

  const lighten = () => {
    const lightened = adjustBrightness(hex, 20)
    updateFromHex(lightened)
  }

  const darken = () => {
    const darkened = adjustBrightness(hex, -20)
    updateFromHex(darkened)
  }

  const clearHistory = () => {
    setColorHistory([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore storage errors
    }
  }

  const contrastColor = getContrastColor(hex)

  return (
    <div className="space-y-6">
      <ToolPageHeader
        icon={<Palette className="h-8 w-8" />}
        title="颜色选择器"
        description="可视化选择颜色，支持 HEX、RGB、HSL 格式互转"
      />

      {/* 颜色选择器 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：颜色选择器 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-sky-500" />
                颜色选择
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={generateRandom}>
                  <Shuffle className="h-4 w-4 mr-1" />
                  随机
                </Button>
                <Button variant="outline" size="sm" onClick={lighten}>
                  <Plus className="h-4 w-4 mr-1" />
                  变亮
                </Button>
                <Button variant="outline" size="sm" onClick={darken}>
                  <Minus className="h-4 w-4 mr-1" />
                  变暗
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <HexColorPicker color={hex} onChange={updateFromHex} className="w-full" />
            
            {/* 预览区域 */}
            <div 
              className="h-32 rounded-lg flex items-center justify-center transition-colors"
              style={{ backgroundColor: hex }}
            >
              <div className="text-center space-y-2" style={{ color: contrastColor }}>
                <div className="text-2xl font-bold font-mono">{hex}</div>
                <div className="text-sm">
                  <span style={{ color: contrastColor }}>文字对比</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 右侧：颜色值 */}
        <Card>
          <CardHeader>
            <CardTitle>颜色值</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* HEX */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">HEX</label>
              <div className="flex gap-2">
                <div className="flex-1 flex gap-2">
                  <span className="text-slate-500">#</span>
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
                  size="sm"
                >
                  {copied === 'hex' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* RGB */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">RGB</label>
              <div className="flex gap-2">
                <div className="flex-1 flex gap-2">
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
                  size="sm"
                >
                  {copied === 'rgb' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* HSL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">HSL</label>
              <div className="flex gap-2">
                <div className="flex-1 flex gap-2">
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
                  size="sm"
                >
                  {copied === 'hsl' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 预设颜色 */}
      <Card>
        <CardHeader>
          <CardTitle>预设颜色</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(PRESET_COLORS).map(([category, colors]) => (
            <div key={category}>
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                {category}
              </div>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => updateFromHex(color)}
                    className="w-12 h-12 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-sky-500 hover:scale-110 transition-all shadow-sm"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 颜色历史 */}
      {colorHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <History className="h-5 w-5 text-sky-500" />
                历史记录
              </span>
              <Button variant="outline" size="sm" onClick={clearHistory}>
                <Trash2 className="h-4 w-4 mr-1" />
                清空
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {colorHistory.map((color) => (
                <button
                  key={color}
                  onClick={() => updateFromHex(color)}
                  className="w-12 h-12 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-sky-500 hover:scale-110 transition-all shadow-sm relative group"
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white px-1 rounded whitespace-nowrap">
                    {color}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
