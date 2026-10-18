import React, { useState } from 'react';
import { FloralProduct, GiftMessage } from '../types';

interface ProductDetailModalProps {
  product: FloralProduct | null;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: FloralProduct) => void;
  onAddToCart: (
    product: FloralProduct,
    vaseOption?: string,
    customNote?: string,
    giftMessage?: GiftMessage
  ) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}) => {
  const [activeCareTab, setActiveCareTab] = useState<'sunlight' | 'hydration' | 'pets' | 'longevity'>('hydration');
  const [selectedVase, setSelectedVase] = useState<'none' | 'glass' | 'clay'>(
    product?.vaseIncluded ? 'glass' : 'none'
  );
  const [includeGiftNote, setIncludeGiftNote] = useState(false);
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('Rajesh Kumar');
  const [giftNote, setGiftNote] = useState('');
  const [cardTheme, setCardTheme] = useState<'botanical' | 'gold-foil' | 'kraft'>('botanical');

  if (!product) return null;

  const vaseAddonPrice = selectedVase === 'glass' ? (product.vaseIncluded ? 0 : 450) : selectedVase === 'clay' ? 650 : 0;
  const totalPrice = product.price + vaseAddonPrice;

  const quickMessageSuggestions = [
    { label: 'Happy Birthday', msg: 'Wishing you a day as radiant and blooming as these fresh flowers! Happy Birthday.' },
    { label: 'Thinking of You', msg: 'Sending quiet warmth, love, and fresh morning blooms your way today.' },
    { label: 'With All My Love', msg: 'Every petal in this bouquet carries my deepest love and affection for you.' },
    { label: 'Congratulations', msg: 'So proud of your achievement! May this new chapter flourish beautifully.' },
  ];

  const handleAdd = () => {
    const formattedGiftMessage: GiftMessage | undefined = includeGiftNote && giftNote.trim()
      ? {
          recipient: recipientName.trim() || 'Someone Special',
          sender: senderName.trim() || 'A Secret Admirer',
          message: giftNote.trim(),
          cardTheme,
        }
      : undefined;

    const shortSummary = formattedGiftMessage
      ? `For ${formattedGiftMessage.recipient}: "${formattedGiftMessage.message.slice(0, 40)}..."`
      : undefined;

    onAddToCart(product, selectedVase, shortSummary, formattedGiftMessage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#fbf9f5] rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl flex flex-col border border-[#efeeea]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Sticky Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-[#fbf9f5]/90 backdrop-blur-md border-b border-[#efeeea]">
          <div className="flex items-center gap-2">
            <span className="font-serif text-[16px] font-semibold text-[#012d1d]">
              Florist Atelier Specimen
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWishlist(product)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isWishlisted
                  ? 'bg-[#9a442d] text-white shadow-sm'
                  : 'bg-white text-[#012d1d] hover:bg-[#efeeea]'
              }`}
            >
              <span className={`material-symbols-outlined text-[18px] ${isWishlisted ? 'material-symbols-filled' : ''}`}>
                favorite
              </span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white text-[#012d1d] flex items-center justify-center hover:bg-[#efeeea] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Hero Floral Image */}
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-sm bg-[#efeeea]">
            <img
              src={product.image}
              alt={product.altText}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md font-sans text-[10px] font-bold text-[#012d1d] uppercase tracking-wider shadow-sm">
                {product.badge}
              </span>
              {product.sameDayEligible && (
                <span className="px-2.5 py-1 rounded-full bg-[#c1ecd4] font-sans text-[10px] font-bold text-[#002114] flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[12px] material-symbols-filled">bolt</span>
                  Same-Day
                </span>
              )}
            </div>

            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[#012d1d] flex items-center gap-1.5 shadow-sm text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px] text-[#9a442d] material-symbols-filled">star</span>
              <span>{product.rating}</span>
              <span className="text-[#717973] font-normal">({product.reviewsCount} reviews)</span>
            </div>
          </div>

          {/* Title & Price Header */}
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-serif text-[24px] font-semibold text-[#012d1d] leading-tight">
                  {product.name}
                </h1>
                <p className="font-sans text-[13px] text-[#717973] mt-0.5">
                  {product.subtitle} · {product.stemsInfo}
                </p>
              </div>
              <div className="text-right">
                <span className="font-sans text-[22px] font-bold text-[#012d1d]">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <p className="text-[12px] text-[#717973] line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </p>
                )}
              </div>
            </div>
            <p className="font-sans text-[13px] text-[#414844] leading-relaxed pt-2">
              {product.description}
            </p>
          </div>

          {/* Scent & Fragrance Profile */}
          <div className="bg-[#f5f3ef] rounded-2xl p-4 border border-[#efeeea] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-serif text-[14px] font-medium text-[#012d1d] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#9a442d]">spa</span>
                Aromatic Scent Profile
              </span>
              <span className="font-sans text-[11px] font-bold text-[#9a442d] uppercase tracking-wide">
                {product.scentProfile.intensity} Intensity
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {product.scentProfile.notes.map((note, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full bg-white text-[#012d1d] text-[11px] font-medium border border-[#efeeea] shadow-2xs"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Stem & Botanical Anatomy Breakdown */}
          <div className="space-y-2.5">
            <h3 className="font-serif text-[15px] font-semibold text-[#012d1d]">
              Botanical Recipe &amp; Stems
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {product.flowerBreakdown.map((item, i) => (
                <div
                  key={i}
                  className="bg-white p-2.5 rounded-xl border border-[#efeeea] flex flex-col justify-between"
                >
                  <span className="text-[12px] font-sans font-medium text-[#012d1d]">
                    {item.flower}
                  </span>
                  <span className="text-[11px] text-[#717973] mt-0.5 font-sans">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Vase Selection Options */}
          {!product.vaseIncluded && (
            <div className="space-y-2">
              <h3 className="font-serif text-[15px] font-semibold text-[#012d1d]">
                Pair with Artisanal Vessel
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedVase('none')}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedVase === 'none'
                      ? 'border-[#012d1d] bg-white ring-1 ring-[#012d1d]'
                      : 'border-[#efeeea] bg-white hover:bg-[#f5f3ef]'
                  }`}
                >
                  <span className="text-[11px] font-bold block text-[#012d1d]">Hand-tied Wrap</span>
                  <span className="text-[10px] text-[#717973]">Included</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedVase('glass')}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedVase === 'glass'
                      ? 'border-[#012d1d] bg-white ring-1 ring-[#012d1d]'
                      : 'border-[#efeeea] bg-white hover:bg-[#f5f3ef]'
                  }`}
                >
                  <span className="text-[11px] font-bold block text-[#012d1d]">Fluted Glass</span>
                  <span className="text-[10px] text-[#9a442d] font-semibold">+₹450</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedVase('clay')}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedVase === 'clay'
                      ? 'border-[#012d1d] bg-white ring-1 ring-[#012d1d]'
                      : 'border-[#efeeea] bg-white hover:bg-[#f5f3ef]'
                  }`}
                >
                  <span className="text-[11px] font-bold block text-[#012d1d]">Sand Ceramic</span>
                  <span className="text-[10px] text-[#9a442d] font-semibold">+₹650</span>
                </button>
              </div>
            </div>
          )}

          {/* Complimentary Botanical Care Accordion */}
          <div className="space-y-2">
            <h3 className="font-serif text-[15px] font-semibold text-[#012d1d] flex items-center justify-between">
              <span>Florist&apos;s Care Ritual</span>
              <span className="font-sans text-[11px] text-[#717973] font-normal">5+ Days Guaranteed</span>
            </h3>

            <div className="bg-white rounded-2xl border border-[#efeeea] overflow-hidden">
              <div className="grid grid-cols-4 border-b border-[#efeeea] bg-[#f5f3ef]">
                {(
                  [
                    { id: 'hydration', label: 'Water', icon: 'water_drop' },
                    { id: 'sunlight', label: 'Light', icon: 'wb_sunny' },
                    { id: 'pets', label: 'Pet Safe', icon: 'pets' },
                    { id: 'longevity', label: 'Longevity', icon: 'eco' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCareTab(tab.id)}
                    className={`py-2 px-1 text-center flex flex-col items-center gap-0.5 transition-colors cursor-pointer ${
                      activeCareTab === tab.id
                        ? 'bg-white text-[#012d1d] font-bold border-b-2 border-[#012d1d]'
                        : 'text-[#717973] hover:text-[#012d1d]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                    <span className="text-[10px]">{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="p-3.5 text-[12px] text-[#414844] leading-relaxed">
                {activeCareTab === 'hydration' && (
                  <p>
                    <strong className="text-[#012d1d]">Hydration Protocol:</strong> {product.careRitual.hydration}
                  </p>
                )}
                {activeCareTab === 'sunlight' && (
                  <p>
                    <strong className="text-[#012d1d]">Light Exposure:</strong> {product.careRitual.sunlight}
                  </p>
                )}
                {activeCareTab === 'pets' && (
                  <p>
                    <strong className="text-[#012d1d]">Furry Friends Note:</strong> {product.careRitual.petSafety}
                  </p>
                )}
                {activeCareTab === 'longevity' && (
                  <p>
                    <strong className="text-[#012d1d]">Longevity Secret:</strong> {product.careRitual.longevityTip}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Complimentary Handwritten Gift Note Option */}
          <div className="bg-[#fdfbf7] p-4 rounded-3xl border border-[#efeeea] space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeGiftNote}
                  onChange={(e) => setIncludeGiftNote(e.target.checked)}
                  className="rounded text-[#012d1d] focus:ring-[#012d1d] h-4 w-4 cursor-pointer"
                />
                <div className="flex flex-col">
                  <span className="text-[13px] font-serif font-semibold text-[#012d1d] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#9a442d]">
                      edit_note
                    </span>
                    Attach Personalized Gift Message
                  </span>
                  <span className="text-[10px] text-[#717973]">
                    Calligraphy note transcribed onto botanical parchment
                  </span>
                </div>
              </label>
              <span className="text-[10px] font-sans font-bold bg-[#c1ecd4] text-[#002114] px-2 py-0.5 rounded-full uppercase tracking-wider">
                Complimentary
              </span>
            </div>

            {includeGiftNote && (
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
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
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
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full text-[12px] px-3 py-2 bg-white rounded-xl border border-[#efeeea] focus:outline-none focus:border-[#012d1d] text-[#012d1d]"
                    />
                  </div>
                </div>

                {/* Quick Occasion Starters */}
                <div>
                  <span className="block text-[10px] font-bold text-[#717973] uppercase tracking-wider mb-1.5">
                    Quick Inspirations:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {quickMessageSuggestions.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setGiftNote(item.msg)}
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
                      {giftNote.length}/250 characters
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={250}
                    placeholder="Write your heartfelt message here... The florist will transcribe this in gold-trimmed ink onto archival parchment."
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    className="w-full text-[12px] p-3 bg-white rounded-xl border border-[#efeeea] focus:outline-none focus:border-[#012d1d] text-[#012d1d] leading-relaxed resize-none"
                  />
                </div>

                {/* Live Calligraphy Card Preview */}
                {giftNote.trim() && (
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
                        Dearest {recipientName || 'Someone Special'},
                      </p>
                      <p className="font-serif text-[13px] leading-relaxed text-[#1b1c1a] italic py-1">
                        &ldquo;{giftNote}&rdquo;
                      </p>
                      <p className="font-serif italic text-[11px] text-right text-[#717973]">
                        With love, {senderName || 'Rajesh'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Sticky CTA */}
        <div className="sticky bottom-0 p-4 bg-white/95 backdrop-blur-md border-t border-[#efeeea] flex items-center gap-3">
          <div className="flex flex-col min-w-[90px]">
            <span className="text-[10px] text-[#717973] uppercase tracking-wide">Total Price</span>
            <span className="font-sans text-[18px] font-bold text-[#012d1d]">
              ₹{totalPrice.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={handleAdd}
            className="flex-1 py-3.5 px-4 rounded-full bg-[#012d1d] text-white font-sans text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-[#1b4332] active:scale-98 transition-all shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
};
