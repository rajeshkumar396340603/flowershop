import React from 'react';
import { FilterState } from '../types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onUpdateFilters: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  matchingCount: number;
}

const FLOWER_OPTIONS = [
  'Roses',
  'Lilies',
  'Ranunculus',
  'Hydrangea',
  'Marigolds & Dahlias',
  'Orchids',
  'Preserved Botanicals',
];

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onUpdateFilters,
  onResetFilters,
  matchingCount,
}) => {
  if (!isOpen) return null;

  const toggleFlower = (flower: string) => {
    const exists = filters.flowerTypes.includes(flower);
    const updated = exists
      ? filters.flowerTypes.filter((f) => f !== flower)
      : [...filters.flowerTypes, flower];
    onUpdateFilters({ ...filters, flowerTypes: updated });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#fbf9f5] rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl flex flex-col border border-[#efeeea]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[#fbf9f5]/95 backdrop-blur-md border-b border-[#efeeea]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#012d1d]">tune</span>
            <h2 className="font-serif text-[17px] font-semibold text-[#012d1d]">
              Filter Floral Atelier
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-[#012d1d] flex items-center justify-center hover:bg-[#efeeea] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Filter Sections */}
        <div className="p-5 space-y-6">
          {/* Price Range Filter */}
          <div className="space-y-3">
            <label className="font-serif text-[14px] font-semibold text-[#012d1d] block">
              Budget &amp; Price Ceiling
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'All Prices', val: null },
                { label: 'Under ₹1,500', val: 1500 },
                { label: 'Under ₹2,500', val: 2500 },
                { label: 'Under ₹3,500', val: 3500 },
              ].map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => onUpdateFilters({ ...filters, maxPrice: opt.val })}
                  className={`py-2.5 px-3 rounded-xl text-left text-[12px] font-sans font-medium transition-all border cursor-pointer ${
                    filters.maxPrice === opt.val
                      ? 'bg-[#012d1d] text-white border-[#012d1d] shadow-sm'
                      : 'bg-white text-[#012d1d] border-[#efeeea] hover:bg-[#f5f3ef]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Speed Filter */}
          <div className="space-y-3">
            <label className="font-serif text-[14px] font-semibold text-[#012d1d] block">
              Fulfillment Speed
            </label>
            <button
              type="button"
              onClick={() => onUpdateFilters({ ...filters, sameDayOnly: !filters.sameDayOnly })}
              className={`w-full p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                filters.sameDayOnly
                  ? 'bg-[#c1ecd4] border-[#86af99] text-[#002114]'
                  : 'bg-white border-[#efeeea] text-[#012d1d]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-[#012d1d] material-symbols-filled">
                  bolt
                </span>
                <div className="text-left">
                  <span className="font-sans text-[13px] font-semibold block leading-tight">
                    Same-Day Bengaluru Delivery
                  </span>
                  <span className="text-[11px] opacity-75">
                    Orders placed before 4:00 PM
                  </span>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                  filters.sameDayOnly
                    ? 'bg-[#012d1d] border-[#012d1d] text-white'
                    : 'border-[#c1c8c2] bg-white'
                }`}
              >
                {filters.sameDayOnly && (
                  <span className="material-symbols-outlined text-[13px]">check</span>
                )}
              </div>
            </button>
          </div>

          {/* Flower Species Varieties */}
          <div className="space-y-3">
            <label className="font-serif text-[14px] font-semibold text-[#012d1d] block">
              Flower Varieties &amp; Flora
            </label>
            <div className="flex flex-wrap gap-2">
              {FLOWER_OPTIONS.map((flower) => {
                const isSelected = filters.flowerTypes.includes(flower);
                return (
                  <button
                    key={flower}
                    type="button"
                    onClick={() => toggleFlower(flower)}
                    className={`py-1.5 px-3 rounded-full text-[12px] font-sans transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-[#012d1d] text-white border-[#012d1d] shadow-sm font-semibold'
                        : 'bg-white text-[#414844] border-[#efeeea] hover:bg-[#f5f3ef]'
                    }`}
                  >
                    {flower}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 p-4 bg-white/95 backdrop-blur-md border-t border-[#efeeea] flex items-center gap-3">
          <button
            type="button"
            onClick={onResetFilters}
            className="py-3 px-4 rounded-full font-sans text-[12px] font-semibold text-[#9a442d] hover:bg-[#ffdbd2]/40 transition-colors cursor-pointer"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-full bg-[#012d1d] text-white font-sans text-[13px] font-semibold hover:bg-[#1b4332] active:scale-98 transition-all shadow-sm cursor-pointer"
          >
            Show {matchingCount} Arrangements
          </button>
        </div>
      </div>
    </div>
  );
};
