import type { Priority, Status, Platform } from './types'

export const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: 'todo', label: 'To do' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'done', label: 'Done' },
  { value: 'published', label: 'Published' },
]

export const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'very_urgent', label: 'Very urgent' },
]

export const PLATFORM_OPTIONS: { value: Platform; label: string }[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'X / Twitter' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'other', label: 'Other' },
]

export const STATUS_STYLES: Record<Status, string> = {
  todo: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-sky-100 text-sky-700',
  scheduled: 'bg-violet-100 text-violet-700',
  done: 'bg-emerald-100 text-emerald-700',
  published: 'bg-teal-100 text-teal-700',
}

export const PRIORITY_STYLES: Record<Priority, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-rose-100 text-rose-700',
  very_urgent: 'bg-purple-100 text-purple-700',
}

export const PLATFORM_STYLES: Record<Platform, string> = {
  instagram: 'bg-pink-100 text-pink-700',
  facebook: 'bg-blue-100 text-blue-700',
  twitter: 'bg-sky-100 text-sky-700',
  tiktok: 'bg-gray-900 text-white',
  linkedin: 'bg-blue-100 text-blue-800',
  other: 'bg-gray-100 text-gray-600',
}
