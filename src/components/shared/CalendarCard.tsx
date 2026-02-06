import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, ChevronRight, Calendar, ChevronDown } from 'lucide-react'
import { Solar, HolidayUtil } from 'lunar-typescript'

export function CalendarCard() {
  const [today, setToday] = useState<Solar>(Solar.fromDate(new Date()))
  const [year, setYear] = useState(today.getYear())
  const [month, setMonth] = useState(today.getMonth())
  const [day, setDay] = useState(today.getDay())
  const [holidayMessages, setHolidayMessages] = useState<string[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const updateDate = (solar: Solar) => {
    setToday(solar)
    setYear(solar.getYear())
    setMonth(solar.getMonth())
    setDay(solar.getDay())
    calHolidayCountDownWithDate(solar)
  }

  const prevDay = () => {
    const newDate = today.next(-1)
    updateDate(newDate)
  }

  const nextDay = () => {
    const newDate = today.next(1)
    updateDate(newDate)
  }

  const handleYearChange = (value: string) => {
    const newYear = parseInt(value)
    setYear(newYear)
    try {
      updateDate(Solar.fromYmd(newYear, month, day))
    } catch {
      updateDate(Solar.fromYmd(newYear, month, 1))
    }
  }

  const handleMonthChange = (value: string) => {
    const newMonth = parseInt(value)
    setMonth(newMonth)
    try {
      updateDate(Solar.fromYmd(year, newMonth, day))
    } catch {
      updateDate(Solar.fromYmd(year, newMonth, 1))
    }
  }

  const handleDayChange = (value: string) => {
    const newDay = parseInt(value)
    setDay(newDay)
    try {
      updateDate(Solar.fromYmd(year, month, newDay))
    } catch {
      updateDate(Solar.fromYmd(year, month, 1))
    }
  }

  const calHolidayCountDownWithDate = (date: Solar) => {
    let holidays = HolidayUtil.getHolidays(date.getYear())

    holidays = holidays.filter((item) => !item.isWork())

    const todayYmd = date.toYmd()
    const todayHoliday = holidays.find(holiday => holiday.getDay() === todayYmd)

    const currentWeek = date.getWeek()
    let days = 0
    
    if (currentWeek === 6) {
      days = -1
    } else if (currentWeek === 0) {
      days = -2
    } else {
      days = 6 - currentWeek
    }

    const groupedHolidays = new Map<string, Solar[]>()
    holidays.forEach((holiday) => {
      const name = holiday.getName()
      if (!groupedHolidays.has(name)) {
        groupedHolidays.set(name, [])
      }
      groupedHolidays.get(name)!.push(Solar.fromDate(new Date(holiday.getDay())))
    })

    let holidayInfos = Array.from(groupedHolidays.entries()).map(([name, holidays]) => {
      const earliestHoliday = holidays.reduce((prev, curr) =>
        prev ? (prev.isBefore(curr) ? prev : curr) : curr
      )
      const latestHoliday = holidays.reduce((prev, curr) =>
        prev ? (prev.isAfter(curr) ? prev : curr) : curr
      )
      return {
        name,
        earliestDate: earliestHoliday,
        latestDate: latestHoliday,
        leftDays: 0
      }
    })

    holidayInfos = holidayInfos.sort((a, b) => {
      if (a.earliestDate.isBefore(b.earliestDate)) return -1
      if (a.earliestDate.isAfter(b.earliestDate)) return 1
      return 0
    })

    holidayInfos = holidayInfos.filter((holiday) => {
      const isBeforeHoliday = holiday.earliestDate.isAfter(date)
      const isAfterHoliday = holiday.latestDate.isBefore(date)
      const isDuringHoliday = !date.isBefore(holiday.earliestDate) && !date.isAfter(holiday.latestDate)
      return isBeforeHoliday || (isAfterHoliday && !isDuringHoliday)
    })

    for (const holiday of holidayInfos) {
      holiday.leftDays = holiday.earliestDate.subtract(date)
    }

    const messages: string[] = []
    
    if (todayHoliday) {
      const holidayName = todayHoliday.getName()
      const currentHolidayGroup = Array.from(groupedHolidays.entries()).find(([name]) => name === holidayName)
      
      if (currentHolidayGroup) {
        const holidayDays = currentHolidayGroup[1]
        const lastDay = holidayDays.reduce((prev, curr) =>
          prev ? (prev.isAfter(curr) ? prev : curr) : curr
        )
        
        if (lastDay.toYmd() === todayYmd) {
          messages.push(`${holidayName}最后一天，明天要上班了 😭`)
        } else {
          messages.push(`${holidayName}了，好好休息吧~`)
        }
      }
    } else {
      if (days > 1) {
        messages.push(`距离周末还有 ${days} 天`)
      } else if (days === 1) {
        messages.push('明天就是周末啦~~')
      } else if (days === -1) {
        messages.push('今天周末啦！！！')
      } else if (days === -2) {
        messages.push('明天要上班，惊不惊喜，意不意外 😄')
      }
    }

    holidayInfos.filter(holiday => holiday.leftDays > 0).slice(0, 5).forEach(({ name, leftDays }) => {
      messages.push(`距离 ${name} 还有 ${leftDays} 天`)
    })

    setHolidayMessages(messages)
  }

  useEffect(() => {
    const initializeHolidayCountdown = () => {
      let holidays = HolidayUtil.getHolidays(today.getYear())

      holidays = holidays.filter((item) => !item.isWork())

      const todayYmd = today.toYmd()
      const todayHoliday = holidays.find(holiday => holiday.getDay() === todayYmd)

      const currentWeek = today.getWeek()
      let days = 0
      
      if (currentWeek === 6) {
        days = -1
      } else if (currentWeek === 0) {
        days = -2
      } else {
        days = 6 - currentWeek
      }

      const groupedHolidays = new Map<string, Solar[]>()
      holidays.forEach((holiday) => {
        const name = holiday.getName()
        if (!groupedHolidays.has(name)) {
          groupedHolidays.set(name, [])
        }
        groupedHolidays.get(name)!.push(Solar.fromDate(new Date(holiday.getDay())))
      })

      let holidayInfos = Array.from(groupedHolidays.entries()).map(([name, holidays]) => {
        const earliestHoliday = holidays.reduce((prev, curr) =>
          prev ? (prev.isBefore(curr) ? prev : curr) : curr
        )
        const latestHoliday = holidays.reduce((prev, curr) =>
          prev ? (prev.isAfter(curr) ? prev : curr) : curr
        )
        return {
          name,
          earliestDate: earliestHoliday,
          latestDate: latestHoliday,
          leftDays: 0
        }
      })

      holidayInfos = holidayInfos.sort((a, b) => {
        if (a.earliestDate.isBefore(b.earliestDate)) return -1
        if (a.earliestDate.isAfter(b.earliestDate)) return 1
        return 0
      })

      holidayInfos = holidayInfos.filter((holiday) => {
        const isBeforeHoliday = holiday.earliestDate.isAfter(today)
        const isAfterHoliday = holiday.latestDate.isBefore(today)
        const isDuringHoliday = !today.isBefore(holiday.earliestDate) && !today.isAfter(holiday.latestDate)
        return isBeforeHoliday || (isAfterHoliday && !isDuringHoliday)
      })

      for (const holiday of holidayInfos) {
        holiday.leftDays = holiday.earliestDate.subtract(today)
      }

      const messages: string[] = []
      
      if (todayHoliday) {
        const holidayName = todayHoliday.getName()
        const currentHolidayGroup = Array.from(groupedHolidays.entries()).find(([name]) => name === holidayName)
        
        if (currentHolidayGroup) {
          const holidayDays = currentHolidayGroup[1]
          const lastDay = holidayDays.reduce((prev, curr) =>
            prev ? (prev.isAfter(curr) ? prev : curr) : curr
          )
          
          if (lastDay.toYmd() === todayYmd) {
            messages.push(`${holidayName}最后一天，明天要上班了 😭`)
          } else {
            messages.push(`${holidayName}了，好好休息吧~`)
          }
        }
      } else {
        if (days > 1) {
          messages.push(`距离周末还有 ${days} 天`)
        } else if (days === 1) {
          messages.push('明天就是周末啦~~')
        } else if (days === -1) {
          messages.push('今天周末啦！！！')
        } else if (days === -2) {
          messages.push('明天要上班，惊不惊喜，意不意外 😄')
        }
      }

      holidayInfos.filter(holiday => holiday.leftDays > 0).slice(0, 5).forEach(({ name, leftDays }) => {
        messages.push(`距离 ${name} 还有 ${leftDays} 天`)
      })

      setHolidayMessages(messages)
    }

    initializeHolidayCountdown()
    
    const timer = setInterval(() => {
      const currentDay = Solar.fromDate(new Date())
      const todaySolar = Solar.fromYmd(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        new Date().getDate()
      )
      if (currentDay.toYmd() !== todaySolar.toYmd()) {
        setToday(currentDay)
      }
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const lunar = today.getLunar()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={year}
            onChange={(e) => handleYearChange(e.target.value)}
            className="text-center"
          />
          <span className="text-sm">年</span>
        </div>
        <div className="flex items-center gap-2">
          <Select value={month.toString()} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i + 1} value={(i + 1).toString()}>
                  {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm">月</span>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={day}
            onChange={(e) => handleDayChange(e.target.value)}
            className="text-center"
          />
          <span className="text-sm">日</span>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        公历 {today.getYear()}年 {today.getMonth()}月 {today.getDay()}日 星期{today.getWeekInChinese()} {today.getXingZuo()}座
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button variant="ghost" size="icon" onClick={prevDay}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <span className="text-5xl font-bold text-red-500 w-20 text-center">
          {today.getDay()}
        </span>
        <Button variant="ghost" size="icon" onClick={nextDay}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        农历 {lunar.getYearInChinese()}年 {lunar.getMonthInChinese()}月 {lunar.getDayInChinese()}
      </div>

      <div className="border-t pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-xs">假期倒计时</span>
          </div>
          {holidayMessages.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1 hover:bg-primary/10 text-primary"
              onClick={() => {
                setIsExpanded(!isExpanded)
                setCurrentIndex(0)
              }}
            >
              {isExpanded ? '收起' : '展开'}
              <ChevronDown 
                className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
              />
            </Button>
          )}
        </div>
        <div className="text-center space-y-1.5">
          {holidayMessages.length === 0 ? (
            <p className="text-sm text-foreground">暂无假期信息</p>
          ) : isExpanded ? (
            holidayMessages.map((message, index) => (
              <p key={index} className="text-sm text-foreground">
                {message}
              </p>
            ))
          ) : (
            <>
              <p className="text-sm text-foreground">
                {holidayMessages[currentIndex]}
              </p>
              {holidayMessages.length > 1 && (
                <div className="flex items-center justify-center gap-3 mt-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : holidayMessages.length - 1))}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <div className="flex gap-1">
                    {holidayMessages.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          index === currentIndex ? 'w-3 bg-primary' : 'w-1 bg-muted-foreground/40'
                        }`}
                      />
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setCurrentIndex((prev) => (prev < holidayMessages.length - 1 ? prev + 1 : 0))}
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
