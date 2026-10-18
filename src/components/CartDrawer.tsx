import React, { useState } from 'react';
import { CartItem, DeliveryAddress, GiftMessage } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  currentAddress: DeliveryAddress;
  onClearCart: () => void;
  onUpdateGiftMessage?: (productId: string, giftMessage: GiftMessage | undefined) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  currentAddress,
  onClearCart,
  onUpdateGiftMessage,
}) => {
  const [selectedSlot, setSelectedSlot] = useState<'today-evening' | 'tomorrow-dawn' | 'tomorrow-noon'>(
    'today-evening'
  );
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Cart-level / Order-level gift message state
  const firstItemWithGift = cartItems.find((i) => i.giftMessage);
  const [includeOrderGiftMessage, setIncludeOrderGiftMessage] = useState<boolean>(
    Boolean(firstItemWithGift)
  );
  const [recipient, setRecipient] = useState(firstItemWithGift?.giftMessage?.recipient || '');
  const [sender, setSender] = useState(firstItemWithGift?.giftMessage?.sender || 'Rajesh Kumar');
  const [giftText, setGiftText] = useState(firstItemWithGift?.giftMessage?.message || '');
  const [editingTargetId, setEditingTargetId] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal >= 1499 || subtotal === 0 ? 0 : 150;
  const discountAmount = discountApplied ? Math.round(subtotal * 0.1) : 0;
  const grandTotal = subtotal + deliveryFee - discountAmount;

  const quickMessageSuggestions = [
    { label: 'Happy Birthday', msg: 'Wishing you a day as radiant and blooming as these fresh flowers! Happy Birthday.' },
    { label: 'Thinking of You', msg: 'Sending quiet warmth, love, and fresh morning blooms your way today.' },
    { label: 'With All My Love', msg: 'Every petal in this bouquet carries my deepest love and affection for you.' },
    { label: 'Congratulations', msg: 'So proud of your achievement! May this new chapter flourish beautifully.' },
  ];

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'SPRING10' || promoCode.trim().toUpperCase() === 'BLOOM') {
      setDiscountApplied(true);
    }
  };

  const handleSaveGiftMessage = () => {
    if (!includeOrderGiftMessage || !giftText.trim()) {
      // Remove gift messages if unchecked
      if (editingTargetId && onUpdateGiftMessage) {
        onUpdateGiftMessage(editingTargetId, undefined);
      } else if (onUpdateGiftMessage && cartItems.length > 0) {
        onUpdateGiftMessage(cartItems[0].product.id, undefined);
      }
      return;
    }

    const compiledMessage: GiftMessage = {
      recipient: recipient.trim() || 'Someone Special',
      sender: sender.trim() || 'Rajesh Kumar',
      message: giftText.trim(),
      cardTheme: 'botanical',
    };

    const targetProductId = editingTargetId || (cartItems.length > 0 ? cartItems[0].product.id : null);
    if (targetProductId && onUpdateGiftMessage) {
      onUpdateGiftMessage(targetProductId, compiledMessage);
    }
    setEditingTargetId(null);
  };

  const handleCheckout = () => {
    // Ensure gift note is saved if typed
    if (includeOrderGiftMessage && giftText.trim()) {
      handleSaveGiftMessage();
    }
    const randomId = `BLM-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderId(randomId);
    setOrderSuccess(true);
    setTimeout(() => {
      onClearCart();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#fbf9f5] rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl flex flex-col border border-[#efeeea]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-[#fbf9f5]/95 backdrop-blur-md border-b border-[#efeeea]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-[#012d1d]">
              shopping_bag
            </span>
            <h2 className="font-serif text-[18px] font-semibold text-[#012d1d]">
              Floral Atelier Bag
            </h2>
            {cartItems.length > 0 && (
              <span className="text-[11px] font-sans font-bold bg-[#ffdbd2] text-[#3c0800] px-2 py-0.5 rounded-full">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)} items
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-[#012d1d] flex items-center justify-center hover:bg-[#efeeea] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Order Success State */}
        {orderSuccess ? (
          <div className="p-6 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-[#c1ecd4] text-[#002114] flex items-center justify-center mx-auto shadow-md">
              <span className="material-symbols-outlined text-[32px] material-symbols-filled">
                task_alt
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-sans font-bold text-[#9a442d] uppercase tracking-wider">
                Order Confirmed
              </span>
              <h3 className="font-serif text-[22px] font-semibold text-[#012d1d]">
                Stem Harvest Scheduled!
              </h3>
              <p className="font-sans text-[12px] text-[#717973]">
                Order Reference: <strong className="text-[#012d1d] font-bold">{orderId}</strong>
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#efeeea] text-left text-[12px] space-y-2 text-[#414844]">
              <div className="flex justify-between">
                <span>Destination:</span>
                <span className="font-semibold text-[#012d1d]">{currentAddress.area}, Bengaluru</span>
              </div>
              <div className="flex justify-between">
                <span>Dispatch Slot:</span>
                <span className="font-semibold text-[#012d1d]">
                  {selectedSlot === 'today-evening'
                    ? 'Today, 5:00 PM - 8:00 PM'
                    : selectedSlot === 'tomorrow-dawn'
                    ? 'Tomorrow Dawn Fresh (7:00 AM - 10:00 AM)'
                    : 'Tomorrow Afternoon (1:00 PM - 4:00 PM)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Vase Longevity:</span>
                <span className="text-[#012d1d] font-semibold">5+ Days Guaranteed</span>
              </div>
            </div>

            {/* Attached Gift Note Confirmation */}
            {includeOrderGiftMessage && giftText.trim() && (
              <div className="bg-[#fdfbf7] p-4 rounded-2xl border border-[#e4e2de] text-left space-y-1 shadow-2xs">
                <div className="flex items-center justify-between text-[11px] text-[#9a442d] font-bold uppercase tracking-wider pb-1 border-b border-[#efeeea]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">mark_email_read</span>
                    Attached Calligraphy Gift Card
                  </span>
                  <span className="text-[9px] bg-[#c1ecd4] text-[#002114] px-1.5 py-0.2 rounded font-sans">
                    Hand-Transcribed
                  </span>
                </div>
                <p className="font-serif italic text-[11px] text-[#717973] pt-1">
                  For: <strong className="text-[#012d1d] font-semibold">{recipient || 'Someone Special'}</strong>
                </p>
                <p className="font-serif italic text-[12px] text-[#1b1c1a] leading-relaxed">
                  &ldquo;{giftText}&rdquo;
                </p>
                <p className="font-serif italic text-[11px] text-right text-[#717973]">
                  From: {sender || 'Rajesh'}
                </p>
              </div>
            )}

            <p className="text-[11px] text-[#717973] leading-relaxed">
              Your floral specimens will be conditioning-wrapped in moisture pouches and dispatched in refrigerated courier transport.
            </p>

            <button
              onClick={() => {
                setOrderSuccess(false);
                onClose();
              }}
              className="w-full py-3.5 px-4 rounded-full bg-[#012d1d] text-white font-sans text-[13px] font-semibold hover:bg-[#1b4332] transition-colors shadow-sm cursor-pointer"
            >
              Continue Exploring Florals
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty Bag State */
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-[#f5f3ef] text-[#717973] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[30px]">local_florist</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-[18px] font-semibold text-[#012d1d]">
                Your Bag is Empty
              </h3>
              <p className="font-sans text-[12px] text-[#717973]">
                Discover fresh morning cuts and artisanal stems curated for Spring 2025.
              </p>
            </div>
            <button
              onClick={onClose}
              className="py-2.5 px-6 rounded-full bg-[#012d1d] text-white font-sans text-[12px] font-semibold hover:bg-[#1b4332] transition-colors cursor-pointer"
            >
              Discover Curated Blooms
            </button>
          </div>
        ) : (
          /* Active Cart Items */
          <div className="p-5 space-y-5">
            {/* Delivery Neighborhood Marker */}
            <div className="bg-[#f5f3ef] p-3 rounded-2xl flex items-center justify-between border border-[#efeeea]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#012d1d]">
                  pin_drop
                </span>
                <span className="text-[12px] font-sans font-medium text-[#012d1d]">
                  Delivering to <strong>{currentAddress.area}</strong>, Bengaluru
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#9a442d] uppercase">Fast Dispatch</span>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              {cartItems.map((item) => {
                const hasItemGift = Boolean(item.giftMessage);

                return (
                  <div
                    key={item.product.id}
                    className="bg-white p-3.5 rounded-2xl border border-[#efeeea] shadow-2xs space-y-2.5"
                  >
                    <div className="flex gap-3 items-center">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-20 rounded-xl object-cover bg-[#f5f3ef] flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="font-serif text-[14px] font-semibold text-[#012d1d] truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-[11px] text-[#717973] truncate">
                          {item.product.subtitle}
                        </p>
                        <div className="font-sans text-[14px] font-bold text-[#012d1d] pt-0.5">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-[#717973] hover:text-[#9a442d] transition-colors p-1"
                          title="Remove"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                        <div className="flex items-center bg-[#f5f3ef] rounded-full p-0.5 border border-[#efeeea]">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[#012d1d] hover:bg-white transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[14px]">remove</span>
                          </button>
                          <span className="w-6 text-center font-sans text-[12px] font-bold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[#012d1d] hover:bg-white transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[14px]">add</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Attached Gift Note Strip on Item */}
                    {hasItemGift && item.giftMessage && (
                      <div className="bg-[#fbf9f5] px-3 py-2 rounded-xl border border-[#efeeea] flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="material-symbols-outlined text-[14px] text-[#9a442d]">
                            mark_email_read
                          </span>
                          <span className="text-[#012d1d] font-semibold truncate">
                            Note for {item.giftMessage.recipient}:
                          </span>
                          <span className="text-[#717973] truncate italic">
                            &ldquo;{item.giftMessage.message}&rdquo;
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setEditingTargetId(item.product.id);
                            setIncludeOrderGiftMessage(true);
                            setRecipient(item.giftMessage?.recipient || '');
                            setSender(item.giftMessage?.sender || 'Rajesh Kumar');
                            setGiftText(item.giftMessage?.message || '');
                          }}
                          className="text-[#9a442d] font-semibold hover:underline flex-shrink-0 ml-2"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ================= Optional Gift Message Text Area Section ================= */}
            <div className="bg-[#fdfbf7] p-4 rounded-3xl border border-[#efeeea] shadow-2xs space-y-3.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeOrderGiftMessage}
                    onChange={(e) => {
                      const willInclude = e.target.checked;
                      setIncludeOrderGiftMessage(willInclude);
                      if (!willInclude) {
                        handleSaveGiftMessage();
                      }
                    }}
                    className="rounded text-[#012d1d] focus:ring-[#012d1d] h-4 w-4 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-serif font-semibold text-[#012d1d] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#9a442d]">
                        edit_note
                      </span>
                      Personalized Gift Message &amp; Card
                    </span>
                    <span className="text-[10px] text-[#717973]">
                      Transcribed in ink onto archival botanical parchment
                    </span>
                  </div>
                </label>
                <span className="text-[10px] font-sans font-bold bg-[#c1ecd4] text-[#002114] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Free
                </span>
              </div>

              {includeOrderGiftMessage && (
                <div className="space-y-3 pt-1 border-t border-[#efeeea] animate-in fade-in duration-200">
                  {/* Recipient & Sender Fields */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-[10px] font-bold text-[#717973] uppercase tracking-wider mb-1">
                        Recipient (To)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Ananya"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        onBlur={handleSaveGiftMessage}
                        className="w-full text-[12px] px-3 py-2 bg-white rounded-xl border border-[#efeeea] focus:outline-none focus:border-[#012d1d] text-[#012d1d]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#717973] uppercase tracking-wider mb-1">
                        Sender (From)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Rajesh Kumar"
                        value={sender}
                        onChange={(e) => setSender(e.target.value)}
                        onBlur={handleSaveGiftMessage}
                        className="w-full text-[12px] px-3 py-2 bg-white rounded-xl border border-[#efeeea] focus:outline-none focus:border-[#012d1d] text-[#012d1d]"
                      />
                    </div>
                  </div>

                  {/* Quick Occasion Starters */}
                  <div>
                    <span className="block text-[10px] font-bold text-[#717973] uppercase tracking-wider mb-1.5">
                      Quick Suggestions:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {quickMessageSuggestions.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setGiftText(item.msg);
                            setTimeout(handleSaveGiftMessage, 50);
                          }}
                          className="text-[10px] font-sans font-medium px-2.5 py-1 rounded-full bg-white border border-[#efeeea] text-[#414844] hover:border-[#012d1d] hover:text-[#012d1d] transition-all cursor-pointer"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Main Gift Message Text Area */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-bold text-[#717973] uppercase tracking-wider">
                        Gift Message Text Area
                      </label>
                      <span className="text-[10px] text-[#717973] tabular-nums">
                        {giftText.length}/250 characters
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      maxLength={250}
                      placeholder="Write your personalized note here... (Florist will hand-letter in calligraphy onto botanical parchment card)..."
                      value={giftText}
                      onChange={(e) => setGiftText(e.target.value)}
                      onBlur={handleSaveGiftMessage}
                      className="w-full text-[12px] p-3 bg-white rounded-xl border border-[#efeeea] focus:outline-none focus:border-[#012d1d] text-[#012d1d] leading-relaxed resize-none"
                    />
                  </div>

                  {/* Live Calligraphy Card Preview */}
                  {giftText.trim() && (
                    <div className="bg-[#fbf9f5] rounded-2xl p-3.5 border border-[#e4e2de] shadow-inner space-y-1.5 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-[11px] text-[#9a442d] font-bold uppercase tracking-wider flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">mark_email_read</span>
                          Live Calligraphy Card Preview
                        </span>
                        <span className="text-[9px] bg-[#efeeea] text-[#717973] px-2 py-0.5 rounded-full">
                          Wax-sealed Enclosure
                        </span>
                      </div>

                      <div className="pt-1 text-[#012d1d]">
                        <p className="font-serif italic text-[11px] text-[#717973]">
                          Dearest {recipient || 'Someone Special'},
                        </p>
                        <p className="font-serif text-[13px] leading-relaxed text-[#1b1c1a] italic py-1">
                          &ldquo;{giftText}&rdquo;
                        </p>
                        <p className="font-serif italic text-[11px] text-right text-[#717973]">
                          With love, {sender || 'Rajesh'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Delivery Time Slot Picker */}
            <div className="space-y-2">
              <span className="font-serif text-[14px] font-semibold text-[#012d1d] block">
                Choose Delivery Slot
              </span>
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    id: 'today-evening',
                    title: 'Today Evening (5:00 PM - 8:00 PM)',
                    subtitle: 'Same-day express van dispatch',
                    tag: 'Same Day',
                  },
                  {
                    id: 'tomorrow-dawn',
                    title: 'Tomorrow Dawn Fresh (7:00 AM - 10:00 AM)',
                    subtitle: 'Direct from dawn harvest',
                    tag: 'Recommended',
                  },
                  {
                    id: 'tomorrow-noon',
                    title: 'Tomorrow Afternoon (1:00 PM - 4:00 PM)',
                    subtitle: 'Chilled delivery slot',
                    tag: 'Standard',
                  },
                ].map((slot) => {
                  const isSelected = selectedSlot === slot.id;
                  return (
                    <div
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot.id as any)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-white border-[#012d1d] ring-1 ring-[#012d1d]'
                          : 'bg-white border-[#efeeea] hover:bg-[#f5f3ef]'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="font-sans text-[12px] font-semibold text-[#012d1d] block">
                          {slot.title}
                        </span>
                        <span className="text-[11px] text-[#717973]">{slot.subtitle}</span>
                      </div>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          isSelected ? 'bg-[#c1ecd4] text-[#002114]' : 'bg-[#efeeea] text-[#717973]'
                        }`}
                      >
                        {slot.tag}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Promo Code Input */}
            <form onSubmit={applyPromo} className="flex gap-2">
              <input
                type="text"
                placeholder="Promo code (e.g., SPRING10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 text-[12px] px-3.5 py-2.5 rounded-xl bg-white border border-[#efeeea] focus:outline-none focus:border-[#012d1d] uppercase font-sans tracking-wide"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#012d1d] text-white text-[12px] font-semibold hover:bg-[#1b4332] transition-colors cursor-pointer"
              >
                Apply
              </button>
            </form>
            {discountApplied && (
              <p className="text-[11px] text-[#012d1d] font-semibold bg-[#c1ecd4]/60 p-2 rounded-lg flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                10% Seasonal Florist Privilege applied!
              </p>
            )}

            {/* Billing Breakdown */}
            <div className="bg-white p-4 rounded-2xl border border-[#efeeea] space-y-2.5 text-[12px] text-[#414844]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#012d1d] tabular-nums">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Climate-Controlled Logistics</span>
                <span className="font-semibold text-[#012d1d]">
                  {deliveryFee === 0 ? (
                    <span className="text-[#002114] bg-[#c1ecd4] px-1.5 py-0.5 rounded text-[10px] font-bold">
                      FREE
                    </span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Silk Ribbon &amp; Hydration Pouch</span>
                <span className="text-[#002114] bg-[#c1ecd4] px-1.5 py-0.5 rounded text-[10px] font-bold">
                  COMPLIMENTARY
                </span>
              </div>
              {includeOrderGiftMessage && giftText.trim() && (
                <div className="flex justify-between">
                  <span>Calligraphy Parchment Card</span>
                  <span className="text-[#002114] bg-[#c1ecd4] px-1.5 py-0.5 rounded text-[10px] font-bold">
                    INCLUDED
                  </span>
                </div>
              )}
              {discountApplied && (
                <div className="flex justify-between text-[#9a442d]">
                  <span>Privilege Discount</span>
                  <span className="font-semibold tabular-nums">-₹{discountAmount}</span>
                </div>
              )}
              <div className="border-t border-[#efeeea] pt-2 flex justify-between font-bold text-[14px] text-[#012d1d]">
                <span>Grand Total</span>
                <span className="tabular-nums">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Footer Checkout Button */}
        {!orderSuccess && cartItems.length > 0 && (
          <div className="sticky bottom-0 p-4 bg-white/95 backdrop-blur-md border-t border-[#efeeea] flex items-center gap-3">
            <div className="flex flex-col min-w-[90px]">
              <span className="text-[10px] text-[#717973] uppercase tracking-wide">Payable</span>
              <span className="font-sans text-[18px] font-bold text-[#012d1d] tabular-nums">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="flex-1 py-3.5 px-4 rounded-full bg-[#012d1d] text-white font-sans text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-[#1b4332] active:scale-98 transition-all shadow-md cursor-pointer"
            >
              <span>Schedule Floral Delivery</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
