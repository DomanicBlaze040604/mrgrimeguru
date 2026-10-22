// ============================================
// MR GRIMEGURU — CORE TYPES
// ============================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ============================================
// DATABASE TYPES
// ============================================

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id'>>
      }
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Product, 'id'>>
      }
      product_variants: {
        Row: ProductVariant
        Insert: Omit<ProductVariant, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ProductVariant, 'id'>>
      }
      orders: {
        Row: Order
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Order, 'id'>>
      }
      reviews: {
        Row: Review
        Insert: Omit<Review, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Review, 'id'>>
      }
      blog_posts: {
        Row: BlogPost
        Insert: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<BlogPost, 'id'>>
      }
    }
  }
}

// ============================================
// PROFILE / USER TYPES
// ============================================

export type UserRole = 'owner' | 'administrator' | 'operations' | 'content_editor' | 'customer_support' | 'customer'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at: string
}

// ============================================
// PRODUCT TYPES
// ============================================

export type ProductFamily = 'laundry_pods' | 'laundry_beads' | 'floor_cleaner' | 'kitchen_degreaser' | 'shoe_cleaner'
export type ProductStatus = 'draft' | 'active' | 'archived'

export interface ProductCategory {
  id: string
  name: string
  slug: string
  description: string | null
  parent_id: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  family: ProductFamily
  category_id: string | null
  short_description: string
  description: string
  usage_instructions: string | null
  safety_precautions: string | null
  ingredients_info: string | null
  status: ProductStatus
  is_featured: boolean
  sort_order: number
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
  // Relations
  variants?: ProductVariant[]
  media?: ProductMedia[]
  category?: ProductCategory
}

export interface ProductVariant {
  id: string
  product_id: string
  name: string
  sku: string
  price_paise: number // Store in paise (1/100 of INR) for exact math
  compare_at_price_paise: number | null
  pack_size: string | null
  weight_grams: number | null
  color: string | null
  scent: string | null
  is_default: boolean
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
  // Relations
  inventory?: Inventory
}

export interface ProductMedia {
  id: string
  product_id: string
  variant_id: string | null
  type: 'image' | 'video'
  url: string
  alt_text: string | null
  sort_order: number
  is_hero: boolean
  created_at: string
}

// Convenience: price in rupees (for display)
export function formatPrice(paise: number): string {
  return `₹${(paise / 100).toFixed(2)}`
}

export function formatPriceShort(paise: number): string {
  const rupees = paise / 100
  return `₹${rupees % 1 === 0 ? rupees.toFixed(0) : rupees.toFixed(2)}`
}

// ============================================
// INVENTORY TYPES
// ============================================

export interface Inventory {
  id: string
  variant_id: string
  quantity: number
  reserved_quantity: number
  low_stock_threshold: number
  track_inventory: boolean
  updated_at: string
}

export interface InventoryMovement {
  id: string
  variant_id: string
  quantity_change: number
  reason: 'purchase' | 'return' | 'adjustment' | 'reservation' | 'reservation_release'
  reference_id: string | null
  note: string | null
  created_by: string | null
  created_at: string
}

// Available stock = quantity - reserved_quantity
export function getAvailableStock(inv: Inventory): number {
  return Math.max(0, inv.quantity - inv.reserved_quantity)
}

// ============================================
// CART TYPES
// ============================================

export interface CartItem {
  id: string
  product_id: string
  variant_id: string
  quantity: number
  // Denormalized for display
  name: string
  product_name: string
  variant_name: string
  price_paise: number
  image: string
  image_url: string
  slug: string
}

export interface Cart {
  id: string
  user_id: string | null
  session_id: string | null
  items: CartItem[]
  discount_code: string | null
  discount_amount_paise: number
  updated_at: string
}

export interface CartTotals {
  subtotal_paise: number
  discount_paise: number
  shipping_paise: number
  tax_paise: number
  total_paise: number
  item_count: number
}

// ============================================
// ADDRESS TYPES
// ============================================

export interface Address {
  id: string
  user_id: string
  full_name: string
  phone: string
  line1: string
  line2: string | null
  city: string
  state: string
  pincode: string
  country: string
  is_default: boolean
  created_at: string
  updated_at: string
}

// ============================================
// ORDER TYPES
// ============================================

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'partially_refunded'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
export type FulfillmentStatus = 'unfulfilled' | 'partial' | 'fulfilled' | 'returned'

export interface Order {
  id: string
  order_number: string
  user_id: string | null
  guest_email: string | null
  status: OrderStatus
  payment_status: PaymentStatus
  fulfillment_status: FulfillmentStatus
  
  // Pricing
  subtotal_paise: number
  discount_paise: number
  shipping_paise: number
  tax_paise: number
  total_paise: number
  
  // Snapshot
  shipping_address: AddressSnapshot
  discount_code: string | null
  
  // Tracking
  tracking_number: string | null
  tracking_url: string | null
  notes: string | null
  
  created_at: string
  updated_at: string
  
  // Relations
  items?: OrderItem[]
  payments?: Payment[]
  customer?: Profile
}

export interface AddressSnapshot {
  full_name: string
  phone: string
  line1: string
  line2?: string | null
  city: string
  state: string
  pincode: string
  country: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  variant_id: string
  quantity: number
  // Snapshot at time of purchase
  product_name: string
  variant_name: string
  sku: string
  unit_price_paise: number
  total_price_paise: number
  image_url: string | null
  created_at: string
}

// ============================================
// PAYMENT TYPES
// ============================================

export type PaymentProvider = 'razorpay' | 'cod'

export interface Payment {
  id: string
  order_id: string
  provider: PaymentProvider
  provider_order_id: string | null
  provider_payment_id: string | null
  amount_paise: number
  currency: string
  status: PaymentStatus
  metadata: Json
  created_at: string
  updated_at: string
}

// ============================================
// DISCOUNT TYPES
// ============================================

export type DiscountType = 'percentage' | 'fixed_amount'

export interface Discount {
  id: string
  code: string
  type: DiscountType
  value: number // Percentage (0-100) or amount in paise
  min_order_paise: number | null
  max_uses: number | null
  used_count: number
  valid_from: string | null
  valid_until: string | null
  is_active: boolean
  applicable_product_ids: string[] | null
  created_at: string
  updated_at: string
}

// ============================================
// REVIEW TYPES
// ============================================

export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'flagged'
export type ReviewType = 'text' | 'video'

export interface Review {
  id: string
  product_id: string
  user_id: string | null
  guest_name: string | null
  guest_email: string | null
  type: ReviewType
  rating: number // 1-5
  title: string | null
  body: string | null
  video_url: string | null
  video_thumbnail: string | null
  status: ReviewStatus
  is_verified_purchase: boolean
  order_id: string | null
  helpful_count: number
  created_at: string
  updated_at: string
  // Relations
  reviewer?: Pick<Profile, 'full_name' | 'avatar_url'>
}

// ============================================
// BLOG TYPES
// ============================================

export type BlogPostStatus = 'draft' | 'scheduled' | 'published' | 'archived'

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image_url: string | null
  author_id: string
  status: BlogPostStatus
  published_at: string | null
  scheduled_at: string | null
  reading_time_minutes: number | null
  meta_title: string | null
  meta_description: string | null
  og_image_url: string | null
  created_at: string
  updated_at: string
  // Relations
  author?: Pick<Profile, 'full_name' | 'avatar_url'>
  categories?: BlogCategory[]
  tags?: BlogTag[]
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string | null
}

export interface BlogTag {
  id: string
  name: string
  slug: string
}

// ============================================
// CONTENT / CMS TYPES
// ============================================

export interface HomepageSection {
  id: string
  key: string
  title: string | null
  content: Json
  is_visible: boolean
  sort_order: number
  updated_at: string
}

export interface SiteSetting {
  id: string
  key: string
  value: Json
  updated_at: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  product_id: string | null
  category: string | null
  sort_order: number
  is_published: boolean
}

// ============================================
// CHAT / AI TYPES
// ============================================

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface ChatConversation {
  id: string
  session_id: string
  messages: ChatMessage[]
  created_at: string
  updated_at: string
}

// ============================================
// ANALYTICS TYPES
// ============================================

export interface AnalyticsEvent {
  id: string
  event_name: string
  properties: Json
  user_id: string | null
  session_id: string | null
  created_at: string
}

// ============================================
// ADMIN TYPES
// ============================================

export interface AuditLog {
  id: string
  user_id: string
  action: string
  resource_type: string
  resource_id: string | null
  before_state: Json
  after_state: Json
  ip_address: string | null
  created_at: string
}

export interface DashboardMetrics {
  total_orders: number
  gross_sales_paise: number
  net_sales_paise: number
  average_order_value_paise: number
  pending_fulfillment: number
  cancelled_orders: number
  low_stock_products: number
  pending_reviews: number
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  per_page: number
  total_pages: number
}
