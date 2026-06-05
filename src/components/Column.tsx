import type { ColumnDef, Status, Task } from '../types'
import { TaskCard } from './TaskCard'

interface Props {
  column: ColumnDef
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onMove: (id: string, status: Status) => void
  onAdd: (status: Status) => void
  onAddSubtask: (taskId: string, title: string) => void
  onToggleSubtask: (taskId: string, subId: string) => void
  onDeleteSubtask: (taskId: string, subId: string) => void
  onDragStart: (id: string) => void
  onDropTask: (status: Status) => void
}

/** Columna del tablero Kanban. Acepta drag & drop de tarjetas. */
export function Column({
  column,
  tasks,
  onEdit,
  onDelete,
  onMove,
  onAdd,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
  onDragStart,
  onDropTask,
}: Props) {
  return (
    <section
      className="column"
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDropTask(column.id)}
    >
      <header className="column-header">
        <h2>{column.title}</h2>
        <span className="count">{tasks.length}</span>
      </header>

      <div className="column-body">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onMove={onMove}
            onAddSubtask={onAddSubtask}
            onToggleSubtask={onToggleSubtask}
            onDeleteSubtask={onDeleteSubtask}
            onDragStart={onDragStart}
          />
        ))}
        {tasks.length === 0 && (
          <p className="empty-col">Sin tareas</p>
        )}
      </div>

      <button className="add-card-btn" onClick={() => onAdd(column.id)}>
        + Añade una tarjeta
      </button>
    </section>
  )
}
