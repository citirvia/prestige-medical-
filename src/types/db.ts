export type LocalizedString = {
  en: string;
  fr: string;
  ar: string;
};

export type Product = {
  id: string;
  slug?: string;
  category_id: string;
  brand: string;
  name: LocalizedString;
  description: LocalizedString;
  technical_specs: Record<string, string>;
  is_professional_only: boolean;
  image_url_list: string[];
};

export type Variant = {
  id: string;
  product_id: string;
  size_name: string;
  sku: string;
  price: number;
  stock_quantity: number;
  weight?: number;
};

export type OrderStatus = 'pending' | 'confirmed' | 'in_preparation' | 'out_for_delivery' | 'completed' | 'cancelled';
export type CustomerType = 'clinic' | 'pharmacy' | 'individual';
export type LogisticsType = 'pickup' | 'delivery';

export type Order = {
  id: string;
  customer_type: CustomerType;
  status: OrderStatus;
  total_price: number;
  customer_details: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    city?: string;
  };
  logistics_type: LogisticsType;
  internal_notes?: string;
  created_at: string;
  items: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  variant_id: string;
  quantity: number;
  price_at_time_of_order: number;
  product_name: string;
  variant_name: string;
};

export type ClinicRegistration = {
  id: string;
  clinic_name: string;
  doctor_name: string;
  specialty?: string;
  license_number?: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};
