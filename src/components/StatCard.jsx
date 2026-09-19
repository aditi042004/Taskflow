function StatCard({ icon, label, value, accent }) {
  return (
    <div className="stat-card">
      {/* Inline style used for dynamic accent background — demonstrates inline styling */}
      <div
        className="stat-card-icon"
        style={{ backgroundColor: accent + '15', color: accent }}
      >
        {icon}
      </div>
      <div className="stat-card-info">
        <span className="stat-card-value">{value}</span>
        <span className="stat-card-label">{label}</span>
      </div>
    </div>
  );
}

export default StatCard;
