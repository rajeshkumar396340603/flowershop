import React, { useState } from 'react';
import { DeliveryAddress, FloralProduct } from '../types';
import { FLORAL_PRODUCTS } from '../data/florals';

interface AccountScreenProps {
  currentAddress: DeliveryAddress;
  onOpenAddressPicker: () => void;
  onAddToCart: (product: FloralProduct) => void;
  onOpenProductDetails: (product: FloralProduct) => void;
}

interface TimelineStep {
  title: string;
  time: string;
  location: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  icon: string;
}

interface OrderItem {
  id: string;
  date: string;
  status: 'Out for Delivery' | 'Delivered' | 'Harvesting';
  statusType: 'active' | 'delivered';
  product: FloralProduct;
  address: string;
  total: number;
  deliverySlot: string;
  courierName?: string;
  vanTemp?: string;
  timeline: TimelineStep[];
}

export const AccountScreen: React.FC<AccountScreenProps> = ({
  currentAddress,
  onOpenAddressPicker,
  onAddToCart,
  onOpenProductDetails,
}) => {
  const [accountSubTab, setAccountSubTab] = useState<'orders' | 'profile'>('orders');
  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'delivered'>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>('BLM-8892');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [chilledPackagingPreference, setChilledPackagingPreference] = useState(true);

  const orders: OrderItem[] = [
    {
      id: 'BLM-8892',
      date: 'Today, Oct 18',
      status: 'Out for Delivery',
      statusType: 'active',
      product: FLORAL_PRODUCTS[3], // Golden Sunset
      address: `${currentAddress.area}, Bengaluru`,
      total: 1299,
      deliverySlot: 'Today Evening, 5:00 PM - 8:00 PM',
      courierName: 'Suresh Kumar (Florist Courier)',
      vanTemp: '16°C (Climate-controlled)',
      timeline: [
        {
          title: 'Dawn Harvest & Moisture Conditioning',
          time: '06:15 AM',
          location: 'Nilgiri Estate Farm',
          description: 'Marigolds and dahlias freshly picked at dawn, stems pre-conditioned in nutrient cold bath.',
          status: 'completed',
          icon: 'eco',
        },
        {
          title: 'Atelier Styling & Calligraphy Card',
          time: '11:45 AM',
          location: 'Bloomify Indiranagar Atelier',
          description: 'Hand-tied with eco-banana fiber and bespoke wax-sealed greeting card.',
          status: 'completed',
          icon: 'design_services',
        },
        {
          title: 'Out for Delivery in Chilled Van',
          time: '02:40 PM',
          location: 'En route in 12th Main Indiranagar',
          description: 'Assigned to white-glove specialist Suresh. Temperature strictly maintained at 16°C.',
          status: 'current',
          icon: 'local_shipping',
        },
        {
          title: 'Doorstep Handover',
          time: 'Est. 05:45 PM',
          location: `${currentAddress.area}, Bengaluru`,
          description: 'Direct contact-free handover with floral care packet and water replenishment vial.',
          status: 'pending',
          icon: 'home',
        },
      ],
    },
    {
      id: 'BLM-6481',
      date: 'April 12, 2025',
      status: 'Delivered',
      statusType: 'delivered',
      product: FLORAL_PRODUCTS[0], // Pastel Meadow
      address: 'Indiranagar, Bengaluru',
      total: 2150,
      deliverySlot: 'April 12, 4:00 PM',
      courierName: 'Karthik R.',
      timeline: [
        {
          title: 'Harvested from Ooty Glasshouse',
          time: '07:00 AM',
          location: 'Ooty Bio-dome',
          description: 'Blush ranunculus and peach roses picked at peak bloom.',
          status: 'completed',
          icon: 'eco',
        },
        {
          title: 'Artisanal Silk Wrapping',
          time: '12:30 PM',
          location: 'Bengaluru Atelier',
          description: 'Arranged with sage silk ribbon and hydration pouch.',
          status: 'completed',
          icon: 'design_services',
        },
        {
          title: 'Dispatched via Chilled Transport',
          time: '02:15 PM',
          location: 'Bengaluru Logistics Hub',
          description: 'Dispatched in refrigerated courier van.',
          status: 'completed',
          icon: 'local_shipping',
        },
        {
          title: 'Successfully Delivered to Concierge',
          time: '04:15 PM',
          location: 'Indiranagar, Bengaluru',
          description: 'Received by recipient with recipient signature.',
          status: 'completed',
          icon: 'check_circle',
        },
      ],
    },
    {
      id: 'BLM-5192',
      date: 'March 28, 2025',
      status: 'Delivered',
      statusType: 'delivered',
      product: FLORAL_PRODUCTS[2], // Cashmere Rose & Lily
      address: 'Indiranagar, Bengaluru',
      total: 2899,
      deliverySlot: 'March 28, 6:30 PM',
      courierName: 'Arun M.',
      timeline: [
        {
          title: 'Harvested from Ooty Cold Reserve',
          time: '08:00 AM',
          location: 'Ooty Estate',
          description: 'Fragrant pure white Oriental lilies selected.',
          status: 'completed',
          icon: 'eco',
        },
        {
          title: 'Atelier French Parchment Wrap',
          time: '01:00 PM',
          location: 'Central Atelier',
          description: 'Handcrafted luxury bouquet arrangement.',
          status: 'completed',
          icon: 'design_services',
        },
        {
          title: 'Courier Express Dispatch',
          time: '04:00 PM',
          location: 'Express Hub',
          description: 'Courier handover completed.',
          status: 'completed',
          icon: 'local_shipping',
        },
        {
          title: 'Delivered to Doorstep',
          time: '06:30 PM',
          location: 'Indiranagar, Bengaluru',
          description: 'Handed over directly to resident.',
          status: 'completed',
          icon: 'check_circle',
        },
      ],
    },
  ];

  const filteredOrders = orders.filter((order) => {
    if (orderFilter === 'active') return order.statusType === 'active';
    if (orderFilter === 'delivered') return order.statusType === 'delivered';
    return true;
  });

  const activeCount = orders.filter((o) => o.statusType === 'active').length;

  return (
    <div className="flex flex-col w-full px-4 pb-28 pt-2 space-y-4">
      {/* Account Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#efeeea] rounded-full border border-[#eae8e4] shadow-2xs">
        <button
          onClick={() => setAccountSubTab('orders')}
          className={`flex-1 py-2 px-3 rounded-full font-sans text-[12px] font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            accountSubTab === 'orders'
              ? 'bg-[#012d1d] text-white shadow-sm'
              : 'text-[#414844] hover:text-[#012d1d]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">receipt_long</span>
          <span>Orders</span>
          {activeCount > 0 && (
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                accountSubTab === 'orders'
                  ? 'bg-[#fc9174] text-white'
                  : 'bg-[#012d1d] text-white'
              }`}
            >
              {activeCount} Active
            </span>
          )}
        </button>

        <button
          onClick={() => setAccountSubTab('profile')}
          className={`flex-1 py-2 px-3 rounded-full font-sans text-[12px] font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            accountSubTab === 'profile'
              ? 'bg-[#012d1d] text-white shadow-sm'
              : 'text-[#414844] hover:text-[#012d1d]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">person</span>
          <span>Profile &amp; Club</span>
        </button>
      </div>

      {/* ======================= ORDERS TAB ======================= */}
      {accountSubTab === 'orders' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Header & Sub-filter pills */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <h1 className="font-serif text-[22px] font-semibold text-[#012d1d]">
                Floral Deliveries
              </h1>
              <p className="font-sans text-[12px] text-[#717973]">
                Real-time cold-chain tracking and past orders
              </p>
            </div>
            <span className="text-[10px] font-sans font-bold text-[#9a442d] bg-[#ffdbd2]/70 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Live Logistics
            </span>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'all', label: `All Orders (${orders.length})` },
              { id: 'active', label: `In Transit (${activeCount})` },
              { id: 'delivered', label: `Delivered (${orders.length - activeCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setOrderFilter(tab.id as any)}
                className={`py-1.5 px-3 rounded-full text-[11px] font-sans transition-all cursor-pointer whitespace-nowrap border ${
                  orderFilter === tab.id
                    ? 'bg-[#012d1d] text-white border-[#012d1d] font-semibold shadow-2xs'
                    : 'bg-white text-[#414844] border-[#efeeea] hover:bg-[#f5f3ef]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Orders List with Timeline Visualizations */}
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrderId === order.id;
              const isActiveOrder = order.statusType === 'active';

              return (
                <div
                  key={order.id}
                  className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden shadow-sm ${
                    isActiveOrder
                      ? 'border-[#86af99] ring-1 ring-[#86af99]/30'
                      : 'border-[#efeeea]'
                  }`}
                >
                  {/* Order Card Header */}
                  <div
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                    className="p-4 cursor-pointer hover:bg-[#fbf9f5] transition-colors"
                  >
                    <div className="flex items-center justify-between pb-2.5 border-b border-[#efeeea] text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-[#717973]">
                          Order <strong className="text-[#012d1d] font-bold">{order.id}</strong>
                        </span>
                        <span className="text-[#717973]">· {order.date}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-full font-sans text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 ${
                            isActiveOrder
                              ? 'bg-[#c1ecd4] text-[#002114] animate-pulse'
                              : 'bg-[#efeeea] text-[#414844]'
                          }`}
                        >
                          {isActiveOrder && (
                            <span className="material-symbols-outlined text-[12px] material-symbols-filled">
                              bolt
                            </span>
                          )}
                          {order.status}
                        </span>
                        <span className="material-symbols-outlined text-[16px] text-[#717973]">
                          {isExpanded ? 'expand_less' : 'expand_more'}
                        </span>
                      </div>
                    </div>

                    {/* Product Summary Row */}
                    <div className="pt-3 flex items-center gap-3">
                      <img
                        src={order.product.image}
                        alt={order.product.name}
                        className="w-14 h-16 rounded-xl object-cover bg-[#f5f3ef] flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-[15px] font-semibold text-[#012d1d] truncate">
                          {order.product.name}
                        </h3>
                        <p className="font-sans text-[11px] text-[#717973] truncate">
                          {order.product.subtitle} · {order.address}
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="font-sans text-[14px] font-bold text-[#012d1d]">
                            ₹{order.total.toLocaleString('en-IN')}
                          </span>
                          <span className="font-sans text-[11px] text-[#9a442d] font-semibold">
                            {isActiveOrder ? 'Estimated 5:45 PM' : 'Delivered on time'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Timeline Visualization & Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 bg-[#fbf9f5]/80 border-t border-[#efeeea] space-y-4">
                      {/* Active Dispatch Info Strip */}
                      {isActiveOrder && order.courierName && (
                        <div className="bg-[#c1ecd4]/40 p-3 rounded-2xl border border-[#86af99]/30 flex items-center justify-between text-[11px] text-[#002114]">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] text-[#012d1d] material-symbols-filled">
                              ac_unit
                            </span>
                            <div>
                              <span className="font-bold block">{order.courierName}</span>
                              <span className="opacity-80">Van Transit Temp: {order.vanTemp}</span>
                            </div>
                          </div>
                          <span className="bg-[#012d1d] text-white px-2.5 py-1 rounded-full text-[10px] font-bold">
                            Live Tracking
                          </span>
                        </div>
                      )}

                      {/* Timeline Visualization Section */}
                      <div className="space-y-2 pt-1">
                        <span className="font-serif text-[13px] font-semibold text-[#012d1d] flex items-center justify-between">
                          <span>Harvest &amp; Fulfillment Timeline</span>
                          <span className="font-sans text-[10px] text-[#717973] font-normal">
                            UTC+05:30 IST
                          </span>
                        </span>

                        <div className="relative pl-6 space-y-5 pt-2">
                          {/* Vertical Connector Line */}
                          <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-[#e4e2de]" />

                          {order.timeline.map((step, idx) => {
                            const isCompleted = step.status === 'completed';
                            const isCurrent = step.status === 'current';
                            const isPending = step.status === 'pending';

                            return (
                              <div key={idx} className="relative flex items-start gap-3 group">
                                {/* Timeline Node Marker */}
                                <div
                                  className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                                    isCompleted
                                      ? 'bg-[#012d1d] text-white shadow-2xs'
                                      : isCurrent
                                      ? 'bg-[#fc9174] text-white ring-4 ring-[#ffdbd2] shadow-sm animate-pulse'
                                      : 'bg-[#efeeea] border-2 border-[#c1c8c2] text-[#717973]'
                                  }`}
                                >
                                  {isCompleted ? (
                                    <span className="material-symbols-outlined text-[12px] font-bold">
                                      check
                                    </span>
                                  ) : isCurrent ? (
                                    <span className="material-symbols-outlined text-[12px]">
                                      sensors
                                    </span>
                                  ) : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#717973]" />
                                  )}
                                </div>

                                {/* Step Information */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <h4
                                      className={`font-sans text-[12px] leading-tight ${
                                        isCurrent
                                          ? 'font-bold text-[#012d1d]'
                                          : isCompleted
                                          ? 'font-semibold text-[#012d1d]'
                                          : 'text-[#717973]'
                                      }`}
                                    >
                                      {step.title}
                                    </h4>
                                    <span
                                      className={`text-[10px] font-sans tabular-nums whitespace-nowrap ${
                                        isCurrent ? 'text-[#9a442d] font-bold' : 'text-[#717973]'
                                      }`}
                                    >
                                      {step.time}
                                    </span>
                                  </div>

                                  <span className="text-[10px] font-medium text-[#717973] block mt-0.5">
                                    {step.location}
                                  </span>

                                  <p className="text-[11px] text-[#414844] leading-relaxed mt-0.5">
                                    {step.description}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#efeeea]">
                        <button
                          onClick={() => onOpenProductDetails(order.product)}
                          className="py-1.5 px-3 rounded-full bg-white border border-[#efeeea] text-[#012d1d] text-[11px] font-sans font-semibold hover:bg-[#efeeea] transition-colors cursor-pointer"
                        >
                          View Botanical Card
                        </button>
                        <button
                          onClick={() => onAddToCart(order.product)}
                          className="py-1.5 px-3.5 rounded-full bg-[#012d1d] text-white text-[11px] font-sans font-semibold flex items-center gap-1 hover:bg-[#1b4332] active:scale-95 transition-all cursor-pointer shadow-2xs"
                        >
                          <span className="material-symbols-outlined text-[14px]">replay</span>
                          Reorder Arrangement
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================= PROFILE & CLUB TAB ======================= */}
      {accountSubTab === 'profile' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* User Header Profile */}
          <div className="bg-white rounded-3xl p-5 border border-[#efeeea] shadow-sm flex items-center gap-4">
            <div className="relative">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmIa-GLv6IGlsaiCLmutqs8RAtVBmNaZ5_XFfM4DAkGu5kCqxO69NCi-1slF1uSQ4twNUIktKzDVfMDnc4VbO27cT7eSy_YwlAzsk2ahjKmE9Kz9ZTTX_6I-C9t6OaOWkGKz8p4ePsp49mjL-gqXp3Cwv_T90iqXRh41xcHXpAjDiVbWeWof3AOonsrYv0hoWRR97dWkJkyBFTl3Zj4CmL3emWQPSzLXNpnZrRT_pgRpLSAK3lNzHihA"
                alt="Rajesh Kumar"
                className="w-16 h-16 rounded-full object-cover ring-2 ring-[#012d1d]/20"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#1b4332] text-white flex items-center justify-center text-[9px] shadow-sm">
                ✓
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <span className="font-sans text-[10px] font-bold text-[#9a442d] uppercase tracking-wider">
                Patron Member
              </span>
              <h2 className="font-serif text-[18px] font-semibold text-[#012d1d] truncate">
                Rajesh Kumar
              </h2>
              <p className="font-sans text-[12px] text-[#717973] truncate">
                rajeshkumar396340@gmail.com
              </p>
            </div>
          </div>

          {/* Bloomify Club Privilege Tier */}
          <div className="bg-gradient-to-br from-[#012d1d] to-[#1b4332] rounded-3xl p-5 text-white shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#ffdcbd] material-symbols-filled">
                  loyalty
                </span>
                <span className="font-serif text-[15px] font-semibold tracking-wide">
                  Bloomify Club · Petal Connoisseur
                </span>
              </div>
              <span className="text-[11px] font-sans font-bold bg-[#c1ecd4] text-[#002114] px-2 py-0.5 rounded-full">
                Tier 2
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] opacity-80">
                <span>Progress to Master Florist Tier</span>
                <span>340 / 500 Petals</span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-[#ffdcbd] h-full rounded-full w-[68%]" />
              </div>
            </div>

            <p className="text-[11px] opacity-90 leading-relaxed pt-1">
              Enjoy complimentary white-glove chilled van logistics and free calligraphy cards on every stem order.
            </p>
          </div>

          {/* Primary Delivery Address */}
          <div className="bg-white rounded-3xl p-4 border border-[#efeeea] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#012d1d]">
                  location_on
                </span>
                <h3 className="font-serif text-[15px] font-semibold text-[#012d1d]">
                  Primary Delivery Location
                </h3>
              </div>
              <button
                onClick={onOpenAddressPicker}
                className="text-[11px] font-sans font-semibold text-[#9a442d] hover:underline cursor-pointer"
              >
                Change
              </button>
            </div>

            <div className="bg-[#fbf9f5] p-3 rounded-2xl border border-[#efeeea] space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-sans text-[13px] font-bold text-[#012d1d]">
                  {currentAddress.label} ({currentAddress.area})
                </span>
                <span className="text-[9px] bg-[#c1ecd4] text-[#002114] px-1.5 py-0.5 rounded font-bold uppercase">
                  Selected
                </span>
              </div>
              <p className="text-[11px] text-[#717973]">
                {currentAddress.addressLine}, {currentAddress.city}
              </p>
            </div>
          </div>

          {/* Delivery & Packaging Preferences */}
          <div className="bg-white rounded-3xl p-4 border border-[#efeeea] shadow-sm space-y-3">
            <h3 className="font-serif text-[15px] font-semibold text-[#012d1d]">
              Delivery &amp; Packaging Preferences
            </h3>

            <div className="space-y-2 text-[12px]">
              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="text-[#414844]">Conditioning Moisture Pouches</span>
                <input
                  type="checkbox"
                  checked={chilledPackagingPreference}
                  onChange={(e) => setChilledPackagingPreference(e.target.checked)}
                  className="rounded text-[#012d1d] focus:ring-[#012d1d] h-4 w-4"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer py-1">
                <span className="text-[#414844]">Harvest &amp; Dispatch SMS Updates</span>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => setNotificationsEnabled(e.target.checked)}
                  className="rounded text-[#012d1d] focus:ring-[#012d1d] h-4 w-4"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
