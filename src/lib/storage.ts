import type { Task } from '../types'

const STORAGE_KEY = 'agile-training-tasks'

/** Carga las tareas persistidas en localStorage. */
export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Task[]
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

/** Guarda las tareas en localStorage. */
export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // Almacenamiento lleno o no disponible: se ignora silenciosamente.
  }
}

/** Genera un id único razonablemente seguro para el navegador. */
export function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}
