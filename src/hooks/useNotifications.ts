import { useCallback, useEffect, useRef, useState } from 'react'
import type { Task } from '../types'

type Permission = 'default' | 'granted' | 'denied' | 'unsupported'

/**
 * Hook de notificaciones (user story "Should": Notificaciones).
 * Revisa periódicamente las tareas con fecha límite vencida o próxima
 * y dispara una notificación del navegador una sola vez por tarea.
 */
export function useNotifications(
  tasks: Task[],
  markNotified: (id: string) => void,
) {
  const [permission, setPermission] = useState<Permission>(() =>
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission,
  )
  // Evita notificar repetidamente dentro de la misma sesión.
  const sessionNotified = useRef<Set<string>>(new Set())

  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') return
    const result = await Notification.requestPermission()
    setPermission(result)
  }, [])

  useEffect(() => {
    if (permission !== 'granted') return

    const check = () => {
      const now = Date.now()
      for (const task of tasks) {
        if (task.status === 'done') continue
        if (!task.dueDate) continue
        if (task.notified || sessionNotified.current.has(task.id)) continue

        const due = new Date(task.dueDate).getTime()
        if (Number.isNaN(due)) continue

        // Notificar cuando faltan 5 min o menos (incluye ya vencidas).
        const msLeft = due - now
        if (msLeft <= 5 * 60 * 1000) {
          const overdue = msLeft < 0
          new Notification(overdue ? '⏰ Tarea vencida' : '⏳ Tarea por vencer', {
            body: task.title,
            tag: task.id,
          })
          sessionNotified.current.add(task.id)
          markNotified(task.id)
        }
      }
    }

    check()
    const interval = setInterval(check, 30 * 1000)
    return () => clearInterval(interval)
  }, [tasks, permission, markNotified])

  return { permission, requestPermission }
}
