import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import {
  BOTTLE_SIZES,
  BOOSTER_OPTIONS,
  PICKUP_LOCATIONS,
  PICKUP_SLOTS,
} from '../data/juices';
import { CartItem, ConfirmedOrder } from '../types/order';
import { ResilientImage } from './ResilientImage';

interface CartCheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
  onOrderConfirmed: (order: ConfirmedOrder) => void;
  activeConfirmedOrder: ConfirmedOrder | null;
}

export const CartCheckoutDrawer: React.FC<CartCheckoutDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderConfirmed,
  activeConfirmedOrder,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [fulfillmentMode, setFulfillmentMode] = useState<'pickup' | 'delivery'>('pickup');
  const [selectedLocationId, setSelectedLocationId] = useState<string>(PICKUP_LOCATIONS[0].id);
  const [selectedSlot, setSelectedSlot] = useState<string>(PICKUP_SLOTS[0]);
  const [returnedBottlesCount, setReturnedBottlesCount] = useState<number>(0);
  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string>('');

  const [customerName, setCustomerName] = useState<string>('Clara Vance');
  const [customerPhone, setCustomerPhone] = useState<string>('(212) 555-0194');
  const [customerEmail, setCustomerEmail] = useState<string>('clara.vance@atelier.org');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('84 Mercer St, Apt 4B, New York, NY 10012');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [formError, setFormError] = useState<string>('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const totalBottles = cart.reduce(
    (sum, item) => sum + (item.isFlightBundle ? item.quantity * 6 : item.quantity),
    0
  );

  const glassDepositTotal = cart.reduce((sum, item) => {
    if (item.isFlightBundle) {
      return sum + 1.5 * 6 * item.quantity;
    }
    const sizeObj = BOTTLE_SIZES.find((s) => s.id === item.size) || BOTTLE_SIZES[0];
    return sum + sizeObj.glassDeposit * item.quantity;
  }, 0);

  const returnedBottlesCredit = Math.min(returnedBottlesCount * 1.5, glassDepositTotal);
  const discountAmount = appliedPromo === 'AUTUMN15' ? Math.round(subtotal * 0.15 * 100) / 100 : 0;
  const freeDeliveryThreshold = 55;
  const deliveryFee =
    fulfillmentMode === 'pickup' ? 0 : subtotal >= freeDeliveryThreshold ? 0 : 6.5;

  const finalTotal = Math.max(
    0,
    subtotal + glassDepositTotal - returnedBottlesCredit - discountAmount + deliveryFee
  );

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = promoCodeInput.trim().toUpperCase();
    if (cleaned === 'AUTUMN15') {
      setAppliedPromo('AUTUMN15');
      setPromoError('');
    } else {
      setPromoError('Try code AUTUMN15 for 15% off seasonal harvest.');
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      setFormError('Please provide your name and mobile number.');
      return;
    }
    if (fulfillmentMode === 'delivery' && !deliveryAddress.trim()) {
      setFormError('Please provide a delivery address.');
      return;
    }
    setFormError('');

    const loc = PICKUP_LOCATIONS.find((l) => l.id === selectedLocationId);
    const orderNum = `VP-${Math.floor(1040 + Math.random() * 890)}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: ConfirmedOrder = {
      orderNumber: orderNum,
      createdAt: `Today at ${nowTime}`,
      fulfillmentMode,
      pickupLocationName: loc?.name,
      pickupSlot: selectedSlot,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      deliveryAddress: fulfillmentMode === 'delivery' ? deliveryAddress.trim() : undefined,
      paymentMethod,
      items: [...cart],
      subtotal,
      glassDepositTotal,
      returnedBottlesCredit,
      discountAmount,
      deliveryFee,
      total: finalTotal,
      currentStepIndex: 1,
    };

    onOrderConfirmed(newOrder);
    onClearCart();
    setStep('confirmed');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Apothecary Order Bag and Checkout"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-[#FBFBF9] h-full flex flex-col justify-between shadow-2xl border-l border-black/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-black/8 bg-[#F4F3EF] flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-500">
              <span>JuiceFlow Fulfillment</span>
              <span className="mx-1.5" aria-hidden="true">·</span>
              <span className="font-mono-tabular">{totalBottles} Vessels</span>
            </div>
            <h2 className="font-display text-2xl font-semibold text-zinc-900">
              {step === 'confirmed' || (cart.length === 0 && activeConfirmedOrder)
                ? 'Order Verification'
                : step === 'checkout'
                ? 'Schedule Pickup or Delivery'
                : 'Apothecary Order Bag'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close bag drawer"
            className="w-10 h-10 rounded-lg bg-white border border-black/10 flex items-center justify-center text-zinc-700 hover:text-zinc-950 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {(step === 'confirmed' || (cart.length === 0 && activeConfirmedOrder)) && activeConfirmedOrder ? (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-[#1E3F2B] text-white">
                <div className="flex items-center justify-between text-xs text-emerald-200/90 mb-1">
                  <span className="font-mono-tabular">
                    Order #{activeConfirmedOrder.orderNumber} Confirmed
                  </span>
                  <span>{activeConfirmedOrder.createdAt}</span>
                </div>
                <h3 className="font-display text-2xl font-medium">
                  Hydraulic Pressing & Chilling in Progress
                </h3>
                <p className="text-xs text-emerald-100/80 mt-1.5 leading-relaxed">
                  {activeConfirmedOrder.fulfillmentMode === 'pickup'
                    ? `Reserved at ${activeConfirmedOrder.pickupLocationName} (${activeConfirmedOrder.pickupSlot}).`
                    : `Insulated courier scheduled for ${activeConfirmedOrder.deliveryAddress} (${activeConfirmedOrder.pickupSlot}).`}
                </p>

                <div className="mt-5 pt-4 border-t border-white/15 grid grid-cols-3 gap-2 text-left">
                  <div>
                    <div className="text-[11px] font-mono-tabular text-emerald-300">
                      01. Confirmed
                    </div>
                    <div className="text-xs font-medium mt-0.5">Batch Assigned</div>
                  </div>
                  <div>
                    <div className="text-[11px] font-mono-tabular text-emerald-300">
                      02. Cold Press
                    </div>
                    <div className="text-xs font-medium mt-0.5">Bottling at 38°F</div>
                  </div>
                  <div className="opacity-75">
                    <div className="text-[11px] font-mono-tabular text-emerald-200">
                      03. Hand-Off
                    </div>
                    <div className="text-xs font-medium mt-0.5">Ice-Packed Seal</div>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-black/10 bg-white space-y-4">
                <div className="flex items-center justify-between border-b border-black/8 pb-3">
                  <div>
                    <div className="text-xs font-semibold text-zinc-900">
                      Customer & Payment Verification
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">
                      {activeConfirmedOrder.customerName} · {activeConfirmedOrder.customerPhone}
                    </div>
                  </div>
                  <span className="text-xs font-mono-tabular text-zinc-700">
                    {activeConfirmedOrder.paymentMethod === 'cod'
                      ? 'Pay on Pickup / Delivery'
                      : 'Paid via Card'}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {activeConfirmedOrder.items.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="flex items-start justify-between text-xs py-1"
                    >
                      <div className="pr-3">
                        <span className="font-medium text-zinc-900">
                          {item.quantity}× {item.product.name}
                        </span>
                        <div className="text-[11px] text-zinc-500">
                          {item.isFlightBundle
                            ? 'Custom 6-Bottle Flight'
                            : `${item.size} Vessel`}
                        </div>
                      </div>
                      <span className="font-mono-tabular text-zinc-900 font-medium">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-black/8 space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-500">
                    <span>Formulations Subtotal</span>
                    <span className="font-mono-tabular">${activeConfirmedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Returnable Glass Deposit</span>
                    <span className="font-mono-tabular">
                      +${activeConfirmedOrder.glassDepositTotal.toFixed(2)}
                    </span>
                  </div>
                  {activeConfirmedOrder.returnedBottlesCredit > 0 && (
                    <div className="flex justify-between text-[#1E3F2B]">
                      <span>Glass Return Loop Credit</span>
                      <span className="font-mono-tabular">
                        -${activeConfirmedOrder.returnedBottlesCredit.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {activeConfirmedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-[#1E3F2B]">
                      <span>Seasonal Harvest Promo (15%)</span>
                      <span className="font-mono-tabular">
                        -${activeConfirmedOrder.discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-zinc-500">
                    <span>Chilled Fulfillment</span>
                    <span className="font-mono-tabular">
                      {activeConfirmedOrder.deliveryFee === 0
                        ? 'Complimentary'
                        : `$${activeConfirmedOrder.deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold text-zinc-900 pt-2 border-t border-black/8">
                    <span>Total Verified</span>
                    <span className="font-mono-tabular">${activeConfirmedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStep('cart');
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-lg border border-black/15 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 transition-colors"
              >
                Return to Seasonal Harvest Menu
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <p className="font-display text-2xl text-zinc-800">
                Your Apothecary Bag is Empty
              </p>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                Explore our seasonal cold-pressed formulations or curate a custom 6-bottle flight with 15% savings.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#1E3F2B] text-white text-xs font-medium hover:bg-[#163020] transition-colors"
              >
                <span>Browse Seasonal Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : step === 'cart' ? (
            <>
              <div className="p-3.5 rounded-lg bg-[#F4F3EF] border border-black/8 text-xs">
                {subtotal >= freeDeliveryThreshold ? (
                  <div className="flex items-center gap-2 text-[#1E3F2B] font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>
                      Complimentary courier delivery unlocked ($55+ threshold met).
                    </span>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between text-zinc-700 mb-1.5">
                      <span>Add ${(freeDeliveryThreshold - subtotal).toFixed(2)} for free delivery</span>
                      <span className="font-mono-tabular">
                        ${subtotal.toFixed(0)} / ${freeDeliveryThreshold}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-black/8 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1E3F2B] transition-transform duration-200 origin-left"
                        style={{
                          transform: `scaleX(${Math.min(1, subtotal / freeDeliveryThreshold)})`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="divide-y divide-black/8">
                {cart.map((item) => {
                  const sizeObj =
                    BOTTLE_SIZES.find((s) => s.id === item.size) || BOTTLE_SIZES[0];
                  const boosterNames = item.boosterIds
                    .map((id) => BOOSTER_OPTIONS.find((b) => b.id === id)?.name)
                    .filter(Boolean);

                  return (
                    <div key={item.cartItemId} className="py-4 flex gap-3.5">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#F4F3EF] shrink-0">
                        <ResilientImage
                          src={item.product.image}
                          alt={item.product.name}
                          accentHex={item.product.accentHex}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-xs font-semibold text-zinc-900 leading-snug">
                            {item.product.name}
                          </h3>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.cartItemId)}
                            aria-label={`Remove ${item.product.name}`}
                            className="text-zinc-400 hover:text-zinc-800 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-[11px] text-zinc-500 mt-0.5">
                          {item.isFlightBundle ? (
                            <span>6 × 350 ml Custom Flight Crate (15% Savings)</span>
                          ) : (
                            <span>
                              {sizeObj.volumeLabel} · {item.product.category}
                            </span>
                          )}
                        </div>

                        {boosterNames.length > 0 && (
                          <div className="text-[11px] text-[#1E3F2B] mt-1">
                            + Boosters: {boosterNames.join(' · ')}
                          </div>
                        )}

                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center border border-black/12 rounded bg-white">
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                              aria-label="Decrease quantity"
                              className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:bg-zinc-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-mono-tabular text-xs font-medium px-2.5">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                              aria-label="Increase quantity"
                              className="w-7 h-7 flex items-center justify-center text-zinc-600 hover:bg-zinc-100"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="font-mono-tabular text-xs font-semibold text-zinc-900">
                            ${(item.unitPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-lg border border-black/10 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5 text-[#1E3F2B]" />
                      <span>Returning Clean Glass Bottles?</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Receive an instant $1.50 deposit credit per bottle returned at pickup or hand-off.
                    </p>
                  </div>

                  <div className="flex items-center border border-black/15 rounded bg-[#FBFBF9] shrink-0 ml-3">
                    <button
                      type="button"
                      onClick={() => setReturnedBottlesCount((c) => Math.max(0, c - 1))}
                      aria-label="Decrease returned bottles"
                      className="w-7 h-7 flex items-center justify-center text-zinc-700 hover:bg-zinc-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono-tabular text-xs font-medium px-2.5">
                      {returnedBottlesCount}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setReturnedBottlesCount((c) => Math.min(totalBottles, c + 1))
                      }
                      aria-label="Increase returned bottles"
                      className="w-7 h-7 flex items-center justify-center text-zinc-700 hover:bg-zinc-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoCodeInput}
                  onChange={(e) => setPromoCodeInput(e.target.value)}
                  placeholder="Harvest code (try AUTUMN15)"
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-black/15 bg-white focus:outline-none focus:border-[#1E3F2B]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg border border-black/15 bg-white hover:bg-zinc-100 text-xs font-medium text-zinc-800 whitespace-nowrap transition-colors"
                >
                  Apply
                </button>
              </form>
              {promoError && <p className="text-[11px] text-amber-800 -mt-4">{promoError}</p>}
              {appliedPromo && (
                <p className="text-[11px] text-[#1E3F2B] font-medium -mt-4">
                  Code {appliedPromo} applied: 15% off seasonal harvest formulations.
                </p>
              )}
            </>
          ) : (
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-900 mb-2">
                  1. Select Fulfillment Method
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setFulfillmentMode('pickup')}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      fulfillmentMode === 'pickup'
                        ? 'border-[#1E3F2B] bg-[#1E3F2B]/5 text-zinc-900'
                        : 'border-black/10 bg-white text-zinc-600'
                    }`}
                  >
                    <div className="text-xs font-semibold">Apothecary Pickup</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      Ready in 20 mins · Free
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfillmentMode('delivery')}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      fulfillmentMode === 'delivery'
                        ? 'border-[#1E3F2B] bg-[#1E3F2B]/5 text-zinc-900'
                        : 'border-black/10 bg-white text-zinc-600'
                    }`}
                  >
                    <div className="text-xs font-semibold">Chilled Delivery</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      {subtotal >= freeDeliveryThreshold ? 'Complimentary ($55+)' : '$6.50 Flat Rate'}
                    </div>
                  </button>
                </div>
              </div>

              {fulfillmentMode === 'pickup' ? (
                <div>
                  <label className="block text-xs font-semibold text-zinc-900 mb-2">
                    2. Choose Press Room Location
                  </label>
                  <div className="space-y-2">
                    {PICKUP_LOCATIONS.map((loc) => (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => setSelectedLocationId(loc.id)}
                        className={`w-full p-3 rounded-lg border text-left transition-colors ${
                          selectedLocationId === loc.id
                            ? 'border-[#1E3F2B] bg-[#1E3F2B]/5'
                            : 'border-black/10 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-semibold text-zinc-900">
                          <span>{loc.name}</span>
                          <span className="font-mono-tabular text-[11px] text-[#1E3F2B]">
                            ~{loc.readyMinutes}m prep
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">
                          {loc.address} · {loc.hours}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-zinc-900 mb-1.5">
                    2. Delivery Address
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-black/15 bg-white focus:outline-none focus:border-[#1E3F2B]"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-zinc-900 mb-1.5">
                  3. Preferred Time Window
                </label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-black/15 bg-white focus:outline-none focus:border-[#1E3F2B]"
                >
                  {PICKUP_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 pt-2 border-t border-black/8">
                <div className="text-xs font-semibold text-zinc-900">
                  4. Customer Verification
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] text-zinc-500 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-black/15 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-500 mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-black/15 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-500 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-black/15 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-left ${
                      paymentMethod === 'card'
                        ? 'border-[#1E3F2B] bg-[#1E3F2B]/5 text-zinc-900'
                        : 'border-black/10 bg-white text-zinc-600'
                    }`}
                  >
                    <div>Instant Card Checkout</div>
                    <div className="text-[10px] text-zinc-500 font-mono-tabular">
                      •••• 4829 Express
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-2.5 rounded-lg border text-xs font-medium text-left ${
                      paymentMethod === 'cod'
                        ? 'border-[#1E3F2B] bg-[#1E3F2B]/5 text-zinc-900'
                        : 'border-black/10 bg-white text-zinc-600'
                    }`}
                  >
                    <div>Pay at Hand-Off</div>
                    <div className="text-[10px] text-zinc-500">Card or Cash</div>
                  </button>
                </div>
              </div>

              {formError && <p className="text-xs text-red-700">{formError}</p>}
            </form>
          )}
        </div>

        {cart.length > 0 && step !== 'confirmed' && (
          <div className="p-6 border-t border-black/10 bg-[#F4F3EF] space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Formulations ({totalBottles} bottles)</span>
                <span className="font-mono-tabular">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Glass Bottle Deposit</span>
                <span className="font-mono-tabular">+${glassDepositTotal.toFixed(2)}</span>
              </div>
              {returnedBottlesCredit > 0 && (
                <div className="flex justify-between text-[#1E3F2B] font-medium">
                  <span>Returned Glass Credit ({returnedBottlesCount})</span>
                  <span className="font-mono-tabular">-${returnedBottlesCredit.toFixed(2)}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#1E3F2B] font-medium">
                  <span>Harvest Promo (AUTUMN15)</span>
                  <span className="font-mono-tabular">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              {step === 'checkout' && (
                <div className="flex justify-between text-zinc-600">
                  <span>Fulfillment</span>
                  <span className="font-mono-tabular">
                    {deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm font-semibold text-zinc-900 pt-2 border-t border-black/10">
                <span>Estimated Total</span>
                <span className="font-mono-tabular">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full py-3 px-5 rounded-lg bg-[#1E3F2B] hover:bg-[#163020] text-white text-sm font-medium transition-colors flex items-center justify-between whitespace-nowrap"
              >
                <span>Proceed to Scheduling</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="px-4 py-3 rounded-lg border border-black/15 bg-white text-xs font-medium text-zinc-700 hover:bg-zinc-100 whitespace-nowrap"
                >
                  Back
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="flex-1 py-3 px-5 rounded-lg bg-[#1E3F2B] hover:bg-[#163020] text-white text-sm font-medium transition-colors flex items-center justify-between whitespace-nowrap"
                >
                  <span>Confirm Order</span>
                  <span className="font-mono-tabular">${finalTotal.toFixed(2)}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
