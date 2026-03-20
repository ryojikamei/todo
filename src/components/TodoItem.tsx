import { useState } from 'react'
import type { Todo } from '../types'

interface Props {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (todo: Todo) => void
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.floor((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diff < 0) return `${Math.abs(diff)}日超過`
  if (diff === 0) return '今日'
  if (diff === 1) return '明日'
  return `${diff}日後`
}

function isOverdue(dateStr: string): boolean {
  const date = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date < today
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  const [showConfirm, setShowConfirm] = useState(false)
  const overdue = todo.dueDate && !todo.completed && isOverdue(todo.dueDate)

  return (
    <div className={`todo-item priority-border-${todo.priority} ${todo.completed ? 'completed' : ''} ${overdue ? 'overdue' : ''}`}>
      <button
        className={`checkbox ${todo.completed ? 'checked' : ''}`}
        onClick={() => onToggle(todo.id)}
        title={todo.completed ? '未完了に戻す' : '完了にする'}
      >
        {todo.completed && <span className="checkmark">✓</span>}
      </button>

      <div className="todo-content">
        <div className="todo-title-row">
          <span className="todo-title">{todo.title}</span>
          <span className={`priority-badge priority-${todo.priority}`}>
            {todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}
          </span>
        </div>

        {todo.description && (
          <p className="todo-description">{todo.description}</p>
        )}

        <div className="todo-meta">
          <span className="category-tag">📁 {todo.category}</span>
          {todo.dueDate && (
            <span className={`due-date ${overdue ? 'due-overdue' : ''}`}>
              📅 {formatDate(todo.dueDate)}
            </span>
          )}
        </div>
      </div>

      <div className="todo-actions">
        <button
          className="action-btn edit-btn"
          onClick={() => onEdit(todo)}
          title="編集"
        >
          ✏️
        </button>
        {showConfirm ? (
          <div className="confirm-delete">
            <button className="action-btn confirm-yes" onClick={() => onDelete(todo.id)}>✓</button>
            <button className="action-btn confirm-no" onClick={() => setShowConfirm(false)}>✕</button>
          </div>
        ) : (
          <button
            className="action-btn delete-btn"
            onClick={() => setShowConfirm(true)}
            title="削除"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  )
}
