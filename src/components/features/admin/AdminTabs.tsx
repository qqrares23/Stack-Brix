import type { SubmissionStatus } from '../../../types/admin';

const STATUS_LABEL: Record<SubmissionStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

interface AdminTabsProps {
  activeTab: SubmissionStatus;
  counts: Record<SubmissionStatus, number>;
  onTab: (t: SubmissionStatus) => void;
}

const TABS: SubmissionStatus[] = ['pending', 'approved', 'rejected'];

const SEG: React.CSSProperties = {
  border: 0, cursor: 'pointer', background: 'transparent', color: 'var(--ink-soft)',
  fontFamily: "'Plus Jakarta Sans'", fontWeight: 600, fontSize: 13.5,
  padding: '8px 16px', borderRadius: 9,
};

export function AdminTabs({ activeTab, counts, onTab }: AdminTabsProps) {
  return (
    <div style={{ display: 'flex', gap: 6, padding: 5, background: 'var(--surface-2)', borderRadius: 13, width: 'max-content', marginBottom: 20 }}>
      {TABS.map((t) => (
        <button key={t} data-seg-active={String(activeTab === t)} onClick={() => onTab(t)} style={SEG}>
          {STATUS_LABEL[t]} · {counts[t]}
        </button>
      ))}
    </div>
  );
}
