import { useCallback, useEffect, useState } from 'react'
import type { WorkspaceData } from '../types'
import {
  getWorkspaceId,
  loadWorkspace,
  saveWorkspace,
  subscribeWorkspace,
} from '../store'

export function useWorkspace() {
  const [workspaceId, setWorkspaceId] = useState(getWorkspaceId)
  const [data, setData] = useState<WorkspaceData>(() => loadWorkspace(getWorkspaceId()))

  useEffect(() => {
    const id = getWorkspaceId()
    setWorkspaceId(id)
    setData(loadWorkspace(id))
    return subscribeWorkspace(id, setData)
  }, [])

  const persist = useCallback(
    (next: WorkspaceData | ((prev: WorkspaceData) => WorkspaceData)) => {
      setData((prev) => {
        const updated = typeof next === 'function' ? next(prev) : next
        saveWorkspace(workspaceId, updated)
        return updated
      })
    },
    [workspaceId]
  )

  const switchWorkspace = useCallback((id: string) => {
    const url = new URL(window.location.href)
    url.searchParams.set('workspace', id)
    window.location.href = url.toString()
  }, [])

  return { workspaceId, data, persist, switchWorkspace }
}
