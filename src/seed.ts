import type { WorkspaceData } from './types'

export const SAMPLE_DATA: WorkspaceData = {
  teamMembers: ['Alex', 'Jordan', 'Sam'],
  events: [
    {
      id: 'e1',
      name: 'Community town hall',
      status: 'in_progress',
      assignees: ['Alex', 'Jordan'],
      priority: 'high',
      date: '2026-06-15',
      location: 'City Hall',
    },
    {
      id: 'e2',
      name: 'Volunteer phone bank',
      status: 'todo',
      assignees: ['Sam'],
      priority: 'medium',
      date: '2026-06-20',
    },
    {
      id: 'e3',
      name: 'Neighborhood canvass',
      status: 'todo',
      assignees: [],
      priority: 'urgent',
      date: '2026-06-08',
    },
  ],
  socialPosts: [
    {
      id: 's1',
      title: 'Event recap carousel',
      platform: 'instagram',
      status: 'scheduled',
      assignees: ['Jordan'],
      priority: 'medium',
      scheduledDate: '2026-06-10',
      caption: 'Thank you to everyone who joined us!',
    },
    {
      id: 's2',
      title: 'Policy explainer thread',
      platform: 'twitter',
      status: 'in_progress',
      assignees: ['Alex'],
      priority: 'high',
      scheduledDate: '2026-06-07',
    },
    {
      id: 's3',
      title: 'Fundraising live stream promo',
      platform: 'facebook',
      status: 'todo',
      assignees: ['Sam'],
      priority: 'very_urgent',
      scheduledDate: '2026-06-12',
    },
  ],
}

export function seedIfEmpty(_workspaceId: string, data: WorkspaceData): WorkspaceData {
  if (data.events.length === 0 && data.socialPosts.length === 0) {
    const seeded = { ...SAMPLE_DATA }
    return seeded
  }
  return data
}
