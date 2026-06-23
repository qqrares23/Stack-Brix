import { useNavigate } from 'react-router-dom';
import { Avatar } from '../../ui/Avatar';
import type { Library } from '../../../types/library';

function StarIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--accent)"><path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" /></svg>;
}
function InstallIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 3v12M7 11l5 5 5-5M5 21h14" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

interface LibraryCardProps {
  lib: Library;
}

export function LibraryCard({ lib }: LibraryCardProps) {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate('/docs')}
      className="hcard card"
      style={{ position: 'relative', overflow: 'hidden', background: 'var(--surface)', border: '1.5px solid var(--line)', borderRadius: 18, padding: 20, cursor: 'pointer' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 13 }}>
        <Avatar initials={lib.initials} color={lib.color} size={50} radius={14} fontSize={20} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 18, lineHeight: 1.1 }}>{lib.name}</div>
          <div style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 600 }}>by {lib.author}</div>
        </div>
      </div>

      <p style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--ink-soft)', margin: '0 0 14px', minHeight: 42 }}>{lib.desc}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 15 }}>
        {lib.tags.map((tag) => (
          <span key={tag} style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--blue)', background: 'color-mix(in srgb, var(--blue) 12%, transparent)', padding: '4px 9px', borderRadius: 7 }}>
            {tag}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingTop: 13, borderTop: '1px solid var(--line-soft)', fontSize: 13, fontWeight: 600, color: 'var(--ink-soft)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><StarIcon />{lib.stars}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><InstallIcon />{lib.installs}</span>
        <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, fontWeight: 500, color: 'var(--ink)', background: 'var(--surface-2)', padding: '3px 8px', borderRadius: 6 }}>{lib.version}</span>
      </div>
    </article>
  );
}
