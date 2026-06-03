interface AssigneeInputProps {
  assignees: string[]
  teamMembers: string[]
  onChange: (assignees: string[]) => void
  onAddTeamMember: (name: string) => void
  onRemoveTeamMember?: (name: string) => void
}

export function AssigneeInput({
  assignees,
  teamMembers,
  onChange,
  onAddTeamMember,
  onRemoveTeamMember,
}: AssigneeInputProps) {
  const add = (name: string) => {
    if (name === '__new__') {
      const entered = window.prompt('Enter team member name:')
      if (!entered?.trim()) return
      const trimmed = entered.trim()
      if (!teamMembers.includes(trimmed)) onAddTeamMember(trimmed)
      if (!assignees.includes(trimmed)) onChange([...assignees, trimmed])
      return
    }
    if (name === '__remove__') {
      if (teamMembers.length === 0) {
        alert('No team members to remove. Add members first.')
        return
      }
      const pick = window.prompt(
        `Remove which name from the team list?\n\n${teamMembers.join('\n')}\n\nType the exact name:`
      )
      if (!pick?.trim()) return
      const trimmed = pick.trim()
      if (!teamMembers.includes(trimmed)) {
        alert(`"${trimmed}" is not on the team list.`)
        return
      }
      onRemoveTeamMember?.(trimmed)
      return
    }
    if (name && !assignees.includes(name)) onChange([...assignees, name])
  }

  const removeFromRow = (name: string) => onChange(assignees.filter((a) => a !== name))

  return (
    <div className="flex flex-wrap items-center gap-1">
      {assignees.length === 0 && <span className="text-xs text-gray-400">—</span>}
      {assignees.map((a) => (
        <button
          key={a}
          type="button"
          onClick={() => removeFromRow(a)}
          className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
          title="Remove from this row"
        >
          {a} ×
        </button>
      ))}
      <select
        className="max-w-[110px] rounded border-0 bg-transparent text-xs text-gray-500 outline-none"
        value=""
        onChange={(e) => {
          add(e.target.value)
          e.target.value = ''
        }}
      >
        <option value="">+</option>
        {teamMembers
          .filter((m) => !assignees.includes(m))
          .map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        <option value="__new__">New…</option>
        {onRemoveTeamMember && teamMembers.length > 0 && (
          <option value="__remove__">Remove name…</option>
        )}
      </select>
    </div>
  )
}
