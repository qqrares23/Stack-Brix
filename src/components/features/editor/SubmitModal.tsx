import { useNavigate } from 'react-router-dom';

interface SubmitModalProps {
  onClose: () => void;
}

export function SubmitModal({ onClose }: SubmitModalProps) {
  const navigate = useNavigate();

  const goToAdmin = () => { onClose(); navigate('/admin'); };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,12,20,.55)', backdropFilter: 'blur(4px)', padding: 24 }}>
      <div
        className="modal-box"
        style={{ maxWidth: 460, width: '100%', background: 'var(--surface)', border: '1.5px solid var(--line)', borderRadius: 22, padding: '38px 34px', textAlign: 'center', boxShadow: '0 30px 70px -20px rgba(0,0,0,.45)', animation: 'sb-pop .3s both' }}
      >
        <div style={{ width: 66, height: 66, borderRadius: '50%', background: 'color-mix(in srgb, var(--green) 16%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.6">
            <path d="M5 12.5l4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 26, margin: '0 0 8px' }}>Submitted for review!</h2>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--ink-soft)', margin: '0 0 26px' }}>
          Your docs for <strong style={{ color: 'var(--ink)' }}>Maid v1.3.1</strong> are in the moderation queue. A StackBrix moderator will approve them shortly — you'll get a notification.
        </p>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={goToAdmin} style={{ flex: 1, border: 0, cursor: 'pointer', background: 'var(--brand)', color: '#fff', fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 14.5, padding: 12, borderRadius: 11 }}>
            View review queue
          </button>
          <button onClick={onClose} className="hbords" style={{ flex: 1, border: '1.5px solid var(--line)', cursor: 'pointer', background: 'transparent', color: 'var(--ink)', fontFamily: "'Plus Jakarta Sans'", fontWeight: 600, fontSize: 14.5, padding: 12, borderRadius: 11 }}>
            Keep editing
          </button>
        </div>
      </div>
    </div>
  );
}
