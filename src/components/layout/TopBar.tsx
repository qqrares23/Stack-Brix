import { useNavigate, useLocation } from 'react-router-dom';
import { BrixMark } from '../ui/BrixMark';
import type { Theme } from '../../types/theme';

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

const SEG_STYLE: React.CSSProperties = {
  border: 0,
  cursor: 'pointer',
  background: 'transparent',
  color: 'var(--ink-soft)',
  fontFamily: "'Plus Jakarta Sans'",
  fontWeight: 600,
  fontSize: 14,
  padding: '7px 15px',
  borderRadius: 9,
  transition: '.15s',
};

interface TopBarProps {
  theme: Theme;
  toggleTheme: () => void;
  isAdmin: boolean;
  isLoggedIn: boolean;
}

export function TopBar({ theme, toggleTheme, isAdmin, isLoggedIn }: TopBarProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isDark = theme === 'stackbrix-dark';

  const seg = (path: string) => (pathname === path ? 'true' : 'false');

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, display: 'flex', alignItems: 'center', gap: 16, padding: '13px 26px', background: 'color-mix(in srgb, var(--bg) 86%, transparent)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--line)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer' }} onClick={() => navigate('/')}>
        <BrixMark />
        <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 22, letterSpacing: '-.3px' }}>
          Stack<span style={{ color: 'var(--brand)' }}>Brix</span>
        </span>
      </div>

      <nav style={{ display: 'flex', gap: 4, marginLeft: 6, padding: 5, background: 'var(--surface-2)', borderRadius: 13 }}>
        <button data-seg-active={seg('/')} onClick={() => navigate('/')} style={SEG_STYLE}>Explore</button>
        <button data-seg-active={seg('/docs')} onClick={() => navigate('/docs')} style={SEG_STYLE}>Read docs</button>
        <button data-seg-active={seg('/editor')} onClick={() => navigate('/editor')} style={SEG_STYLE}>Write</button>
      </nav>

      <div style={{ flex: 1 }} />

      <a href="#" aria-label="GitHub repository" className="hbord" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, textDecoration: 'none', color: 'var(--ink)', border: '1.5px solid var(--line)', borderRadius: 11 }}>
        <GitHubIcon />
      </a>

      {isAdmin && (
        <button
          onClick={() => navigate('/admin')}
          data-seg-active={seg('/admin')}
          className="hbord"
          style={{ display: 'flex', alignItems: 'center', gap: 7, border: '1.5px solid var(--line)', cursor: 'pointer', background: 'var(--surface)', color: 'var(--ink)', fontFamily: "'Plus Jakarta Sans'", fontWeight: 600, fontSize: 13.5, padding: '8px 13px', borderRadius: 10 }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5z" strokeLinejoin="round" />
            <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Admin
        </button>
      )}

      {!isLoggedIn ? (
        <button
          onClick={() => navigate('/login')}
          style={{ border: 0, cursor: 'pointer', background: 'var(--ink)', color: 'var(--bg)', fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 14, padding: '9px 18px', borderRadius: 10 }}
        >
          Sign in
        </button>
      ) : (
        <button
          onClick={() => navigate('/editor')}
          className="hbord"
          style={{ display: 'flex', alignItems: 'center', gap: 7, border: '1.5px solid var(--line)', cursor: 'pointer', background: 'var(--surface)', color: 'var(--ink)', fontFamily: "'Plus Jakarta Sans'", fontWeight: 600, fontSize: 13.5, padding: '8px 13px', borderRadius: 10 }}
        >
          My docs
        </button>
      )}

      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="hbord"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, border: '1.5px solid var(--line)', background: 'var(--surface)', borderRadius: 11, cursor: 'pointer', color: 'var(--ink)' }}
      >
        {isDark ? (
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="4.5" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 14.5A8 8 0 019.5 4 7 7 0 1020 14.5z" />
          </svg>
        )}
      </button>
    </header>
  );
}
