import { BrandPanel } from '../components/features/auth/BrandPanel';
import { LoginForm } from '../components/features/auth/LoginForm';

export default function LoginPage() {
  return (
    <main style={{ minHeight: 'calc(100vh - 65px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '44px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(var(--line) 1.4px, transparent 1.4px)', backgroundSize: '24px 24px', opacity: 0.5, pointerEvents: 'none' }} />
      <div style={{ position: 'relative', width: '100%', maxWidth: 940, display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--surface)', border: '1.5px solid var(--line)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 30px 60px -30px var(--shadow)' }}>
        <BrandPanel variant="login" />
        <LoginForm />
      </div>
    </main>
  );
}
