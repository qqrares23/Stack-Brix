export function DocsToc() {
  return (
    <aside style={{ alignSelf: 'start', position: 'sticky', top: 65, height: 'calc(100vh - 65px)', padding: '34px 22px 0' }}>
      <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '.9px', color: 'var(--ink-soft)', marginBottom: 12 }}>On this page</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, borderLeft: '1.5px solid var(--line)', paddingLeft: 14, marginBottom: 26 }}>
        <a href="#install" style={{ textDecoration: 'none', fontSize: 13.5, fontWeight: 700, color: 'var(--brand)' }}>Installation</a>
        <a href="#usage" className="hink" style={{ textDecoration: 'none', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-soft)' }}>Basic usage</a>
        <a href="#api" className="hink" style={{ textDecoration: 'none', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-soft)' }}>API reference</a>
      </div>
      <a href="#" className="hink" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', padding: '9px 0' }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Edit on GitHub
      </a>
    </aside>
  );
}
