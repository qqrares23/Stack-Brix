import { useNavigate } from 'react-router-dom';

interface PublishPanelProps {
  onSubmit: () => void;
  moderationError?: string | null;
}

export function PublishPanel({ onSubmit, moderationError }: PublishPanelProps) {
  const navigate = useNavigate();

  return (
    <aside style={{ borderLeft: '1px solid var(--line)', overflowY: 'auto', padding: '22px 18px', background: 'var(--surface)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--accent)' }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>Draft</span>
        <span style={{ fontSize: 12.5, color: 'var(--ink-soft)', fontWeight: 500, marginLeft: 'auto' }}>Autosaved</span>
      </div>

      <button onClick={onSubmit} style={{ width: '100%', border: 0, cursor: 'pointer', background: 'var(--brand)', color: '#fff', fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 15, padding: 13, borderRadius: 12, marginBottom: 10, boxShadow: '0 8px 18px -8px var(--brand)' }}>
        Submit for review
      </button>

      {moderationError && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 13px', background: 'color-mix(in srgb, var(--red) 12%, transparent)', border: '1.5px solid color-mix(in srgb, var(--red) 30%, transparent)', borderRadius: 10, marginBottom: 10 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.2" style={{ flex: 'none', marginTop: 1 }}><circle cx="12" cy="12" r="9" /><path d="M12 8v4M12 16h.01" strokeLinecap="round" /></svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--red)', lineHeight: 1.4 }}>{moderationError}</span>
        </div>
      )}
      <button onClick={() => navigate('/docs')} className="hbords" style={{ width: '100%', border: '1.5px solid var(--line)', cursor: 'pointer', background: 'transparent', color: 'var(--ink)', fontFamily: "'Plus Jakarta Sans'", fontWeight: 600, fontSize: 14, padding: 11, borderRadius: 11, marginBottom: 24 }}>
        Preview as reader
      </button>

      <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.7px', color: 'var(--ink-soft)', marginBottom: 9 }}>Version</div>
      <input defaultValue="v1.3.1" className="finp" style={{ width: '100%', border: '1.5px solid var(--line)', background: 'var(--surface-2)', borderRadius: 10, padding: '10px 13px', marginBottom: 20, fontFamily: "'JetBrains Mono', monospace", fontSize: 13.5, fontWeight: 500, color: 'var(--ink)', outline: 0 }} />

      <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.7px', color: 'var(--ink-soft)', marginBottom: 9 }}>Category</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 13px', background: 'var(--surface-2)', borderRadius: 10, marginBottom: 20, fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
        Utilities <span style={{ color: 'var(--ink-soft)', fontSize: 11 }}>▾</span>
      </div>

      <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.7px', color: 'var(--ink-soft)', marginBottom: 9 }}>Tags</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 22 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)', background: 'color-mix(in srgb, var(--blue) 12%, transparent)', padding: '5px 10px', borderRadius: 8 }}>Memory ✕</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--blue)', background: 'color-mix(in srgb, var(--blue) 12%, transparent)', padding: '5px 10px', borderRadius: 8 }}>Lifecycle ✕</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', border: '1.5px dashed var(--line)', padding: '5px 10px', borderRadius: 8, cursor: 'pointer' }}>+ add</span>
      </div>

      <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.7px', color: 'var(--ink-soft)', marginBottom: 9 }}>Links</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 13px', background: 'var(--surface-2)', borderRadius: 10, fontSize: 13.5, fontWeight: 600 }}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" style={{ flex: 'none' }}><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38v-1.32c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.81.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 014 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
          github.com/Quenty/maid
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 13px', background: 'var(--surface-2)', borderRadius: 10, fontSize: 13.5, fontWeight: 600, color: 'var(--ink-soft)', cursor: 'pointer' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flex: 'none' }}><path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1" strokeLinecap="round" /></svg>
          + add link
        </div>
      </div>
    </aside>
  );
}
