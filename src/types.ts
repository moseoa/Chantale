export type Status = 'todo' | 'in_progress' | 'done' | 'scheduled' | 'published'
export type Priority = 'low' | 'medium' | 'high' | 'urgent' | 'very_urgent'
export type Platform = 'instagram' | 'facebook' | 'twitter' | 'tiktok' | 'linkedin' | 'other'

export interface Event {
  id: string
  name: string
  status: Status
  assignees: string[]
  priority: Priority
  date?: string
  location?: string
  notes?: string
}

export interface SocialPost {
  id: string
  title: string
  platform: Platform
  status: Status
  assignees: string[]
  priority: Priority
  scheduledDate?: string
  caption?: string
  link?: string
}

export interface WorkspaceData {
  events: Event[]
  socialPosts: SocialPost[]
  teamMembers: string[]
}

export type ViewMode = 'table' | 'calendar'
export type Page = 'events' | 'social' | 'share'
