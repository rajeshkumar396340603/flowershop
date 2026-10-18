import React from 'react';
import { CuratedAesthetic, FloralProduct } from '../types';
import { AESTHETICS, FLORAL_PRODUCTS } from '../data/florals';

interface ExploreScreenProps {
  onSelectAestheticAndHome: (aestheticId: string) => void;
  onOpenProductDetails: (product: FloralProduct) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  onSelectAestheticAndHome,
  onOpenProductDetails,
}) => {
  return (
    <div className="flex flex-col w-full px-4 pb-28 pt-2 space-y-6">
      {/* Editorial Header */}
      <div className="space-y-1.5 pt-1">
        <span className="font-sans text-[10px] font-bold text-[#9a442d] uppercase tracking-widest">
          Editorial Curation · Spring &apos;25
        </span>
        <h1 className="font-serif text-[26px] font-semibold text-[#012d1d] leading-tight">
          The Botanical Atelier Journal
        </h1>
        <p className="font-sans text-[13px] text-[#414844] leading-relaxed">
          Exploring seasonal floral architectures, rare cultivars from Nilgiri micro-climates, and mindful living arrangements.
        </p>
      </div>

      {/* Featured Aesthetics Deep-Dive */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-[18px] font-semibold text-[#012d1d]">
            Curated Aesthetics
          </h2>
          <span className="font-sans text-[11px] text-[#717973]">5 Design Dialects</span>
        </div>

        <div className="space-y-3.5">
          {AESTHETICS.map((aesthetic: CuratedAesthetic) => {
            const sampleProduct = FLORAL_PRODUCTS.find((p) => p.aestheticId === aesthetic.id);
            return (
              <div
                key={aesthetic.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#efeeea] shadow-sm hover:shadow-md transition-all group"
              >
                <div className="relative aspect-[16/9] w-full bg-[#efeeea] overflow-hidden">
                  <img
                    src={aesthetic.image}
                    alt={aesthetic.altText}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex items-end p-4">
                    <div className="text-white space-y-0.5">
                      <span className="font-sans text-[9px] uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full font-bold">
                        {aesthetic.count} Floral Compositions
                      </span>
                      <h3 className="font-serif text-[20px] font-medium leading-snug">
                        {aesthetic.title}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <p className="font-sans text-[12px] text-[#414844] leading-relaxed">
                    {aesthetic.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-[#efeeea]">
                    <span className="text-[11px] text-[#717973] font-medium">
                      Key Stems: {aesthetic.subtitle}
                    </span>
                    <button
                      onClick={() => onSelectAestheticAndHome(aesthetic.id)}
                      className="inline-flex items-center gap-1 font-sans text-[12px] font-semibold text-[#012d1d] hover:text-[#9a442d] transition-colors cursor-pointer"
                    >
                      <span>View Collection</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seasonal Harvest Calendar */}
      <div className="bg-[#f5f3ef] rounded-3xl p-5 border border-[#efeeea] space-y-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#012d1d]">
            calendar_month
          </span>
          <h3 className="font-serif text-[16px] font-semibold text-[#012d1d]">
            Nilgiri &amp; Bangalore Harvest Calendar
          </h3>
        </div>
        <p className="text-[12px] text-[#414844] leading-relaxed">
          Every stem in our atelier is cut strictly within 12 hours of dispatch. Here is what is flourishing in our estate glasshouses this month:
        </p>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {[
            { month: 'March – May', flower: 'Ecuadorian Peonies & Ranunculus', status: 'Peak Harvest' },
            { month: 'Year-Round', flower: 'Hawaiian Hybrid Mokara Orchids', status: 'Constant Bloom' },
            { month: 'April – June', flower: 'Amethyst Hydrangeas & Dahlias', status: 'Fresh Harvest' },
            { month: 'Autumn / Winter', flower: 'Preserved Nordic Ruscus & Grasses', status: 'Everlasting' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-3 rounded-2xl border border-[#efeeea] space-y-1">
              <span className="text-[10px] font-bold text-[#9a442d] uppercase block">
                {item.month}
              </span>
              <h4 className="font-sans text-[12px] font-semibold text-[#012d1d] leading-snug">
                {item.flower}
              </h4>
              <span className="text-[10px] text-[#717973] block">{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
