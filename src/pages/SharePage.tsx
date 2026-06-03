import { useState } from 'react'
import { Copy, Check, Download, Upload, Users } from 'lucide-react'
import type { WorkspaceData } from '../types'
import {
  getShareUrl,
  exportJson,
  importJson,
  generateWorkspaceId,
  saveWorkspace,
} from '../store'
import { TeamMembersPanel } from '../components/TeamMembersPanel'

interface SharePageProps {
  workspaceId: string
  data: WorkspaceData
  onImport: (data: WorkspaceData) => void
  onUpdate: (data: WorkspaceData) => void
  onSwitchWorkspace: (id: string) => void
}

export function SharePage({
  workspaceId,
  data,
  onImport,
  onUpdate,
  onSwitchWorkspace,
}: SharePageProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = getShareUrl(workspaceId)

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExport = () => {
    const blob = new Blob([exportJson(data)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chantale-backup-${workspaceId}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,application/json'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      try {
        const text = await file.text()
        const imported = importJson(text)
        onImport(imported)
        saveWorkspace(workspaceId, imported)
        alert('Backup imported successfully.')
      } catch {
        alert('Could not read that file. Make sure it is a Chantale backup JSON.')
      }
    }
    input.click()
  }

  const createTeamWorkspace = () => {
    const id = generateWorkspaceId()
    if (confirm(`Create new team workspace "${id}"? Your current data stays in "${workspaceId}".`)) {
      onSwitchWorkspace(id)
    }
  }

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Share & sync</h1>
        <p className="mt-1 text-sm text-gray-500">
          Share one link with your team — no custom domain required.
        </p>
      </header>

      <div className="mx-auto w-full max-w-2xl space-y-6 p-6">
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="flex items-center gap-2 font-semibold text-gray-900">
            <Users className="h-5 w-5 text-teal-600" />
            Team link
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Everyone who opens this link joins workspace{' '}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">{workspaceId}</code>.
            Deploy to Netlify or GitHub Pages once, then share that URL.
          </p>
          <div className="mt-4 flex gap-2">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
            />
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </section>

        <TeamMembersPanel data={data} onUpdate={onUpdate} />

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="font-semibold text-gray-900">Backup & restore</h2>
          <p className="mt-2 text-sm text-gray-600">
            Export a JSON file and send it to teammates (Slack, email, Drive). They import it
            to load the same events and posts. Re-export after big updates.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Download className="h-4 w-4" />
              Export backup
            </button>
            <button
              type="button"
              onClick={handleImport}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Upload className="h-4 w-4" />
              Import backup
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-5">
          <h2 className="font-semibold text-gray-900">New team workspace</h2>
          <p className="mt-2 text-sm text-gray-600">
            Start a separate board (e.g. for a different campaign) with its own share link.
          </p>
          <button
            type="button"
            onClick={createTeamWorkspace}
            className="mt-4 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Create workspace
          </button>
        </section>

        <section className="rounded-xl bg-teal-50 p-5 text-sm text-teal-900">
          <strong>How to go live without a domain</strong>
          <ol className="mt-2 list-inside list-decimal space-y-1 text-teal-800">
            <li>Run <code className="rounded bg-white/60 px-1">npm run build</code></li>
            <li>Drag the <code className="rounded bg-white/60 px-1">dist</code> folder to{' '}
              <a
                href="https://app.netlify.com/drop"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Netlify Drop
              </a>{' '}
              (free <code>*.netlify.app</code> URL)
            </li>
            <li>Copy your team link from above and send it to everyone</li>
          </ol>
        </section>
      </div>
    </div>
  )
}
