function FilterBar({ filter, onFilterChange, searchTerm, onSearchChange, sortBy, onSortChange }) {
  return (
    <div className="filter-bar" role="toolbar" aria-label="Task filters">
      {/* Search input */}
      <div className="search-wrapper">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <label htmlFor="search-tasks" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
          Search tasks
        </label>
        <input
          id="search-tasks"
          className="search-input"
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter buttons */}
      <div className="filter-group" role="group" aria-label="Filter by status">
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => onFilterChange(f)}
            aria-pressed={filter === f}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Sort dropdown */}
      <label htmlFor="sort-tasks" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        Sort tasks
      </label>
      <select
        id="sort-tasks"
        className="sort-select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="priority">Priority (High → Low)</option>
      </select>
    </div>
  );
}

export default FilterBar;
