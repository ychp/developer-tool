import { useState, useMemo } from 'react'
import { Image, Copy, Check, RefreshCw, Sparkles, Palette, Sun, Camera, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

type Platform = 'midjourney' | 'dalle' | 'stable-diffusion'

interface PromptOptions {
  platform: Platform
  subject: string
  style: string
  lighting: string
  camera: string
  quality: string
  mood: string
  customParams: string
  aspectRatio: string
  version: string
}

const styleOptions = [
  { value: '', label: '无' },
  { value: 'photorealistic', label: '照片写实' },
  { value: 'anime', label: '动漫风格' },
  { value: 'oil painting', label: '油画风格' },
  { value: 'watercolor', label: '水彩风格' },
  { value: 'digital art', label: '数字艺术' },
  { value: '3D render', label: '3D 渲染' },
  { value: 'pixel art', label: '像素艺术' },
  { value: 'sketch', label: '素描风格' },
  { value: 'cinematic', label: '电影风格' },
  { value: 'fantasy art', label: '奇幻艺术' },
  { value: 'minimalist', label: '极简主义' },
  { value: 'cyberpunk', label: '赛博朋克' },
  { value: 'steampunk', label: '蒸汽朋克' },
]

const lightingOptions = [
  { value: '', label: '无' },
  { value: 'natural lighting', label: '自然光' },
  { value: 'golden hour', label: '黄金时刻' },
  { value: 'blue hour', label: '蓝色时刻' },
  { value: 'studio lighting', label: '摄影棚灯光' },
  { value: 'dramatic lighting', label: '戏剧性灯光' },
  { value: 'soft lighting', label: '柔和灯光' },
  { value: 'backlighting', label: '逆光' },
  { value: 'neon lighting', label: '霓虹灯光' },
  { value: 'volumetric lighting', label: '体积光' },
  { value: 'rim lighting', label: '轮廓光' },
]

const cameraOptions = [
  { value: '', label: '无' },
  { value: 'close-up', label: '特写' },
  { value: 'medium shot', label: '中景' },
  { value: 'wide shot', label: '广角' },
  { value: 'ultra wide angle', label: '超广角' },
  { value: 'bird eye view', label: '鸟瞰视角' },
  { value: 'low angle', label: '低角度' },
  { value: 'portrait', label: '肖像' },
  { value: 'macro', label: '微距' },
  { value: 'drone shot', label: '无人机视角' },
  { value: 'fisheye', label: '鱼眼' },
]

const qualityOptions = [
  { value: '', label: '无' },
  { value: 'highly detailed', label: '高细节' },
  { value: 'ultra HD', label: '超高清' },
  { value: '8K', label: '8K 分辨率' },
  { value: '4K', label: '4K 分辨率' },
  { value: 'masterpiece', label: '杰作级' },
  { value: 'best quality', label: '最佳质量' },
  { value: 'professional', label: '专业级' },
]

const moodOptions = [
  { value: '', label: '无' },
  { value: 'peaceful', label: '宁静' },
  { value: 'dramatic', label: '戏剧性' },
  { value: 'mysterious', label: '神秘' },
  { value: 'romantic', label: '浪漫' },
  { value: 'dark', label: '暗黑' },
  { value: 'cheerful', label: '欢快' },
  { value: 'melancholic', label: '忧郁' },
  { value: 'epic', label: '史诗' },
  { value: 'dreamy', label: '梦幻' },
  { value: 'horror', label: '恐怖' },
]

const aspectRatioOptions = [
  { value: '', label: '默认' },
  { value: '--ar 1:1', label: '1:1 (方形)' },
  { value: '--ar 16:9', label: '16:9 (横屏)' },
  { value: '--ar 9:16', label: '9:16 (竖屏)' },
  { value: '--ar 4:3', label: '4:3 (传统)' },
  { value: '--ar 3:4', label: '3:4 (竖向)' },
  { value: '--ar 21:9', label: '21:9 (超宽)' },
  { value: '--ar 2:3', label: '2:3 (肖像)' },
  { value: '--ar 3:2', label: '3:2 (风景)' },
]

const versionOptions = [
  { value: '', label: '默认' },
  { value: '--v 6', label: 'V6 (最新)' },
  { value: '--v 5.2', label: 'V5.2' },
  { value: '--v 5.1', label: 'V5.1' },
  { value: '--v 5', label: 'V5' },
  { value: '--niji 6', label: 'Niji 6 (动漫)' },
  { value: '--niji 5', label: 'Niji 5 (动漫)' },
]

const presetTemplates = [
  {
    name: '人物肖像',
    subject: 'beautiful woman with flowing hair',
    style: 'photorealistic',
    lighting: 'soft lighting',
    camera: 'portrait',
    quality: 'highly detailed',
    mood: '',
  },
  {
    name: '风景摄影',
    subject: 'mountain landscape with lake reflection',
    style: 'photorealistic',
    lighting: 'golden hour',
    camera: 'wide shot',
    quality: 'ultra HD',
    mood: 'peaceful',
  },
  {
    name: '动漫角色',
    subject: 'anime girl with colorful hair',
    style: 'anime',
    lighting: 'natural lighting',
    camera: 'close-up',
    quality: 'highly detailed',
    mood: 'cheerful',
  },
  {
    name: '科幻场景',
    subject: 'futuristic city with flying cars',
    style: 'cyberpunk',
    lighting: 'neon lighting',
    camera: 'wide shot',
    quality: 'ultra HD',
    mood: 'dramatic',
  },
  {
    name: '奇幻生物',
    subject: 'majestic dragon in forest',
    style: 'fantasy art',
    lighting: 'dramatic lighting',
    camera: 'medium shot',
    quality: 'masterpiece',
    mood: 'epic',
  },
  {
    name: '产品摄影',
    subject: 'luxury watch on marble surface',
    style: 'photorealistic',
    lighting: 'studio lighting',
    camera: 'close-up',
    quality: 'professional',
    mood: '',
  },
]

export function ImagePromptGenerator() {
  const [options, setOptions] = useState<PromptOptions>({
    platform: 'midjourney',
    subject: '',
    style: '',
    lighting: '',
    camera: '',
    quality: '',
    mood: '',
    customParams: '',
    aspectRatio: '',
    version: '',
  })
  const [copied, setCopied] = useState(false)

  const updateOption = (key: keyof PromptOptions, value: string) => {
    setOptions(prev => ({ ...prev, [key]: value }))
  }

  const applyPreset = (preset: typeof presetTemplates[0]) => {
    setOptions(prev => ({
      ...prev,
      subject: preset.subject,
      style: preset.style,
      lighting: preset.lighting,
      camera: preset.camera,
      quality: preset.quality,
      mood: preset.mood,
    }))
  }

  const generatedPrompt = useMemo(() => {
    const parts: string[] = []
    
    if (options.subject) {
      parts.push(options.subject)
    }
    
    if (options.style) {
      parts.push(options.style)
    }
    
    if (options.lighting) {
      parts.push(options.lighting)
    }
    
    if (options.camera) {
      parts.push(options.camera)
    }
    
    if (options.quality) {
      parts.push(options.quality)
    }
    
    if (options.mood) {
      parts.push(options.mood)
    }
    
    if (options.customParams) {
      parts.push(options.customParams)
    }
    
    let prompt = parts.join(', ')
    
    if (options.platform === 'midjourney') {
      const mjParams: string[] = []
      if (options.aspectRatio) {
        mjParams.push(options.aspectRatio)
      }
      if (options.version) {
        mjParams.push(options.version)
      }
      if (mjParams.length > 0) {
        prompt += ' ' + mjParams.join(' ')
      }
    }
    
    return prompt
  }, [options])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetOptions = () => {
    setOptions({
      platform: 'midjourney',
      subject: '',
      style: '',
      lighting: '',
      camera: '',
      quality: '',
      mood: '',
      customParams: '',
      aspectRatio: '',
      version: '',
    })
  }

  const platformLabels: Record<Platform, string> = {
    'midjourney': 'Midjourney',
    'dalle': 'DALL-E',
    'stable-diffusion': 'Stable Diffusion',
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">图像 Prompt 生成器</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          为 Midjourney、DALL-E、Stable Diffusion 生成高质量图像提示词
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Image className="w-5 h-5 text-sky-500" />
              基础设置
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  目标平台
                </label>
                <div className="flex gap-2">
                  {(Object.keys(platformLabels) as Platform[]).map((platform) => (
                    <button
                      key={platform}
                      onClick={() => updateOption('platform', platform)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        options.platform === platform
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                      }`}
                    >
                      {platformLabels[platform]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  主体描述
                </label>
                <textarea
                  value={options.subject}
                  onChange={(e) => updateOption('subject', e.target.value)}
                  placeholder="描述你想生成的图像主体，如：a beautiful sunset over the ocean"
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm resize-none"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-sky-500" />
              风格设置
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  艺术风格
                </label>
                <select
                  value={options.style}
                  onChange={(e) => updateOption('style', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                >
                  {styleOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  氛围情绪
                </label>
                <select
                  value={options.mood}
                  onChange={(e) => updateOption('mood', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                >
                  {moodOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sun className="w-5 h-5 text-sky-500" />
              光照与视角
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  光照效果
                </label>
                <select
                  value={options.lighting}
                  onChange={(e) => updateOption('lighting', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                >
                  {lightingOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  镜头视角
                </label>
                <select
                  value={options.camera}
                  onChange={(e) => updateOption('camera', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                >
                  {cameraOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-sky-500" />
              质量与参数
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    画面质量
                  </label>
                  <select
                    value={options.quality}
                    onChange={(e) => updateOption('quality', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                  >
                    {qualityOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {options.platform === 'midjourney' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        画面比例
                      </label>
                      <select
                        value={options.aspectRatio}
                        onChange={(e) => updateOption('aspectRatio', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                      >
                        {aspectRatioOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        模型版本
                      </label>
                      <select
                        value={options.version}
                        onChange={(e) => updateOption('version', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                      >
                        {versionOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  自定义参数
                </label>
                <input
                  type="text"
                  value={options.customParams}
                  onChange={(e) => updateOption('customParams', e.target.value)}
                  placeholder="添加额外的提示词，如：trending on artstation, octane render"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-500" />
              快捷预设
            </h2>
            <div className="space-y-2">
              {presetTemplates.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-sky-500" />
                生成结果
              </h2>
              <div className="flex gap-2">
                <Button onClick={resetOptions} size="sm" variant="outline">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  重置
                </Button>
                <Button
                  onClick={() => copyToClipboard(generatedPrompt)}
                  size="sm"
                  variant="outline"
                  disabled={!generatedPrompt}
                >
                  {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copied ? '已复制' : '复制'}
                </Button>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800 min-h-32">
              {generatedPrompt ? (
                <p className="text-sm font-mono break-words">{generatedPrompt}</p>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                  输入主体描述开始生成 Prompt
                </p>
              )}
            </div>

            {generatedPrompt && (
              <div className="mt-4 text-xs text-slate-500 dark:text-slate-400">
                <div>字符数：{generatedPrompt.length}</div>
                <div>单词数：{generatedPrompt.split(/\s+/).filter(Boolean).length}</div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">使用提示</h2>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="p-3 rounded bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300">
                <strong>提示：</strong>主体描述越具体，生成效果越好！
              </div>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Midjourney 支持画面比例和模型版本参数</li>
                <li>DALL-E 3 会自动优化提示词</li>
                <li>Stable Diffusion 支持负面提示词</li>
                <li>使用英文提示词效果最佳</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
