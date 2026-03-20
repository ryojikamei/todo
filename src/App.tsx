import { useState, useEffect } from 'react'
import { useTodos } from './useTodos'
import { TodoForm } from './components/TodoForm'
import { TodoItem } from './components/TodoItem'
import { FilterBar } from './components/FilterBar'
import type { Todo } from './types'

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'
  })
  const [showForm, setShowForm] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)

  const {
    todos,
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
  } = useTodos()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
    localStorage.setItem('darkMode', String(darkMode))
  }, [darkMode])

  function handleEdit(todo: Todo) {
    setEditingTodo(todo)
    setShowForm(true)
  }

  function handleFormClose() {
    setShowForm(false)
    setEditingTodo(null)
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <span className="logo">✓</span>
            <h1 className="title">TODO</h1>
          </div>
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(d => !d)}
            title={darkMode ? 'ライトモード' : 'ダークモード'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="main">
        <div className="stats">
          <div className="stat-card stat-active">
            <span className="stat-num">{activeCount}</span>
            <span className="stat-label">残り</span>
          </div>
          <div className="stat-card stat-completed">
            <span className="stat-num">{completedCount}</span>
            <span className="stat-label">完了</span>
          </div>
          <div className="stat-card stat-total">
            <span className="stat-num">{activeCount + completedCount}</span>
            <span className="stat-label">合計</span>
          </div>
        </div>

        <FilterBar
          filter={filter}
          setFilter={setFilter}
          search={search}
          setSearch={setSearch}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categories={categories}
        />

        <div className="todo-list">
          {todos.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📝</span>
              <p>タスクはありません</p>
              <p className="empty-sub">下の＋ボタンでタスクを追加しましょう</p>
            </div>
          ) : (
            todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={handleEdit}
              />
            ))
          )}
        </div>

        {completedCount > 0 && (
          <button className="clear-btn" onClick={clearCompleted}>
            完了済みを削除 ({completedCount})
          </button>
        )}
      </main>

      <button
        className="fab"
        onClick={() => { setEditingTodo(null); setShowForm(true) }}
        title="タスクを追加"
      >
        +
      </button>

      {showForm && (
        <TodoForm
          todo={editingTodo}
          onSubmit={(title, description, priority, category, dueDate) => {
            if (editingTodo) {
              updateTodo(editingTodo.id, { title, description, priority, category, dueDate })
            } else {
              addTodo(title, description, priority, category, dueDate)
            }
            handleFormClose()
          }}
          onClose={handleFormClose}
        />
      )}
    </div>
  )
}
