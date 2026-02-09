import { useState, useMemo } from 'react'
import { Calendar, Clock, Copy, Check, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ToolPageHeader } from '@/components/tool/ToolPageHeader'
import { Button } from '@/components/ui/button'

type CronPart = 'minute' | 'hour' | 'day' | 'month' | 'weekday'
type CronType = 'every' | 'range' | 'specific' | 'interval'

interface CronPartValue {
  type: CronType
  value: string
}

interface CronValues {
  minute: CronPartValue
  hour: CronPartValue
  day: CronPartValue
  month: CronPartValue
  weekday: CronPartValue
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

const PRESETS = [
  { name: '每分钟', cron: '* * * * *', desc: '每分钟执行' },
  { name: '每小时', cron: '0 * * * *', desc: '每小时的第0分钟执行' },
  { name: '每天0点', cron: '0 0 * * *', desc: '每天凌晨0点执行' },
  { name: '每天12点', cron: '0 12 * * *', desc: '每天中午12点执行' },
  { name: '每周一0点', cron: '0 0 * * 1', desc: '每周一凌晨0点执行' },
  { name: '每月1号0点', cron: '0 0 1 * *', desc: '每月1号凌晨0点执行' },
  { name: '每天9-18点', cron: '0 9-18 * * *', desc: '每天9点到18点每小时执行' },
  { name: '每5分钟', cron: '*/5 * * * *', desc: '每5分钟执行一次' },
  { name: '工作日9点', cron: '0 9 * * 1-5', desc: '周一到周五每天9点执行' },
]

const generateCron = (values: CronValues): string => {
  return `${values.minute.value} ${values.hour.value} ${values.day.value} ${values.month.value} ${values.weekday.value}`
}

const parseCron = (cron: string): CronValues => {
  const parts = cron.trim().split(/\s+/)
  if (parts.length !== 5) {
    return {
      minute: { type: 'every', value: '*' },
      hour: { type: 'every', value: '*' },
      day: { type: 'every', value: '*' },
      month: { type: 'every', value: '*' },
      weekday: { type: 'every', value: '*' },
    }
  }

  const parsePart = (part: string): CronPartValue => {
    if (part === '*') return { type: 'every', value: '*' }
    if (part.includes('*/')) return { type: 'interval', value: part }
    if (part.includes('-')) return { type: 'range', value: part }
    if (part.includes(',')) return { type: 'specific', value: part }
    if (!isNaN(Number(part))) return { type: 'specific', value: part }
    return { type: 'every', value: '*' }
  }

  return {
    minute: parsePart(parts[0]),
    hour: parsePart(parts[1]),
    day: parsePart(parts[2]),
    month: parsePart(parts[3]),
    weekday: parsePart(parts[4]),
  }
}

const getCronDescription = (cron: string): string => {
  const parts = cron.trim().split(/\s+/)
  if (parts.length !== 5) return '无效的 Cron 表达式'

  const [minute, hour, day, month, weekday] = parts

  let desc = ''

  if (minute === '*') desc += '每分钟'
  else if (minute.startsWith('*/')) desc += `每${minute.replace('*/', '')}分钟`
  else desc += `第${minute}分钟`

  if (hour === '*') desc += '每小时'
  else if (hour.startsWith('*/')) desc += `每${hour.replace('*/', '')}小时`
  else desc += `${hour}点`

  if (day === '*') desc += '每天'
  else if (day.startsWith('*/')) desc += `每${day.replace('*/', '')}天`
  else if (day.includes('-')) desc += `每月${day.replace('-', '到')}日`
  else desc += `每月${day}日`

  if (month === '*') desc += ''
  else if (month.startsWith('*/')) desc += `每${month.replace('*/', '')}月`
  else if (month.includes('-')) desc += `${month.replace('-', '到')}月`
  else desc += `${month}月`

  if (weekday === '*') desc += '执行'
  else if (weekday.includes('-')) {
    const [start, end] = weekday.split('-')
    desc += `，周${WEEKDAYS[Number(start)]}到周${WEEKDAYS[Number(end)]}`
  } else {
    desc += `，周${WEEKDAYS[Number(weekday)]}`
  }

  return desc
}

export function CronGenerator() {
  const [cron, setCron] = useState('0 0 * * *')
  const [values, setValues] = useState<CronValues>(() => parseCron('0 0 * * *'))
  const [copied, setCopied] = useState(false)

  const description = useMemo(() => getCronDescription(cron), [cron])

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setCron(preset.cron)
    setValues(parseCron(preset.cron))
  }

  const updatePart = (part: CronPart, value: CronPartValue) => {
    const newValues = { ...values, [part]: value }
    setValues(newValues)
    setCron(generateCron(newValues))
  }

  const copyCron = async () => {
    await navigator.clipboard.writeText(cron)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const clearCron = () => {
    setCron('* * * * *')
    setValues(parseCron('* * * * *'))
  }

  return (
    <div className="space-y-6">
      <ToolPageHeader
        icon={<Calendar className="h-8 w-8" />}
        title="Cron 表达式生成器"
        description="可视化生成和解析 Cron 表达式"
      />

      {/* 常用预设 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            常用预设
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => applyPreset(preset)}
                className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/30 transition-all text-left"
              >
                <div className="font-medium text-slate-800 dark:text-slate-200">{preset.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">{preset.cron}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cron 表达式 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <Clock className="h-5 w-5 text-sky-500" />
            Cron 表达式
            <div className="flex items-center gap-2">
              {copied && <Check className="h-4 w-4 text-green-500" />}
              <Button variant="outline" size="sm" onClick={copyCron}>
                <Copy className="h-4 w-4 mr-1" />
                复制
              </Button>
              <Button variant="outline" size="sm" onClick={clearCron}>
                <Trash2 className="h-4 w-4 mr-1" />
                清空
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="font-mono text-2xl text-center py-6 bg-slate-50 dark:bg-slate-800 rounded-lg">
            {cron}
          </div>
          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            {description}
          </div>
        </CardContent>
      </Card>

      {/* 详细设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            详细设置
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 分钟 */}
          <PartSelector
            title="分钟"
            value={values.minute}
            min={0}
            max={59}
            onChange={(v) => updatePart('minute', v)}
          />

          {/* 小时 */}
          <PartSelector
            title="小时"
            value={values.hour}
            min={0}
            max={23}
            onChange={(v) => updatePart('hour', v)}
          />

          {/* 日 */}
          <PartSelector
            title="日"
            value={values.day}
            min={1}
            max={31}
            onChange={(v) => updatePart('day', v)}
          />

          {/* 月 */}
          <PartSelector
            title="月"
            value={values.month}
            min={1}
            max={12}
            onChange={(v) => updatePart('month', v)}
          />

          {/* 星期 */}
          <PartSelector
            title="星期"
            value={values.weekday}
            min={0}
            max={6}
            labels={WEEKDAYS.map((d, i) => ({ value: i, label: `周${d}` }))}
            onChange={(v) => updatePart('weekday', v)}
          />
        </CardContent>
      </Card>
    </div>
  )
}

interface PartSelectorProps {
  title: string
  value: CronPartValue
  min: number
  max: number
  labels?: Array<{ value: number; label: string }>
  onChange: (value: CronPartValue) => void
}

function PartSelector({ title, value, min, max, labels, onChange }: PartSelectorProps) {
  const [type, setType] = useState<CronType>(value.type)
  const [rangeStart, setRangeStart] = useState(min)
  const [rangeEnd, setRangeEnd] = useState(max)
  const [interval, setInterval] = useState(1)
  const [specific, setSpecific] = useState<number[]>([])

  const toggleSpecific = (val: number) => {
    const newSpecific = specific.includes(val)
      ? specific.filter((v) => v !== val)
      : [...specific, val]
    setSpecific(newSpecific)
    onChange({
      type: 'specific',
      value: newSpecific.sort((a, b) => a - b).join(','),
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-medium text-slate-800 dark:text-slate-200">{title}</div>
        <div className="font-mono text-sm text-sky-600 dark:text-sky-400">{value.value}</div>
      </div>

      {/* 类型选择 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            setType('every')
            onChange({ type: 'every', value: '*' })
          }}
          className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
            type === 'every'
              ? 'bg-sky-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          每单位
        </button>
        <button
          onClick={() => {
            setType('range')
            onChange({ type: 'range', value: `${rangeStart}-${rangeEnd}` })
          }}
          className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
            type === 'range'
              ? 'bg-sky-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          范围
        </button>
        <button
          onClick={() => {
            setType('interval')
            onChange({ type: 'interval', value: `*/${interval}` })
          }}
          className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
            type === 'interval'
              ? 'bg-sky-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          间隔
        </button>
        <button
          onClick={() => {
            setType('specific')
            onChange({
              type: 'specific',
              value: specific.length > 0 ? specific.sort((a, b) => a - b).join(',') : '*',
            })
          }}
          className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
            type === 'specific'
              ? 'bg-sky-500 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
          }`}
        >
          指定
        </button>
      </div>

      {/* 范围选择 */}
      {type === 'range' && (
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={min}
            max={max}
            value={rangeStart}
            onChange={(e) => {
              const val = Number(e.target.value)
              setRangeStart(val)
              onChange({ type: 'range', value: `${val}-${rangeEnd}` })
            }}
            className="w-20 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          />
          <span className="text-slate-400">-</span>
          <input
            type="number"
            min={min}
            max={max}
            value={rangeEnd}
            onChange={(e) => {
              const val = Number(e.target.value)
              setRangeEnd(val)
              onChange({ type: 'range', value: `${rangeStart}-${val}` })
            }}
            className="w-20 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          />
        </div>
      )}

      {/* 间隔选择 */}
      {type === 'interval' && (
        <div className="flex items-center gap-3">
          <span className="text-slate-600 dark:text-slate-400">每</span>
          <input
            type="number"
            min={1}
            max={max}
            value={interval}
            onChange={(e) => {
              const val = Number(e.target.value)
              setInterval(val)
              onChange({ type: 'interval', value: `*/${val}` })
            }}
            className="w-20 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
          />
          <span className="text-slate-600 dark:text-slate-400">{title}</span>
        </div>
      )}

      {/* 指定值选择 */}
      {type === 'specific' && (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((val) => {
            const label = labels?.find((l) => l.value === val)?.label || String(val)
            return (
              <button
                key={val}
                onClick={() => toggleSpecific(val)}
                className={`w-10 h-10 text-sm rounded-lg transition-all ${
                  specific.includes(val)
                    ? 'bg-sky-500 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
