'use client';

import { useEffect, useRef, useState } from 'react';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function FadeIn({ children, delay = 0, className = '' }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  // F-03: start mounted=false so SSR/no-JS renders content visible (opacity-100)
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [delay]);

  // F-01: transition-all → transition-[opacity,transform]
  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-700 ease-out ${
        mounted && !visible
          ? 'opacity-0 translate-y-7 will-change-transform'
          : 'opacity-100 translate-y-0'
      } ${className}`}
    >
      {children}
    </div>
  );
}
