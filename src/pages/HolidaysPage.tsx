import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { getCanadianHolidays, type CanadianHoliday } from '../canadianHolidays'

const CATEGORY_LABELS: Record<CanadianHoliday['category'], string> = {
  federal: 'Federal',
  provincial: 'Provincial',
  observance: 'Observance',
}

const CATEGORY_STYLES: Record<CanadianHoliday['category'], string> = {
  federal: 'bg-red-100 text-red-800',
  provincial: 'bg-amber-100 text-amber-900',
  observance: 'bg-slate-100 text-slate-700',
}

export function HolidaysPage() {
  const [year, setYear] = useState(() => new Date().getFullYear())
  const holidays = getCanadianHolidays(year)

  const byMonth = new Map<string, CanadianHoliday[]>()
  for (const h of holidays) {
    const monthKey = h.date.slice(0, 7)
    const list = byMonth.get(monthKey) ?? []
    list.push(h)
    byMonth.set(monthKey, list)
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Canadian holidays</h1>
          <p className="mt-1 text-sm text-gray-500">
            Federal statutory days, provincial holidays, and national observances
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setYear((y) => y - 1)}
            className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-[4rem] text-center text-lg font-semibold">{year}</span>
          <button
            type="button"
            onClick={() => setYear((y) => y + 1)}
            className="rounded-lg border border-gray-200 p-2 hover:bg-gray-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-3xl space-y-8">
          {[...byMonth.entries()].map(([monthKey, monthHolidays]) => (
            <section key={monthKey}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                {format(parseISO(`${monthKey}-01`), 'MMMM yyyy')}
              </h2>
              <ul className="space-y-2">
                {monthHolidays.map((h) => (
                  <li
                    key={`${h.date}-${h.name}`}
                    className="flex flex-wrap items-start justify-between gap-2 rounded-xl border border-gray-100 bg-white px-4 py-3"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{h.name}</p>
                      <p className="text-sm text-gray-500">
                        {format(parseISO(h.date), 'EEEE, MMMM d')}
                      </p>
                      {h.note && (
                        <p className="mt-1 text-xs text-gray-400">{h.note}</p>
                      )}
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${CATEGORY_STYLES[h.category]}`}
                    >
                      {CATEGORY_LABELS[h.category]}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
