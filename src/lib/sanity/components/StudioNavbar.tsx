/* eslint-disable @typescript-eslint/no-explicit-any */
export function StudioNavbar(props: any) {
  return (
    <div>
      {props.renderDefault(props)}
      <div
        style={{
          background: 'linear-gradient(135deg, #fdf3f4 0%, #fbe5e8 100%)',
          borderBottom: '1px solid #f6c8cd',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <span style={{ fontSize: 20 }}>📖</span>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#380a14' }}>
            歡迎使用每日經文後台！
          </p>
          <p style={{ margin: 0, fontSize: 12, color: '#92202f' }}>
            點左側「Daily Scripture」→ 右上「Create」→ 選日期、上傳圖片 → 按「Publish」即完成發布
          </p>
        </div>
      </div>
    </div>
  )
}
