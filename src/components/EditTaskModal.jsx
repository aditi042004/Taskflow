import { useState, useEffect } from 'react';

function EditTaskModal({ task, onSave, onClose }) {
  const [text, setText] = useState(task.text);
  const [category, setCategory] = useState(task.category || 'Work');
  const [priority, setPriority] = useState(task.priority || 'Medium');
  const [status, setStatus] = useState(task.completed ? 'Completed' : 'Active');
  const [error, setError] = useState('');

  /* Close on Escape key */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();

    if (!trimmed) {
      setError('Task title cannot be empty.');
      return;
    }

    if (trimmed.length > 60) {
      setError('Keep the task title under 60 characters.');
      return;
    }

    onSave(task.id, {
      text: trimmed,
      category,
      priority,
      completed: status === 'Completed',
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h2 id="modal-title" className="modal-title">
              Edit Task
            </h2>
            <p className="modal-subtitle">Update your task details</p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close edit task dialog"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && <div className="modal-error-alert">⚠️ {error}</div>}

          {/* Task Title */}
          <div className="form-group">
            <label htmlFor="edit-task-title" className="form-label">
              Task Title
            </label>
            <input
              id="edit-task-title"
              type="text"
              className="form-input"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter task description..."
              maxLength={70}
              autoFocus
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="edit-task-category" className="form-label">
              Category
            </label>
            <select
              id="edit-task-category"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Learning">Learning</option>
              <option value="Health">Health</option>
            </select>
          </div>

          {/* Priority */}
          <div className="form-group">
            <label htmlFor="edit-task-priority" className="form-label">
              Priority
            </label>
            <select
              id="edit-task-priority"
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Status */}
          <div className="form-group">
            <label htmlFor="edit-task-status" className="form-label">
              Status
            </label>
            <select
              id="edit-task-status"
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTaskModal;
