export interface FloralProduct {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  stemsInfo: string;
  badge: string;
  badgeType: 'fresh' | 'rare' | 'bestseller' | 'festive' | 'everlasting' | 'purifying';
  rating: number;
  reviewsCount: number;
  image: string;
  altText: string;
  category: 'all' | 'bouquets' | 'vase' | 'orchids' | 'hampers';
  aestheticId: 'pastel' | 'monochrome' | 'boho' | 'zen' | 'exotic';
  description: string;
  scentProfile: {
    intensity: 'Delicate' | 'Moderate' | 'Intense';
    notes: string[];
  };
  flowerBreakdown: { flower: string; count: string }[];
  careRitual: {
    sunlight: string;
    hydration: string;
    petSafety: string;
    longevityTip: string;
  };
  sameDayEligible: boolean;
  vaseIncluded: boolean;
}

export interface CuratedAesthetic {
  id: 'pastel' | 'monochrome' | 'boho' | 'zen' | 'exotic';
  title: string;
  image: string;
  count: number;
  subtitle: string;
  description: string;
  altText: string;
  colorHex: string;
}

export interface GiftMessage {
  recipient: string;
  sender: string;
  message: string;
  cardTheme?: 'botanical' | 'gold-foil' | 'kraft';
}

export interface CartItem {
  product: FloralProduct;
  quantity: number;
  selectedVase?: 'included' | 'fluted-crystal' | 'ceramic-matte' | 'none';
  customCardMessage?: string;
  giftMessage?: GiftMessage;
}

export interface FilterState {
  searchQuery: string;
  category: 'all' | 'bouquets' | 'vase' | 'orchids' | 'hampers';
  maxPrice: number | null; // e.g. 2500
  sameDayOnly: boolean;
  selectedAesthetic: string | null;
  flowerTypes: string[];
  sortBy: 'popular' | 'price-asc' | 'price-desc' | 'rating' | 'new';
}

export interface DeliveryAddress {
  id: string;
  label: string;
  addressLine: string;
  area: string;
  city: string;
  isDefault: boolean;
}
