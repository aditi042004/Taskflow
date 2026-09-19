import { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import EditTaskModal from './components/EditTaskModal';
import Footer from './components/Footer';
import initialTasks from './data/initialTasks';
import './styles/App.css';

/* ---------- Constants ---------- */
const STORAGE_KEY = 'taskflow.tasks';
const THEME_KEY = 'taskflow.theme';
const API_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=6';
const API_TIMEOUT = 8000;
const UNDO_DURATION = 5000;

/* Priority rank map for sorting */
const PRIORITY_RANK = { High: 1, Medium: 2, Low: 3 };

/* ---------- Helpers ---------- */

/** Safely load tasks from localStorage */
function loadTasksFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* corrupted localStorage — ignore silently */
  }
  return null;
}

/** Safely load theme from localStorage */
function loadThemeFromStorage() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    /* ignore */
  }
  return 'light';
}

/** Filter, search, and sort tasks (computed during render — NOT stored in state) */
function getVisibleTasks(tasks, filter, searchTerm, sortBy) {
  let result = tasks;

  /* Filter by status */
  if (filter === 'active') {
    result = result.filter(t => !t.completed);
  } else if (filter === 'completed') {
    result = result.filter(t => t.completed);
  }

  /* Search — case-insensitive */
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    result = result.filter(t => t.text.toLowerCase().includes(term));
  }

  /* Sort — do not mutate original array */
  result = [...result].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'priority') return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    return 0;
  });

  return result;
}

/* ---------- App Component ---------- */
function App() {
  /* ---- State ---- */
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(loadThemeFromStorage);

  /* Modal and Toast state */
  const [editingTask, setEditingTask] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const toastTimeoutRef = useRef(null);

  /* Undo delete state */
  const [deletedTask, setDeletedTask] = useState(null);
  const undoTimeoutRef = useRef(null);

  /* Guard to prevent overwriting localStorage during initial load */
  const hasInitialized = useRef(false);

  /* ---- API Fetch on Mount ---- */
  useEffect(() => {
    const savedTasks = loadTasksFromStorage();

    /* If user has saved tasks, use those instead of fetching */
    if (savedTasks && savedTasks.length > 0) {
      setTasks(savedTasks);
      setIsLoading(false);
      hasInitialized.current = true;
      return;
    }

    /* Fetch from API with AbortController timeout */
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    fetch(API_URL, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('API response not OK');
        return response.json();
      })
      .then(data => {
        const mapped = data.map(item => ({
          id: item.id,
          text: item.title,
          category: 'Work',
          priority: 'Medium',
          completed: item.completed,
          createdAt: new Date().toISOString(),
        }));
        setTasks(mapped);
      })
      .catch(() => {
        setError('Could not load tasks. Showing local data instead.');
        setTasks(initialTasks);
      })
      .finally(() => {
        clearTimeout(timeoutId);
        setIsLoading(false);
        hasInitialized.current = true;
      });

    /* Cleanup: abort if component unmounts */
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  /* ---- Persist tasks to localStorage ---- */
  useEffect(() => {
    if (!hasInitialized.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  /* ---- Persist theme to localStorage ---- */
  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  /* ---- Update document title ---- */
  useEffect(() => {
    const pending = tasks.filter(t => !t.completed).length;
    document.title = pending > 0 ? `(${pending}) TaskFlow` : 'TaskFlow — All done! 🎉';
  }, [tasks]);

  /* ---- Cleanup timeouts on unmount ---- */
  useEffect(() => {
    return () => {
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  /* ---- Handlers (passed to children via props) ---- */

  /** Add a new task — immutable update */
  const addTask = useCallback((text, category, priority) => {
    const newTask = {
      id: Date.now(),
      text,
      category,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  }, []);

  /** Toggle task completion — immutable update with map */
  const toggleTask = useCallback((id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  /** Delete task with undo support — immutable update with filter */
  const deleteTask = useCallback((id) => {
    setTasks(prev => {
      const taskToDelete = prev.find(t => t.id === id);
      if (taskToDelete) {
        /* Clear any existing undo timeout */
        if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
        setDeletedTask(taskToDelete);
        /* Auto-dismiss undo after UNDO_DURATION */
        undoTimeoutRef.current = setTimeout(() => {
          setDeletedTask(null);
          undoTimeoutRef.current = null;
        }, UNDO_DURATION);
      }
      return prev.filter(task => task.id !== id);
    });
  }, []);

  /** Edit task text (inline edit) — immutable update with map */
  const editTask = useCallback((id, newText) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  }, []);

  /** Advanced update task (full edit modal) — immutable update with map */
  const updateTask = useCallback((id, updates) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
    setEditingTask(null);
    setToastMessage('✓ Task updated successfully');

    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage('');
      toastTimeoutRef.current = null;
    }, 3000);
  }, []);

  /** Clear all completed tasks — immutable update with filter */
  const clearCompleted = useCallback(() => {
    setTasks(prev => prev.filter(task => !task.completed));
  }, []);

  /** Undo delete — restore the last deleted task */
  const undoDelete = useCallback(() => {
    if (deletedTask) {
      setTasks(prev => [deletedTask, ...prev]);
      setDeletedTask(null);
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
        undoTimeoutRef.current = null;
      }
    }
  }, [deletedTask]);

  /** Toggle theme */
  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  /* ---- Derived Values (computed during render, NOT in state) ---- */
  const visibleTasks = getVisibleTasks(tasks, filter, searchTerm, sortBy);
  const completedCount = tasks.filter(t => t.completed).length;
  const hasActiveFilters = filter !== 'all' || searchTerm.trim() !== '';

  /* ---- Render ---- */
  return (
    <div className="app-container" data-theme={theme}>
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main className="app-main">
        <StatsBar tasks={tasks} />

        <TaskForm onAddTask={addTask} />

        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <TaskList
          tasks={visibleTasks}
          isLoading={isLoading}
          error={error}
          hasActiveFilters={hasActiveFilters}
          completedCount={completedCount}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={editTask}
          onEditModal={setEditingTask}
          onClearCompleted={clearCompleted}
        />
      </main>

      <Footer
        visibleCount={visibleTasks.length}
        totalCount={tasks.length}
      />

      {/* Advanced Edit Task Modal */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onSave={updateTask}
          onClose={() => setEditingTask(null)}
        />
      )}

      {/* Undo Delete Toast */}
      {deletedTask && (
        <div className="undo-toast" role="alert">
          <span>Task deleted</span>
          <span>—</span>
          <button className="undo-btn" onClick={undoDelete}>
            Undo
          </button>
        </div>
      )}

      {/* Success Update Toast */}
      {toastMessage && (
        <div className="success-toast" role="status">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

export default App;
