import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  SlidersHorizontal,
  Plus,
  Check,
  ArrowUpRight,
  PackageCheck,
  X,
} from 'lucide-react';
import {
  SEASONS,
  JUICE_PRODUCTS,
  BOTTLE_SIZES,
  BOOSTER_OPTIONS,
  PICKUP_LOCATIONS,
  SeasonKey,
  CategoryKey,
  BottleSize,
  JuiceProduct,
} from './data/juices';
import { CartItem, ConfirmedOrder } from './types/order';
import { ResilientImage } from './components/ResilientImage';
import { ProductDetailModal } from './components/ProductDetailModal';
import { FlightBuilderModal } from './components/FlightBuilderModal';
import { CartCheckoutDrawer } from './components/CartCheckoutDrawer';

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: 'all', label: 'All Formulations' },
  { key: 'Greens', label: 'Greens' },
  { key: 'Roots & Citrus', label: 'Roots & Citrus' },
  { key: 'Nut Mylks', label: 'Nut Mylks' },
  { key: 'Botanical Tonics', label: 'Botanical Tonics' },
];

export default function App() {
  const [selectedSeason, setSelectedSeason] = useState<SeasonKey>('autumn');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'index' | 'brix-asc' | 'price-asc'>('index');

  const [cardSizes, setCardSizes] = useState<Record<string, BottleSize>>({});
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const [activeProductModal, setActiveProductModal] = useState<JuiceProduct | null>(null);
  const [isFlightModalOpen, setIsFlightModalOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  const [cart, setCart] = useState<CartItem[]>(() => [
    {
      cartItemId: 'init-aut-01',
      product: JUICE_PRODUCTS[0],
      size: '350ml',
      boosterIds: [],
      quantity: 1,
      unitPrice: JUICE_PRODUCTS[0].basePrice,
    },
    {
      cartItemId: 'init-aut-02',
      product: JUICE_PRODUCTS[1],
      size: '350ml',
      boosterIds: ['ginger-cold'],
      quantity: 1,
      unitPrice: JUICE_PRODUCTS[1].basePrice + 1.75,
    },
  ]);

  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);

  const currentSeasonMeta = useMemo(
    () => SEASONS.find((s) => s.key === selectedSeason) || SEASONS[0],
    [selectedSeason]
  );

  const filteredProducts = useMemo(() => {
    return JUICE_PRODUCTS.filter((item) => {
      const matchesSeason = item.season === selectedSeason;
      const matchesCat =
        selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.tastingNotes.toLowerCase().includes(q) ||
        item.ingredients.some((ing) => ing.toLowerCase().includes(q)) ||
        item.orchardPartner.toLowerCase().includes(q);
      return matchesSeason && matchesCat && matchesQuery;
    }).sort((a, b) => {
      if (sortBy === 'brix-asc') return a.brix - b.brix;
      if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
      return a.index.localeCompare(b.index);
    });
  }, [selectedSeason, selectedCategory, searchQuery, sortBy]);

  const totalBagCount = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  const handleAddToCart = (
    product: JuiceProduct,
    size: BottleSize,
    boosterIds: string[],
    quantity: number
  ) => {
    const sizeObj = BOTTLE_SIZES.find((s) => s.id === size) || BOTTLE_SIZES[0];
    const boosterSum = boosterIds.reduce((sum, id) => {
      const b = BOOSTER_OPTIONS.find((opt) => opt.id === id);
      return sum + (b ? b.price : 0);
    }, 0);
    const unitPrice =
      Math.round((product.basePrice * sizeObj.multiplier + boosterSum) * 100) / 100;

    const sortedBoosters = [...boosterIds].sort().join(',');
    const compositeId = `${product.id}__${size}__${sortedBoosters}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((i) => i.cartItemId === compositeId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [
        ...prev,
        {
          cartItemId: compositeId,
          product,
          size,
          boosterIds,
          quantity,
          unitPrice,
        },
      ];
    });

    setRecentlyAddedId(product.id);
    setTimeout(() => {
      setRecentlyAddedId((prev) => (prev === product.id ? null : prev));
    }, 1200);
  };

  const handleQuickAddFromCard = (product: JuiceProduct) => {
    const chosenSize = cardSizes[product.id] || '350ml';
    handleAddToCart(product, chosenSize, [], 1);
  };

  const handleAddFlightToCart = (
    selectedProducts: JuiceProduct[],
    discountedPrice: number
  ) => {
    const names = selectedProducts.map((p) => p.name.split('—')[0].trim());
    const flightItem: CartItem = {
      cartItemId: `flight-${Date.now()}`,
      product: {
        ...selectedProducts[0],
        name: `Seasonal 6-Bottle Flight (${currentSeasonMeta.title})`,
      },
      size: '350ml',
      boosterIds: [],
      quantity: 1,
      unitPrice: discountedPrice,
      isFlightBundle: true,
      flightSelectionNames: names,
    };
    setCart((prev) => [...prev, flightItem]);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-[#18181B]">
      {/* Top Bar Contract: 1 Row, 3 Zones */}
      <header className="sticky top-0 z-40 h-16 bg-[#FBFBF9]/95 backdrop-blur-xs border-b border-black/8 px-6 lg:px-12 flex items-center justify-between">
        <a
          href="#top"
          className="font-display text-2xl font-semibold tracking-tight text-zinc-900 whitespace-nowrap"
        >
          JuiceFlow
        </a>

        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600"
        >
          <a
            href="#seasonal-menu"
            className="hover:text-zinc-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Seasonal Menu
          </a>
          <button
            type="button"
            onClick={() => setIsFlightModalOpen(true)}
            className="hover:text-zinc-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Custom Flight
          </button>
          <a
            href="#craftsmanship"
            className="hover:text-zinc-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Press & Orchards
          </a>
          <a
            href="#press-rooms"
            className="hover:text-zinc-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Apothecaries
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setIsSearchOpen((prev) => !prev);
              const menuEl = document.getElementById('seasonal-menu');
              if (menuEl && !isSearchOpen) {
                menuEl.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            aria-label="Search seasonal ingredients"
            className="w-10 h-10 rounded-lg border border-black/10 bg-white hover:bg-zinc-100 flex items-center justify-center text-zinc-700 transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="px-4 py-2 rounded-lg bg-[#1E3F2B] hover:bg-[#163020] text-white text-xs font-medium transition-colors flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Order Bag</span>
            <span className="font-mono-tabular">({totalBagCount})</span>
          </button>
        </div>
      </header>

      {/* Active Order Verification Banner */}
      {confirmedOrder && (
        <div className="bg-[#1E3F2B] text-white px-6 lg:px-12 py-2.5 border-b border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-emerald-300 shrink-0" />
            <span className="font-mono-tabular font-medium">
              Order #{confirmedOrder.orderNumber} Verified
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-100">
              Hydraulic Pressing & Chilling ({confirmedOrder.pickupSlot})
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="underline underline-offset-4 font-medium text-emerald-200 hover:text-white whitespace-nowrap"
          >
            View Live Receipt & Status
          </button>
        </div>
      )}

      {/* Section 1: Hero */}
      <section
        id="top"
        className="w-full max-w-[1280px] mx-auto px-6 lg:px-12 pt-8 pb-14 lg:py-16 border-b border-black/8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              <span className="font-medium text-[#1E3F2B]">
                Autumn Harvest Rotation
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular">Pressed Daily at 38°F</span>
              <span aria-hidden="true">·</span>
              <span>Hudson Valley & Sonoma Biodynamic</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-medium tracking-tight text-zinc-900 leading-[1.08]">
              Raw Hydraulic Extractions from Late-Orchard Roots & Botanicals.
            </h1>

            <p className="text-base text-zinc-600 leading-relaxed max-w-[60ch]">
              Every 350 ml glass apothecary bottle contains up to 2.2 kg of whole organic produce pressed under 12,000 lbs of cold hydraulic force—never heated, never HPP-treated, and bottled within 14 hours of harvest.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <a
                href="#seasonal-menu"
                className="px-6 py-3 rounded-lg bg-[#1E3F2B] hover:bg-[#163020] text-white text-sm font-medium transition-colors whitespace-nowrap"
              >
                Explore Seasonal Menu
              </a>
              <button
                type="button"
                onClick={() => setIsFlightModalOpen(true)}
                className="px-5 py-3 rounded-lg border border-black/15 bg-white hover:bg-zinc-100 text-zinc-900 text-sm font-medium transition-colors whitespace-nowrap"
              >
                Build 6-Bottle Flight (Save 15%)
              </button>
            </div>

            <div className="pt-6 border-t border-black/8 grid grid-cols-3 gap-6">
              <div>
                <div className="font-mono-tabular text-lg font-medium text-zinc-900">
                  1.9 kg
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  Avg. Produce per Bottle
                </div>
              </div>
              <div>
                <div className="font-mono-tabular text-lg font-medium text-zinc-900">
                  &lt; 14 hrs
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  Harvest to Cold Press
                </div>
              </div>
              <div>
                <div className="font-mono-tabular text-lg font-medium text-zinc-900">
                  $1.50
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">
                  Bottle Return Credit
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-xl overflow-hidden bg-[#F4F3EF] border border-black/8 aspect-[16/9] flex items-center justify-center">
              <ResilientImage
                src=""
                alt="Cold-Pressed Autumn Harvest Botanical Collection"
                accentHex="#1E3F2B"
                label="Autumn Harvest Collection — 4 Signature Extractions"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 text-white flex items-end justify-between">
                <div>
                  <div className="text-[11px] text-zinc-300 font-mono-tabular">
                    Autumn Flight No. 284 · 4 Core Extractions
                  </div>
                  <div className="text-sm font-medium mt-0.5">
                    Solstice Amber · Canopy No. 4 · Velvet Root · Saffron Cashew Mylk
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFlightModalOpen(true)}
                  className="text-xs font-medium text-emerald-200 hover:text-white underline underline-offset-4 whitespace-nowrap ml-4"
                >
                  Customize Flight
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Seasonal Harvest Menu */}
      <section
        id="seasonal-menu"
        className="w-full max-w-[1280px] mx-auto px-6 lg:px-12 py-14 lg:py-20 border-b border-black/8"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-black/8">
          <div>
            <div className="text-xs text-zinc-500 mb-2">
              <span>01. Seasonal Harvest Menu</span>
              <span className="mx-1.5" aria-hidden="true">·</span>
              <span>{currentSeasonMeta.months}</span>
              <span className="mx-1.5" aria-hidden="true">·</span>
              <span className="font-mono-tabular text-[#1E3F2B] font-medium">
                {currentSeasonMeta.statusLabel}
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-medium text-zinc-900">
              {currentSeasonMeta.headline}
            </h2>
            <p className="text-sm text-zinc-600 mt-2 max-w-2xl leading-relaxed">
              {currentSeasonMeta.subheadline}
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Select Seasonal Harvest Menu"
            className="flex flex-wrap sm:flex-nowrap items-center gap-1 p-1.5 bg-[#EFECE6] rounded-lg self-start lg:self-auto"
          >
            {SEASONS.map((season) => {
              const isActive = selectedSeason === season.key;
              return (
                <button
                  key={season.key}
                  role="tab"
                  aria-selected={isActive}
                  type="button"
                  onClick={() => setSelectedSeason(season.key)}
                  className={`px-3.5 py-2 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-zinc-900 shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <span>{season.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[#1E3F2B] text-white'
                      : 'bg-[#F4F3EF] text-zinc-700 hover:bg-[#EAE8E1]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {(isSearchOpen || searchQuery) && (
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by ingredient or orchard..."
                  className="pl-8 pr-8 py-2 text-xs rounded-lg border border-black/15 bg-white text-zinc-900 focus:outline-none focus:border-[#1E3F2B] w-56"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-2.5 text-zinc-400 hover:text-zinc-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
              <label htmlFor="sort-select" className="sr-only">
                Sort formulations
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as 'index' | 'brix-asc' | 'price-asc')
                }
                className="py-2 pl-2.5 pr-7 rounded-lg border border-black/12 bg-white text-xs font-medium text-zinc-800 focus:outline-none focus:border-[#1E3F2B]"
              >
                <option value="index">Sort: Curated Harvest Order</option>
                <option value="brix-asc">Sort: Lowest Sugar (Brix°)</option>
                <option value="price-asc">Sort: Price (Low to High)</option>
              </select>
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-[#F4F3EF] rounded-xl border border-black/8 p-8">
            <p className="font-display text-2xl text-zinc-800">
              No seasonal formulations match your filter criteria.
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Try clearing your ingredient search or switching to All Formulations.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-[#1E3F2B] text-white text-xs font-medium"
            >
              Reset Seasonal Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => {
              const activeSize = cardSizes[product.id] || '350ml';
              const sizeObj =
                BOTTLE_SIZES.find((s) => s.id === activeSize) || BOTTLE_SIZES[0];
              const displayPrice = (product.basePrice * sizeObj.multiplier).toFixed(2);
              const isJustAdded = recentlyAddedId === product.id;

              return (
                <article
                  key={product.id}
                  className="group rounded-xl bg-[#F4F3EF] border border-black/8 overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div>
                    <div
                      onClick={() => setActiveProductModal(product)}
                      className="relative aspect-[4/3] w-full bg-[#EAE8E1] overflow-hidden cursor-pointer"
                    >
                      <ResilientImage
                        src={product.image}
                        alt={product.name}
                        accentHex={product.accentHex}
                        label={product.name}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                      />
                    </div>

                    <div className="p-6 pb-4">
                      <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
                        <div>
                          <span className="font-mono-tabular">No. {product.index}</span>
                          <span className="mx-1.5" aria-hidden="true">·</span>
                          <span>{product.category}</span>
                          <span className="mx-1.5" aria-hidden="true">·</span>
                          <span className="font-mono-tabular">{product.brix.toFixed(1)}° Brix</span>
                        </div>
                        <span className="text-[#1E3F2B] font-medium">
                          {product.availability}
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="text-base font-semibold text-zinc-900 leading-snug">
                          <button
                            type="button"
                            onClick={() => setActiveProductModal(product)}
                            className="text-left hover:underline underline-offset-4 focus:outline-none"
                          >
                            {product.name}
                          </button>
                        </h3>
                        <span className="font-mono-tabular text-[15px] font-medium text-zinc-900 shrink-0">
                          ${displayPrice}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-600 mt-2 line-clamp-2 leading-relaxed">
                        {product.tastingNotes}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-black/6 text-[11px] text-zinc-500 flex items-center justify-between">
                        <span className="truncate">{product.orchardPartner}</span>
                        <span className="font-mono-tabular shrink-0 ml-2">
                          {product.produceWeightKg.toFixed(1)} kg raw
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2 space-y-3">
                    <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#EAE8E1] rounded-lg">
                      {BOTTLE_SIZES.map((s) => {
                        const selected = activeSize === s.id;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() =>
                              setCardSizes((prev) => ({ ...prev, [product.id]: s.id }))
                            }
                            className={`py-1.5 px-2 rounded-md font-mono-tabular text-[11px] font-medium transition-colors whitespace-nowrap ${
                              selected
                                ? 'bg-white text-zinc-900 shadow-2xs'
                                : 'text-zinc-600 hover:text-zinc-900'
                            }`}
                          >
                            {s.volumeLabel}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveProductModal(product)}
                        className="px-3.5 py-2.5 rounded-lg border border-black/12 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-800 transition-colors whitespace-nowrap"
                      >
                        Customize
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickAddFromCard(product)}
                        className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap ${
                          isJustAdded
                            ? 'bg-emerald-800 text-white'
                            : 'bg-[#1E3F2B] hover:bg-[#163020] text-white'
                        }`}
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added ({sizeObj.volumeLabel})</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add to Bag · ${displayPrice}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="mt-12 p-6 sm:p-8 rounded-xl bg-[#EFECE6] border border-black/8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="text-xs text-zinc-500">
              <span>Seasonal Apothecary Crate</span>
              <span className="mx-1.5" aria-hidden="true">·</span>
              <span className="font-mono-tabular text-[#1E3F2B] font-medium">
                15% Bundle Savings
              </span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-medium text-zinc-900">
              Curate a Custom 6-Bottle Harvest Flight
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-xl">
              Mix any six 350 ml cold-pressed formulations across our Roots, Botanical Greens, and Stone-Milled Nut Mylks. Delivered in an ice-packed returnable crate.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsFlightModalOpen(true)}
            className="px-6 py-3 rounded-lg bg-[#1E3F2B] hover:bg-[#163020] text-white text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0"
          >
            Launch Flight Configurator
          </button>
        </div>
      </section>

      {/* Section 3: Craftsmanship & Provenance */}
      <section
        id="craftsmanship"
        className="w-full max-w-[1280px] mx-auto px-6 lg:px-12 py-14 lg:py-20 border-b border-black/8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs text-zinc-500">
              <span>02. Cold-Chain Provenance & Extraction</span>
              <span className="mx-1.5" aria-hidden="true">·</span>
              <span>Zero HPP</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-medium text-zinc-900 leading-tight">
              Why We Press in Small Batches at 38°F and Reject High-Pressure Processing.
            </h2>

            <p className="text-sm text-zinc-600 leading-relaxed">
              Commercial juices undergo High-Pressure Processing (HPP) to sit on shelves for months, denaturing raw plant enzymes. At JuiceFlow, hydraulic presses extract juice in a 38°F cold room every morning for same-day delivery and local pickup.
            </p>

            <div className="pt-4 border-t border-black/8 space-y-4">
              <div>
                <div className="text-xs font-semibold text-zinc-900">
                  01. Two-Stage Trituration & 12,000-lb Hydraulic Press
                </div>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  Whole organic roots and leafy brassicas are pulverized into a fine mash without centrifugal heat, then pressed through linen weave bags to extract 98% of cellular micronutrients.
                </p>
              </div>
              <div className="pt-3 border-t border-black/6">
                <div className="text-xs font-semibold text-zinc-900">
                  02. Closed-Loop Apothecary Glass Sanitizing
                </div>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  Over 84% of our glass vessels are returned by local customers, thermally sanitized at 185°F, and refilled—eliminating single-use plastics.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div className="rounded-xl border border-black/8 bg-[#F4F3EF] p-6">
              <div className="flex items-center justify-between pb-4 border-b border-black/8">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">
                    Biodynamic Orchard Harvest Ledger
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Direct farm-gate deliveries verified by refractometer Brix° and harvest lot
                  </p>
                </div>
                <span className="font-mono-tabular text-xs text-zinc-500">
                  Lot #2026-10A
                </span>
              </div>

              <div className="overflow-x-auto mt-3">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-black/8 text-zinc-500">
                      <th className="py-2.5 pr-4 font-medium">Grower Partner</th>
                      <th className="py-2.5 px-4 font-medium">Primary Crop</th>
                      <th className="py-2.5 px-4 font-medium text-right">Brix°</th>
                      <th className="py-2.5 pl-4 font-medium text-right">Harvest-to-Press</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/6 text-zinc-800">
                    <tr>
                      <td className="py-3 pr-4 font-medium">Four Winds Farm, NY</td>
                      <td className="py-3 px-4 text-zinc-600">Lacinato Kale & Bulb Fennel</td>
                      <td className="py-3 px-4 text-right font-mono-tabular">6.2°</td>
                      <td className="py-3 pl-4 text-right font-mono-tabular">11.5 hrs</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium">Katsura Orchard, CA</td>
                      <td className="py-3 px-4 text-zinc-600">Fuyu Persimmon & Bolero Carrot</td>
                      <td className="py-3 px-4 text-right font-mono-tabular">9.4°</td>
                      <td className="py-3 pl-4 text-right font-mono-tabular">13.8 hrs</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium">Red Earth Collective</td>
                      <td className="py-3 px-4 text-zinc-600">Bull’s Blood Beet & Pomegranate</td>
                      <td className="py-3 px-4 text-right font-mono-tabular">8.8°</td>
                      <td className="py-3 pl-4 text-right font-mono-tabular">12.0 hrs</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium">Skyline Biodynamic</td>
                      <td className="py-3 px-4 text-zinc-600">Wild Stinging Nettle & Pear</td>
                      <td className="py-3 px-4 text-right font-mono-tabular">5.4°</td>
                      <td className="py-3 pl-4 text-right font-mono-tabular">10.2 hrs</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <blockquote className="p-5 rounded-xl border border-black/8 bg-white flex flex-col justify-between">
                <p className="text-xs text-zinc-600 leading-relaxed">
                  “Before switching our studio’s morning catering to JuiceFlow, bottled HPP juices tasted oxidized and overly sweet. Replacing them with the 6-bottle Canopy No. 4 and Saffron Cashew flights cut afternoon crashes across our team and returned 95% of our glass vessels weekly.”
                </p>
                <footer className="mt-4 pt-3 border-t border-black/6 text-xs">
                  <div className="font-semibold text-zinc-900">Julian Vance-Sorensen</div>
                  <div className="text-zinc-500">
                    Principal Architect · Studio Sorensen & Partners, SoHo
                  </div>
                </footer>
              </blockquote>

              <blockquote className="p-5 rounded-xl border border-black/8 bg-white flex flex-col justify-between">
                <p className="text-xs text-zinc-600 leading-relaxed">
                  “As a sports dietitian, I needed verified nitrate and low-glycemic formulations without pasteurization. Ordering Velvet Root and Chlorophyll Reserve with cold-pressed ginger boosters improved my athletes’ recovery markers over a 10-week autumn training block.”
                </p>
                <footer className="mt-4 pt-3 border-t border-black/6 text-xs">
                  <div className="font-semibold text-zinc-900">Dr. Elena Rostova, RD</div>
                  <div className="text-zinc-500">
                    Performance Dietitian · Downtown Endurance Lab
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Press Rooms & Footer */}
      <footer
        id="press-rooms"
        className="w-full max-w-[1280px] mx-auto px-6 lg:px-12 py-14 text-xs text-zinc-600"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-black/8">
          {PICKUP_LOCATIONS.map((loc, idx) => (
            <div key={loc.id} className="space-y-1.5">
              <div className="font-mono-tabular text-[11px] text-zinc-400">
                0{idx + 1}. Press Room & Glass Return
              </div>
              <h3 className="text-sm font-semibold text-zinc-900">{loc.name}</h3>
              <p className="text-zinc-600">{loc.address}</p>
              <p className="font-mono-tabular text-zinc-500">
                {loc.hours} · Pickup ready in ~{loc.readyMinutes} mins
              </p>
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="pt-1 inline-flex items-center gap-1 text-[#1E3F2B] font-medium hover:underline"
              >
                <span>Order from this location</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-zinc-500">
          <div>
            <span className="font-display text-base font-semibold text-zinc-900 mr-3">
              JuiceFlow
            </span>
            <span>
              Raw Cold-Pressed Botanicals & Seasonal Orchard Apothecary · Certified Organic Handlers
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#seasonal-menu" className="hover:text-zinc-900">
              Seasonal Menu
            </a>
            <button
              type="button"
              onClick={() => setIsFlightModalOpen(true)}
              className="hover:text-zinc-900"
            >
              6-Bottle Flight
            </button>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="hover:text-zinc-900"
            >
              Order Bag ({totalBagCount})
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProductDetailModal
        product={activeProductModal}
        onClose={() => setActiveProductModal(null)}
        onAddToCart={handleAddToCart}
      />

      <FlightBuilderModal
        isOpen={isFlightModalOpen}
        initialSeason={selectedSeason}
        onClose={() => setIsFlightModalOpen(false)}
        onAddFlightToCart={handleAddFlightToCart}
      />

      <CartCheckoutDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCart([])}
        onOrderConfirmed={(order) => setConfirmedOrder(order)}
        activeConfirmedOrder={confirmedOrder}
      />
    </div>
  );
}
