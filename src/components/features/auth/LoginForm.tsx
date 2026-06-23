import { useNavigate } from 'react-router-dom';

function GitHubIcon() {
  return <svg width="17" height="17" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38v-1.32c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.81.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 014 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>;
}

const FIELD: React.CSSProperties = { width: '100%', border: '1.5px solid var(--line)', background: 'var(--bg)', borderRadius: 11, padding: '12px 14px', fontFamily: "'Plus Jakarta Sans'", fontSize: 15, color: 'var(--ink)', outline: 0 };
const LABEL: React.CSSProperties = { fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 6, display: 'block' };

export function LoginForm() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '44px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 28, margin: '0 0 6px' }}>Log in</h1>
      <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', margin: '0 0 26px' }}>
        New here? <span onClick={() => navigate('/register')} style={{ color: 'var(--brand)', fontWeight: 700, cursor: 'pointer' }}>Create an account</span>
      </p>

      <label style={LABEL}>Email</label>
      <input type="email" placeholder="you@studio.dev" className="finp" style={{ ...FIELD, marginBottom: 16 }} />

      <label style={LABEL}>Password</label>
      <input type="password" placeholder="••••••••" className="finp" style={{ ...FIELD, marginBottom: 12 }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)', cursor: 'pointer' }}>
          <input type="checkbox" style={{ accentColor: 'var(--brand)', width: 15, height: 15 }} /> Remember me
        </label>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--brand)', cursor: 'pointer' }}>Forgot password?</span>
      </div>

      <button onClick={() => navigate('/')} style={{ width: '100%', border: 0, cursor: 'pointer', background: 'var(--brand)', color: '#fff', fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 15.5, padding: 13, borderRadius: 12, marginBottom: 18, boxShadow: '0 8px 18px -8px var(--brand)' }}>
        Log in
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)' }}>or continue with</span>
        <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => navigate('/')} className="hbord" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: '1.5px solid var(--line)', cursor: 'pointer', background: 'var(--surface)', color: 'var(--ink)', fontFamily: "'Plus Jakarta Sans'", fontWeight: 600, fontSize: 13.5, padding: 11, borderRadius: 11 }}>
          <GitHubIcon /> GitHub
        </button>
        <button onClick={() => navigate('/')} className="hbord" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: '1.5px solid var(--line)', cursor: 'pointer', background: 'var(--surface)', color: 'var(--ink)', fontFamily: "'Plus Jakarta Sans'", fontWeight: 600, fontSize: 13.5, padding: 11, borderRadius: 11 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="4" transform="rotate(12 12 12)" /></svg> Roblox
        </button>
      </div>
    </div>
  );
}
