export default function SermonsSkeleton() {
  return (
    <section className="py-24 dark-section relative overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '32px 32px' }}
      />
      <div className="absolute top-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full block h-14">
          <path d="M0,0 L1440,0 C1080,56 360,56 0,0 Z" fill="#fdfaf5"/>
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 56" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full block h-14">
          <path d="M0,56 L1440,56 C1080,0 360,0 0,56 Z" fill="#fdfaf5"/>
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
          <div className="space-y-3">
            <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
            <div className="h-8 w-52 bg-white/10 rounded animate-pulse" />
            <div className="h-4 w-40 bg-white/10 rounded animate-pulse" />
          </div>
          <div className="h-9 w-40 bg-white/10 rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-white/5">
              <div className="aspect-video bg-white/10 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-white/10 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-white/10 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
