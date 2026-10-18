import React from 'react';
import { CuratedAesthetic } from '../types';
import { AESTHETICS } from '../data/florals';

interface AestheticsRibbonProps {
  selectedAesthetic: string | null;
  onSelectAesthetic: (aestheticId: string | null) => void;
}

export const AestheticsRibbon: React.FC<AestheticsRibbonProps> = ({
  selectedAesthetic,
  onSelectAesthetic,
}) => {
  return (
    <section className="flex flex-col w-full space-y-2.5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-[18px] font-semibold text-[#012d1d]">
          Curated Aesthetics
        </h2>
        <span className="font-sans text-[10px] font-bold text-[#9a442d] uppercase tracking-wider">
          Spring &apos;25
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-4 px-4 py-1">
        {AESTHETICS.map((aesthetic: CuratedAesthetic) => {
          const isSelected = selectedAesthetic === aesthetic.id;
          return (
            <div
              key={aesthetic.id}
              onClick={() => onSelectAesthetic(isSelected ? null : aesthetic.id)}
              className="flex-shrink-0 w-32 flex flex-col space-y-1.5 cursor-pointer group select-none"
            >
              <div
                className={`relative w-32 h-40 rounded-2xl overflow-hidden bg-[#efeeea] shadow-sm transition-all duration-300 ${
                  isSelected
                    ? 'ring-3 ring-[#012d1d] shadow-md scale-[1.02]'
                    : 'group-hover:shadow-md group-hover:scale-[1.01]'
                }`}
              >
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={aesthetic.image}
                  alt={aesthetic.altText}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#012d1d]/85 via-black/10 to-transparent flex items-end p-2.5">
                  <span className="font-serif text-[13px] leading-tight text-white font-medium">
                    {aesthetic.title}
                  </span>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#012d1d] text-white flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                  </div>
                )}
              </div>
              <span
                className={`font-sans text-[10px] text-center transition-colors ${
                  isSelected ? 'text-[#012d1d] font-bold' : 'text-[#717973]'
                }`}
              >
                {isSelected ? 'Filtered' : `${aesthetic.count} Arrangements`}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
