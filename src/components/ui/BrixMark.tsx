interface BrixMarkProps {
  size?: number;
  variant?: 'default' | 'mono';
}

export function BrixMark({ size = 36, variant = 'default' }: BrixMarkProps) {
  const top = variant === 'mono' ? '#fff' : 'var(--accent)';
  const bot = variant === 'mono' ? '#fff' : 'var(--brand)';
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" style={{ flex: 'none' }}>
      <rect x="7" y="6" width="19" height="9" rx="3" fill={top} opacity={variant === 'mono' ? 0.85 : 1} />
      <circle cx="12.5" cy="6" r="2.2" fill={top} />
      <circle cx="20.5" cy="6" r="2.2" fill={top} />
      <rect x="9.5" y="17" width="21" height="12" rx="3.6" fill={bot} />
      <circle cx="15.5" cy="17" r="2.7" fill={bot} />
      <circle cx="24.5" cy="17" r="2.7" fill={bot} />
    </svg>
  );
}
