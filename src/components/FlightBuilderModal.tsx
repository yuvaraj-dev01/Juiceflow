import React, { useState } from 'react';
import { X, Minus, Check } from 'lucide-react';
import { JuiceProduct, JUICE_PRODUCTS, SEASONS, SeasonKey } from '../data/juices';
import { ResilientImage } from './ResilientImage';

interface FlightBuilderModalProps {
  isOpen: boolean;
  initialSeason: SeasonKey;
  onClose: () => void;
  onAddFlightToCart: (selectedProducts: JuiceProduct[], discountedPrice: number) => void;
}

export const FlightBuilderModal: React.FC<FlightBuilderModalProps> = ({
  isOpen,
  initialSeason,
  onClose,
  onAddFlightToCart,
}) => {
  const [activeSeason, setActiveSeason] = useState<SeasonKey>(initialSeason);
  const [selectedBottles, setSelectedBottles] = useState<JuiceProduct[]>(() => {
    return JUICE_PRODUCTS.filter((p) => p.season === 'autumn').slice(0, 6);
  });

  if (!isOpen) return null;

  const seasonProducts = JUICE_PRODUCTS.filter((p) => p.season === activeSeason);
  const rawTotal = selectedBottles.reduce((sum, p) => sum + p.basePrice, 0);
  const discountedTotal = Math.round(rawTotal * 0.85 * 100) / 100;
  const remainingSlots = 6 - selectedBottles.length;

  const handleAddBottle = (product: JuiceProduct) => {
    if (selectedBottles.length >= 6) return;
    setSelectedBottles((prev) => [...prev, product]);
  };

  const handleRemoveBottleAtIndex = (index: number) => {
    setSelectedBottles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleLoadCuratedPreset = () => {
    const pool = JUICE_PRODUCTS.filter((p) => p.season === activeSeason);
    const filled: JuiceProduct[] = [];
    for (let i = 0; i < 6; i++) {
      filled.push(pool[i % pool.length]);
    }
    setSelectedBottles(filled);
  };

  const handleCompleteFlight = () => {
    if (selectedBottles.length !== 6) return;
    onAddFlightToCart(selectedBottles, discountedTotal);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-[2px] p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="flight-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#FBFBF9] border border-black/10 rounded-xl overflow-hidden shadow-xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/8 bg-[#F4F3EF]">
          <div>
            <div className="text-xs text-zinc-500">
              <span>Custom 6-Bottle Apothecary Box</span>
              <span className="mx-1.5" aria-hidden="true">·</span>
              <span>15% Flight Savings Applied Automatically</span>
            </div>
            <h2
              id="flight-modal-title"
              className="font-display text-2xl font-semibold text-zinc-900 mt-0.5"
            >
              Curate Your Seasonal Cold-Press Flight
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close flight configurator"
            className="w-10 h-10 rounded-lg bg-white border border-black/10 flex items-center justify-center text-zinc-700 hover:text-zinc-950 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[80vh] overflow-y-auto">
          {/* Left Column: Formulations */}
          <div className="lg:col-span-7 p-6 border-b lg:border-b-0 lg:border-r border-black/8">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
              <div className="flex items-center gap-1 p-1 bg-[#EAE8E1] rounded-lg">
                {SEASONS.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => setActiveSeason(s.key)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                      activeSeason === s.key
                        ? 'bg-white text-zinc-900 shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleLoadCuratedPreset}
                className="text-xs font-medium text-[#1E3F2B] hover:underline whitespace-nowrap"
              >
                Auto-Fill Season Balance
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {seasonProducts.map((product) => {
                const countInBox = selectedBottles.filter((b) => b.id === product.id).length;
                return (
                  <div
                    key={product.id}
                    className="p-3.5 rounded-lg border border-black/8 bg-white flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-14 rounded overflow-hidden bg-[#F4F3EF] shrink-0">
                          <ResilientImage
                            src={product.image}
                            alt={product.name}
                            accentHex={product.accentHex}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] text-zinc-500">
                            <span>{product.category}</span>
                            <span className="mx-1" aria-hidden="true">·</span>
                            <span className="font-mono-tabular">${product.basePrice.toFixed(2)}</span>
                          </div>
                          <h3 className="text-xs font-semibold text-zinc-900 leading-snug line-clamp-2 mt-0.5">
                            {product.name}
                          </h3>
                        </div>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-2 line-clamp-1">
                        {product.tastingNotes}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-black/6 flex items-center justify-between">
                      <span className="font-mono-tabular text-[11px] text-zinc-500">
                        {countInBox > 0 ? `${countInBox} in crate` : '350 ml glass'}
                      </span>
                      <button
                        type="button"
                        disabled={selectedBottles.length >= 6}
                        onClick={() => handleAddBottle(product)}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                          selectedBottles.length >= 6
                            ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                            : 'bg-[#1E3F2B] text-white hover:bg-[#163020]'
                        }`}
                      >
                        + Add Bottle
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: 6-Slot Crate */}
          <div className="lg:col-span-5 p-6 bg-[#F8F7F3] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-zinc-900">
                  Your 6-Bottle Insulated Crate
                </span>
                <span className="font-mono-tabular text-xs text-zinc-600">
                  {selectedBottles.length} / 6 Slots Filled
                </span>
              </div>

              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, slotIdx) => {
                  const bottle = selectedBottles[slotIdx];
                  return (
                    <div
                      key={slotIdx}
                      className={`p-3 rounded-lg border flex items-center justify-between ${
                        bottle
                          ? 'bg-white border-black/10'
                          : 'bg-[#F1EFEA] border-dashed border-black/15'
                      }`}
                    >
                      {bottle ? (
                        <>
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            <span className="font-mono-tabular text-xs text-zinc-400">
                              0{slotIdx + 1}
                            </span>
                            <div className="w-8 h-8 rounded overflow-hidden shrink-0">
                              <ResilientImage
                                src={bottle.image}
                                alt={bottle.name}
                                accentHex={bottle.accentHex}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-medium text-zinc-900 truncate">
                                {bottle.name}
                              </div>
                              <div className="text-[11px] text-zinc-500 font-mono-tabular">
                                350 ml · ${bottle.basePrice.toFixed(2)}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveBottleAtIndex(slotIdx)}
                            aria-label={`Remove ${bottle.name} from slot ${slotIdx + 1}`}
                            className="p-1.5 text-zinc-400 hover:text-zinc-800 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center justify-between w-full text-xs text-zinc-400 py-1">
                          <span className="font-mono-tabular">Slot 0{slotIdx + 1}</span>
                          <span>Select a bottle from the menu</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-black/10">
              <div className="space-y-1.5 text-xs mb-4">
                <div className="flex justify-between text-zinc-500">
                  <span>Individual Bottle Value (6 × 350 ml)</span>
                  <span className="font-mono-tabular">${rawTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#1E3F2B] font-medium">
                  <span>15% Apothecary Flight Savings</span>
                  <span className="font-mono-tabular">
                    -${(rawTotal - discountedTotal).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-zinc-900 pt-2 border-t border-black/8">
                  <span>Flight Box Total</span>
                  <span className="font-mono-tabular">${discountedTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={remainingSlots > 0}
                onClick={handleCompleteFlight}
                className={`w-full py-3 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${
                  remainingSlots > 0
                    ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed'
                    : 'bg-[#1E3F2B] hover:bg-[#163020] text-white'
                }`}
              >
                {remainingSlots > 0 ? (
                  <span>Select {remainingSlots} More Bottle{remainingSlots > 1 ? 's' : ''} to Complete</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Add 6-Bottle Flight to Bag · ${discountedTotal.toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
