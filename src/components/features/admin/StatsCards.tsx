interface StatCardProps {
  dot: string;
  label: string;
  value: number;
}

function StatCard({ dot, label, value }: StatCardProps) {
  return (
    <div className="card" style={{ background: 'var(--surface)', border: '1.5px solid var(--line)', borderRadius: 16, padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 8 }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: dot }} /> {label}
      </div>
      <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 36, lineHeight: 1 }}>{value}</div>
    </div>
  );
}

interface StatsCardsProps {
  pending: number;
  approved: number;
  rejected: number;
}

export function StatsCards({ pending, approved, rejected }: StatsCardsProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
      <StatCard dot="var(--accent)" label="Awaiting review" value={pending} />
      <StatCard dot="var(--green)" label="Approved" value={approved} />
      <StatCard dot="var(--red)" label="Rejected" value={rejected} />
    </div>
  );
}
