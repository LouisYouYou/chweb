export default function EventsSkeleton() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#fdfaf5] to-white relative overflow-hidden" aria-hidden="true">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-4">
          <div className="space-y-3">
            <div className="h-3 w-20 bg-wine-100 rounded animate-pulse" />
            <div className="h-8 w-48 bg-wine-100 rounded animate-pulse" />
          </div>
          <div className="h-9 w-36 bg-wine-100 rounded-full animate-pulse" />
        </div>
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 bg-wine-50 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );
}
