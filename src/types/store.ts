export interface Product {
  id: string;
  name: string;
  club: string;
  season: string;
  price: number;
  description: string;
  image: string;
  home: boolean;
  badge: string;
  colors: string[];
  sizes: string[];
  limited?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  paymentMethod: string;
  deliveryNotes?: string;
  jerseyName?: string;
  jerseyNumber?: string;
}

export interface OrderPayload {
  user: { id: string; fullName: string; email: string };
  items: CartItem[];
  totals: { subtotal: number; shipping: number; total: number };
  shipping: ShippingDetails;
  placedAt: string;
}
