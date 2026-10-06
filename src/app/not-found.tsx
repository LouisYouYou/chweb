import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-wine-950 flex flex-col items-center justify-center px-4 text-center">
      <div className="church-gradient w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-wine-900/50">
        <span className="text-white text-3xl select-none">✝</span>
      </div>

      <p className="text-amber-400 text-xs tracking-[0.3em] uppercase font-bold mb-4">404</p>
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">找不到這個頁面</h1>
      <p className="text-wine-300 text-sm sm:text-base mb-2 max-w-xs leading-relaxed">
        您所尋找的頁面不存在，可能已移除或輸入了錯誤的網址。
      </p>
      <p className="text-wine-500 text-xs mb-10">Page not found — please check the URL.</p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/zh-TW"
          className="inline-flex items-center gap-2 px-7 py-3 bg-amber-400 hover:bg-amber-300 text-wine-900 font-bold rounded-full text-sm transition-all shadow-lg shadow-amber-400/20"
        >
          回到首頁
        </Link>
        <Link
          href="/zh-TW/contact"
          className="inline-flex items-center gap-2 px-7 py-3 bg-wine-800 hover:bg-wine-700 text-wine-200 font-semibold rounded-full text-sm transition-all border border-wine-700"
        >
          聯絡我們
        </Link>
      </div>
    </div>
  );
}
