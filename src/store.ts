import type { WorkspaceData } from './types'

const DEFAULT_WORKSPACE = 'default'

export function getWorkspaceId(): string {
  const params = new URLSearchParams(window.location.search)
  return params.get('workspace') || params.get('w') || DEFAULT_WORKSPACE
}

function storageKey(workspaceId: string): string {
  return `chantale:${workspaceId}`
}

export function loadWorkspace(workspaceId: string): WorkspaceData {
  try {
    const raw = localStorage.getItem(storageKey(workspaceId))
    if (raw) return JSON.parse(raw) as WorkspaceData
  } catch {
    /* ignore corrupt data */
  }
  return { events: [], socialPosts: [], teamMembers: [] }
}

export function saveWorkspace(workspaceId: string, data: WorkspaceData): void {
  localStorage.setItem(storageKey(workspaceId), JSON.stringify(data))
  broadcast(workspaceId, data)
}

let channel: BroadcastChannel | null = null

function getChannel(workspaceId: string): BroadcastChannel {
  if (!channel || channel.name !== `chantale-${workspaceId}`) {
    channel?.close()
    channel = new BroadcastChannel(`chantale-${workspaceId}`)
  }
  return channel
}

function broadcast(workspaceId: string, data: WorkspaceData): void {
  try {
    getChannel(workspaceId).postMessage({ type: 'sync', data })
  } catch {
    /* BroadcastChannel unavailable */
  }
}

export function subscribeWorkspace(
  workspaceId: string,
  onUpdate: (data: WorkspaceData) => void
): () => void {
  const ch = getChannel(workspaceId)
  const handler = (e: MessageEvent) => {
    if (e.data?.type === 'sync') onUpdate(e.data.data as WorkspaceData)
  }
  ch.addEventListener('message', handler)
  return () => ch.removeEventListener('message', handler)
}

export function getShareUrl(workspaceId: string): string {
  const url = new URL(window.location.href)
  url.searchParams.set('workspace', workspaceId)
  url.hash = ''
  return url.toString()
}

export function exportJson(data: WorkspaceData): string {
  return JSON.stringify(data, null, 2)
}

export function importJson(json: string): WorkspaceData {
  const parsed = JSON.parse(json) as WorkspaceData
  if (!Array.isArray(parsed.events) || !Array.isArray(parsed.socialPosts)) {
    throw new Error('Invalid backup file')
  }
  return {
    events: parsed.events,
    socialPosts: parsed.socialPosts,
    teamMembers: parsed.teamMembers ?? [],
  }
}

export function generateWorkspaceId(): string {
  return `team-${Math.random().toString(36).slice(2, 8)}`
}
