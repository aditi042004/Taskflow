import { useState, useRef } from 'react';

function TaskItem({ task, onToggle, onDelete, onEdit, onEditModal }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const inputRef = useRef(null);

  const startEditing = () => {
    setEditText(task.text);
    setIsEditing(true);
    /* Focus the input after React renders it */
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const saveEdit = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed.length <= 60) {
      onEdit(task.id, trimmed);
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditText(task.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  /* Format created date */
  const formattedDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      {/* Checkbox toggle */}
      <button
        className={`task-checkbox ${task.completed ? 'checked' : ''}`}
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
        role="checkbox"
        aria-checked={task.completed}
      />

      {/* Task content */}
      <div className="task-content">
        {isEditing ? (
          <input
            ref={inputRef}
            className="task-edit-input"
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={saveEdit}
            aria-label="Edit task text"
          />
        ) : (
          <>
            <span
              className="task-text"
              onDoubleClick={startEditing}
              title="Double-click to edit text"
            >
              {task.text}
            </span>
            <div className="task-meta">
              <span className="task-badge badge-category">{task.category}</span>
              <span className={`task-badge badge-priority-${task.priority}`}>
                {task.priority}
              </span>
              <span className="task-date">{formattedDate}</span>
            </div>
          </>
        )}
      </div>

      {/* Action buttons */}
      <div className="task-actions">
        {!isEditing && (
          <button
            className="task-action-btn"
            onClick={() => onEditModal && onEditModal(task)}
            aria-label="Edit task"
            title="Edit task details"
          >
            ✏️
          </button>
        )}
        <button
          className="task-action-btn delete"
          onClick={() => onDelete(task.id)}
          aria-label="Delete task"
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
