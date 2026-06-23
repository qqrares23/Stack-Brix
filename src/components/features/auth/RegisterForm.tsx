import { useNavigate } from 'react-router-dom';

const FIELD: React.CSSProperties = { width: '100%', border: '1.5px solid var(--line)', background: 'var(--bg)', borderRadius: 11, padding: '11px 13px', fontFamily: "'Plus Jakarta Sans'", fontSize: 14.5, color: 'var(--ink)', outline: 0 };
const LABEL: React.CSSProperties = { fontSize: 12.5, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 6, display: 'block' };

export function RegisterForm() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '38px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 28, margin: '0 0 6px' }}>Create your account</h1>
      <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', margin: '0 0 22px' }}>
        Already have one? <span onClick={() => navigate('/login')} style={{ color: 'var(--brand)', fontWeight: 700, cursor: 'pointer' }}>Log in</span>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div>
          <label style={LABEL}>Username</label>
          <input placeholder="brickmaster" className="finp" style={FIELD} />
        </div>
        <div>
          <label style={LABEL}>Roblox name</label>
          <input placeholder="optional" className="finp" style={FIELD} />
        </div>
      </div>

      <label style={LABEL}>Email</label>
      <input type="email" placeholder="you@studio.dev" className="finp" style={{ ...FIELD, marginBottom: 14 }} />

      <label style={LABEL}>Password</label>
      <input type="password" placeholder="At least 8 characters" className="finp" style={{ ...FIELD, marginBottom: 16 }} />

      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', cursor: 'pointer', marginBottom: 20, lineHeight: 1.45 }}>
        <input type="checkbox" style={{ accentColor: 'var(--brand)', width: 15, height: 15, marginTop: 2, flex: 'none' }} />
        I'll keep my docs accurate, friendly, and free of spam.
      </label>

      <button onClick={() => navigate('/editor')} style={{ width: '100%', border: 0, cursor: 'pointer', background: 'var(--brand)', color: '#fff', fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 15.5, padding: 13, borderRadius: 12, marginBottom: 16, boxShadow: '0 8px 18px -8px var(--brand)' }}>
        Create account
      </button>

      <button onClick={() => navigate('/editor')} className="hbord" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, border: '1.5px solid var(--line)', cursor: 'pointer', background: 'var(--surface)', color: 'var(--ink)', fontFamily: "'Plus Jakarta Sans'", fontWeight: 600, fontSize: 13.5, padding: 11, borderRadius: 11 }}>
        <svg width="17" height="17" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38v-1.32c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.81.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 014 0c1.53-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
        Sign up with GitHub
      </button>
    </div>
  );
}
