import React from 'react';

export type NavTab = 'home' | 'explore' | 'wishlist' | 'cart' | 'account';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  cartItemCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  cartItemCount,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pb-safe pointer-events-none">
      <div className="max-w-md mx-auto px-4 pb-3 pt-1">
        <div className="pointer-events-auto h-16 rounded-full bg-[#fbf9f5]/90 backdrop-blur-xl shadow-[0_12px_36px_rgba(27,67,50,0.14),0_2px_8px_rgba(212,163,115,0.08)] px-1 flex items-center justify-around border border-[#eae6df]">
          {/* Home */}
          <button
            onClick={() => onChangeTab('home')}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all cursor-pointer ${
              activeTab === 'home'
                ? 'text-[#012d1d] font-semibold'
                : 'text-[#414844] hover:text-[#012d1d]'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                activeTab === 'home' ? 'material-symbols-filled' : ''
              }`}
            >
              local_florist
            </span>
            <span className="font-sans text-[10px] leading-3 mt-0.5">Home</span>
            {activeTab === 'home' && (
              <span className="w-1 h-1 rounded-full bg-[#9a442d] mt-0.5" />
            )}
          </button>

          {/* Explore */}
          <button
            onClick={() => onChangeTab('explore')}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all cursor-pointer ${
              activeTab === 'explore'
                ? 'text-[#012d1d] font-semibold'
                : 'text-[#414844] hover:text-[#012d1d]'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                activeTab === 'explore' ? 'material-symbols-filled' : ''
              }`}
            >
              auto_awesome
            </span>
            <span className="font-sans text-[10px] leading-3 mt-0.5">Explore</span>
            {activeTab === 'explore' && (
              <span className="w-1 h-1 rounded-full bg-[#9a442d] mt-0.5" />
            )}
          </button>

          {/* Wishlist */}
          <button
            onClick={() => onChangeTab('wishlist')}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all cursor-pointer ${
              activeTab === 'wishlist'
                ? 'text-[#012d1d] font-semibold'
                : 'text-[#414844] hover:text-[#012d1d]'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                activeTab === 'wishlist' ? 'material-symbols-filled text-[#9a442d]' : ''
              }`}
            >
              favorite
            </span>
            <span className="font-sans text-[10px] leading-3 mt-0.5">Wishlist</span>
            {activeTab === 'wishlist' && (
              <span className="w-1 h-1 rounded-full bg-[#9a442d] mt-0.5" />
            )}
          </button>

          {/* Cart */}
          <button
            onClick={() => onChangeTab('cart')}
            className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all cursor-pointer ${
              activeTab === 'cart'
                ? 'text-[#012d1d] font-semibold'
                : 'text-[#414844] hover:text-[#012d1d]'
            }`}
          >
            <div className="relative">
              <span
                className={`material-symbols-outlined text-[22px] ${
                  activeTab === 'cart' ? 'material-symbols-filled' : ''
                }`}
              >
                shopping_bag
              </span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#9a442d] text-white font-sans text-[10px] leading-none px-1.5 py-0.5 rounded-full min-w-[16px] text-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </div>
            <span className="font-sans text-[10px] leading-3 mt-0.5">Cart</span>
            {activeTab === 'cart' && (
              <span className="w-1 h-1 rounded-full bg-[#9a442d] mt-0.5" />
            )}
          </button>

          {/* Account */}
          <button
            onClick={() => onChangeTab('account')}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-full transition-all cursor-pointer ${
              activeTab === 'account'
                ? 'text-[#012d1d] font-semibold'
                : 'text-[#414844] hover:text-[#012d1d]'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[22px] ${
                activeTab === 'account' ? 'material-symbols-filled' : ''
              }`}
            >
              person
            </span>
            <span className="font-sans text-[10px] leading-3 mt-0.5">Account</span>
            {activeTab === 'account' && (
              <span className="w-1 h-1 rounded-full bg-[#9a442d] mt-0.5" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
