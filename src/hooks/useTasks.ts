import { useCallback, useEffect, useState } from 'react'
import type { Status, Task } from '../types'
import { loadTasks, saveTasks, uid } from '../lib/storage'

export interface NewTaskInput {
  title: string
  description: string
  priority: Task['priority']
  dueDate: string | null
  status?: Status
}

/**
 * Hook central de estado: maneja el CRUD de tareas y persiste en localStorage.
 * Cubre los user stories "Must": crear, editar, eliminar y cambiar de estado.
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks())

  // Persistir ante cualquier cambio.
  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const createTask = useCallback((input: NewTaskInput) => {
    const now = Date.now()
    const task: Task = {
      id: uid(),
      title: input.title.trim(),
      description: input.description.trim(),
      status: input.status ?? 'todo',
      priority: input.priority,
      dueDate: input.dueDate || null,
      subtasks: [],
      createdAt: now,
      updatedAt: now,
      notified: false,
    }
    setTasks((prev) => [task, ...prev])
    return task
  }, [])

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...patch, updatedAt: Date.now() } : t,
      ),
    )
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const moveTask = useCallback((id: string, status: Status) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status, updatedAt: Date.now() } : t,
      ),
    )
  }, [])

  // --- Subtareas (user story "Could") ---
  const addSubtask = useCallback((taskId: string, title: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: [
                ...t.subtasks,
                { id: uid(), title: title.trim(), done: false },
              ],
              updatedAt: Date.now(),
            }
          : t,
      ),
    )
  }, [])

  const toggleSubtask = useCallback((taskId: string, subId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.map((s) =>
                s.id === subId ? { ...s, done: !s.done } : s,
              ),
              updatedAt: Date.now(),
            }
          : t,
      ),
    )
  }, [])

  const deleteSubtask = useCallback((taskId: string, subId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              subtasks: t.subtasks.filter((s) => s.id !== subId),
              updatedAt: Date.now(),
            }
          : t,
      ),
    )
  }, [])

  return {
    tasks,
    setTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
  }
}
