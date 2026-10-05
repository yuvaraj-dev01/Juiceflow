import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import {
  JuiceProduct,
  BottleSize,
  BOTTLE_SIZES,
  BOOSTER_OPTIONS,
} from '../data/juices';
import { ResilientImage } from './ResilientImage';

interface ProductDetailModalProps {
  product: JuiceProduct | null;
  onClose: () => void;
  onAddToCart: (
    product: JuiceProduct,
    size: BottleSize,
    boosterIds: string[],
    quantity: number
  ) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [selectedSize, setSelectedSize] = useState<BottleSize>('350ml');
  const [selectedBoosters, setSelectedBoosters] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedSize('350ml');
      setSelectedBoosters([]);
      setQuantity(1);
      setAddedFeedback(false);
    }
  }, [product]);

  if (!product) return null;

  const sizeObj = BOTTLE_SIZES.find((s) => s.id === selectedSize) || BOTTLE_SIZES[0];
  const boostersTotal = selectedBoosters.reduce((sum, id) => {
    const b = BOOSTER_OPTIONS.find((opt) => opt.id === id);
    return sum + (b ? b.price : 0);
  }, 0);

  const singleUnitPrice =
    Math.round((product.basePrice * sizeObj.multiplier + boostersTotal) * 100) / 100;
  const totalPrice = singleUnitPrice * quantity;

  const toggleBooster = (id: string) => {
    setSelectedBoosters((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConfirmAdd = () => {
    onAddToCart(product, selectedSize, selectedBoosters, quantity);
    setAddedFeedback(true);
    setTimeout(() => {
      onClose();
    }, 350);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-[2px] p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#FBFBF9] border border-black/10 rounded-xl overflow-hidden shadow-xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close formulation details"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-lg bg-[#FBFBF9]/90 border border-black/10 flex items-center justify-center text-zinc-700 hover:text-zinc-950 hover:bg-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left Column: Visual & Provenance Gallery */}
          <div className="md:col-span-5 bg-[#F4F3EF] p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-black/8">
            <div>
              <div className="text-xs text-zinc-500 mb-4">
                <span>Formulation {product.index}</span>
                <span className="mx-1.5" aria-hidden="true">·</span>
                <span>{product.category}</span>
                <span className="mx-1.5" aria-hidden="true">·</span>
                <span>{product.availability}</span>
              </div>

              <div className="aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#EAE8E1] mb-6">
                <ResilientImage
                  src={product.image}
                  alt={product.name}
                  accentHex={product.accentHex}
                  label={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-black/8 text-xs text-zinc-600">
                <div className="flex justify-between py-1">
                  <span className="text-zinc-500">Orchard Provenance</span>
                  <span className="font-medium text-zinc-900 text-right">{product.orchardPartner}</span>
                </div>
                <div className="flex justify-between py-1 border-t border-black/6">
                  <span className="text-zinc-500">Harvest Window</span>
                  <span className="font-mono-tabular text-zinc-900">{product.harvestWindow}</span>
                </div>
                <div className="flex justify-between py-1 border-t border-black/6">
                  <span className="text-zinc-500">Raw Produce Input</span>
                  <span className="font-mono-tabular text-zinc-900">{product.produceWeightKg.toFixed(1)} kg / 350 ml</span>
                </div>
                <div className="flex justify-between py-1 border-t border-black/6">
                  <span className="text-zinc-500">Refractometer Sweetness</span>
                  <span className="font-mono-tabular text-zinc-900">{product.brix.toFixed(1)}° Brix</span>
                </div>
                <div className="flex justify-between py-1 border-t border-black/6">
                  <span className="text-zinc-500">Hydraulic Press Temp</span>
                  <span className="font-mono-tabular text-zinc-900">{product.pressedTempF}°F Raw</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-black/10 grid grid-cols-3 gap-2 text-left">
              <div>
                <div className="text-[11px] text-zinc-500">Energy</div>
                <div className="font-mono-tabular text-sm font-medium text-zinc-900">
                  {Math.round(product.calories * sizeObj.multiplier)} kcal
                </div>
              </div>
              <div>
                <div className="text-[11px] text-zinc-500">Plant Sugars</div>
                <div className="font-mono-tabular text-sm font-medium text-zinc-900">
                  {Math.round(product.sugarGrams * sizeObj.multiplier)}g
                </div>
              </div>
              <div>
                <div className="text-[11px] text-zinc-500">Vitamin C</div>
                <div className="font-mono-tabular text-sm font-medium text-zinc-900">
                  {Math.round(product.vitaminCPercent * sizeObj.multiplier)}% DV
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              <div className="flex items-baseline justify-between gap-4 pr-10">
                <h2
                  id="pdp-modal-title"
                  className="font-display text-2xl sm:text-3xl font-semibold text-zinc-900 leading-tight"
                >
                  {product.name}
                </h2>
              </div>

              <div className="mt-2 flex items-center gap-2 text-sm text-zinc-600">
                <span className="font-mono-tabular text-lg font-medium text-zinc-900">
                  ${singleUnitPrice.toFixed(2)}
                </span>
                <span aria-hidden="true">·</span>
                <span>{sizeObj.volumeLabel} Returnable Glass</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#1E3F2B] font-medium">{product.availability}</span>
              </div>

              <p className="mt-4 text-sm text-zinc-600 leading-relaxed">
                {product.description}
              </p>

              <div className="mt-5 pt-4 border-t border-black/8">
                <div className="text-xs font-semibold text-zinc-900 mb-2">
                  Botanical Bill & Cold-Press Ratios
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {product.ingredients.join(' · ')}
                </p>
              </div>

              {/* Bottle Volume Selector */}
              <div className="mt-6 pt-4 border-t border-black/8">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-zinc-900">
                    Select Apothecary Vessel Size
                  </span>
                  <span className="text-xs text-zinc-500 font-mono-tabular">
                    Includes refundable ${sizeObj.glassDeposit.toFixed(2)} glass deposit
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {BOTTLE_SIZES.map((s) => {
                    const isSelected = selectedSize === s.id;
                    const priceForSize = (product.basePrice * s.multiplier).toFixed(2);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSelectedSize(s.id)}
                        className={`p-3 rounded-lg border text-left transition-colors ${
                          isSelected
                            ? 'border-[#1E3F2B] bg-[#1E3F2B]/5 text-zinc-900'
                            : 'border-black/10 bg-white hover:border-black/25 text-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono-tabular text-xs font-semibold">
                            {s.volumeLabel}
                          </span>
                          <span className="font-mono-tabular text-xs text-zinc-600">
                            ${priceForSize}
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-0.5 truncate">
                          {s.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Optional Botanical Boosters */}
              <div className="mt-6 pt-4 border-t border-black/8">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-zinc-900">
                    Optional Cold-Pressed Botanical Boosters
                  </span>
                  <span className="text-xs text-zinc-500">
                    Micro-dosed into bottle before sealing
                  </span>
                </div>
                <div className="space-y-2">
                  {BOOSTER_OPTIONS.map((booster) => {
                    const active = selectedBoosters.includes(booster.id);
                    return (
                      <button
                        key={booster.id}
                        type="button"
                        onClick={() => toggleBooster(booster.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-colors ${
                          active
                            ? 'border-[#1E3F2B] bg-[#1E3F2B]/5'
                            : 'border-black/10 bg-white hover:border-black/20'
                        }`}
                      >
                        <div className="pr-3">
                          <div className="text-xs font-semibold text-zinc-900 flex items-center gap-2">
                            <span>{booster.name}</span>
                            <span className="text-zinc-400 font-normal">·</span>
                            <span className="text-[11px] font-normal text-zinc-500">
                              {booster.origin}
                            </span>
                          </div>
                          <div className="text-[11px] text-zinc-500 mt-0.5">
                            {booster.benefit}
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className="font-mono-tabular text-xs font-medium text-zinc-900">
                            +${booster.price.toFixed(2)}
                          </span>
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center border ${
                              active
                                ? 'bg-[#1E3F2B] border-[#1E3F2B] text-white'
                                : 'border-zinc-300 bg-white'
                            }`}
                          >
                            {active && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Contiguous Action Bar */}
            <div className="mt-8 pt-4 border-t border-black/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center justify-between sm:justify-start border border-black/15 rounded-lg bg-white px-2 py-1.5">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease bottle quantity"
                  className="w-8 h-8 rounded flex items-center justify-center text-zinc-700 hover:bg-zinc-100 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono-tabular text-sm font-medium px-4 text-zinc-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase bottle quantity"
                  className="w-8 h-8 rounded flex items-center justify-center text-zinc-700 hover:bg-zinc-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleConfirmAdd}
                className="flex-1 py-3 px-5 rounded-lg bg-[#1E3F2B] hover:bg-[#163020] text-white text-sm font-medium transition-colors flex items-center justify-between whitespace-nowrap"
              >
                <span>
                  {addedFeedback ? 'Added to Apothecary Bag' : 'Add to Apothecary Bag'}
                </span>
                <span className="font-mono-tabular font-medium">
                  ${totalPrice.toFixed(2)}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
