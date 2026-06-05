import type { Priority, SortBy, Task } from '../types'
import { PRIORITY_WEIGHT } from '../types'

export interface FilterState {
  search: string
  priority: Priority | 'all'
  sortBy: SortBy
}

export const DEFAULT_FILTERS: FilterState = {
  search: '',
  priority: 'all',
  sortBy: 'created',
}

/**
 * Aplica filtros (búsqueda + prioridad) y ordenamiento.
 * Cubre los user stories "Should": Filtros y Ordenar.
 */
export function filterAndSort(tasks: Task[], filters: FilterState): Task[] {
  const term = filters.search.trim().toLowerCase()

  const filtered = tasks.filter((t) => {
    if (filters.priority !== 'all' && t.priority !== filters.priority) {
      return false
    }
    if (term) {
      const haystack = `${t.title} ${t.description}`.toLowerCase()
      if (!haystack.includes(term)) return false
    }
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    switch (filters.sortBy) {
      case 'due': {
        // Las tareas sin fecha van al final.
        const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity
        const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity
        return da - db
      }
      case 'priority':
        return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority]
      case 'title':
        return a.title.localeCompare(b.title)
      case 'created':
      default:
        return b.createdAt - a.createdAt
    }
  })

  return sorted
}

/** Devuelve true si la tarea está vencida y aún no terminada. */
export function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === 'done') return false
  return new Date(task.dueDate).getTime() < Date.now()
}

/** Formatea una fecha ISO a algo legible en español. */
export function formatDue(dueDate: string | null): string {
  if (!dueDate) return ''
  const d = new Date(dueDate)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('es', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
