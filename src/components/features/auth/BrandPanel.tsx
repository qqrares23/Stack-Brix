import { BrixMark } from '../../ui/BrixMark';

interface BrandPanelProps {
  variant: 'login' | 'register';
}

export function BrandPanel({ variant }: BrandPanelProps) {
  if (variant === 'login') {
    return (
      <div style={{ position: 'relative', padding: '46px 40px', background: 'linear-gradient(155deg, var(--brand), #C8261C)', color: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: -24, right: -16, opacity: 0.22 }}>
          <svg width="180" height="180" viewBox="0 0 36 36" fill="none">
            <rect x="9.5" y="17" width="21" height="12" rx="3.6" fill="#fff" />
            <rect x="7" y="6" width="19" height="9" rx="3" fill="#fff" />
          </svg>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 'auto' }}>
          <BrixMark size={30} variant="mono" />
          <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 20 }}>StackBrix</span>
        </div>
        <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 32, lineHeight: 1.1, margin: '32px 0 12px' }}>Welcome back, builder.</h2>
        <p style={{ fontSize: 15, lineHeight: 1.6, opacity: 0.92, margin: '0 0 24px' }}>Pick up where you left off and keep your library docs sharp.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
          {['Unlimited libraries & versions', 'Free & open source, forever', 'Sync straight from GitHub'].map((t) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 600 }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,.22)' }}>✓</span>
              {t}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', padding: '46px 40px', background: 'linear-gradient(155deg, #1B1D24, #2A2D3C)', color: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: -24, right: -16, opacity: 0.18 }}>
        <svg width="180" height="180" viewBox="0 0 36 36" fill="none">
          <rect x="9.5" y="17" width="21" height="12" rx="3.6" fill="var(--accent)" />
          <rect x="7" y="6" width="19" height="9" rx="3" fill="var(--brand)" />
        </svg>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 'auto' }}>
        <BrixMark size={30} />
        <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 20 }}>StackBrix</span>
      </div>
      <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 32, lineHeight: 1.1, margin: '32px 0 12px' }}>Ship docs the<br />community loves.</h2>
      <p style={{ fontSize: 15, lineHeight: 1.6, opacity: 0.85, margin: '0 0 24px' }}>Join thousands of Roblox developers documenting their libraries in one friendly home.</p>
      <div style={{ display: 'flex', gap: 22 }}>
        {[['128', 'libraries'], ['2.4k', 'authors'], ['$0', 'forever']].map(([n, l]) => (
          <div key={l}>
            <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 26, color: 'var(--accent)' }}>{n}</div>
            <div style={{ fontSize: 12.5, opacity: 0.7, fontWeight: 600 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
