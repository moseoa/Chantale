import {
  Calendar,
  Share2,
  LayoutGrid,
  Link2,
  Flag,
} from 'lucide-react'
import type { Page } from '../types'

interface SidebarProps {
  page: Page
  onNavigate: (page: Page) => void
}

const navItems: { id: Page; label: string; icon: typeof Calendar }[] = [
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'social', label: 'Social media', icon: Share2 },
  { id: 'holidays', label: 'Canadian holidays', icon: Flag },
  { id: 'share', label: 'Share & sync', icon: Link2 },
]

export function Sidebar({ page, onNavigate }: SidebarProps) {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600 text-sm font-bold text-white">
          C
        </div>
        <span className="text-lg font-semibold text-gray-900">Chantale</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          Outreach
        </p>
        <ul className="space-y-0.5">
          {navItems.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => onNavigate(id)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  page === id
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-70" />
                {label}
              </button>
            </li>
          ))}
        </ul>

        <p className="mb-2 mt-6 px-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
          Overview
        </p>
        <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-400">
          <LayoutGrid className="h-4 w-4" />
          Dashboard
        </div>
      </nav>

      <div className="border-t border-gray-100 p-4 text-xs text-gray-500">
        No domain needed — share your link with the team.
      </div>
    </aside>
  )
}
