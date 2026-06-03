import type { WorkspaceData } from './types'

export function removeTeamMember(data: WorkspaceData, name: string): WorkspaceData {
  return {
    teamMembers: data.teamMembers.filter((m) => m !== name),
    events: data.events.map((e) => ({
      ...e,
      assignees: e.assignees.filter((a) => a !== name),
    })),
    socialPosts: data.socialPosts.map((p) => ({
      ...p,
      assignees: p.assignees.filter((a) => a !== name),
    })),
  }
}

export function addTeamMember(data: WorkspaceData, name: string): WorkspaceData {
  const trimmed = name.trim()
  if (!trimmed || data.teamMembers.includes(trimmed)) return data
  return { ...data, teamMembers: [...data.teamMembers, trimmed] }
}
