import { Avatar } from '../../ui/Avatar';
import type { QueueItem, SubmissionStatus } from '../../../types/admin';

const STATUS_META: Record<SubmissionStatus, { label: string; color: string; bg: string }> = {
  pending:  { label: 'Pending',  color: 'var(--brand-ink)', bg: 'color-mix(in srgb, var(--accent) 22%, transparent)' },
  approved: { label: 'Approved', color: 'var(--green)',     bg: 'color-mix(in srgb, var(--green) 15%, transparent)' },
  rejected: { label: 'Rejected', color: 'var(--red)',       bg: 'color-mix(in srgb, var(--red) 15%, transparent)' },
};

interface QueueListProps {
  items: QueueItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function QueueList({ items, selectedId, onSelect }: QueueListProps) {
  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '54px 20px', color: 'var(--ink-soft)' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
        <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 18, color: 'var(--ink)' }}>Nothing here</div>
        <p style={{ fontSize: 14, margin: '6px 0 0' }}>No submissions in this tab right now.</p>
      </div>
    );
  }

  return (
    <div>
      {items.map((row) => {
        const meta = STATUS_META[row.status];
        return (
          <div
            key={row.id}
            onClick={() => onSelect(row.id)}
            data-block-active={String(row.id === selectedId)}
            className="hbords"
            style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--surface)', border: '1.5px solid var(--line)', borderRadius: 14, padding: '14px 16px', cursor: 'pointer', marginBottom: 10, transition: 'box-shadow .12s' }}
          >
            <Avatar initials={row.initials} color={row.color} size={46} radius={13} fontSize={18} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 16.5 }}>{row.name}</span>
                {row.mine && <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--brand)', background: 'color-mix(in srgb, var(--brand) 13%, transparent)', padding: '2px 7px', borderRadius: 6 }}>YOURS</span>}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', fontWeight: 600, marginTop: 2 }}>by {row.author} · {row.cat} · {row.version} · {row.submitted}</div>
            </div>
            <span style={{ fontSize: 11.5, fontWeight: 700, padding: '5px 11px', borderRadius: 999, color: meta.color, background: meta.bg }}>{meta.label}</span>
          </div>
        );
      })}
    </div>
  );
}
