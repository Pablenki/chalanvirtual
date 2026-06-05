# 📋 Mis Tareas — Agile Training

Gestor de tareas estilo Kanban construido a partir de los *user stories* del
tablero de Trello "Agile Training". Permite organizar tareas en tres estados
(**Por Hacer**, **En Progreso**, **Terminado**) con prioridades, fechas límite,
subtareas, filtros, ordenamiento y notificaciones.

## 🧱 Tech stack

- **React 18** + **TypeScript**
- **Vite** como bundler/dev server
- Persistencia local con **localStorage** (sin backend)
- API de **Notifications** del navegador

## ✅ Funcionalidades

### Must (implementadas)
- ➕ Crear tareas con **título** y **descripción**
- ✏️ **Editar** tareas existentes
- 🗑️ **Eliminar** tareas (terminadas o canceladas)
- 🔁 **Cambiar el estado**: Por Hacer / En Progreso / Terminado
  (vía selector o arrastrando la tarjeta entre columnas)
- 📅 Asignar **fecha y hora límite**

### Should (implementadas)
- 🔔 **Notificaciones** del navegador cuando una tarea está por vencer o vencida
- ↕️ **Ordenar** por fecha de creación, fecha límite, prioridad o título
- 🔍 **Filtros** por texto (búsqueda) y por prioridad
- ⭐ **Prioridad** (Baja / Media / Alta)

### Could (implementadas)
- 🎨 **Colores de prioridad** en cada tarjeta
- ☑️ **Subtareas** con barra de progreso

### Won't do (fuera de alcance)
- 📊 Gráficas
- 🗓️ Vista de calendario

## 🚀 Cómo ejecutar

```bash
npm install
npm run dev      # entorno de desarrollo (http://localhost:5173)
npm run build    # build de producción en /dist
npm run preview  # previsualizar el build
```

## 📁 Estructura

```
src/
├── components/      # TaskModal, TaskCard, Column, Toolbar
├── hooks/           # useTasks (CRUD), useNotifications
├── lib/             # storage (localStorage), filters (filtrar/ordenar)
├── styles/          # index.css (tema oscuro)
├── types.ts         # modelo de dominio
├── App.tsx          # composición principal
└── main.tsx         # punto de entrada
```

## 💾 Datos

Todas las tareas se guardan en `localStorage` bajo la clave
`agile-training-tasks`, por lo que persisten entre recargas sin necesidad de
servidor.
