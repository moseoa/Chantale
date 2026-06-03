import { useState } from 'react'
const newId = () => crypto.randomUUID()
import { Plus, Trash2 } from 'lucide-react'
import type { Event, ViewMode, WorkspaceData } from '../types'
import {
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  STATUS_STYLES,
  PRIORITY_STYLES,
} from '../constants'
import { PillSelect } from '../components/PillSelect'
import { AssigneeInput } from '../components/AssigneeInput'
import { CalendarView } from '../components/CalendarView'
import { Modal } from '../components/Modal'

interface EventsPageProps {
  data: WorkspaceData
  onUpdate: (fn: (prev: WorkspaceData) => WorkspaceData) => void
}

export function EventsPage({ data, onUpdate }: EventsPageProps) {
  const [view, setView] = useState<ViewMode>('table')
  const [editing, setEditing] = useState<Event | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const addEvent = () => {
    const event: Event = {
      id: newId(),
      name: 'New event',
      status: 'todo',
      assignees: [],
      priority: 'medium',
    }
    onUpdate((prev) => ({ ...prev, events: [event, ...prev.events] }))
    setEditing(event)
  }

  const updateEvent = (id: string, patch: Partial<Event>) => {
    onUpdate((prev) => ({
      ...prev,
      events: prev.events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }))
    if (editing?.id === id) setEditing((e) => (e ? { ...e, ...patch } : null))
  }

  const deleteEvents = (ids: string[]) => {
    onUpdate((prev) => ({
      ...prev,
      events: prev.events.filter((e) => !ids.includes(e.id)),
    }))
    setSelected(new Set())
  }

  const addTeamMember = (name: string) => {
    onUpdate((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(name)
        ? prev.teamMembers
        : [...prev.teamMembers, name],
    }))
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Events</h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-gray-200 p-0.5">
            <button
              type="button"
              onClick={() => setView('table')}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                view === 'table' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Table
            </button>
            <button
              type="button"
              onClick={() => setView('calendar')}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                view === 'calendar' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Calendar
            </button>
          </div>
          <button
            type="button"
            onClick={addEvent}
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            <Plus className="h-4 w-4" />
            Add event
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        {selected.size > 0 && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2">
            <span className="text-sm text-gray-600">{selected.size} selected</span>
            <button
              type="button"
              onClick={() => deleteEvents([...selected])}
              className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        )}

        {view === 'calendar' ? (
          <CalendarView
            items={data.events.map((e) => ({
              id: e.id,
              title: e.name,
              date: e.date,
            }))}
            onSelectItem={(id) => setEditing(data.events.find((e) => e.id === id) ?? null)}
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-medium uppercase tracking-wide text-gray-500">
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={data.events.length > 0 && selected.size === data.events.length}
                      onChange={(e) =>
                        setSelected(
                          e.target.checked ? new Set(data.events.map((x) => x.id)) : new Set()
                        )
                      }
                    />
                  </th>
                  <th className="px-4 py-3">Event name</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Assignee</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.events.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                      No events yet. Click &quot;Add event&quot; to get started.
                    </td>
                  </tr>
                )}
                {data.events.map((event, i) => (
                  <tr
                    key={event.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(event.id)}
                        onChange={(e) => {
                          const next = new Set(selected)
                          if (e.target.checked) next.add(event.id)
                          else next.delete(event.id)
                          setSelected(next)
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setEditing(event)}
                        className="flex items-center gap-2 text-left font-medium text-gray-900 hover:text-teal-700"
                      >
                        <span className="text-gray-400">{i + 1}</span>
                        <input
                          type="text"
                          value={event.name}
                          onChange={(e) => updateEvent(event.id, { name: e.target.value })}
                          onClick={(e) => e.stopPropagation()}
                          className="min-w-0 flex-1 border-0 bg-transparent outline-none focus:ring-0"
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <PillSelect
                        value={event.status}
                        options={STATUS_OPTIONS}
                        styles={STATUS_STYLES}
                        onChange={(v) => updateEvent(event.id, { status: v as Event['status'] })}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <AssigneeInput
                        assignees={event.assignees}
                        teamMembers={data.teamMembers}
                        onChange={(assignees) => updateEvent(event.id, { assignees })}
                        onAddTeamMember={addTeamMember}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <PillSelect
                        value={event.priority}
                        options={PRIORITY_OPTIONS}
                        styles={PRIORITY_STYLES}
                        onChange={(v) =>
                          updateEvent(event.id, { priority: v as Event['priority'] })
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="date"
                        value={event.date ?? ''}
                        onChange={(e) => updateEvent(event.id, { date: e.target.value || undefined })}
                        className="rounded border border-gray-200 px-2 py-1 text-xs"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        title="Event details"
        open={!!editing}
        onClose={() => setEditing(null)}
      >
        {editing && (
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-medium text-gray-500">Name</span>
              <input
                type="text"
                value={editing.name}
                onChange={(e) => updateEvent(editing.id, { name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-500">Location</span>
              <input
                type="text"
                value={editing.location ?? ''}
                onChange={(e) => updateEvent(editing.id, { location: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-500">Notes</span>
              <textarea
                value={editing.notes ?? ''}
                onChange={(e) => updateEvent(editing.id, { notes: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              />
            </label>
          </div>
        )}
      </Modal>
    </div>
  )
}
