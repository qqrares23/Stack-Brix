import { useNavigate } from 'react-router-dom';
import type { Category } from '../../../types/library';

interface CategoryFilterProps {
  categories: Category[];
  activeCat: string;
  onSelect: (id: string) => void;
}

export function CategoryFilter({ categories, activeCat, onSelect }: CategoryFilterProps) {
  const navigate = useNavigate();

  return (
    <aside style={{ alignSelf: 'start', position: 'sticky', top: 84 }}>
      <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '.8px', color: 'var(--ink-soft)', margin: '0 0 12px 4px' }}>Categories</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            data-cat-active={String(cat.id === activeCat)}
            onClick={() => onSelect(cat.id)}
            className="hsurf"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1.5px solid transparent', cursor: 'pointer', background: 'transparent', color: 'var(--ink)', fontFamily: "'Plus Jakarta Sans'", fontWeight: 600, fontSize: 14.5, padding: '10px 13px', borderRadius: 11, textAlign: 'left', transition: '.12s' }}
          >
            {cat.label}
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)' }}>{cat.count}</span>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 22, padding: 18, background: 'var(--surface)', border: '1.5px solid var(--line)', borderRadius: 16 }}>
        <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: 16, marginBottom: 6 }}>Got a library?</div>
        <p style={{ fontSize: 13.5, lineHeight: 1.5, color: 'var(--ink-soft)', margin: '0 0 14px' }}>Document it in minutes. It's free, forever.</p>
        <button
          onClick={() => navigate('/editor')}
          style={{ width: '100%', border: 0, cursor: 'pointer', background: 'var(--ink)', color: 'var(--bg)', fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 14.5, padding: 11, borderRadius: 11 }}
        >
          Start writing
        </button>
      </div>
    </aside>
  );
}
