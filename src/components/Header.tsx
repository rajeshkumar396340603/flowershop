import React, { useState } from 'react';
import { DeliveryAddress } from '../types';
import { FLORIST_NOTIFICATIONS } from '../data/florals';

interface HeaderProps {
  currentAddress: DeliveryAddress;
  onOpenAddressPicker: () => void;
  onNavigateToAccount: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentAddress,
  onOpenAddressPicker,
  onNavigateToAccount,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(FLORIST_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#fbf9f5]/85 backdrop-blur-xl shadow-[0_4px_24px_-4px_rgba(27,67,50,0.06)] border-b border-[#efeeea]">
      <div className="max-w-md mx-auto h-20 px-4 flex items-center justify-between gap-2">
        {/* Brand & Delivery Address */}
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            alt="Bloomify Floral Brandmark"
            className="h-8 w-auto object-contain flex-shrink-0"
            src="https://lh3.googleusercontent.com/aida/AEtjO1XlA8bv6WGfMQLvKj6cgol2ON0j8ur9RnpfoDwdRlbQYzZYmrsF47k0QREcwRPy2GxxBr-BSKUIbWlDnKwYZ7RX5DyVsJqI3pzeyShrrd3_Sv8Zuq4SWa2jZbK5Iql6VdzUEPMcBfxIr2qXzXze37D2SDX_DmXZqOf3U4Ru3DepcEplB-JdUo7A1kbh-CpssIXMxE_lX4nQM1NPsRcRGd4nKHIRinW4AOMdKLklWV9VmGBWQV4b82VYyBs"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-sans text-[10px] leading-3 font-bold text-[#9a442d] uppercase tracking-wider">
              BLOOMIFY
            </span>
            <button
              onClick={onOpenAddressPicker}
              className="flex items-center gap-0.5 text-left min-w-0 group cursor-pointer focus:outline-none"
              title="Change delivery location"
            >
              <span className="font-sans text-[12px] font-semibold text-[#012d1d] truncate max-w-[170px]">
                Delivering to {currentAddress.area}, Bengaluru
              </span>
              <span className="material-symbols-outlined text-[16px] text-[#012d1d] transition-transform group-hover:translate-y-0.5">
                expand_more
              </span>
            </button>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1 flex-shrink-0 relative">
          {/* Notification Button */}
          <button
            aria-label="Notifications"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative w-11 h-11 flex items-center justify-center rounded-full text-[#012d1d] hover:bg-[#f5f3ef] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#fc9174] ring-2 ring-[#fbf9f5]" />
            )}
          </button>

          {/* Profile Avatar Button */}
          <button
            aria-label="User Profile"
            onClick={onNavigateToAccount}
            className="w-11 h-11 flex items-center justify-center rounded-full cursor-pointer hover:ring-2 hover:ring-[#1b4332]/30 transition-all"
          >
            <img
              alt="Rajesh Kumar Profile"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-[#e4e2de]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmIa-GLv6IGlsaiCLmutqs8RAtVBmNaZ5_XFfM4DAkGu5kCqxO69NCi-1slF1uSQ4twNUIktKzDVfMDnc4VbO27cT7eSy_YwlAzsk2ahjKmE9Kz9ZTTX_6I-C9t6OaOWkGKz8p4ePsp49mjL-gqXp3Cwv_T90iqXRh41xcHXpAjDiVbWeWof3AOonsrYv0hoWRR97dWkJkyBFTl3Zj4CmL3emWQPSzLXNpnZrRT_pgRpLSAK3lNzHihA"
            />
          </button>

          {/* Notifications Flyout Tray */}
          {notificationsOpen && (
            <div className="absolute top-12 right-0 w-80 max-w-[90vw] rounded-2xl bg-white shadow-2xl border border-[#efeeea] p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#efeeea]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#012d1d]">
                    notifications_active
                  </span>
                  <span className="font-serif text-[15px] font-semibold text-[#012d1d]">
                    Florist Dispatch &amp; Notes
                  </span>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] font-sans font-semibold text-[#9a442d] hover:underline"
                  >
                    Mark read
                  </button>
                )}
              </div>

              <div className="divide-y divide-[#efeeea] max-h-72 overflow-y-auto no-scrollbar">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`py-3 text-left transition-colors ${
                      item.unread ? 'bg-[#fbf9f5]/80' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-[12px] font-sans font-semibold text-[#012d1d] leading-tight">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-[#717973] whitespace-nowrap">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-[11px] font-sans text-[#414844] mt-1 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setNotificationsOpen(false)}
                className="w-full mt-2 py-2 text-center text-[11px] font-sans font-semibold text-[#012d1d] hover:bg-[#f5f3ef] rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
