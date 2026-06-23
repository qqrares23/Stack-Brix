import { useNavigate } from 'react-router-dom';
import { Avatar } from '../../ui/Avatar';
import type { QueueItem, SubmissionStatus } from '../../../types/admin';

interface DetailPanelProps {
  item: QueueItem | null;
  onSetStatus: (id: string, status: SubmissionStatus) => void;
}

export function DetailPanel({ item, onSetStatus }: DetailPanelProps) {
  const navigate = useNavigate();

  if (!item) {
    return (
      <aside style={{ position: 'sticky', top: 84, background: 'var(--surface)', border: '1.5px solid var(--line)', borderRadius: 18, overflow: 'hidden' }}>
        <div style={{ padding: '54px 24px', textAlign: 'center', color: 'var(--ink-soft)' }}>
          <div style={{ fontSize: 30, marginBottom: 8 }}>👈</div>
          <p style={{ fontSize: 14, margin: 0 }}>Select a submission to review it.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside style={{ position: 'sticky', top: 84, background: 'var(--surface)', border: '1.5px solid var(--line)', borderRadius: 18, overflow: 'hidden' }}>
      <div style={{ padding: '22px 22px 18px', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 14 }}>
          <Avatar initials={item.initials} color={item.color} size={52} radius={14} fontSize={20} />
          <div>
            <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 20, lineHeight: 1.05 }}>{item.name}</div>
            <div style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 600 }}>by {item.author}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)' }}>
          <span style={{ background: 'var(--surface-2)', padding: '4px 10px', borderRadius: 7 }}>{item.cat}</span>
          <span style={{ background: 'var(--surface-2)', padding: '4px 10px', borderRadius: 7, fontFamily: "'JetBrains Mono', monospace" }}>{item.version}</span>
          <span style={{ background: 'var(--surface-2)', padding: '4px 10px', borderRadius: 7 }}>{item.submitted}</span>
        </div>
      </div>

      <div style={{ padding: '18px 22px' }}>
        <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.7px', color: 'var(--ink-soft)', marginBottom: 8 }}>Summary</div>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--ink)', margin: '0 0 18px' }}>{item.desc}</p>

        {item.links.length > 0 && (
          <>
            <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.7px', color: 'var(--ink-soft)', marginBottom: 8 }}>Links</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 18 }}>
              {item.links.map((lnk) => (
                <div key={lnk} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--blue)', background: 'var(--surface-2)', padding: '9px 12px', borderRadius: 9, wordBreak: 'break-all' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flex: 'none' }}><path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1" strokeLinecap="round" /></svg>
                  {lnk}
                </div>
              ))}
            </div>
          </>
        )}

        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/docs'); }} className="hbords" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, textDecoration: 'none', fontSize: 13.5, fontWeight: 600, color: 'var(--ink)', border: '1.5px solid var(--line)', borderRadius: 10, padding: 10, marginBottom: 18 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
          Open full preview
        </a>

        {item.status === 'pending' && (
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => onSetStatus(item.id, 'approved')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, border: 0, cursor: 'pointer', background: 'var(--green)', color: '#fff', fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 14.5, padding: 12, borderRadius: 11 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M5 12.5l4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Approve
            </button>
            <button onClick={() => onSetStatus(item.id, 'rejected')} className="hred" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, border: '1.5px solid var(--line)', cursor: 'pointer', background: 'transparent', color: 'var(--red)', fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 14.5, padding: 12, borderRadius: 11 }}>Reject</button>
          </div>
        )}

        {item.status === 'approved' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '13px 15px', background: 'color-mix(in srgb, var(--green) 13%, transparent)', borderRadius: 12, color: 'var(--green)', fontWeight: 700, fontSize: 14 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12.5l4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Approved &amp; published
          </div>
        )}

        {item.status === 'rejected' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '13px 15px', background: 'color-mix(in srgb, var(--red) 13%, transparent)', borderRadius: 12, color: 'var(--red)', fontWeight: 700, fontSize: 14 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /></svg>
            Rejected — author notified
          </div>
        )}
      </div>
    </aside>
  );
}
