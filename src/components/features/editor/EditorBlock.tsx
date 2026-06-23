import type { Block } from '../../../types/editor';

interface EditorBlockProps {
  block: Block;
  active: boolean;
  onSelect: () => void;
  onChange: (text: string) => void;
  onUp: () => void;
  onDown: () => void;
  onRemove: () => void;
}

export function EditorBlock({ block, active, onSelect, onChange, onUp, onDown, onRemove }: EditorBlockProps) {
  const stop = (fn: () => void) => (e: React.MouseEvent) => { e.stopPropagation(); fn(); };

  return (
    <div onClick={onSelect} data-block-active={String(active)} style={{ position: 'relative', borderRadius: 12, marginBottom: 8, transition: 'box-shadow .12s', padding: 1 }}>
      <span style={{ position: 'absolute', left: -23, top: 13, fontSize: 13, color: 'var(--ink-soft)', opacity: 0.45, cursor: 'grab' }}>⠿</span>

      {active && (
        <div style={{ position: 'absolute', top: -14, right: 8, zIndex: 3, display: 'flex', gap: 2, background: 'var(--surface)', border: '1.5px solid var(--line)', borderRadius: 9, padding: 3, boxShadow: '0 6px 16px -6px var(--shadow)' }}>
          <button onClick={stop(onUp)} aria-label="Move up" className="hsurf" style={{ width: 26, height: 26, border: 0, background: 'transparent', borderRadius: 6, cursor: 'pointer', color: 'var(--ink-soft)', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↑</button>
          <button onClick={stop(onDown)} aria-label="Move down" className="hsurf" style={{ width: 26, height: 26, border: 0, background: 'transparent', borderRadius: 6, cursor: 'pointer', color: 'var(--ink-soft)', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>↓</button>
          <button onClick={stop(onRemove)} aria-label="Delete block" style={{ width: 26, height: 26, border: 0, background: 'transparent', borderRadius: 6, cursor: 'pointer', color: 'var(--brand)', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
      )}

      {block.type === 'h2' && (
        <input value={block.text} onChange={(e) => onChange(e.target.value)} style={{ width: '100%', border: 0, outline: 0, background: 'transparent', fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 24, color: 'var(--ink)', padding: '8px 12px' }} />
      )}

      {block.type === 'text' && (
        <textarea value={block.text} onChange={(e) => onChange(e.target.value)} rows={2} style={{ display: 'block', width: '100%', border: 0, outline: 0, background: 'transparent', fontFamily: "'Plus Jakarta Sans'", fontSize: 15.5, lineHeight: 1.7, color: 'var(--ink)', padding: '8px 12px', resize: 'none', fieldSizing: 'content' as never }} />
      )}

      {block.type === 'code' && (
        <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 14px', background: 'var(--surface-2)' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, fontWeight: 600, color: 'var(--ink-soft)' }}>lua</span>
          </div>
          <textarea value={block.text} onChange={(e) => onChange(e.target.value)} spellCheck={false} rows={3} style={{ display: 'block', width: '100%', border: 0, outline: 0, background: 'var(--code-bg)', color: 'var(--code-ink)', fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 1.7, padding: '14px 16px', resize: 'none', fieldSizing: 'content' as never }} />
        </div>
      )}

      {block.type === 'callout' && (
        <div style={{ display: 'flex', gap: 11, padding: '14px 16px', background: 'color-mix(in srgb, var(--accent) 14%, var(--surface))', border: '1.5px solid color-mix(in srgb, var(--accent) 45%, var(--line))', borderRadius: 12 }}>
          <span style={{ fontSize: 17 }}>💡</span>
          <textarea value={block.text} onChange={(e) => onChange(e.target.value)} rows={2} style={{ flex: 1, border: 0, outline: 0, background: 'transparent', fontFamily: "'Plus Jakarta Sans'", fontSize: 14.5, lineHeight: 1.55, color: 'var(--ink)', resize: 'none', fieldSizing: 'content' as never }} />
        </div>
      )}
    </div>
  );
}
