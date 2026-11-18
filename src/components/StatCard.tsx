import type { Stat } from "../types";

interface Props {
  stat: Stat;
}

function StatCard({ stat }: Props) {
  return (
    <div className="stat-card">
      <p className="stat-label">{stat.label}</p>
      <h2>{stat.value}</h2>
      <span className="stat-description">{stat.description}</span>
    </div>
  );
}

export default StatCard;
