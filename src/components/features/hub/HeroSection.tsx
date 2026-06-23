const POPULAR_TAGS = ['Frameworks', 'Networking', 'DataStore', 'UI', 'Promises', 'ECS'];

interface HeroSectionProps {
  search: string;
  onSearch: (v: string) => void;
}

export function HeroSection({ search, onSearch }: HeroSectionProps) {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', padding: '64px 28px 52px', background: 'var(--surface)', borderBottom: '1px solid var(--line)' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(var(--line) 1.4px, transparent 1.4px)', backgroundSize: '24px 24px', opacity: 0.6, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: -40, right: '7%', opacity: 0.9, animation: 'sb-float 6s ease-in-out infinite' }}>
        <svg width="120" height="120" viewBox="0 0 36 36" fill="none">
          <rect x="9.5" y="17" width="21" height="12" rx="3.6" fill="var(--brand)" opacity=".18" />
          <rect x="7" y="6" width="19" height="9" rx="3" fill="var(--accent)" opacity=".22" />
        </svg>
      </div>

      <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'var(--surface-2)', borderRadius: 999, fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 22 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)' }} />
          Free forever · Open source · 128 libraries documented
        </div>

        <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 'clamp(38px,6vw,62px)', lineHeight: 1.04, letterSpacing: '-1.2px', margin: '0 0 16px' }}>
          Docs that click<br />right into place.
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.55, color: 'var(--ink-soft)', margin: '0 auto 30px', maxWidth: 560 }}>
          Publish beautiful documentation for your Roblox libraries — headers, chapters, code samples and a full API reference. Discover what the community is building.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, maxWidth: 560, margin: '0 auto', padding: '7px 7px 7px 18px', background: 'var(--bg)', border: '2px solid var(--line)', borderRadius: 16, boxShadow: '0 10px 30px -16px var(--shadow)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ink-soft)" strokeWidth="2.2" style={{ flex: 'none' }}>
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" strokeLinecap="round" />
          </svg>
          <input
            className="finp"
            placeholder="Search libraries, functions, authors…"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            style={{ flex: 1, border: 0, outline: 0, background: 'transparent', fontFamily: "'Plus Jakarta Sans'", fontSize: 16, color: 'var(--ink)', padding: '8px 0' }}
          />
          <button style={{ border: 0, cursor: 'pointer', background: 'var(--brand)', color: '#fff', fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 15, padding: '11px 22px', borderRadius: 11 }}>Search</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8, marginTop: 18 }}>
          {POPULAR_TAGS.map((tag) => (
            <span key={tag} className="hink" style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', background: 'var(--surface-2)', padding: '6px 13px', borderRadius: 999, cursor: 'pointer' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
