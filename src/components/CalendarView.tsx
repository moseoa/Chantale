import { useState } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
  isValid,
  addMonths,
  subMonths,
} from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { CanadianHoliday } from '../canadianHolidays'
import { getCanadianHolidaysForMonth } from '../canadianHolidays'

interface CalendarItem {
  id: string
  title: string
  date?: string
}

interface CalendarViewProps {
  items: CalendarItem[]
  onSelectItem?: (id: string) => void
  showCanadianHolidays?: boolean
}

const CATEGORY_STYLES: Record<CanadianHoliday['category'], string> = {
  federal: 'bg-red-100 text-red-800',
  provincial: 'bg-amber-100 text-amber-900',
  observance: 'bg-slate-100 text-slate-700',
}

export function CalendarView({
  items,
  onSelectItem,
  showCanadianHolidays = true,
}: CalendarViewProps) {
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(new Date()))
  const today = new Date()
  const monthStart = startOfMonth(viewMonth)
  const monthEnd = endOfMonth(viewMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const holidays = showCanadianHolidays
    ? getCanadianHolidaysForMonth(viewMonth.getFullYear(), viewMonth.getMonth())
    : []

  const holidaysByDate = new Map<string, CanadianHoliday[]>()
  for (const h of holidays) {
    const list = holidaysByDate.get(h.date) ?? []
    list.push(h)
    holidaysByDate.set(h.date, list)
  }

  const itemsByDate = new Map<string, CalendarItem[]>()
  for (const item of items) {
    if (!item.date) continue
    const d = parseISO(item.date)
    if (!isValid(d)) continue
    const key = format(d, 'yyyy-MM-dd')
    const list = itemsByDate.get(key) ?? []
    list.push(item)
    itemsByDate.set(key, list)
  }

  const startPad = monthStart.getDay()

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewMonth(subMonths(viewMonth, 1))}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="text-sm font-semibold text-gray-900">
          {format(viewMonth, 'MMMM yyyy')}
        </h3>
        <button
          type="button"
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {showCanadianHolidays && (
        <div className="mb-3 flex flex-wrap gap-3 text-[10px] text-gray-500">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-red-400" /> Federal
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-400" /> Provincial
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-slate-400" /> Observance
          </span>
        </div>
      )}

      <div className="grid grid-cols-7 gap-px text-center text-xs font-medium text-gray-500">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startPad }).map((_, i) => (
          <div key={`pad-${i}`} className="min-h-[88px]" />
        ))}
        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd')
          const dayItems = itemsByDate.get(key) ?? []
          const dayHolidays = holidaysByDate.get(key) ?? []
          const isToday = isSameDay(day, today)
          const hasHoliday = dayHolidays.length > 0
          return (
            <div
              key={key}
              className={`min-h-[88px] rounded-lg border p-1 ${
                isSameMonth(day, viewMonth)
                  ? isToday
                    ? 'border-teal-300 bg-teal-50'
                    : hasHoliday
                      ? 'border-red-200 bg-red-50/30'
                      : 'border-gray-100 bg-gray-50/50'
                  : 'border-transparent opacity-40'
              }`}
            >
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                  isToday ? 'bg-teal-600 font-semibold text-white' : 'text-gray-600'
                }`}
              >
                {format(day, 'd')}
              </span>
              {dayHolidays.map((h) => (
                <div
                  key={h.name}
                  className={`mt-0.5 truncate rounded px-1 py-0.5 text-[9px] font-medium leading-tight ${CATEGORY_STYLES[h.category]}`}
                  title={h.note ? `${h.name} — ${h.note}` : h.name}
                >
                  🍁 {h.name}
                </div>
              ))}
              <ul className="mt-0.5 space-y-0.5">
                {dayItems.slice(0, hasHoliday ? 1 : 2).map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onSelectItem?.(item.id)}
                      className="w-full truncate rounded bg-teal-100 px-1 py-0.5 text-left text-[10px] text-teal-800 hover:bg-teal-200"
                    >
                      {item.title}
                    </button>
                  </li>
                ))}
                {dayItems.length > (hasHoliday ? 1 : 2) && (
                  <li className="text-[10px] text-gray-400">
                    +{dayItems.length - (hasHoliday ? 1 : 2)} more
                  </li>
                )}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
