import { useEffect, useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { EventsPage } from './pages/EventsPage'
import { SocialPage } from './pages/SocialPage'
import { SharePage } from './pages/SharePage'
import { useWorkspace } from './hooks/useWorkspace'
import { seedIfEmpty } from './seed'
import { loadWorkspace, saveWorkspace } from './store'
import type { Page } from './types'

function App() {
  const { workspaceId, data, persist, switchWorkspace } = useWorkspace()
  const [page, setPage] = useState<Page>('events')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const loaded = loadWorkspace(workspaceId)
    const seeded = seedIfEmpty(workspaceId, loaded)
    if (seeded !== loaded) saveWorkspace(workspaceId, seeded)
    persist(seeded)
    setReady(true)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- run once on mount

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500">
        Loading…
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar page={page} onNavigate={setPage} />
      <main className="flex min-w-0 flex-1 flex-col">
        {page === 'events' && <EventsPage data={data} onUpdate={persist} />}
        {page === 'social' && <SocialPage data={data} onUpdate={persist} />}
        {page === 'share' && (
          <SharePage
            workspaceId={workspaceId}
            data={data}
            onImport={(d) => persist(d)}
            onSwitchWorkspace={switchWorkspace}
          />
        )}
      </main>
    </div>
  )
}

export default App
