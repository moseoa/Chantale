import { Trash2, UserPlus } from 'lucide-react'
import type { WorkspaceData } from '../types'
import { addTeamMember, removeTeamMember } from '../team'

interface TeamMembersPanelProps {
  data: WorkspaceData
  onUpdate: (data: WorkspaceData) => void
  compact?: boolean
}

export function TeamMembersPanel({ data, onUpdate, compact }: TeamMembersPanelProps) {
  const handleRemove = (name: string) => {
    const usedIn =
      data.events.some((e) => e.assignees.includes(name)) ||
      data.socialPosts.some((p) => p.assignees.includes(name))
    const msg = usedIn
      ? `Remove "${name}" from the team list and from all event/post assignees?`
      : `Remove "${name}" from the team list?`
    if (!confirm(msg)) return
    onUpdate(removeTeamMember(data, name))
  }

  const handleAdd = () => {
    const entered = window.prompt('Enter team member name:')
    if (!entered?.trim()) return
    onUpdate(addTeamMember(data, entered))
  }

  return (
    <div className={compact ? '' : 'rounded-xl border border-gray-200 bg-white p-5'}>
      {!compact && (
        <>
          <h2 className="font-semibold text-gray-900">Team members</h2>
          <p className="mt-2 text-sm text-gray-600">
            Names appear in assignee dropdowns. Remove someone to delete them from the list and
            all assignments.
          </p>
        </>
      )}
      <ul className={`space-y-2 ${compact ? 'mt-0' : 'mt-4'}`}>
        {data.teamMembers.length === 0 && (
          <li className="text-sm text-gray-400">No team members yet. Add one below or from an assignee field.</li>
        )}
        {data.teamMembers.map((name) => (
          <li
            key={name}
            className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
          >
            <span className="text-sm font-medium text-gray-800">{name}</span>
            <button
              type="button"
              onClick={() => handleRemove(name)}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
              title={`Remove ${name} from team`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={handleAdd}
        className={`inline-flex items-center gap-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 ${
          compact ? 'mt-2 px-3 py-1.5' : 'mt-4 px-4 py-2'
        }`}
      >
        <UserPlus className="h-4 w-4" />
        Add member
      </button>
    </div>
  )
}
