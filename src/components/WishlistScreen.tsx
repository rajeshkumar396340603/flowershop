import React from 'react';
import { FloralProduct } from '../types';

interface WishlistScreenProps {
  wishlistItems: FloralProduct[];
  onToggleWishlist: (product: FloralProduct) => void;
  onAddToCart: (product: FloralProduct) => void;
  onOpenDetails: (product: FloralProduct) => void;
  onNavigateHome: () => void;
}

export const WishlistScreen: React.FC<WishlistScreenProps> = ({
  wishlistItems,
  onToggleWishlist,
  onAddToCart,
  onOpenDetails,
  onNavigateHome,
}) => {
  return (
    <div className="flex flex-col w-full px-4 pb-28 pt-2 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="font-serif text-[22px] font-semibold text-[#012d1d]">
            Your Saved Botanicals
          </h1>
          <p className="font-sans text-[12px] text-[#717973]">
            {wishlistItems.length} curated {wishlistItems.length === 1 ? 'arrangement' : 'arrangements'} in your wishlist
          </p>
        </div>
        <span className="font-sans text-[10px] font-bold text-[#9a442d] uppercase tracking-wider bg-[#ffdbd2]/70 px-2 py-0.5 rounded-full">
          Curated
        </span>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-[#efeeea] text-center space-y-4 my-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#f5f3ef] text-[#9a442d] flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-[32px]">favorite_border</span>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-[18px] font-semibold text-[#012d1d]">
              No Stems Saved Yet
            </h3>
            <p className="font-sans text-[12px] text-[#717973] max-w-xs mx-auto">
              Tap the heart icon on any floral arrangement to save your favorites for upcoming celebrations.
            </p>
          </div>
          <button
            onClick={onNavigateHome}
            className="py-2.5 px-6 rounded-full bg-[#012d1d] text-white font-sans text-[12px] font-semibold hover:bg-[#1b4332] transition-colors cursor-pointer"
          >
            Explore Arrangements
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {wishlistItems.map((product) => (
            <div
              key={product.id}
              onClick={() => onOpenDetails(product)}
              className="bg-white rounded-2xl p-3 border border-[#efeeea] shadow-sm flex gap-3.5 items-center cursor-pointer hover:shadow-md transition-shadow group"
            >
              <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#efeeea] flex-shrink-0">
                <img
                  src={product.image}
                  alt={product.altText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#9a442d]">
                  {product.badge}
                </span>
                <h3 className="font-serif text-[15px] font-semibold text-[#012d1d] truncate group-hover:text-[#9a442d] transition-colors">
                  {product.name}
                </h3>
                <p className="text-[11px] text-[#717973] truncate">
                  {product.subtitle}
                </p>
                <div className="font-sans text-[15px] font-bold text-[#012d1d] pt-0.5">
                  ₹{product.price.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <button
                  aria-label="Remove from Wishlist"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(product);
                  }}
                  className="w-8 h-8 rounded-full bg-[#ffdbd2]/50 text-[#9a442d] flex items-center justify-center hover:bg-[#ffdbd2] transition-colors"
                >
                  <span className="material-symbols-outlined text-[17px] material-symbols-filled">
                    favorite
                  </span>
                </button>

                <button
                  aria-label="Add to Bag"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                  className="w-8 h-8 rounded-full bg-[#012d1d] text-white flex items-center justify-center hover:bg-[#1b4332] active:scale-95 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
