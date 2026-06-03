import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
  isValid,
} from 'date-fns'

interface CalendarItem {
  id: string
  title: string
  date?: string
}

interface CalendarViewProps {
  items: CalendarItem[]
  onSelectItem?: (id: string) => void
}

export function CalendarView({ items, onSelectItem }: CalendarViewProps) {
  const today = new Date()
  const monthStart = startOfMonth(today)
  const monthEnd = endOfMonth(today)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

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
      <h3 className="mb-4 text-sm font-semibold text-gray-900">
        {format(today, 'MMMM yyyy')}
      </h3>
      <div className="grid grid-cols-7 gap-px text-center text-xs font-medium text-gray-500">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startPad }).map((_, i) => (
          <div key={`pad-${i}`} className="min-h-[72px]" />
        ))}
        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd')
          const dayItems = itemsByDate.get(key) ?? []
          const isToday = isSameDay(day, today)
          return (
            <div
              key={key}
              className={`min-h-[72px] rounded-lg border p-1 ${
                isSameMonth(day, today)
                  ? isToday
                    ? 'border-teal-300 bg-teal-50'
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
              <ul className="mt-0.5 space-y-0.5">
                {dayItems.slice(0, 2).map((item) => (
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
                {dayItems.length > 2 && (
                  <li className="text-[10px] text-gray-400">+{dayItems.length - 2} more</li>
                )}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
