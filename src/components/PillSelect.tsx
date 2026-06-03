interface Option {
  value: string
  label: string
}

interface PillSelectProps {
  value: string
  options: Option[]
  styles: Record<string, string>
  onChange: (value: string) => void
}

export function PillSelect({ value, options, styles, onChange }: PillSelectProps) {
  const current = options.find((o) => o.value === value)
  const style = styles[value] ?? 'bg-gray-100 text-gray-600'

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`appearance-none cursor-pointer rounded-full border-0 px-2.5 py-0.5 text-xs font-medium outline-none ${style}`}
      title={current?.label}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
