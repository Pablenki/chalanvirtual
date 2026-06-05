import type { Priority, SortBy } from '../types'
import { PRIORITY_LABELS } from '../types'
import type { FilterState } from '../lib/filters'

interface Props {
  filters: FilterState
  onChange: (filters: FilterState) => void
  onNewTask: () => void
  notificationsEnabled: boolean
  onEnableNotifications: () => void
}

/**
 * Barra de herramientas: búsqueda, filtro por prioridad, ordenamiento,
 * crear tarea y activar notificaciones.
 * User stories "Should": Filtros, Ordenar, Notificaciones.
 */
export function Toolbar({
  filters,
  onChange,
  onNewTask,
  notificationsEnabled,
  onEnableNotifications,
}: Props) {
  return (
    <div className="toolbar">
      <input
        className="search"
        type="search"
        placeholder="🔍 Buscar tareas..."
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
      />

      <label className="toolbar-field">
        <span>Prioridad</span>
        <select
          value={filters.priority}
          onChange={(e) =>
            onChange({
              ...filters,
              priority: e.target.value as Priority | 'all',
            })
          }
        >
          <option value="all">Todas</option>
          {(Object.keys(PRIORITY_LABELS) as Priority[]).map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABELS[p]}
            </option>
          ))}
        </select>
      </label>

      <label className="toolbar-field">
        <span>Ordenar</span>
        <select
          value={filters.sortBy}
          onChange={(e) =>
            onChange({ ...filters, sortBy: e.target.value as SortBy })
          }
        >
          <option value="created">Más recientes</option>
          <option value="due">Fecha límite</option>
          <option value="priority">Prioridad</option>
          <option value="title">Título (A-Z)</option>
        </select>
      </label>

      <div className="toolbar-spacer" />

      {!notificationsEnabled && (
        <button className="btn ghost" onClick={onEnableNotifications}>
          🔔 Activar notificaciones
        </button>
      )}

      <button className="btn primary" onClick={onNewTask}>
        + Nueva tarea
      </button>
    </div>
  )
}
