import StatCard from './StatCard';

function StatsBar({ tasks }) {
  /* Derive stats during render — NOT stored in state */
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <section aria-label="Task statistics">
      <div className="stats-bar">
        {/* Reuse StatCard component 3 times with different props */}
        <StatCard icon="📋" label="Total" value={total} accent="#4f46e5" />
        <StatCard icon="✅" label="Completed" value={completed} accent="#16a34a" />
        <StatCard icon="⏳" label="Pending" value={pending} accent="#d97706" />
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">Overall Progress</span>
          <span className="progress-percent">{percent}%</span>
        </div>
        <div className="progress-track" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
          {/* Inline style for progress width — required to demonstrate inline styling */}
          <div className="progress-fill" style={{ width: `${percent}%` }}></div>
        </div>
      </div>
    </section>
  );
}

export default StatsBar;
