interface AvatarProps {
  initials: string;
  color: string;
  size?: number;
  radius?: number;
  fontSize?: number;
}

export function Avatar({ initials, color, size = 50, radius = 14, fontSize = 20 }: AvatarProps) {
  return (
    <div
      style={{
        position: 'relative',
        flex: 'none',
        width: size,
        height: size,
        borderRadius: radius,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Baloo 2', cursive",
        fontWeight: 800,
        fontSize,
        color: '#fff',
        background: color,
        boxShadow: `0 6px 14px -6px ${color}`,
      }}
    >
      <span style={{ position: 'absolute', top: 5, left: 9, width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,.55)' }} />
      <span style={{ position: 'absolute', top: 5, left: 18, width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,.55)' }} />
      {initials}
    </div>
  );
}
