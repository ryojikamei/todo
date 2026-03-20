import { useState, useEffect, useCallback } from 'react'
import type { Todo, Priority, Filter } from './types'

const STORAGE_KEY = 'todo-app-data'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function loadTodos(): Todo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  const addTodo = useCallback((
    title: string,
    description: string,
    priority: Priority,
    category: string,
    dueDate: string | null
  ) => {
    const todo: Todo = {
      id: generateId(),
      title,
      description,
      completed: false,
      priority,
      category: category || '未分類',
      dueDate,
      createdAt: Date.now(),
    }
    setTodos(prev => [todo, ...prev])
  }, [])

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    )
  }, [])

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }, [])

  const updateTodo = useCallback((id: string, updates: Partial<Todo>) => {
    setTodos(prev =>
      prev.map(t => t.id === id ? { ...t, ...updates } : t)
    )
  }, [])

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(t => !t.completed))
  }, [])

  const categories = ['all', ...Array.from(new Set(todos.map(t => t.category)))]

  const filtered = todos.filter(todo => {
    if (filter === 'active' && todo.completed) return false
    if (filter === 'completed' && !todo.completed) return false
    if (categoryFilter !== 'all' && todo.category !== categoryFilter) return false
    if (search && !todo.title.toLowerCase().includes(search.toLowerCase()) &&
        !todo.description.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const activeCount = todos.filter(t => !t.completed).length
  const completedCount = todos.filter(t => t.completed).length

  return {
    todos: filtered,
    allTodos: todos,
    filter,
    setFilter,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    categories,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    activeCount,
    completedCount,
  }
}
