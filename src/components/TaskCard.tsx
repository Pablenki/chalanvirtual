import { useState } from 'react'
import type { Status, Task } from '../types'
import { PRIORITY_LABELS, COLUMNS } from '../types'
import { formatDue, isOverdue } from '../lib/filters'

interface Props {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onMove: (id: string, status: Status) => void
  onAddSubtask: (taskId: string, title: string) => void
  onToggleSubtask: (taskId: string, subId: string) => void
  onDeleteSubtask: (taskId: string, subId: string) => void
  onDragStart: (id: string) => void
}

/**
 * Tarjeta de una tarea. Muestra prioridad con color (user story "Could":
 * colores de prioridad), fecha límite, y subtareas con progreso.
 */
export function TaskCard({
  task,
  onEdit,
  onDelete,
  onMove,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onDragStart,
}: Props) {
  const [expanded, setExpanded] = useState(false)
  const [newSub, setNewSub] = useState('')

  const overdue = isOverdue(task)
  const doneSubs = task.subtasks.filter((s) => s.done).length
  const totalSubs = task.subtasks.length

  const handleAddSub = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSub.trim()) return
    onAddSubtask(task.id, newSub)
    setNewSub('')
  }

  return (
    <article
      className={`card priority-${task.priority}`}
      draggable
      onDragStart={() => onDragStart(task.id)}
    >
      <div className="card-top">
        <span className={`badge priority-badge-${task.priority}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
        <div className="card-actions">
          <button
            className="icon-btn"
            title="Editar"
            onClick={() => onEdit(task)}
          >
            ✏️
          </button>
          <button
            className="icon-btn"
            title="Eliminar"
            onClick={() => onDelete(task.id)}
          >
            🗑️
          </button>
        </div>
      </div>

      <h3 className="card-title">{task.title}</h3>
      {task.description && <p className="card-desc">{task.description}</p>}

      {task.dueDate && (
        <div className={`due ${overdue ? 'overdue' : ''}`}>
          📅 {formatDue(task.dueDate)}
          {overdue && <span className="overdue-tag"> · vencida</span>}
        </div>
      )}

      {totalSubs > 0 && (
        <div className="subtask-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(doneSubs / totalSubs) * 100}%` }}
            />
          </div>
          <span className="progress-text">
            {doneSubs}/{totalSubs}
          </span>
        </div>
      )}

      <div className="card-footer">
        <select
          className="status-select"
          value={task.status}
          onChange={(e) => onMove(task.id, e.target.value as Status)}
          title="Cambiar estado"
        >
          {COLUMNS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <button
          className="link-btn"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'Ocultar' : 'Subtareas'}
        </button>
      </div>

      {expanded && (
        <div className="subtasks">
          <ul>
            {task.subtasks.map((s) => (
              <li key={s.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={s.done}
                    onChange={() => onToggleSubtask(task.id, s.id)}
                  />
                  <span className={s.done ? 'sub-done' : ''}>{s.title}</span>
                </label>
                <button
                  className="icon-btn small"
                  onClick={() => onDeleteSubtask(task.id, s.id)}
                  title="Eliminar subtarea"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={handleAddSub} className="add-subtask">
            <input
              type="text"
              value={newSub}
              onChange={(e) => setNewSub(e.target.value)}
              placeholder="Nueva subtarea..."
            />
            <button type="submit" className="btn small">
              +
            </button>
          </form>
        </div>
      )}
    </article>
  )
}
