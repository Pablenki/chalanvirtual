// Modelo de dominio de la app de tareas (Agile Training)

/** Estados posibles de una tarea en el tablero Kanban. */
export type Status = 'todo' | 'in-progress' | 'done'

/** Nivel de prioridad de una tarea. */
export type Priority = 'low' | 'medium' | 'high'

/** Subtarea: un ítem simple con texto y estado de completado. */
export interface Subtask {
  id: string
  title: string
  done: boolean
}

/** Tarea principal del tablero. */
export interface Task {
  id: string
  title: string
  description: string
  status: Status
  priority: Priority
  /** Fecha y hora límite en formato ISO (datetime-local). Vacío si no aplica. */
  dueDate: string | null
  subtasks: Subtask[]
  createdAt: number
  updatedAt: number
  /** Marca interna para no notificar dos veces por el mismo vencimiento. */
  notified?: boolean
}

/** Criterios de ordenamiento disponibles. */
export type SortBy = 'created' | 'due' | 'priority' | 'title'

/** Definición de cada columna del tablero. */
export interface ColumnDef {
  id: Status
  title: string
}

export const COLUMNS: ColumnDef[] = [
  { id: 'todo', title: 'Por Hacer' },
  { id: 'in-progress', title: 'En Progreso' },
  { id: 'done', title: 'Terminado' },
]

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
}

/** Pesos para ordenar por prioridad (mayor = más urgente). */
export const PRIORITY_WEIGHT: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
}
