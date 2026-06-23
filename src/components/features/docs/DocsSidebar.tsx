import type { NavGroup } from '../../../types/navigation';

interface DocsSidebarProps {
  navGroups: NavGroup[];
  activeSection: string;
  onSelect: (id: string) => void;
}

export function DocsSidebar({ navGroups, activeSection, onSelect }: DocsSidebarProps) {
  return (
    <aside style={{ alignSelf: 'start', position: 'sticky', top: 65, height: 'calc(100vh - 65px)', overflowY: 'auto', borderRight: '1px solid var(--line)', padding: '24px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '8px 10px 16px' }}>
        <div style={{ flex: 'none', width: 42, height: 42, borderRadius: 12, background: '#FF4438', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 18, color: '#fff' }}>Md</div>
        <div>
          <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 18, lineHeight: 1 }}>Maid</div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-soft)', fontWeight: 600 }}>by Quenty</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '9px 12px', background: 'var(--surface-2)', borderRadius: 11, cursor: 'pointer', fontSize: 13.5, fontWeight: 700, marginBottom: 18 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>v1.3.0</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)' }}>latest ▾</span>
      </div>

      {navGroups.map((grp) => (
        <div key={grp.title} style={{ marginBottom: 18 }}>
          <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '.9px', color: 'var(--ink-soft)', margin: '0 0 7px 10px' }}>{grp.title}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {grp.items.map((it) => (
              <button
                key={it.id}
                data-nav-active={String(it.id === activeSection)}
                onClick={() => onSelect(it.id)}
                className="hnav"
                style={{ border: 0, cursor: 'pointer', background: 'transparent', color: 'var(--ink-soft)', fontFamily: "'Plus Jakarta Sans'", fontWeight: 600, fontSize: 14, padding: '8px 12px', borderRadius: 9, textAlign: 'left', transition: '.12s' }}
              >
                {it.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
