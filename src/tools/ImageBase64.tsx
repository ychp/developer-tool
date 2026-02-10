import { useState, useRef } from 'react'
import { ImageIcon, Upload, Download, Copy, Check, Trash2, FileImage, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ToolPageHeader } from '@/components/tool/ToolPageHeader'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

export function ImageBase64() {
  const [base64, setBase64] = useState('')
  const [imagePreview, setImagePreview] = useState<string>('')
  const [imageInfo, setImageInfo] = useState<{
    size: number
    type: string
    width: number
    height: number
  } | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件')
      return
    }

    setError('')
    const reader = new FileReader()

    reader.onload = (event) => {
      const result = event.target?.result as string
      setBase64(result)
      setImagePreview(result)

      const img = new Image()
      img.onload = () => {
        setImageInfo({
          size: file.size,
          type: file.type,
          width: img.width,
          height: img.height,
        })
      }
      img.src = result
    }

    reader.onerror = () => {
      setError('读取文件失败')
    }

    reader.readAsDataURL(file)
  }

  const handleBase64Input = (value: string) => {
    setBase64(value)
    setError('')

    if (!value.trim()) {
      setImagePreview('')
      setImageInfo(null)
      return
    }

    try {
      const img = new Image()
      img.onload = () => {
        setImagePreview(value)
        setImageInfo({
          size: Math.round((value.length * 3) / 4),
          type: value.match(/data:(.*?);/)?.[1] || 'unknown',
          width: img.width,
          height: img.height,
        })
      }
      img.onerror = () => {
        setError('无效的 Base64 图片数据')
        setImagePreview('')
        setImageInfo(null)
      }
      img.src = value
    } catch {
      setError('无效的 Base64 数据')
    }
  }

  const copyBase64 = async () => {
    await navigator.clipboard.writeText(base64)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clearAll = () => {
    setBase64('')
    setImagePreview('')
    setImageInfo(null)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const downloadImage = () => {
    if (!imagePreview) return

    const link = document.createElement('a')
    link.href = imagePreview
    const ext = imageInfo?.type.split('/')[1] || 'png'
    link.download = `image.${ext}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const loadSampleImage = () => {
    const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    handleBase64Input(sampleBase64)
  }

  return (
    <div className="space-y-6">
      <ToolPageHeader
        icon={<ImageIcon className="h-8 w-8" />}
        title="图片 Base64 转换"
        description="图片与 Base64 格式互转，支持实时预览"
      />

      {/* 操作按钮 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileImage className="h-5 w-5 text-sky-500" />
              文件操作
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={loadSampleImage}>
                示例
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-1" />
                上传图片
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={downloadImage}
                disabled={!imagePreview}
              >
                <Download className="h-4 w-4 mr-1" />
                下载图片
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
                disabled={!base64 && !imagePreview}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                清空
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* 转换区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 图片预览 */}
        <Card>
          <CardHeader>
            <CardTitle>图片预览</CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="h-[400px] flex items-center justify-center bg-red-50 dark:bg-red-950/30 rounded-lg">
                <div className="text-center space-y-3">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                  <div className="text-red-600 dark:text-red-400 font-medium">错误</div>
                  <div className="text-sm text-red-500 dark:text-red-500 max-w-xs mx-auto">
                    {error}
                  </div>
                </div>
              </div>
            ) : imagePreview ? (
              <div className="space-y-4">
                <div className="bg-white dark:bg-slate-900 rounded-lg p-4 flex items-center justify-center min-h-[400px]">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full max-h-[400px] object-contain"
                  />
                </div>
                {imageInfo && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                      <div className="text-slate-500 dark:text-slate-400 mb-1">文件大小</div>
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {formatFileSize(imageInfo.size)}
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                      <div className="text-slate-500 dark:text-slate-400 mb-1">文件类型</div>
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {imageInfo.type}
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                      <div className="text-slate-500 dark:text-slate-400 mb-1">宽度</div>
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {imageInfo.width}px
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                      <div className="text-slate-500 dark:text-slate-400 mb-1">高度</div>
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {imageInfo.height}px
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700">
                <div className="text-center space-y-3">
                  <ImageIcon className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto" />
                  <div className="text-slate-500 dark:text-slate-400">
                    上传图片或输入 Base64
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    选择图片
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Base64 输出 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Base64 输出</span>
              <Button
                variant="outline"
                size="sm"
                onClick={copyBase64}
                disabled={!base64}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    复制
                  </>
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Base64 字符串将显示在这里，也可以粘贴 Base64 字符串来预览图片..."
              value={base64}
              onChange={(e) => handleBase64Input(e.target.value)}
              className="min-h-[400px] font-mono text-xs resize-y"
            />
            <div className="mt-3 flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>字符数: {base64.length.toLocaleString()}</span>
              {base64 && (
                <span>预计大小: {formatFileSize(Math.round((base64.length * 3) / 4))}</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 使用说明 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            使用说明
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
          <p>• <strong>图片转 Base64</strong>：点击"上传图片"按钮，选择图片文件即可自动转换</p>
          <p>• <strong>Base64 转图片</strong>：在右侧文本框粘贴 Base64 字符串，左侧自动显示预览</p>
          <p>• <strong>复制 Base64</strong>：点击右上角"复制"按钮，复制完整的 Base64 字符串</p>
          <p>• <strong>下载图片</strong>：点击"下载图片"按钮，将 Base64 转换为图片文件下载</p>
          <p>• <strong>文件信息</strong>：显示图片的尺寸、大小、类型等信息</p>
          <p>• <strong>清空</strong>：点击"清空"按钮，重置所有内容</p>
        </CardContent>
      </Card>
    </div>
  )
}
