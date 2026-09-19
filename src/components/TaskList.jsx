import TaskItem from './TaskItem';

function TaskList({ tasks, isLoading, error, hasActiveFilters, completedCount, onToggle, onDelete, onEdit, onEditModal, onClearCompleted }) {
  /* Loading state */
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner" role="status" aria-label="Loading tasks"></div>
        <p className="loading-text">⏳ Loading your tasks...</p>
      </div>
    );
  }

  return (
    <section className="task-list-section" aria-label="Task list">
      {/* API error alert */}
      {error && (
        <div className="error-alert" role="alert">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Header with clear completed */}
      <div className="task-list-header">
        <span className="task-list-title">
          {tasks.length > 0 ? `${tasks.length} task${tasks.length !== 1 ? 's' : ''}` : ''}
        </span>
        {completedCount > 0 && (
          <button
            className="clear-completed-btn"
            onClick={onClearCompleted}
            aria-label={`Clear ${completedCount} completed tasks`}
          >
            🧹 Clear {completedCount} completed
          </button>
        )}
      </div>

      {/* Task items or empty states */}
      {tasks.length === 0 ? (
        <div className="state-message">
          {hasActiveFilters ? (
            <>
              <span className="state-message-icon">🔍</span>
              <p className="state-message-text">No tasks match your search.</p>
              <p className="state-message-subtext">Try adjusting your filters or search term.</p>
            </>
          ) : (
            <>
              <span className="state-message-icon">🎉</span>
              <p className="state-message-text">No tasks yet. Add your first task above!</p>
              <p className="state-message-subtext">Start being productive today.</p>
            </>
          )}
        </div>
      ) : (
        tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
            onEditModal={onEditModal}
          />
        ))
      )}
    </section>
  );
}

export default TaskList;
