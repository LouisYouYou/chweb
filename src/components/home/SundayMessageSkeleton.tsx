export default function SundayMessageSkeleton() {
  return (
    <section className="py-24 bg-[#fdfaf5] relative overflow-hidden" aria-hidden="true">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mb-10 space-y-3">
          <div className="h-3 w-32 bg-wine-100 rounded animate-pulse" />
          <div className="h-9 w-60 bg-wine-100 rounded animate-pulse" />
        </div>
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-wine-100/60 border border-gray-100 flex flex-col lg:flex-row">
          <div className="lg:w-[52%] bg-wine-100 animate-pulse aspect-video" />
          <div className="flex flex-col justify-center px-8 py-10 lg:py-12 lg:px-12 gap-4">
            <div className="h-3 w-24 bg-wine-100 rounded animate-pulse" />
            <div className="h-8 w-3/4 bg-wine-100 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-wine-100 rounded animate-pulse" />
            <div className="h-4 bg-wine-100 rounded animate-pulse" />
            <div className="h-4 bg-wine-100 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-wine-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
