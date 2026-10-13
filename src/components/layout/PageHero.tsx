import Image from 'next/image';

interface PageHeroProps {
  title: string;
  subtitle?: string;
}

export default function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        minHeight: 'calc(13rem + 6.5rem)',
        marginTop: '-6.5rem',
        paddingTop: '6.5rem',
      }}
    >
      <Image
        src="/church.jpg"
        alt=""
        fill
        className="object-cover object-center scale-105"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-br from-wine-950/95 via-wine-900/85 to-wine-800/75" />
      <div className="absolute inset-0 bg-gradient-to-t from-wine-950/50 via-transparent to-wine-950/20" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-wine-200 text-base sm:text-lg mt-3 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
        <div className="w-16 h-0.5 bg-amber-400 mx-auto mt-5 rounded-full" />
      </div>
    </section>
  );
}
