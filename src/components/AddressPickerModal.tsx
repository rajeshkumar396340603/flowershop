import React, { useState } from 'react';
import { DeliveryAddress } from '../types';
import { SAVED_ADDRESSES } from '../data/florals';

interface AddressPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAddress: DeliveryAddress;
  onSelectAddress: (address: DeliveryAddress) => void;
}

export const AddressPickerModal: React.FC<AddressPickerModalProps> = ({
  isOpen,
  onClose,
  currentAddress,
  onSelectAddress,
}) => {
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(SAVED_ADDRESSES);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newArea, setNewArea] = useState('');
  const [newStreet, setNewStreet] = useState('');

  if (!isOpen) return null;

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArea.trim()) return;

    const newAddr: DeliveryAddress = {
      id: `addr-${Date.now()}`,
      label: 'Custom Location',
      area: newArea.trim(),
      addressLine: newStreet.trim() || 'Bloom House, Bengaluru',
      city: 'Bengaluru 560001',
      isDefault: false,
    };

    setAddresses([newAddr, ...addresses]);
    onSelectAddress(newAddr);
    setIsAddingNew(false);
    setNewArea('');
    setNewStreet('');
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
            <span className="material-symbols-outlined text-[20px] text-[#012d1d]">
              location_on
            </span>
            <h2 className="font-serif text-[17px] font-semibold text-[#012d1d]">
              Select Delivery Address
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white text-[#012d1d] flex items-center justify-center hover:bg-[#efeeea] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-[12px] font-sans text-[#717973]">
            Bloomify delivers via specialized climate-controlled vans across all Bengaluru pin codes to preserve freshness.
          </p>

          <div className="space-y-2.5">
            {addresses.map((addr) => {
              const isSelected = currentAddress.id === addr.id;
              return (
                <div
                  key={addr.id}
                  onClick={() => {
                    onSelectAddress(addr);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-white border-[#012d1d] ring-1 ring-[#012d1d] shadow-sm'
                      : 'bg-white border-[#efeeea] hover:bg-[#f5f3ef]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-[13px] font-semibold text-[#012d1d]">
                        {addr.label} · {addr.area}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[9px] bg-[#c1ecd4] text-[#002114] px-1.5 py-0.5 rounded font-bold uppercase">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#414844] leading-relaxed">
                      {addr.addressLine}, {addr.city}
                    </p>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border flex-shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-[#012d1d] border-[#012d1d] text-white'
                        : 'border-[#c1c8c2] bg-white'
                    }`}
                  >
                    {isSelected && (
                      <span className="material-symbols-outlined text-[13px]">check</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add New Address Form */}
          {isAddingNew ? (
            <form onSubmit={handleAddNew} className="bg-white p-4 rounded-2xl border border-[#efeeea] space-y-3">
              <span className="font-serif text-[14px] font-semibold text-[#012d1d] block">
                Add New Delivery Pin
              </span>
              <input
                type="text"
                placeholder="Area (e.g. Sadashivanagar, Malleshwaram, HSR)"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                className="w-full text-[12px] px-3 py-2 rounded-lg border border-[#efeeea] focus:outline-none focus:border-[#012d1d]"
                required
              />
              <input
                type="text"
                placeholder="Apartment, Street address"
                value={newStreet}
                onChange={(e) => setNewStreet(e.target.value)}
                className="w-full text-[12px] px-3 py-2 rounded-lg border border-[#efeeea] focus:outline-none focus:border-[#012d1d]"
              />
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-3 py-1.5 text-[11px] text-[#717973] hover:text-[#012d1d]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-[11px] font-semibold bg-[#012d1d] text-white rounded-full hover:bg-[#1b4332]"
                >
                  Save &amp; Deliver Here
                </button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddingNew(true)}
              className="w-full py-2.5 px-4 rounded-2xl border border-dashed border-[#717973]/40 text-[#012d1d] text-[12px] font-sans font-semibold flex items-center justify-center gap-1.5 hover:bg-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Deliver to Another Bengaluru Address
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
