import { useCallback, useMemo, useState } from 'react'
import type { Status, Task } from './types'
import { COLUMNS } from './types'
import { useTasks } from './hooks/useTasks'
import { useNotifications } from './hooks/useNotifications'
import { DEFAULT_FILTERS, filterAndSort, type FilterState } from './lib/filters'
import { Toolbar } from './components/Toolbar'
import { Column } from './components/Column'
import { TaskModal } from './components/TaskModal'

export default function App() {
  const {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
  } = useTasks()

  const markNotified = useCallback(
    (id: string) => updateTask(id, { notified: true }),
    [updateTask],
  )
  const { permission, requestPermission } = useNotifications(tasks, markNotified)

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [defaultStatus, setDefaultStatus] = useState<Status>('todo')
  const [dragId, setDragId] = useState<string | null>(null)

  // Tareas filtradas y ordenadas, agrupadas por columna.
  const visibleTasks = useMemo(
    () => filterAndSort(tasks, filters),
    [tasks, filters],
  )

  const tasksByStatus = useMemo(() => {
    const map: Record<Status, Task[]> = {
      todo: [],
      'in-progress': [],
      done: [],
    }
    for (const t of visibleTasks) map[t.status].push(t)
    return map
  }, [visibleTasks])

  const openNew = (status: Status = 'todo') => {
    setEditing(null)
    setDefaultStatus(status)
    setModalOpen(true)
  }

  const openEdit = (task: Task) => {
    setEditing(task)
    setModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar esta tarea?')) deleteTask(id)
  }

  const handleDrop = (status: Status) => {
    if (dragId) {
      moveTask(dragId, status)
      setDragId(null)
    }
  }

  const total = tasks.length
  const done = tasks.filter((t) => t.status === 'done').length

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="logo">📋</span>
          <div>
            <h1>Mis Tareas</h1>
            <p className="subtitle">
              {total} tareas · {done} terminadas
            </p>
          </div>
        </div>
      </header>

      <Toolbar
        filters={filters}
        onChange={setFilters}
        onNewTask={() => openNew('todo')}
        notificationsEnabled={permission === 'granted'}
        onEnableNotifications={requestPermission}
      />

      <main className="board">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            column={col}
            tasks={tasksByStatus[col.id]}
            onEdit={openEdit}
            onDelete={handleDelete}
            onMove={moveTask}
            onAdd={openNew}
            onAddSubtask={addSubtask}
            onToggleSubtask={toggleSubtask}
            onDeleteSubtask={deleteSubtask}
            onDragStart={setDragId}
            onDropTask={handleDrop}
          />
        ))}
      </main>

      {modalOpen && (
        <TaskModal
          task={editing}
          defaultStatus={defaultStatus}
          onClose={() => setModalOpen(false)}
          onCreate={createTask}
          onUpdate={updateTask}
        />
      )}
    </div>
  )
}
