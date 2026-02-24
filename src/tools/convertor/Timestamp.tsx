import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Clock, RefreshCw, ArrowRight } from 'lucide-react'
import dayjs from 'dayjs'
import axios from 'axios'

export function Timestamp() {
  const [currentTimestamp, setCurrentTimestamp] = useState(0)
  const [currentTime, setCurrentTime] = useState('')
  const [timestampInput, setTimestampInput] = useState('')
  const [dateTimeInput, setDateTimeInput] = useState('')
  const [dateYMdInput, setDateYMdInput] = useState('')
  const [isLoadingInternetTime, setIsLoadingInternetTime] = useState(false)
  
  const [timeDuration, setTimeDuration] = useState('')
  const [durationSeconds, setDurationSeconds] = useState(0)
  const [durationMillis, setDurationMillis] = useState(0)
  
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [diffDays, setDiffDays] = useState(0)
  const [addDays, setAddDays] = useState('')
  const [futureDate, setFutureDate] = useState('')

  useEffect(() => {
    updateCurrentTime()
    const interval = setInterval(updateCurrentTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const updateCurrentTime = () => {
    const now = Date.now()
    setCurrentTimestamp(Math.floor(now / 1000))
    setCurrentTime(dayjs().format('YYYY-MM-DD HH:mm:ss'))
  }

  const updateAllTimeFields = (timestamp: number) => {
    if (timestamp > 0) {
      setTimestampInput(timestamp.toString())
      setDateTimeInput(dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss'))
      setDateYMdInput(dayjs(timestamp).format('YYYYMMDD'))
    } else {
      setTimestampInput('')
      setDateTimeInput('')
      setDateYMdInput('')
    }
  }

  const fetchInternetTime = async () => {
    try {
      setIsLoadingInternetTime(true)
      const response = await axios.get('http://worldtimeapi.org/api/ip', { timeout: 3000 })
      const dateTime = response.data.datetime
      const timestamp = dayjs(dateTime).valueOf()
      updateAllTimeFields(timestamp)
    } catch (error) {
      console.error('获取互联网时间失败:', error)
      updateAllTimeFields(Date.now())
    } finally {
      setIsLoadingInternetTime(false)
    }
  }

  const timestampToDate = () => {
    const timestamp = parseInt(timestampInput)
    if (isNaN(timestamp)) {
      return
    }
    
    let date
    if (timestampInput.length <= 10) {
      date = dayjs.unix(timestamp)
    } else {
      date = dayjs(timestamp)
    }
    
    if (!date.isValid()) {
      return
    }
    
    updateAllTimeFields(date.valueOf())
  }

  const dateToTimestamp = () => {
    if (!dateTimeInput) {
      return
    }
    const date = dayjs(dateTimeInput)
    if (!date.isValid()) {
      return
    }
    const timestamp = date.valueOf()
    updateAllTimeFields(timestamp)
  }

  const dateYMdToTimestamp = () => {
    if (!dateYMdInput) {
      return
    }
    const date = dayjs(dateYMdInput, 'YYYYMMDD')
    if (!date.isValid()) {
      return
    }
    const timestamp = date.valueOf()
    updateAllTimeFields(timestamp)
  }

  const parseDuration = (durationStr: string) => {
    const regex = /(\d+)(d|h|m|s)/g
    let match
    let days = 0, hours = 0, minutes = 0, seconds = 0

    while ((match = regex.exec(durationStr)) !== null) {
      const value = parseInt(match[1], 10)
      switch (match[2]) {
        case 'd': days += value; break
        case 'h': hours += value; break
        case 'm': minutes += value; break
        case 's': seconds += value; break
      }
    }

    const totalSeconds = seconds + minutes * 60 + hours * 3600 + days * 86400
    return totalSeconds
  }

  const calculateDuration = () => {
    if (!timeDuration.trim()) {
      setDurationSeconds(0)
      setDurationMillis(0)
      return
    }

    try {
      const totalSeconds = parseDuration(timeDuration)
      setDurationSeconds(totalSeconds)
      setDurationMillis(totalSeconds * 1000)
    } catch (error) {
      console.error('时间格式解析失败:', error)
      setDurationSeconds(0)
      setDurationMillis(0)
    }
  }

  const calculateDateDifference = (start?: string, end?: string) => {
    const startVal = start || startDate
    const endVal = end || endDate
    if (!startVal || !endVal) return
    const startDateObj = dayjs(startVal)
    const endDateObj = dayjs(endVal)
    const diff = endDateObj.diff(startDateObj, 'day')
    setDiffDays(diff)
  }

  const calculateFutureDate = (start?: string, days?: string) => {
    const startVal = start || startDate
    const daysVal = days || addDays
    if (!startVal || !daysVal) return
    const numDays = parseInt(daysVal)
    if (isNaN(numDays)) return
    const date = dayjs(startVal).add(numDays, 'day')
    setFutureDate(date.format('YYYY-MM-DD'))
  }

  const useCurrentTimestamp = () => {
    updateAllTimeFields(Date.now())
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-slate-700 dark:text-slate-200">
          <Clock className="h-6 w-6 text-slate-600 dark:text-slate-300" />
          时间戳转换
        </h1>
        <p className="text-sm text-muted-foreground text-slate-600 dark:text-slate-400">
          Unix 时间戳与日期时间相互转换、时间计算工具
        </p>
      </div>

      <Card className="bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/30">
        <CardContent className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground text-slate-600 dark:text-slate-400">当前时间</p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{currentTime}</p>
              <p className="text-xs text-muted-foreground text-slate-600 dark:text-slate-400 mt-0.5">
                时间戳: {currentTimestamp}s | {currentTimestamp * 1000}ms
              </p>
            </div>
            <Button
              onClick={fetchInternetTime}
              variant="outline"
              size="sm"
              title="同步互联网时间"
              disabled={isLoadingInternetTime}
              className="border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <RefreshCw className={`h-4 w-4 text-slate-700 dark:text-slate-300 ${isLoadingInternetTime ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="bg-white dark:bg-slate-950/60 backdrop-blur-xl border-slate-200 dark:border-slate-700/60 dark:shadow-2xl dark:shadow-black/40 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 dark:before:opacity-100 before:pointer-events-none">
          <CardHeader className="pb-3 relative">
            <CardTitle className="text-base text-slate-700 dark:text-slate-200">时间戳转换</CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">时间戳与多种日期格式相互转换</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 relative">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">时间戳 (毫秒)</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={timestampInput}
                  onChange={(e) => setTimestampInput(e.target.value)}
                  onBlur={timestampToDate}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      timestampToDate()
                    }
                  }}
                  placeholder="输入时间戳"
                  className="font-mono text-sm h-8"
                />
                <Button onClick={useCurrentTimestamp} variant="outline" size="icon" title="当前时间戳" className="h-8 w-8 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Clock className="h-3.5 w-3.5 text-slate-700 dark:text-slate-300" />
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">年-月-日 时:分:秒</label>
              <Input
                type="datetime-local"
                value={dateTimeInput}
                onChange={(e) => setDateTimeInput(e.target.value)}
                onBlur={dateToTimestamp}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    dateToTimestamp()
                  }
                }}
                className="font-mono text-sm h-8"
                step="1"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">年月日 (YYYYMMDD)</label>
              <Input
                type="text"
                value={dateYMdInput}
                onChange={(e) => setDateYMdInput(e.target.value)}
                onBlur={dateYMdToTimestamp}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    dateYMdToTimestamp()
                  }
                }}
                placeholder="例如: 20250205"
                className="font-mono text-sm h-8"
                maxLength={8}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-950/60 backdrop-blur-xl border-slate-200 dark:border-slate-700/60 dark:shadow-2xl dark:shadow-black/40 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 dark:before:opacity-100 before:pointer-events-none">
          <CardHeader className="pb-3 relative">
            <CardTitle className="text-base text-slate-700 dark:text-slate-200">时间计算</CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">计算日期差值和推算未来日期</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 relative">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">开始时间</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => {
                  const newDate = e.target.value
                  setStartDate(newDate)
                  calculateDateDifference(newDate, endDate)
                  calculateFutureDate(newDate, addDays)
                }}
                onBlur={(e) => {
                  const newDate = e.target.value
                  calculateDateDifference(newDate, endDate)
                  calculateFutureDate(newDate, addDays)
                }}
                className="text-sm h-8 cursor-pointer [&::-webkit-calendar-picker-indicator]:hover:bg-slate-100 dark:[&::-webkit-calendar-picker-indicator]:hover:bg-slate-700"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">截止时间</label>
              <div className="flex gap-2 items-center">
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    const newDate = e.target.value
                    setEndDate(newDate)
                    calculateDateDifference(startDate, newDate)
                  }}
                  onBlur={(e) => {
                    calculateDateDifference(startDate, e.target.value)
                  }}
                  className="flex-1 text-sm h-8 cursor-pointer [&::-webkit-calendar-picker-indicator]:hover:bg-slate-100 dark:[&::-webkit-calendar-picker-indicator]:hover:bg-slate-700"
                />
                <ArrowRight className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  相差 {diffDays} 天
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">增加天数</label>
              <div className="flex gap-2 items-center">
                <Input
                  type="number"
                  value={addDays}
                  onChange={(e) => {
                    const newDays = e.target.value
                    setAddDays(newDays)
                    calculateFutureDate(startDate, newDays)
                  }}
                  onBlur={(e) => {
                    calculateFutureDate(startDate, e.target.value)
                  }}
                  placeholder="输入天数"
                  className="flex-1 text-sm h-8"
                />
                <span className="text-xs text-muted-foreground text-slate-500 dark:text-slate-400 whitespace-nowrap">天后为</span>
                <span className="text-xs font-medium whitespace-nowrap">
                  {futureDate || '-'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-slate-950/60 backdrop-blur-xl border-slate-200 dark:border-slate-700/60 dark:shadow-2xl dark:shadow-black/40 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:opacity-0 dark:before:opacity-100 before:pointer-events-none">
        <CardHeader className="pb-3 relative">
          <CardTitle className="text-base text-slate-700 dark:text-slate-200">时间转秒/毫秒</CardTitle>
          <CardDescription className="text-xs text-slate-500 dark:text-slate-400">解析时间长度并转换为秒和毫秒，支持格式: 1d3h15m30s</CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex gap-3 items-end">
            <div className="flex-1 space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">时间长度</label>
              <Input
                type="text"
                value={timeDuration}
                onChange={(e) => setTimeDuration(e.target.value)}
                onBlur={calculateDuration}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    calculateDuration()
                  }
                }}
                placeholder="例如: 1d3h15m30s"
                className="font-mono text-sm h-8"
              />
            </div>
            <div className="w-40 space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">秒 (s)</label>
              <Input
                type="number"
                value={durationSeconds}
                readOnly
                className="font-mono text-sm h-8"
              />
            </div>
            <div className="w-40 space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">毫秒 (ms)</label>
              <Input
                type="number"
                value={durationMillis}
                readOnly
                className="font-mono text-sm h-8"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
