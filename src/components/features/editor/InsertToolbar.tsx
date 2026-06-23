import { useNavigate } from 'react-router-dom';
import type { BlockType } from '../../../types/editor';

interface InsertToolbarProps {
  onAdd: (type: BlockType) => void;
}

const TOOL: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 6,
  border: '1.5px solid var(--line)', cursor: 'pointer',
  background: 'var(--surface)', color: 'var(--ink)',
  fontWeight: 600, fontSize: 13, padding: '6px 12px', borderRadius: 9,
};

export function InsertToolbar({ onAdd }: InsertToolbarProps) {
  const navigate = useNavigate();

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 5, display: 'flex', alignItems: 'center', gap: 6, padding: '11px 22px', background: 'color-mix(in srgb, var(--bg) 90%, transparent)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--line)', flexWrap: 'wrap' }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '.6px', marginRight: 4 }}>Insert</span>
      <button onClick={() => onAdd('h2')} className="hbord" style={{ ...TOOL, fontFamily: "'Plus Jakarta Sans'" }}>
        <span style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800 }}>H</span> Heading
      </button>
      <button onClick={() => onAdd('text')} className="hbord" style={{ ...TOOL, fontFamily: "'Plus Jakarta Sans'" }}>¶ Text</button>
      <button onClick={() => onAdd('code')} className="hbord" style={{ ...TOOL, fontFamily: "'JetBrains Mono', monospace" }}>&lt;/&gt; Code</button>
      <button onClick={() => onAdd('callout')} className="hbord" style={{ ...TOOL, fontFamily: "'Plus Jakarta Sans'" }}>💡 Tip</button>
      <div style={{ flex: 1 }} />
      <button onClick={() => navigate('/docs')} className="hbord" style={{ border: '1.5px solid var(--line)', cursor: 'pointer', background: 'var(--surface)', color: 'var(--ink)', fontFamily: "'Plus Jakarta Sans'", fontWeight: 600, fontSize: 13, padding: '6px 14px', borderRadius: 9 }}>
        Preview as reader
      </button>
    </div>
  );
}
