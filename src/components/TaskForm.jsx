import { useState } from 'react';

function TaskForm({ onAddTask }) {
  /* Local controlled form state */
  const [text, setText] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('Medium');
  const [formError, setFormError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmed = text.trim();

    /* Validation */
    if (!trimmed) {
      setFormError('⚠ Task text cannot be empty.');
      return;
    }
    if (trimmed.length > 60) {
      setFormError('⚠ Keep it under 60 characters.');
      return;
    }

    /* Call parent handler (lifting state up) */
    onAddTask(trimmed, category, priority);

    /* Reset text field only */
    setText('');
    setFormError('');
  };

  return (
    <div className="task-form-card">
      <h2 className="task-form-title">➕ Add New Task</h2>
      <form className="task-form" onSubmit={handleSubmit}>
        <div className="task-form-row">
          <label htmlFor="task-input" className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
            Task description
          </label>
          <input
            id="task-input"
            className="task-form-input"
            type="text"
            placeholder="What needs to be done?"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (formError) setFormError('');
            }}
            autoComplete="off"
          />
        </div>

        <div className="task-form-row">
          <label htmlFor="category-select" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
            Category
          </label>
          <select
            id="category-select"
            className="task-form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Work">📁 Work</option>
            <option value="Personal">🏠 Personal</option>
            <option value="Learning">📚 Learning</option>
            <option value="Health">💪 Health</option>
          </select>

          <label htmlFor="priority-select" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
            Priority
          </label>
          <select
            id="priority-select"
            className="task-form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="High">🔴 High</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Low">🟢 Low</option>
          </select>

          <button type="submit" className="task-form-submit">
            Add Task
          </button>
        </div>

        {text.length > 0 && (
          <span className={`char-count ${text.trim().length > 60 ? 'char-limit' : ''}`}>
            {text.trim().length}/60
          </span>
        )}

        {formError && (
          <p className="task-form-error" role="alert">{formError}</p>
        )}
      </form>
    </div>
  );
}

export default TaskForm;
