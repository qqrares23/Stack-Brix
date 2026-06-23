import type { PageGroup } from '../../../types/navigation';

interface PageTreeSidebarProps {
  pageGroups?: PageGroup[];
}

// `pageGroups` will be populated from Appwrite once a library doc is loaded.
// See developer_docs.md → "Editor / PageTreeSidebar" for the query shape.
export function PageTreeSidebar({ pageGroups = [] }: PageTreeSidebarProps) {
  return (
    <aside style={{ borderRight: '1px solid var(--line)', overflowY: 'auto', padding: '20px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 8px 14px' }}>
        <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '.8px', color: 'var(--ink-soft)' }}>Pages</span>
        <button className="hbord" style={{ width: 26, height: 26, border: '1.5px solid var(--line)', background: 'var(--surface)', borderRadius: 8, cursor: 'pointer', color: 'var(--ink)', fontSize: 16, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
      </div>

      {pageGroups.length === 0 ? (
        <div style={{ padding: '18px 10px', textAlign: 'center', color: 'var(--ink-soft)', fontSize: 13 }}>
          No pages yet. Start by adding a block above.
        </div>
      ) : (
        pageGroups.map((grp) => (
          <div key={grp.title} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.7px', color: 'var(--ink-soft)', margin: '0 8px 6px' }}>{grp.title}</div>
            {grp.items.map((pg) => (
              <div key={pg.id} className="hnav" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ink-soft)', fontWeight: 600, fontSize: 14, padding: '7px 10px', borderRadius: 9, cursor: 'pointer' }}>
                <svg width="9" height="14" viewBox="0 0 6 14" fill="currentColor" style={{ opacity: 0.35, flex: 'none' }}>
                  <circle cx="1.5" cy="2" r="1.3" /><circle cx="4.5" cy="2" r="1.3" />
                  <circle cx="1.5" cy="7" r="1.3" /><circle cx="4.5" cy="7" r="1.3" />
                  <circle cx="1.5" cy="12" r="1.3" /><circle cx="4.5" cy="12" r="1.3" />
                </svg>
                {pg.label}
              </div>
            ))}
          </div>
        ))
      )}
    </aside>
  );
}
