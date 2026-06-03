import {
  addDays,
  format,
  getDay,
  setMonth,
  startOfMonth,
  subDays,
} from 'date-fns'

export type HolidayCategory = 'federal' | 'provincial' | 'observance'

export interface CanadianHoliday {
  date: string
  name: string
  category: HolidayCategory
  note?: string
}

function toKey(d: Date): string {
  return format(d, 'yyyy-MM-dd')
}

function getEasterSunday(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

function nthWeekday(year: number, monthIndex: number, weekday: number, n: number): Date {
  let date = startOfMonth(new Date(year, monthIndex, 1))
  while (getDay(date) !== weekday) date = addDays(date, 1)
  return addDays(date, (n - 1) * 7)
}

function mondayBeforeMay25(year: number): Date {
  let date = new Date(year, 4, 25)
  while (getDay(date) !== 1) date = subDays(date, 1)
  return date
}

function fridayBeforeLastSundayOfFebruary(year: number): Date {
  const lastDay = new Date(year, 2, 0)
  let date = lastDay
  while (getDay(date) !== 0) date = subDays(date, 1)
  return subDays(date, 2)
}

function fixed(year: number, monthIndex: number, day: number, name: string, category: HolidayCategory, note?: string): CanadianHoliday {
  return { date: format(new Date(year, monthIndex, day), 'yyyy-MM-dd'), name, category, note }
}

export function getCanadianHolidays(year: number): CanadianHoliday[] {
  const easter = getEasterSunday(year)
  const goodFriday = subDays(easter, 2)
  const easterMonday = addDays(easter, 1)

  const holidays: CanadianHoliday[] = [
    fixed(year, 0, 1, "New Year's Day", 'federal'),
    { date: toKey(goodFriday), name: 'Good Friday', category: 'federal' },
    { date: toKey(easter), name: 'Easter Sunday', category: 'observance' },
    { date: toKey(easterMonday), name: 'Easter Monday', category: 'federal', note: 'Federal holiday; optional elsewhere' },

    fixed(year, 1, 2, 'Groundhog Day', 'observance'),
    fixed(year, 1, 14, "Valentine's Day", 'observance'),

    {
      date: toKey(nthWeekday(year, 1, 1, 3)),
      name: 'Family Day',
      category: 'provincial',
      note: 'AB, BC, NB, ON, SK (3rd Monday in February)',
    },
    {
      date: toKey(nthWeekday(year, 1, 1, 3)),
      name: 'Louis Riel Day',
      category: 'provincial',
      note: 'Manitoba (3rd Monday in February)',
    },
    {
      date: toKey(nthWeekday(year, 1, 1, 3)),
      name: 'Islander Day',
      category: 'provincial',
      note: 'Prince Edward Island (3rd Monday in February)',
    },
    {
      date: toKey(nthWeekday(year, 1, 1, 3)),
      name: 'Heritage Day',
      category: 'provincial',
      note: 'Nova Scotia (3rd Monday in February)',
    },
    {
      date: toKey(fridayBeforeLastSundayOfFebruary(year)),
      name: 'Yukon Heritage Day',
      category: 'provincial',
      note: 'Yukon (Friday before last Sunday in February)',
    },

    fixed(year, 2, 17, "St. Patrick's Day", 'observance'),

    {
      date: toKey(mondayBeforeMay25(year)),
      name: 'Victoria Day',
      category: 'federal',
      note: 'Monday before May 25',
    },
    {
      date: toKey(mondayBeforeMay25(year)),
      name: 'National Patriots Day',
      category: 'provincial',
      note: 'Quebec (same date as Victoria Day)',
    },
    {
      date: toKey(nthWeekday(year, 4, 0, 2)),
      name: "Mother's Day",
      category: 'observance',
      note: '2nd Sunday in May',
    },

    fixed(year, 5, 21, 'National Indigenous Peoples Day', 'observance'),
    fixed(year, 5, 24, 'Saint-Jean-Baptiste Day', 'provincial', 'Quebec national holiday'),
    fixed(year, 6, 1, 'Canada Day', 'federal'),

    {
      date: toKey(nthWeekday(year, 7, 1, 1)),
      name: 'Civic Holiday',
      category: 'provincial',
      note: 'First Monday in August (name varies by province)',
    },
    {
      date: toKey(nthWeekday(year, 7, 1, 1)),
      name: 'British Columbia Day',
      category: 'provincial',
      note: 'BC (first Monday in August)',
    },
    {
      date: toKey(nthWeekday(year, 7, 1, 1)),
      name: 'Heritage Day (Alberta)',
      category: 'provincial',
      note: 'AB (first Monday in August)',
    },
    {
      date: toKey(nthWeekday(year, 7, 1, 1)),
      name: 'Terry Fox Day',
      category: 'provincial',
      note: 'Manitoba (first Monday in August)',
    },
    {
      date: toKey(nthWeekday(year, 7, 1, 1)),
      name: 'New Brunswick Day',
      category: 'provincial',
      note: 'NB (first Monday in August)',
    },
    {
      date: toKey(nthWeekday(year, 7, 1, 1)),
      name: 'Saskatchewan Day',
      category: 'provincial',
      note: 'SK (first Monday in August)',
    },
    {
      date: toKey(nthWeekday(year, 7, 1, 1)),
      name: 'Natal Day',
      category: 'provincial',
      note: 'NS civic celebration (often first Monday in August)',
    },

    {
      date: toKey(nthWeekday(year, 8, 1, 1)),
      name: 'Labour Day',
      category: 'federal',
      note: 'First Monday in September',
    },
    fixed(year, 8, 30, 'National Day for Truth and Reconciliation', 'federal'),

    fixed(year, 9, 31, 'Halloween', 'observance'),
    {
      date: toKey(nthWeekday(year, 9, 1, 2)),
      name: 'Thanksgiving',
      category: 'federal',
      note: 'Second Monday in October',
    },

    fixed(year, 10, 11, 'Remembrance Day', 'federal', 'Statutory in many provinces; optional day off elsewhere'),
    fixed(year, 11, 25, 'Christmas Day', 'federal'),
    fixed(year, 11, 26, 'Boxing Day', 'federal', 'Statutory in ON; federal public service holiday'),
  ]

  return holidays.sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name))
}

export function getCanadianHolidaysForMonth(year: number, monthIndex: number): CanadianHoliday[] {
  const monthPrefix = format(setMonth(new Date(year, 0, 1), monthIndex), 'yyyy-MM')
  return getCanadianHolidays(year).filter((h) => h.date.startsWith(monthPrefix))
}

export function getHolidaysByDate(year: number): Map<string, CanadianHoliday[]> {
  const map = new Map<string, CanadianHoliday[]>()
  for (const h of getCanadianHolidays(year)) {
    const list = map.get(h.date) ?? []
    list.push(h)
    map.set(h.date, list)
  }
  return map
}
