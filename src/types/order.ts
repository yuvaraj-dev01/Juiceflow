import { BottleSize, JuiceProduct } from '../data/juices';

export interface CartItem {
  cartItemId: string;
  product: JuiceProduct;
  size: BottleSize;
  boosterIds: string[];
  quantity: number;
  unitPrice: number;
  isFlightBundle?: boolean;
  flightSelectionNames?: string[];
}

export interface ConfirmedOrder {
  orderNumber: string;
  createdAt: string;
  fulfillmentMode: 'pickup' | 'delivery';
  pickupLocationName?: string;
  pickupSlot: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress?: string;
  paymentMethod: 'card' | 'cod';
  items: CartItem[];
  subtotal: number;
  glassDepositTotal: number;
  returnedBottlesCredit: number;
  discountAmount: number;
  deliveryFee: number;
  total: number;
  currentStepIndex: number;
}
