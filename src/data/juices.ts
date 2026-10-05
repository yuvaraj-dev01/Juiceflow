export type SeasonKey = 'autumn' | 'winter' | 'spring' | 'summer';

export type CategoryKey = 'all' | 'Greens' | 'Roots & Citrus' | 'Nut Mylks' | 'Botanical Tonics';

export type BottleSize = '350ml' | '500ml' | '1000ml';

export interface BoosterOption {
  id: string;
  name: string;
  origin: string;
  price: number;
  benefit: string;
}

export interface JuiceProduct {
  id: string;
  index: string;
  name: string;
  season: SeasonKey;
  category: Exclude<CategoryKey, 'all'>;
  basePrice: number;
  brix: number; // Sweetness scale 1-14
  produceWeightKg: number;
  calories: number;
  sugarGrams: number;
  vitaminCPercent: number;
  pressedTempF: number;
  harvestWindow: string;
  orchardPartner: string;
  tastingNotes: string;
  description: string;
  ingredients: string[];
  availability: 'Pressed Today' | 'Small Batch' | 'Seasonal Reserve';
  image: string;
  accentHex: string;
}

export interface SeasonMeta {
  key: SeasonKey;
  title: string;
  months: string;
  statusLabel: string;
  headline: string;
  subheadline: string;
  climateNote: string;
}

export const BOTTLE_SIZES: {
  id: BottleSize;
  label: string;
  volumeLabel: string;
  multiplier: number;
  glassDeposit: number;
}[] = [
  { id: '350ml', label: 'Apothecary Standard', volumeLabel: '350 ml', multiplier: 1, glassDeposit: 1.5 },
  { id: '500ml', label: 'Daily Tall', volumeLabel: '500 ml', multiplier: 1.32, glassDeposit: 2.0 },
  { id: '1000ml', label: 'Table Carafe', volumeLabel: '1,000 ml', multiplier: 2.4, glassDeposit: 3.0 },
];

export const BOOSTER_OPTIONS: BoosterOption[] = [
  {
    id: 'ginger-cold',
    name: 'Peruvian Cold-Pressed Ginger',
    origin: 'Junín Region, Peru · 15 ml',
    price: 1.75,
    benefit: 'Thermogenic circulation & digestive warmth',
  },
  {
    id: 'turmeric-black-pepper',
    name: 'Hawaiian Red Turmeric & Piperine',
    origin: 'Kauai Organic Collective · 15 ml',
    price: 2.0,
    benefit: 'Bioavailable curcuminoids for cellular recovery',
  },
  {
    id: 'sea-buckthorn',
    name: 'Nordic Sea Buckthorn Oil Drops',
    origin: 'Gotland Coastal Harvest · 10 ml',
    price: 2.5,
    benefit: 'Omega-7 fatty acids & high-potency Vitamin C',
  },
  {
    id: 'l-theanine-schisandra',
    name: 'Schisandra Berry & L-Theanine Extract',
    origin: 'Catskills Botanical Lab · 10 ml',
    price: 2.25,
    benefit: 'Adaptogenic focus without caffeine jitter',
  },
];

export const SEASONS: SeasonMeta[] = [
  {
    key: 'autumn',
    title: 'Autumn Harvest',
    months: 'October – November',
    statusLabel: 'Current Press · Batch #284',
    headline: 'Late-Orchard Roots, Persimmon & Warming Rhizomes',
    subheadline:
      'Pressed at 38°F within 14 hours of harvest from Hudson Valley & Sonoma biodynamic growers. Formulated to ground immunity as daylight cools.',
    climateNote: 'Peak sugar density in cellar roots and early frost-kissed orchard apples.',
  },
  {
    key: 'winter',
    title: 'Winter Citrus',
    months: 'December – February',
    statusLabel: 'Upcoming Press · Pre-Order Open',
    headline: 'High-Acid Blood Orange, Yuzu, Bergamot & Dark Greens',
    subheadline:
      'High-potency citrus extractions balanced with mineral-rich winter brassicas and raw spiced nut mylks for deep mid-winter vitality.',
    climateNote: 'Cold-night desert groves yield anthocyanin-rich Moro blood oranges and fragrant yuzu.',
  },
  {
    key: 'spring',
    title: 'Spring Botanicals',
    months: 'March – May',
    statusLabel: 'Archive & Seasonal Preview',
    headline: 'First-Flush Dandelion, Young Fennel, Rhubarb & Chlorophyll',
    subheadline:
      'Crisp, low-glycemic botanical extractions designed for lymphatic renewal, featuring tender spring shoots and tart field rhubarb.',
    climateNote: 'Thawing mineral soils produce high-chlorophyll baby greens and crisp stalks.',
  },
  {
    key: 'summer',
    title: 'Summer Stonefruit',
    months: 'June – September',
    statusLabel: 'Archive & Seasonal Preview',
    headline: 'Heirloom Melon, White Peach, Lemon Verbena & Cucumber',
    subheadline:
      'Electrolyte-dense hydration pressed from sun-ripened orchard stonefruit, trellis cucumbers, and aromatic culinary herbs.',
    climateNote: 'Long solar hours maximize natural potassium and cellular structured water.',
  },
];

export const JUICE_PRODUCTS: JuiceProduct[] = [
  {
    id: 'aut-01',
    index: '01',
    name: 'Solstice Amber — Fuyu Persimmon & Heirloom Carrot',
    season: 'autumn',
    category: 'Roots & Citrus',
    basePrice: 11.5,
    brix: 9.4,
    produceWeightKg: 1.9,
    calories: 140,
    sugarGrams: 18,
    vitaminCPercent: 165,
    pressedTempF: 38,
    harvestWindow: 'Oct 1 – Nov 28',
    orchardPartner: 'Katsura Biodynamic Orchard, Sonoma',
    tastingNotes: 'Honeyed persimmon, earthy beta-carotene, warm turmeric finish',
    description:
      'Whole Fuyu persimmons cold-pressed alongside sweet Bolero carrots, raw Hawaiian red turmeric, and a bright squeeze of early Meyer lemon.',
    ingredients: [
      'Organic Bolero Carrot (62%)',
      'Fuyu Persimmon (24%)',
      'Early Meyer Lemon (8%)',
      'Raw Red Turmeric Rhizome (4%)',
      'Cold-Pressed Ginger (2%)',
    ],
    availability: 'Pressed Today',
    image: '',
    accentHex: '#C86D28',
  },
  {
    id: 'aut-02',
    index: '02',
    name: 'Canopy No. 4 — Fennel, Honeycrisp & Lacinato Kale',
    season: 'autumn',
    category: 'Greens',
    basePrice: 12.0,
    brix: 6.2,
    produceWeightKg: 2.1,
    calories: 110,
    sugarGrams: 11,
    vitaminCPercent: 210,
    pressedTempF: 37,
    harvestWindow: 'Sep 20 – Nov 30',
    orchardPartner: 'Four Winds Farm, Hudson Valley',
    tastingNotes: 'Crisp orchard apple, aromatic anise, mineral-rich dark leaf',
    description:
      'Our flagship autumn green extraction pairs frost-sweetened Honeycrisp apples with bulb fennel, Lacinato kale, celery heart, and aromatic yuzu peel.',
    ingredients: [
      'Lacinato Kale (35%)',
      'Bulb Fennel & Fronds (25%)',
      'Unfiltered Honeycrisp Apple (22%)',
      'Organic Celery Heart (14%)',
      'Fresh Yuzu Juice (4%)',
    ],
    availability: 'Pressed Today',
    image: '',
    accentHex: '#2D5A3C',
  },
  {
    id: 'aut-03',
    index: '03',
    name: 'Velvet Root — Bull’s Blood Beet, Pomegranate & Hibiscus',
    season: 'autumn',
    category: 'Roots & Citrus',
    basePrice: 12.5,
    brix: 8.8,
    produceWeightKg: 1.85,
    calories: 135,
    sugarGrams: 16,
    vitaminCPercent: 140,
    pressedTempF: 38,
    harvestWindow: 'Oct 5 – Dec 10',
    orchardPartner: 'Red Earth Collective, Ojai',
    tastingNotes: 'Deep ruby tannin, tart pomegranate arils, floral hibiscus lift',
    description:
      'Nitrate-rich heirloom beets pressed whole with Wonderful pomegranate arils, steeped crimson hibiscus calyces, and a crisp green apple backbone.',
    ingredients: [
      'Heirloom Bull’s Blood Beet (48%)',
      'Cold-Pressed Pomegranate Arils (28%)',
      'Newtown Pippin Apple (15%)',
      'Steeped Hibiscus Infusion (7%)',
      'Lime Juice (2%)',
    ],
    availability: 'Pressed Today',
    image: '',
    accentHex: '#881D32',
  },
  {
    id: 'aut-04',
    index: '04',
    name: 'Saffron & Green Cardamom Raw Cashew Mylk',
    season: 'autumn',
    category: 'Nut Mylks',
    basePrice: 13.5,
    brix: 7.5,
    produceWeightKg: 1.4,
    calories: 230,
    sugarGrams: 9,
    vitaminCPercent: 15,
    pressedTempF: 39,
    harvestWindow: 'Oct 1 – Dec 15',
    orchardPartner: 'Artisanal Stone-Mill Batch, In-House',
    tastingNotes: 'Velvety stone-ground cashew, floral saffron threads, crushed cardamom',
    description:
      'Sprouted raw ivory cashews stone-ground with filtered mountain spring water, steeped Khorasan saffron threads, green cardamom pods, and Medjool date nectar.',
    ingredients: [
      'Mountain Spring Water (68%)',
      'Activated Raw Cashews (22%)',
      'Organic Medjool Date (6%)',
      'Crushed Green Cardamom & Saffron (3%)',
      'Celtic Sea Salt (1%)',
    ],
    availability: 'Small Batch',
    image: '',
    accentHex: '#C59B40',
  },
  {
    id: 'aut-05',
    index: '05',
    name: 'Chlorophyll Reserve — Nettle, Dandelion & Bartlett Pear',
    season: 'autumn',
    category: 'Greens',
    basePrice: 12.0,
    brix: 5.4,
    produceWeightKg: 2.2,
    calories: 95,
    sugarGrams: 8,
    vitaminCPercent: 195,
    pressedTempF: 37,
    harvestWindow: 'Oct 10 – Nov 25',
    orchardPartner: 'Skyline Biodynamic Acres, Sebastopol',
    tastingNotes: 'Herbaceous stinging nettle, delicate pear roundness, crisp cucumber',
    description:
      'An ultra-alkalizing green tonic softened by late-harvest Bartlett pear, English cucumber, dandelion leaf, and cold-pressed parsley stems.',
    ingredients: [
      'English Cucumber (40%)',
      'Dandelion & Romaine Heart (28%)',
      'Late-Harvest Bartlett Pear (18%)',
      'Wild Stinging Nettle & Parsley (11%)',
      'Eureka Lemon (3%)',
    ],
    availability: 'Pressed Today',
    image: '',
    accentHex: '#1F4B38',
  },
  {
    id: 'aut-06',
    index: '06',
    name: 'Fire Cider Elixir — Raw Ginger, Galangal & Cayenne',
    season: 'autumn',
    category: 'Botanical Tonics',
    basePrice: 10.5,
    brix: 4.8,
    produceWeightKg: 1.5,
    calories: 65,
    sugarGrams: 6,
    vitaminCPercent: 240,
    pressedTempF: 38,
    harvestWindow: 'Year-Round Autumn Staple',
    orchardPartner: 'Kauai Rhizome Cooperative',
    tastingNotes: 'Immediate rhizome heat, aromatic galangal citrus, raw apple cider finish',
    description:
      'A potent immunity tonic blending cold-pressed Peruvian ginger, Thai galangal, unfiltered orchard apple cider vinegar, wildflower honey, and bird’s eye chili.',
    ingredients: [
      'Cold-Pressed Ginger & Galangal (42%)',
      'Crushed Fuji Apple Must (34%)',
      'Unpasteurized Apple Cider Vinegar (14%)',
      'Raw Buckwheat Honey (8%)',
      'Cayenne & Black Pepper (2%)',
    ],
    availability: 'Small Batch',
    image: '',
    accentHex: '#B8531E',
  },

  // WINTER CITRUS
  {
    id: 'win-01',
    index: '01',
    name: 'Moro Crimson — Blood Orange, Grapefruit & Rosemary',
    season: 'winter',
    category: 'Roots & Citrus',
    basePrice: 12.0,
    brix: 9.1,
    produceWeightKg: 2.0,
    calories: 130,
    sugarGrams: 17,
    vitaminCPercent: 280,
    pressedTempF: 37,
    harvestWindow: 'Dec 5 – Feb 25',
    orchardPartner: 'Lindcove Citrus Station, Exeter',
    tastingNotes: 'Raspberry-tinted blood orange, pithy ruby grapefruit, piney rosemary',
    description:
      'Anthocyanin-rich Moro blood oranges hydraulic-pressed with Rio Red grapefruit and cold-infusion of fresh garden rosemary sprigs.',
    ingredients: [
      'Moro Blood Orange (58%)',
      'Rio Red Grapefruit (32%)',
      'Cara Cara Navel (8%)',
      'Fresh Rosemary Cold Infusion (2%)',
    ],
    availability: 'Seasonal Reserve',
    image: '',
    accentHex: '#9E2A2B',
  },
  {
    id: 'win-02',
    index: '02',
    name: 'Frost Brassica — Winter Spinach, Tatsoi & Yuzu',
    season: 'winter',
    category: 'Greens',
    basePrice: 12.5,
    brix: 4.9,
    produceWeightKg: 2.3,
    calories: 85,
    sugarGrams: 6,
    vitaminCPercent: 230,
    pressedTempF: 37,
    harvestWindow: 'Dec 1 – Feb 28',
    orchardPartner: 'Four Winds Farm, Hudson Valley',
    tastingNotes: 'Sweet frost-hardened spinach, floral yuzu, clean mineral finish',
    description:
      'Overwintered hoop-house spinach and spoon-leaf tatsoi pressed with crisp celery and aromatic Japanese yuzu juice.',
    ingredients: [
      'Overwintered Spinach (42%)',
      'Tatsoi & Watercress (28%)',
      'Celery Stalk (20%)',
      'Japanese Yuzu & Meyer Lemon (10%)',
    ],
    availability: 'Seasonal Reserve',
    image: '',
    accentHex: '#264E36',
  },

  // SPRING BOTANICALS
  {
    id: 'spr-01',
    index: '01',
    name: 'Vernal Shoot — Pea Tendril, Mint & Green Strawberry',
    season: 'spring',
    category: 'Greens',
    basePrice: 12.5,
    brix: 5.8,
    produceWeightKg: 2.1,
    calories: 90,
    sugarGrams: 7,
    vitaminCPercent: 185,
    pressedTempF: 37,
    harvestWindow: 'Mar 15 – May 30',
    orchardPartner: 'Full Belly Farm, Capay Valley',
    tastingNotes: 'Snap-pea freshness, garden spearmint, bright green acidity',
    description:
      'Tender spring pea shoots, baby bok choy, cucumber, and garden mint lifted with tart early-harvest strawberries.',
    ingredients: [
      'Cucumber (45%)',
      'Organic Pea Tendrils & Romaine (30%)',
      'Granny Smith Apple (15%)',
      'Early Harvest Strawberry (6%)',
      'Garden Spearmint & Lime (4%)',
    ],
    availability: 'Seasonal Reserve',
    image: '',
    accentHex: '#2F6F4E',
  },

  // SUMMER STONEFRUIT
  {
    id: 'sum-01',
    index: '01',
    name: 'Sunstone — White Nectarine, Yellow Carrot & Lemon Verbena',
    season: 'summer',
    category: 'Roots & Citrus',
    basePrice: 12.5,
    brix: 10.2,
    produceWeightKg: 1.9,
    calories: 145,
    sugarGrams: 19,
    vitaminCPercent: 175,
    pressedTempF: 37,
    harvestWindow: 'Jun 15 – Sep 15',
    orchardPartner: 'Frog Hollow Farm, Brentwood',
    tastingNotes: 'Fragrant white stonefruit, citrusy lemon verbena leaf, crisp carrot',
    description:
      'Tree-ripened Arctic Star white nectarines pressed with yellow heirloom carrots, Valencia orange, and fresh lemon verbena leaves.',
    ingredients: [
      'Yellow Heirloom Carrot (46%)',
      'White Nectarine (34%)',
      'Valencia Orange (15%)',
      'Lemon Verbena & Ginger (5%)',
    ],
    availability: 'Seasonal Reserve',
    image: '',
    accentHex: '#D9822B',
  },
];

export const PICKUP_LOCATIONS = [
  {
    id: 'nolita-flagship',
    name: 'Nolita Apothecary & Cold Press Room',
    address: '248 Elizabeth St, New York, NY 10012',
    hours: '07:00 – 19:30 Daily',
    readyMinutes: 20,
  },
  {
    id: 'west-village',
    name: 'West Village Botanical Counter',
    address: '312 Bleecker St, New York, NY 10014',
    hours: '07:30 – 19:00 Daily',
    readyMinutes: 25,
  },
  {
    id: 'williamsburg',
    name: 'Wythe Ave Press & Glass Return Hub',
    address: '118 Wythe Ave, Brooklyn, NY 11249',
    hours: '08:00 – 19:00 Daily',
    readyMinutes: 20,
  },
];

export const PICKUP_SLOTS = [
  'Today · Within 25 mins (Priority Cold Pack)',
  'Today · 12:30 – 14:00 Window',
  'Today · 16:00 – 18:00 Window',
  'Tomorrow Morning · 08:00 – 10:00 (First Press)',
];
