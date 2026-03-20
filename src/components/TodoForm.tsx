import { useState, useEffect, useRef } from 'react'
import type { Priority, Todo } from '../types'

interface Props {
  todo: Todo | null
  onSubmit: (title: string, description: string, priority: Priority, category: string, dueDate: string | null) => void
  onClose: () => void
}

export function TodoForm({ todo, onSubmit, onClose }: Props) {
  const [title, setTitle] = useState(todo?.title ?? '')
  const [description, setDescription] = useState(todo?.description ?? '')
  const [priority, setPriority] = useState<Priority>(todo?.priority ?? 'medium')
  const [category, setCategory] = useState(todo?.category ?? '')
  const [dueDate, setDueDate] = useState(todo?.dueDate ?? '')
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit(title.trim(), description.trim(), priority, category.trim(), dueDate || null)
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>{todo ? 'タスクを編集' : 'タスクを追加'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>タイトル *</label>
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="タスクのタイトルを入力..."
              className="input"
              required
            />
          </div>

          <div className="form-group">
            <label>説明</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="詳細を入力（任意）..."
              className="textarea"
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>優先度</label>
              <div className="priority-selector">
                {(['high', 'medium', 'low'] as Priority[]).map(p => (
                  <button
                    key={p}
                    type="button"
                    className={`priority-btn priority-${p} ${priority === p ? 'active' : ''}`}
                    onClick={() => setPriority(p)}
                  >
                    {p === 'high' ? '🔴 高' : p === 'medium' ? '🟡 中' : '🟢 低'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>カテゴリ</label>
              <input
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="仕事、個人、買い物..."
                className="input"
              />
            </div>

            <div className="form-group">
              <label>期日</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="input"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className="btn btn-primary" disabled={!title.trim()}>
              {todo ? '更新' : '追加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
