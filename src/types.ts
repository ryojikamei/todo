export type Priority = 'high' | 'medium' | 'low'
export type Filter = 'all' | 'active' | 'completed'

export interface Todo {
  id: string
  title: string
  description: string
  completed: boolean
  priority: Priority
  category: string
  dueDate: string | null
  createdAt: number
}
