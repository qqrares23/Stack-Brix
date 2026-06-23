interface CalloutProps {
  children: React.ReactNode;
}

export function Callout({ children }: CalloutProps) {
  return (
    <div style={{ display: 'flex', gap: 13, padding: '16px 18px', background: 'color-mix(in srgb, var(--accent) 14%, var(--surface))', border: '1.5px solid color-mix(in srgb, var(--accent) 45%, var(--line))', borderRadius: 14, marginBottom: 32 }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--brand-ink)" strokeWidth="2.2" style={{ flex: 'none', marginTop: 1 }}>
        <path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10c.6.6 1 1.2 1 2h6c0-.8.4-1.4 1-2a6 6 0 00-4-10z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div>
        <div style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: 15, marginBottom: 3 }}>Tip</div>
        <p style={{ fontSize: 14.5, lineHeight: 1.6, color: 'var(--ink)', margin: 0 }}>{children}</p>
      </div>
    </div>
  );
}
