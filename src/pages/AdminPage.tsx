import { StatsCards } from '../components/features/admin/StatsCards';
import { AdminTabs } from '../components/features/admin/AdminTabs';
import { QueueList } from '../components/features/admin/QueueList';
import { DetailPanel } from '../components/features/admin/DetailPanel';
import { useAdminContext } from '../App';

export default function AdminPage() {
  const { counts, list, selected, selectedId, setSelectedId, setStatus, tab, setTab } = useAdminContext();

  return (
    <main style={{ maxWidth: 1240, margin: '0 auto', padding: '32px 28px 64px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 26 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 12px', background: 'color-mix(in srgb, var(--brand) 12%, transparent)', color: 'var(--brand-ink)', borderRadius: 999, fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 2l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5z" strokeLinejoin="round" /></svg>
            Moderator
          </div>
          <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 34, letterSpacing: '-.8px', margin: '0 0 6px' }}>Library review queue</h1>
          <p style={{ fontSize: 15.5, color: 'var(--ink-soft)', margin: 0 }}>Approve community submissions before they go live on StackBrix.</p>
        </div>
      </div>

      <StatsCards pending={counts.pending} approved={counts.approved} rejected={counts.rejected} />

      <AdminTabs activeTab={tab} counts={counts} onTab={setTab} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 366px', gap: 24, alignItems: 'start' }}>
        <QueueList items={list} selectedId={selectedId} onSelect={setSelectedId} />
        <DetailPanel item={selected} onSetStatus={setStatus} />
      </div>
    </main>
  );
}
