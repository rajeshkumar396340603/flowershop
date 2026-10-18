/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { FloralProduct, FilterState, CartItem, DeliveryAddress, GiftMessage } from './types';
import { FLORAL_PRODUCTS, SAVED_ADDRESSES } from './data/florals';
import { Header } from './components/Header';
import { AestheticsRibbon } from './components/AestheticsRibbon';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { FilterModal } from './components/FilterModal';
import { AddressPickerModal } from './components/AddressPickerModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistScreen } from './components/WishlistScreen';
import { ExploreScreen } from './components/ExploreScreen';
import { AccountScreen } from './components/AccountScreen';
import { BottomNav, NavTab } from './components/BottomNav';
import { Toast } from './components/Toast';

export default function App() {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // Address state
  const [currentAddress, setCurrentAddress] = useState<DeliveryAddress>(SAVED_ADDRESSES[0]);
  const [addressPickerOpen, setAddressPickerOpen] = useState(false);

  // Filter state (Pre-set to match the initial screenshot with 2 active pills)
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    category: 'all',
    maxPrice: 2500,
    sameDayOnly: true,
    selectedAesthetic: null,
    flowerTypes: [],
    sortBy: 'popular',
  });
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Cart state (Pre-loaded with 2 items to match the "2" badge in the screenshot)
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: FLORAL_PRODUCTS[0], quantity: 1 },
    { product: FLORAL_PRODUCTS[1], quantity: 1 },
  ]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Wishlist state
  const [wishlistIds, setWishlistIds] = useState<string[]>(['prod-3']);

  // Selected product detail modal
  const [selectedProduct, setSelectedProduct] = useState<FloralProduct | null>(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2400);
  };

  // Cart total item count
  const cartItemCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  // Wishlist list
  const wishlistItems = useMemo(() => {
    return FLORAL_PRODUCTS.filter((p) => wishlistIds.includes(p.id));
  }, [wishlistIds]);

  // Active filter count for badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.maxPrice !== null) count++;
    if (filters.sameDayOnly) count++;
    if (filters.selectedAesthetic !== null) count++;
    count += filters.flowerTypes.length;
    return count;
  }, [filters]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    let result = [...FLORAL_PRODUCTS];

    // Search query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.flowerBreakdown.some((f) => f.flower.toLowerCase().includes(q))
      );
    }

    // Category tab
    if (filters.category !== 'all') {
      result = result.filter((p) => p.category === filters.category);
    }

    // Curated Aesthetic
    if (filters.selectedAesthetic) {
      result = result.filter((p) => p.aestheticId === filters.selectedAesthetic);
    }

    // Price ceiling
    if (filters.maxPrice !== null) {
      result = result.filter((p) => p.price <= filters.maxPrice!);
    }

    // Delivery speed
    if (filters.sameDayOnly) {
      result = result.filter((p) => p.sameDayEligible);
    }

    // Flower varieties
    if (filters.flowerTypes.length > 0) {
      result = result.filter((p) =>
        p.flowerBreakdown.some((fb) =>
          filters.flowerTypes.some((ft) =>
            fb.flower.toLowerCase().includes(ft.toLowerCase().split(' ')[0])
          )
        )
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
    }

    return result;
  }, [filters]);

  // Wishlist toggle
  const toggleWishlist = (product: FloralProduct) => {
    if (wishlistIds.includes(product.id)) {
      setWishlistIds((prev) => prev.filter((id) => id !== product.id));
      showToast('Removed from wishlist');
    } else {
      setWishlistIds((prev) => [...prev, product.id]);
      showToast('Added to your floral wishlist');
    }
  };

  // Add to cart with optional Gift Message
  const addToCart = (
    product: FloralProduct,
    vaseOption?: string,
    customNote?: string,
    giftMessage?: GiftMessage
  ) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && !item.giftMessage && !giftMessage
      );
      if (existingIndex > -1) {
        return prev.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          selectedVase: vaseOption as any,
          customCardMessage: customNote,
          giftMessage,
        },
      ];
    });
    showToast('Floral arrangement added to bag');
  };

  const updateCartGiftMessage = (productId: string, giftMessage: GiftMessage | undefined) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              giftMessage,
              customCardMessage: giftMessage
                ? `For ${giftMessage.recipient}: "${giftMessage.message.slice(0, 40)}..."`
                : undefined,
            }
          : item
      )
    );
    showToast(giftMessage ? 'Gift note attached to arrangement' : 'Gift message removed');
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Removed item from bag');
  };

  const clearAllFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'all',
      maxPrice: null,
      sameDayOnly: false,
      selectedAesthetic: null,
      flowerTypes: [],
      sortBy: 'popular',
    });
    showToast('Filters cleared');
  };

  const getSortLabel = () => {
    switch (filters.sortBy) {
      case 'price-asc':
        return 'Price: Low to High';
      case 'price-desc':
        return 'Price: High to Low';
      case 'rating':
        return 'Highest Rated';
      case 'new':
        return 'New Arrivals';
      case 'popular':
      default:
        return 'Most Popular';
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] font-sans text-[#1b1c1a] flex flex-col justify-between selection:bg-[#c1ecd4]">
      {/* Top Header */}
      <Header
        currentAddress={currentAddress}
        onOpenAddressPicker={() => setAddressPickerOpen(true)}
        onNavigateToAccount={() => setActiveTab('account')}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto pt-20 pb-28 bg-[#fbf9f5]">
        {activeTab === 'home' && (
          <div className="flex flex-col w-full px-4 space-y-5 pt-1">
            {/* Search & Filter Trigger Area */}
            <section className="flex flex-col w-full space-y-3 pt-1">
              <div className="flex items-center gap-2 w-full">
                {/* Search Bar */}
                <div className="relative flex-1 flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[#717973] pointer-events-none text-[20px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                    placeholder="Search peonies, lilies, orchids..."
                    className="w-full bg-[#f5f3ef] text-[#1b1c1a] placeholder:text-[#717973] font-sans text-[14px] rounded-full pl-11 pr-8 py-2.5 focus:outline-none focus:bg-white shadow-xs transition-all border border-transparent focus:border-[#012d1d]/20"
                  />
                  {filters.searchQuery && (
                    <button
                      onClick={() => setFilters({ ...filters, searchQuery: '' })}
                      className="absolute right-3 text-[#717973] hover:text-[#012d1d] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  )}
                </div>

                {/* Filter Trigger Button */}
                <button
                  aria-label="Open filter preferences"
                  onClick={() => setFilterModalOpen(true)}
                  className="relative w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full bg-[#1b4332] text-white shadow-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">tune</span>
                  {activeFiltersCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#fc9174] text-white font-sans text-[9px] flex items-center justify-center font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Active Filter Pills Bar */}
              {(filters.maxPrice !== null ||
                filters.sameDayOnly ||
                filters.selectedAesthetic !== null ||
                filters.flowerTypes.length > 0) && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                  <span className="font-sans text-[10px] text-[#717973] uppercase tracking-wider flex-shrink-0 font-bold">
                    Active:
                  </span>

                  {/* Price Pill */}
                  {filters.maxPrice !== null && (
                    <div
                      onClick={() => setFilters({ ...filters, maxPrice: null })}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5f3ef] text-[#012d1d] shadow-2xs flex-shrink-0 group cursor-pointer hover:bg-[#efeeea] transition-colors"
                    >
                      <span className="font-sans text-[10px] font-bold">
                        Under ₹{filters.maxPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="material-symbols-outlined text-[14px] text-[#717973] group-hover:text-[#9a442d]">
                        close
                      </span>
                    </div>
                  )}

                  {/* Same-day Speed Pill */}
                  {filters.sameDayOnly && (
                    <div
                      onClick={() => setFilters({ ...filters, sameDayOnly: false })}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c1ecd4] text-[#002114] shadow-2xs flex-shrink-0 group cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-[13px] material-symbols-filled">
                        bolt
                      </span>
                      <span className="font-sans text-[10px] font-bold">Same-Day Delivery</span>
                      <span className="material-symbols-outlined text-[14px] opacity-70 group-hover:opacity-100">
                        close
                      </span>
                    </div>
                  )}

                  {/* Selected Aesthetic Pill */}
                  {filters.selectedAesthetic && (
                    <div
                      onClick={() => setFilters({ ...filters, selectedAesthetic: null })}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdcbd] text-[#2c1600] shadow-2xs flex-shrink-0 group cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <span className="font-sans text-[10px] font-bold capitalize">
                        Aesthetic: {filters.selectedAesthetic}
                      </span>
                      <span className="material-symbols-outlined text-[14px] opacity-70 group-hover:opacity-100">
                        close
                      </span>
                    </div>
                  )}

                  {/* Clear All Button */}
                  <button
                    onClick={clearAllFilters}
                    className="font-sans text-[10px] font-bold text-[#9a442d] hover:underline flex-shrink-0 ml-1 cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </section>

            {/* Curated Aesthetics Ribbon */}
            <AestheticsRibbon
              selectedAesthetic={filters.selectedAesthetic}
              onSelectAesthetic={(id) => {
                setFilters({ ...filters, selectedAesthetic: id });
                if (id) {
                  showToast(`Filtered by ${id} aesthetic`);
                }
              }}
            />

            {/* Category Grid Filter Tabs */}
            <section className="flex flex-col w-full space-y-2">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 py-1">
                {[
                  { id: 'all', label: 'All', count: 36 },
                  { id: 'bouquets', label: 'Fresh Bouquets', count: 18 },
                  { id: 'vase', label: 'Vase Arrangements', count: 9 },
                  { id: 'orchids', label: 'Exotic Orchids', count: 5 },
                  { id: 'hampers', label: 'Hampers & Combos', count: 4 },
                ].map((tab) => {
                  const isActive = filters.category === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setFilters({ ...filters, category: tab.id as any })}
                      className={`px-4 py-2 rounded-full font-sans text-[12px] font-semibold whitespace-nowrap transition-all cursor-pointer shadow-2xs ${
                        isActive
                          ? 'bg-[#012d1d] text-white shadow-sm'
                          : 'bg-[#efeeea] text-[#414844] hover:text-[#012d1d] hover:bg-[#eae8e4]'
                      }`}
                    >
                      {tab.label}{' '}
                      <span className={`font-normal ml-0.5 ${isActive ? 'opacity-75' : 'opacity-70'}`}>
                        ({tab.count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Sorting & Results Tally Header */}
            <div className="flex items-center justify-between pt-1 relative">
              <span className="font-sans text-[12px] text-[#717973]">
                <strong className="font-semibold text-[#012d1d]">{filteredProducts.length}</strong>{' '}
                arrangements found
              </span>

              <div className="relative">
                <button
                  onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                  className="flex items-center gap-1 font-sans text-[10px] text-[#012d1d] py-1 px-2.5 rounded-full bg-[#f5f3ef] hover:bg-[#efeeea] transition-colors cursor-pointer"
                >
                  <span>
                    Sort by: <strong className="font-semibold">{getSortLabel()}</strong>
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-[#717973]">
                    arrow_drop_down
                  </span>
                </button>

                {/* Sort Dropdown */}
                {sortDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-44 rounded-2xl bg-white shadow-xl z-30 py-1.5 flex flex-col border border-[#efeeea]">
                    {[
                      { id: 'popular', label: 'Most Popular' },
                      { id: 'price-asc', label: 'Price: Low to High' },
                      { id: 'price-desc', label: 'Price: High to Low' },
                      { id: 'rating', label: 'Highest Rated' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setFilters({ ...filters, sortBy: opt.id as any });
                          setSortDropdownOpen(false);
                        }}
                        className={`px-3.5 py-2 text-left font-sans text-[12px] transition-colors cursor-pointer ${
                          filters.sortBy === opt.id
                            ? 'text-[#012d1d] font-bold bg-[#f5f3ef]'
                            : 'text-[#414844] hover:bg-[#f5f3ef]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Catalog Grid (2 Columns) */}
            {filteredProducts.length === 0 ? (
              <div className="py-12 text-center space-y-3 bg-white rounded-3xl p-6 border border-[#efeeea]">
                <span className="material-symbols-outlined text-[36px] text-[#717973]">
                  filter_alt_off
                </span>
                <p className="font-serif text-[16px] font-semibold text-[#012d1d]">
                  No stems match your current filters
                </p>
                <p className="text-[12px] text-[#717973]">
                  Try expanding your budget or clearing active flower tags.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-[#012d1d] text-white rounded-full text-[12px] font-semibold cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <section className="grid grid-cols-2 gap-3 w-full">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onToggleWishlist={toggleWishlist}
                    onAddToCart={addToCart}
                    onOpenDetails={(p) => setSelectedProduct(p)}
                  />
                ))}
              </section>
            )}

            {/* Editorial Florist's Freshness Guarantee banner */}
            <section className="mt-4 rounded-2xl bg-[#f5f3ef] p-4 flex items-center gap-3.5 shadow-2xs border border-[#efeeea]">
              <div className="w-10 h-10 rounded-full bg-[#012d1d] text-white flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[20px] material-symbols-filled">
                  eco
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <h4 className="font-serif text-[13px] text-[#012d1d] font-semibold">
                  The Bloomify Freshness Guarantee
                </h4>
                <p className="font-sans text-[11px] text-[#717973] leading-tight mt-0.5">
                  Hand-picked from Nilgiri &amp; Bangalore farms at dawn, conditioning-wrapped for 5+
                  days vase longevity.
                </p>
              </div>
            </section>
          </div>
        )}

        {/* Explore Screen Tab */}
        {activeTab === 'explore' && (
          <ExploreScreen
            onSelectAestheticAndHome={(id) => {
              setFilters({ ...filters, selectedAesthetic: id });
              setActiveTab('home');
              showToast(`Filtered collection: ${id}`);
            }}
            onOpenProductDetails={(p) => setSelectedProduct(p)}
          />
        )}

        {/* Wishlist Screen Tab */}
        {activeTab === 'wishlist' && (
          <WishlistScreen
            wishlistItems={wishlistItems}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
            onOpenDetails={(p) => setSelectedProduct(p)}
            onNavigateHome={() => setActiveTab('home')}
          />
        )}

        {/* Cart Tab (Direct View or Drawer) */}
        {activeTab === 'cart' && (
          <div className="px-4 py-2">
            <CartDrawer
              isOpen={true}
              onClose={() => setActiveTab('home')}
              cartItems={cartItems}
              onUpdateQuantity={updateCartQuantity}
              onRemoveItem={removeCartItem}
              currentAddress={currentAddress}
              onClearCart={() => setCartItems([])}
              onUpdateGiftMessage={updateCartGiftMessage}
            />
          </div>
        )}

        {/* Account Screen Tab */}
        {activeTab === 'account' && (
          <AccountScreen
            currentAddress={currentAddress}
            onOpenAddressPicker={() => setAddressPickerOpen(true)}
            onAddToCart={addToCart}
            onOpenProductDetails={(p) => setSelectedProduct(p)}
          />
        )}
      </main>

      {/* Floating Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => {
          if (tab === 'cart') {
            setCartDrawerOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        cartItemCount={cartItemCount}
      />

      {/* Cart Drawer Modal */}
      {cartDrawerOpen && (
        <CartDrawer
          isOpen={cartDrawerOpen}
          onClose={() => setCartDrawerOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={updateCartQuantity}
          onRemoveItem={removeCartItem}
          currentAddress={currentAddress}
          onClearCart={() => setCartItems([])}
          onUpdateGiftMessage={updateCartGiftMessage}
        />
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          isWishlisted={wishlistIds.includes(selectedProduct.id)}
          onToggleWishlist={toggleWishlist}
          onAddToCart={addToCart}
        />
      )}

      {/* Filter Modal */}
      <FilterModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filters={filters}
        onUpdateFilters={(newFilters) => setFilters(newFilters)}
        onResetFilters={clearAllFilters}
        matchingCount={filteredProducts.length}
      />

      {/* Address Picker Modal */}
      <AddressPickerModal
        isOpen={addressPickerOpen}
        onClose={() => setAddressPickerOpen(false)}
        currentAddress={currentAddress}
        onSelectAddress={(addr) => {
          setCurrentAddress(addr);
          showToast(`Delivery set to ${addr.area}`);
        }}
      />

      {/* Delight Feedback Toast */}
      <Toast message={toastMessage} />
    </div>
  );
}
