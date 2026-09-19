# ⚡ TaskFlow — Personal Productivity Dashboard

A modern, polished personal productivity dashboard built with **React 18** and **Vite**. TaskFlow demonstrates core-to-intermediate React concepts including component architecture, hooks, state management, API integration, and local storage persistence — all wrapped in a premium SaaS-style UI.

---

## 📋 Overview

TaskFlow is a single-page application that lets users manage their daily tasks with full CRUD functionality, real-time statistics, intelligent filtering, and a professional user experience. The app fetches initial data from a REST API, persists state to localStorage, and includes bonus features like dark mode and undo delete.

---

## ✨ Features

- **Task Management** — Add, edit (inline), toggle complete, and delete tasks
- **Real-time Statistics** — Live counters for total, completed, and pending tasks with animated progress bar
- **Smart Filtering** — Filter by status (All / Active / Completed) with case-insensitive search
- **Flexible Sorting** — Sort by newest, oldest, or priority (High → Low)
- **API Integration** — Fetches initial tasks from JSONPlaceholder with timeout handling
- **Local Storage** — Tasks persist across browser sessions with corruption-safe loading
- **Dynamic Document Title** — Shows pending count or "All done!" message
- **Live Clock** — Real-time clock with dynamic greeting in the header
- **Form Validation** — Empty and character-length validation with clear feedback
- **Responsive Design** — Fully usable from 375px to desktop widths
- **Dark / Light Mode** — Theme toggle with localStorage persistence (Bonus)
- **Undo Delete** — 5-second undo toast after deleting a task (Bonus)

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | Component-based UI framework |
| **Vite** | Fast build tool and dev server |
| **JavaScript / JSX** | Language and templating |
| **Plain CSS** | Styling with CSS custom properties |
| **REST API** | JSONPlaceholder for initial task data |
| **localStorage** | Client-side data persistence |

No external UI libraries, no Tailwind, no Bootstrap, no Redux.

---

## 🚀 Setup

```bash
# Clone or navigate to the project directory
cd taskflow

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/`

---

## 📦 Build

```bash
npm run build
```

Production output is generated in the `dist/` folder.

---

## 🌳 Component Tree

```
App
├── Header              — Brand, greeting, live clock, theme toggle
├── StatsBar            — Statistics dashboard
│   └── StatCard × 3    — Reusable stat display (Total, Completed, Pending)
├── TaskForm            — Controlled form with validation
├── FilterBar           — Search, status filters, sort dropdown
├── TaskList            — Task list with loading/error/empty states
│   └── TaskItem × N    — Individual task with inline editing
└── Footer              — Task count summary
```

---

## 📂 Folder Structure

```
taskflow/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx              # React root setup only
    ├── App.jsx               # Single source of truth (state + handlers)
    ├── index.css             # Global resets and base styles
    ├── components/
    │   ├── Header.jsx        # Brand, clock, greeting, theme toggle
    │   ├── StatsBar.jsx      # Statistics with progress bar
    │   ├── StatCard.jsx      # Reusable stat card component
    │   ├── TaskForm.jsx      # Controlled add-task form
    │   ├── FilterBar.jsx     # Search, filter buttons, sort
    │   ├── TaskList.jsx      # Task list with state handling
    │   ├── TaskItem.jsx      # Task row with inline editing
    │   └── Footer.jsx        # Footer with counts
    ├── data/
    │   └── initialTasks.js   # Fallback task data
    └── styles/
        └── App.css           # Theme variables and component styles
```

---

## 🧠 React Concepts Demonstrated

| Concept | Where Used |
|---------|-----------|
| **JSX** | All component files |
| **Functional Components** | Every component (no class components) |
| **Props** | All child components receive data/handlers from App |
| **useState** | App (tasks, filter, search, sort, loading, error, theme), TaskForm (text, category, priority, formError), TaskItem (isEditing, editText), Header (currentTime) |
| **Event Handling** | Form submit, button clicks, keyboard events (Enter/Escape), double-click to edit |
| **Conditional Rendering** | Loading spinner, error alert, empty states, undo toast, edit mode |
| **Lists & Keys** | `tasks.map(task => <TaskItem key={task.id} />)` — stable IDs, never index |
| **Controlled Inputs** | All form inputs use `value` + `onChange` pattern |
| **Lifting State Up** | Task state in App, passed down to children via props and callbacks |
| **useEffect** | API fetch, localStorage sync, document title, clock interval |
| **Dependency Arrays** | `[]` for mount-only, `[tasks]` for persistence, `[theme]` for theme |
| **Cleanup Functions** | `clearInterval` in Header, `AbortController.abort()` in App, `clearTimeout` for undo |
| **API Fetch** | `fetch()` with AbortController and 8-second timeout |
| **Loading/Error States** | Loading spinner, error alert with fallback data |
| **localStorage** | Tasks + theme persisted with try/catch for corruption safety |
| **document.title** | Dynamic title showing pending count |
| **Inline Styling** | Progress bar `style={{ width: \`\${percent}%\` }}`, StatCard accent |
| **Conditional className** | `task.completed ? "completed" : ""`, filter button active state |
| **Responsive CSS** | Media queries for 768px, 480px, 375px breakpoints |
| **Immutable Updates** | `map()`, `filter()`, spread operator — never `push()` or direct mutation |

---

## ❓ Conceptual Questions

### 1. Why does React need a `key` prop, and why is array index a poor key?

React uses `key` props to identify which items in a list have changed, been added, or been removed during reconciliation. Keys give each element a stable identity so React can efficiently update the DOM by matching old and new virtual DOM trees. Using the array index as a key is problematic because when items are reordered, inserted, or deleted, the indices shift — causing React to associate the wrong state and DOM nodes with the wrong data. This leads to subtle bugs like inputs retaining stale values or animations replaying incorrectly. In TaskFlow, we use `task.id` (a unique timestamp) as the key, ensuring stable identity regardless of list modifications.

### 2. What is lifting state up? Name one place used in TaskFlow.

Lifting state up is the React pattern of moving shared state to the closest common ancestor component so that multiple child components can access and modify the same data through props. This avoids duplicate or out-of-sync state and keeps a single source of truth. In TaskFlow, the `tasks` array is lifted up to `App.jsx` rather than being stored in `TaskList` or `TaskForm`. App defines handler functions like `addTask`, `toggleTask`, `deleteTask`, and `editTask`, then passes them down as props. This way, `TaskForm` can add tasks and `TaskList`/`TaskItem` can display, toggle, edit, and delete them — all coordinated through the shared state in App.

### 3. What does the useEffect cleanup function do, and when does React run it?

The cleanup function returned from `useEffect` is used to tear down side effects — like clearing intervals, aborting network requests, or removing event listeners — to prevent memory leaks and stale behavior. React runs the cleanup function in two situations: (1) before re-running the effect when its dependencies change, and (2) when the component unmounts. In TaskFlow's `Header` component, the clock interval is cleaned up with `return () => clearInterval(timerId)` so that when the component unmounts, the interval stops firing and doesn't try to update state on an unmounted component. Similarly, the API fetch in App uses an `AbortController` whose `abort()` method is called in the cleanup function.

---

## 🎁 Bonus Features

### Dark / Light Mode
- Theme state managed in `App.jsx`
- Applied via `data-theme` attribute on the root wrapper
- CSS custom properties switch all colors between light and dark palettes
- Theme preference persisted to `localStorage` under `taskflow.theme`
- Elegant toggle button in the Header with sun/moon icons

### Undo Delete
- When a task is deleted, it's temporarily stored in state (`deletedTask`)
- A toast notification appears at the bottom: "Task deleted — Undo"
- Clicking "Undo" restores the task to the list
- Toast auto-dismisses after 5 seconds via `setTimeout`
- Timeout is properly cleaned up on component unmount

---

## 🔮 What I'd Add With More Time

1. **Drag-and-Drop Reordering** — Allow users to reorder tasks by dragging, using a library like `@dnd-kit` or native HTML5 drag events, with order persisted to localStorage.

2. **Due Dates & Reminders** — Add optional due dates to tasks with visual indicators for overdue items and browser notification reminders using the Notifications API.

3. **Task Categories Dashboard** — A collapsible sidebar or tab view that groups tasks by category with per-category progress tracking and statistics charts.

---

## 📄 License

This project was built as a React Basics capstone assignment.
