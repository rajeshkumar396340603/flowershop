import React from 'react';
import { FloralProduct } from '../types';

interface ProductCardProps {
  product: FloralProduct;
  isWishlisted: boolean;
  onToggleWishlist: (product: FloralProduct) => void;
  onAddToCart: (product: FloralProduct) => void;
  onOpenDetails: (product: FloralProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onOpenDetails,
}) => {
  const getBadgeStyle = (type: FloralProduct['badgeType']) => {
    switch (type) {
      case 'fresh':
      case 'purifying':
        return 'bg-[#c1ecd4] text-[#002114]';
      case 'rare':
      case 'festive':
        return 'bg-[#ffdcbd] text-[#2c1600]';
      case 'bestseller':
        return 'bg-[#ffdbd2] text-[#3c0800]';
      case 'everlasting':
      default:
        return 'bg-[#eae8e4] text-[#414844]';
    }
  };

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group cursor-pointer border border-[#efeeea]"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[4/5] w-full bg-[#efeeea] overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={product.image}
          alt={product.altText}
          loading="lazy"
        />

        {/* Badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span
            className={`px-2 py-0.5 rounded-full font-sans text-[9px] font-bold tracking-wide uppercase shadow-sm ${getBadgeStyle(
              product.badgeType
            )}`}
          >
            {product.badge}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          aria-label={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`wishlist-btn absolute top-2.5 right-2.5 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-sm active:scale-90 z-10 cursor-pointer ${
            isWishlisted
              ? 'bg-[#9a442d] text-white shadow-md'
              : 'bg-white/80 text-[#012d1d] hover:text-[#9a442d]'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[17px] ${
              isWishlisted ? 'material-symbols-filled text-white' : ''
            }`}
          >
            favorite
          </span>
        </button>

        {/* Rating Badge */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-[#fbf9f5]/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[#012d1d] shadow-sm z-10">
          <span
            className="material-symbols-outlined text-[13px] text-[#9a442d] material-symbols-filled"
          >
            star
          </span>
          <span className="font-sans text-[10px] font-bold tabular-nums">
            {product.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Product Metadata & Actions */}
      <div className="p-3 flex flex-col flex-1 justify-between space-y-2">
        <div>
          <h3 className="font-serif text-[14px] leading-snug text-[#012d1d] font-medium line-clamp-1 group-hover:text-[#9a442d] transition-colors">
            {product.name}
          </h3>
          <p className="font-sans text-[11px] text-[#717973] line-clamp-1 mt-0.5">
            {product.subtitle}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="font-sans text-[16px] leading-tight font-bold text-[#012d1d] tabular-nums">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            <span className="font-sans text-[9px] text-[#717973]">
              {product.stemsInfo}
            </span>
          </div>

          <button
            aria-label={`Add ${product.name} to Bag`}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="add-to-cart-btn w-8 h-8 rounded-full bg-[#1b4332] text-white flex items-center justify-center active:scale-90 hover:bg-[#012d1d] transition-all shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
