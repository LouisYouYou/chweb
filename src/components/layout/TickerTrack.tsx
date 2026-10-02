'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';

export interface TickerItem {
  id: string;
  label: string;
  labelColor: string;
  text: string;
  href?: string;
}

interface Props {
  items: TickerItem[];
  sectionLabel: string;
}

export default function TickerTrack({ items, sectionLabel }: Props) {
  const [paused, setPaused] = useState(false);
  const speed = Math.max(18, items.length * 6);

  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div
      className="bg-wine-900 border-b border-wine-800 h-9 flex items-center overflow-hidden select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Static label */}
      <div className="shrink-0 flex items-center gap-2 px-4 h-full border-r border-wine-700 bg-wine-950/40 z-10">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
        </span>
        <span className="text-amber-400 font-bold text-[11px] tracking-[0.15em] uppercase whitespace-nowrap">
          {sectionLabel}
        </span>
      </div>

      {/* Scrolling track */}
      <div className="flex-1 overflow-hidden relative">
        <div
          className="flex items-center gap-0 whitespace-nowrap will-change-transform"
          style={{
            animation: `ticker-scroll ${speed}s linear infinite`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        >
          {doubled.map((item, i) => {
            const content = (
              <span className="inline-flex items-center gap-2 px-6">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.labelColor}`}>
                  {item.label}
                </span>
                <span className="text-white/85 text-xs font-medium">{item.text}</span>
                <span className="text-wine-500 text-[10px] ml-2">◆</span>
              </span>
            );
            return item.href ? (
              <Link key={`${item.id}-${i}`} href={item.href} className="hover:text-amber-300 transition-colors">
                {content}
              </Link>
            ) : (
              <span key={`${item.id}-${i}`}>{content}</span>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
