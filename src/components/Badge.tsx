interface BadgeProps {
  label: string
  className: string
  onClick?: () => void
}

export function Badge({ label, className, onClick }: BadgeProps) {
  const Tag = onClick ? 'button' : 'span'
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className} ${onClick ? 'cursor-pointer hover:opacity-80' : ''}`}
    >
      {label}
    </Tag>
  )
}
