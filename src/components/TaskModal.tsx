import { useEffect, useState } from 'react'
import type { Priority, Status, Task } from '../types'
import { PRIORITY_LABELS, COLUMNS } from '../types'
import type { NewTaskInput } from '../hooks/useTasks'

interface Props {
  /** Tarea a editar, o null para crear una nueva. */
  task: Task | null
  /** Estado/columna por defecto al crear. */
  defaultStatus?: Status
  onClose: () => void
  onCreate: (input: NewTaskInput) => void
  onUpdate: (id: string, patch: Partial<Task>) => void
}

/**
 * Modal para crear y editar tareas.
 * User stories "Must": crear (título + descripción), editar, estado y fecha/hora.
 */
export function TaskModal({
  task,
  defaultStatus = 'todo',
  onClose,
  onCreate,
  onUpdate,
}: Props) {
  const isEditing = task !== null

  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [priority, setPriority] = useState<Priority>(task?.priority ?? 'medium')
  const [status, setStatus] = useState<Status>(task?.status ?? defaultStatus)
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '')
  const [error, setError] = useState('')

  // Cerrar con la tecla Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('El título es obligatorio.')
      return
    }
    if (isEditing && task) {
      onUpdate(task.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        dueDate: dueDate || null,
      })
    } else {
      onCreate({
        title,
        description,
        priority,
        status,
        dueDate: dueDate || null,
      })
    }
    onClose()
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h2>{isEditing ? 'Editar tarea' : 'Nueva tarea'}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </header>

        <form onSubmit={handleSubmit} className="modal-form">
          <label className="field">
            <span>Título *</span>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setError('')
              }}
              placeholder="¿Qué hay que hacer?"
              autoFocus
            />
          </label>

          <label className="field">
            <span>Descripción</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles de la tarea..."
              rows={4}
            />
          </label>

          <div className="field-row">
            <label className="field">
              <span>Prioridad</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                {(Object.keys(PRIORITY_LABELS) as Priority[]).map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY_LABELS[p]}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Estado</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
              >
                {COLUMNS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="field">
            <span>Fecha y hora límite</span>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </label>

          {error && <p className="error">{error}</p>}

          <footer className="modal-actions">
            <button type="button" className="btn ghost" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn primary">
              {isEditing ? 'Guardar cambios' : 'Crear tarea'}
            </button>
          </footer>
        </form>
      </div>
    </div>
  )
}
