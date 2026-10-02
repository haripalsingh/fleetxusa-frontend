// Shapes returned by the PHP REST API (fleetxusa-backend).

export type Category = {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  meta_title: string | null;
  meta_description: string | null;
  product_count: number | null;
};

export type CategoryRef = { id: number; name: string; slug: string };

export type ProductSummary = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  brand: string | null;
  product_type: string | null;
  category: CategoryRef | null;
  price_min: number;
  price_max: number;
  compare_at_price: number | null;
  in_stock: boolean;
  stock: number;
  image_url: string | null;
  colors: string[];
  is_featured: boolean;
  status: string;
};

export type ProductImage = {
  id: number;
  url: string;
  alt: string | null;
  sort_order: number;
  is_primary: boolean;
};

export type ProductVariant = {
  id: number;
  sku: string;
  name: string;
  size: string | null;
  color: string | null;
  price: number;
  compare_at_price: number | null;
  stock: number;
  in_stock: boolean;
  low_stock_threshold: number;
  is_active: boolean;
  sort_order: number;
};

export type Product = Omit<ProductSummary, 'compare_at_price'> & {
  short_description: string | null;
  description: string | null;
  warranty: string | null;
  specifications: { label: string; value: string }[];
  video_url: string | null;
  weight_lbs: number | null;
  meta_title: string | null;
  meta_description: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
  related?: ProductSummary[];
};

export type FacetValue = { value: string; count: number };

export type ProductFacets = {
  categories: { name: string; slug: string; count: number }[];
  types: FacetValue[];
  brands: FacetValue[];
  colors: FacetValue[];
  price: { min: number; max: number };
};

export type PageMeta = {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
};

export type ProductListResult = {
  data: ProductSummary[];
  meta: PageMeta & { category?: Category };
  facets: ProductFacets;
};

export type Totals = {
  subtotal: number;
  discount_total: number;
  shipping_total: number;
  tax_total: number;
  grand_total: number;
  currency: string;
  free_shipping_threshold: number | null;
};

export type CartItem = {
  id: number; // cart line id
  variant_id: number;
  product_id: number;
  name: string;
  slug: string;
  category_slug: string | null;
  sku: string;
  option: string | null;
  size: string | null;
  color: string | null;
  price: number;
  compare_at_price: number | null;
  quantity: number;
  line_total: number;
  stock: number;
  available: boolean;
  image_url: string | null;
};

export type Cart = {
  token: string | null;
  items: CartItem[];
  count: number;
  subtotal: number;
  issues: string[];
  totals: Totals;
};

export type User = {
  id: number;
  name: string;
  email: string;
  mobile: string | null;
  role: 'user' | 'dealer' | 'vendor' | 'admin';
  company_name?: string | null;
  newsletter: boolean;
  created_at: string | null;
  stats?: { orders: number; total_spent: number };
};

export type Address = {
  id?: number;
  label?: string | null;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default?: boolean;
};

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded';

export type OrderItem = {
  id: number;
  product_id: number | null;
  variant_id: number | null;
  name: string;
  slug: string | null;
  category_slug: string | null;
  option: string | null;
  sku: string;
  image_url: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
};

export type Order = {
  id: number;
  order_number: string;
  user_id: number | null;
  email: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string;
  currency: string;
  subtotal: number;
  discount_total: number;
  shipping_total: number;
  tax_total: number;
  grand_total: number;
  coupon_code: string | null;
  shipping_address: Address;
  billing_address: Address;
  customer_note: string | null;
  tracking_number: string | null;
  carrier: string | null;
  paid_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
  can_cancel: boolean;
  can_pay: boolean;
  item_count: number | null;
  access_key?: string;
  items?: OrderItem[];
  history?: { status: string; note: string | null; created_at: string }[];
};

export type PaymentMethod = { code: string; label: string; description: string };

// ---- Parts diagrams ("Shop by Diagram") -------------------------------------------
export type DiagramAssemblySummary = {
  id: number;
  group_id: number;
  code: string | null;
  name: string;
  slug: string;
  diagram_url: string | null;
  sort_order: number;
  is_active: boolean;
  part_count: number | null;
};

export type DiagramGroup = {
  id: number;
  code: string;
  name: string;
  /** "20 - ENGINE COOLING-RADIATOR" */
  label: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
  assemblies: DiagramAssemblySummary[];
};

export type DiagramPart = {
  id: number;
  callout: string;
  quantity: number;
  note: string | null;
  /** position of the callout number in % of the diagram image */
  hotspot: { x: number; y: number } | null;
  product: {
    id: number;
    name: string;
    slug: string;
    sku: string;
    brand: string | null;
    short_description: string | null;
    image_url: string | null;
    category: { slug: string; name: string } | null;
    status: string;
  };
  variant: ProductVariant | null;
  variants: ProductVariant[];
};

export type DiagramAssembly = DiagramAssemblySummary & {
  description: string | null;
  group: Omit<DiagramGroup, 'assemblies'>;
  parts: DiagramPart[];
  previous: { name: string; slug: string } | null;
  next: { name: string; slug: string } | null;
};
