interface CodeBlockProps {
  lang: string;
  children: React.ReactNode;
}

export function CodeBlock({ lang, children }: CodeBlockProps) {
  return (
    <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--line)', marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 15px', background: 'var(--surface-2)', borderBottom: '1px solid var(--line)' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)' }}>{lang}</span>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-soft)', cursor: 'pointer' }}>Copy</span>
      </div>
      <pre style={{ margin: 0, padding: '16px 18px', background: 'var(--code-bg)', color: 'var(--code-ink)', fontFamily: "'JetBrains Mono', monospace", fontSize: 13.5, lineHeight: 1.75, overflowX: 'auto' }}>
        {children}
      </pre>
    </div>
  );
}

export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13.5, background: 'var(--surface-2)', padding: '2px 7px', borderRadius: 6, color: 'var(--brand-ink)' }}>
      {children}
    </span>
  );
}
