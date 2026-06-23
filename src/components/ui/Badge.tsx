interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  bg?: string;
}

export function Badge({ children, color, bg }: BadgeProps) {
  return (
    <span
      className="badge"
      style={{
        fontSize: 11.5,
        fontWeight: 700,
        padding: '5px 11px',
        borderRadius: 999,
        color: color ?? 'var(--ink-soft)',
        background: bg ?? 'var(--surface-2)',
        border: 'none',
      }}
    >
      {children}
    </span>
  );
}
