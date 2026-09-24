export function StudioLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px' }}>
      <img
        src="/logo.png"
        alt="榮耀堂"
        style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid #e2707d', objectFit: 'cover' }}
      />
      <div>
        <div style={{ fontWeight: 800, fontSize: 13, color: '#380a14', lineHeight: 1.3 }}>
          行道會南勢角榮耀堂
        </div>
        <div style={{ fontSize: 11, color: '#92202f', lineHeight: 1.3 }}>
          每日經文管理後台
        </div>
      </div>
    </div>
  )
}
