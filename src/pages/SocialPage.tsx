import { useState } from 'react'
const newId = () => crypto.randomUUID()
import { Plus, Trash2, ExternalLink } from 'lucide-react'
import type { SocialPost, ViewMode, WorkspaceData } from '../types'
import {
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  PLATFORM_OPTIONS,
  STATUS_STYLES,
  PRIORITY_STYLES,
  PLATFORM_STYLES,
} from '../constants'
import { PillSelect } from '../components/PillSelect'
import { AssigneeInput } from '../components/AssigneeInput'
import { CalendarView } from '../components/CalendarView'
import { Modal } from '../components/Modal'
import { addTeamMember, removeTeamMember } from '../team'

interface SocialPageProps {
  data: WorkspaceData
  onUpdate: (fn: (prev: WorkspaceData) => WorkspaceData) => void
}

export function SocialPage({ data, onUpdate }: SocialPageProps) {
  const [view, setView] = useState<ViewMode>('table')
  const [editing, setEditing] = useState<SocialPost | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const addPost = () => {
    const post: SocialPost = {
      id: newId(),
      title: 'New post',
      platform: 'instagram',
      status: 'todo',
      assignees: [],
      priority: 'medium',
    }
    onUpdate((prev) => ({ ...prev, socialPosts: [post, ...prev.socialPosts] }))
    setEditing(post)
  }

  const updatePost = (id: string, patch: Partial<SocialPost>) => {
    onUpdate((prev) => ({
      ...prev,
      socialPosts: prev.socialPosts.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }))
    if (editing?.id === id) setEditing((p) => (p ? { ...p, ...patch } : null))
  }

  const deletePosts = (ids: string[]) => {
    onUpdate((prev) => ({
      ...prev,
      socialPosts: prev.socialPosts.filter((p) => !ids.includes(p.id)),
    }))
    setSelected(new Set())
  }

  const handleAddTeamMember = (name: string) => {
    onUpdate((prev) => addTeamMember(prev, name))
  }

  const handleRemoveTeamMember = (name: string) => {
    const usedIn =
      data.events.some((e) => e.assignees.includes(name)) ||
      data.socialPosts.some((p) => p.assignees.includes(name))
    const msg = usedIn
      ? `Remove "${name}" from the team list and from all assignees?`
      : `Remove "${name}" from the team list?`
    if (!confirm(msg)) return
    onUpdate((prev) => removeTeamMember(prev, name))
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Social media</h1>
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
            onClick={addPost}
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            <Plus className="h-4 w-4" />
            Add post
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        {selected.size > 0 && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-2">
            <span className="text-sm text-gray-600">{selected.size} selected</span>
            <button
              type="button"
              onClick={() => deletePosts([...selected])}
              className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        )}

        {view === 'calendar' ? (
          <CalendarView
            items={data.socialPosts.map((p) => ({
              id: p.id,
              title: p.title,
              date: p.scheduledDate,
            }))}
            onSelectItem={(id) =>
              setEditing(data.socialPosts.find((p) => p.id === id) ?? null)
            }
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80 text-xs font-medium uppercase tracking-wide text-gray-500">
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={
                        data.socialPosts.length > 0 &&
                        selected.size === data.socialPosts.length
                      }
                      onChange={(e) =>
                        setSelected(
                          e.target.checked
                            ? new Set(data.socialPosts.map((x) => x.id))
                            : new Set()
                        )
                      }
                    />
                  </th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Platform</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Assignee</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Scheduled</th>
                </tr>
              </thead>
              <tbody>
                {data.socialPosts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                      No posts yet. Click &quot;Add post&quot; to plan content.
                    </td>
                  </tr>
                )}
                {data.socialPosts.map((post, i) => (
                  <tr
                    key={post.id}
                    className="border-b border-gray-50 hover:bg-gray-50/50"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(post.id)}
                        onChange={(e) => {
                          const next = new Set(selected)
                          if (e.target.checked) next.add(post.id)
                          else next.delete(post.id)
                          setSelected(next)
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setEditing(post)}
                        className="flex items-center gap-2 text-left font-medium text-gray-900"
                      >
                        <span className="text-gray-400">{i + 1}</span>
                        <input
                          type="text"
                          value={post.title}
                          onChange={(e) => updatePost(post.id, { title: e.target.value })}
                          onClick={(e) => e.stopPropagation()}
                          className="min-w-0 flex-1 border-0 bg-transparent outline-none"
                        />
                        {post.link && (
                          <a
                            href={post.link}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-teal-600"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <PillSelect
                        value={post.platform}
                        options={PLATFORM_OPTIONS}
                        styles={PLATFORM_STYLES}
                        onChange={(v) =>
                          updatePost(post.id, { platform: v as SocialPost['platform'] })
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <PillSelect
                        value={post.status}
                        options={STATUS_OPTIONS}
                        styles={STATUS_STYLES}
                        onChange={(v) =>
                          updatePost(post.id, { status: v as SocialPost['status'] })
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <AssigneeInput
                        assignees={post.assignees}
                        teamMembers={data.teamMembers}
                        onChange={(assignees) => updatePost(post.id, { assignees })}
                        onAddTeamMember={handleAddTeamMember}
                        onRemoveTeamMember={handleRemoveTeamMember}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <PillSelect
                        value={post.priority}
                        options={PRIORITY_OPTIONS}
                        styles={PRIORITY_STYLES}
                        onChange={(v) =>
                          updatePost(post.id, { priority: v as SocialPost['priority'] })
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="date"
                        value={post.scheduledDate ?? ''}
                        onChange={(e) =>
                          updatePost(post.id, {
                            scheduledDate: e.target.value || undefined,
                          })
                        }
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

      <Modal title="Post details" open={!!editing} onClose={() => setEditing(null)}>
        {editing && (
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-medium text-gray-500">Title</span>
              <input
                type="text"
                value={editing.title}
                onChange={(e) => updatePost(editing.id, { title: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-500">Caption / copy</span>
              <textarea
                value={editing.caption ?? ''}
                onChange={(e) => updatePost(editing.id, { caption: e.target.value })}
                rows={4}
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-gray-500">Link (draft or live URL)</span>
              <input
                type="url"
                value={editing.link ?? ''}
                onChange={(e) => updatePost(editing.id, { link: e.target.value })}
                placeholder="https://"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              />
            </label>
          </div>
        )}
      </Modal>
    </div>
  )
}
