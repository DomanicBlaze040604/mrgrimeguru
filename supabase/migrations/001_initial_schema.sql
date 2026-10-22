-- ============================================================
-- MR GRIMEGURU — SUPABASE DATABASE SCHEMA
-- Migration: 001_initial_schema.sql
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- For full-text search

-- ============================================================
-- PROFILES & ROLES
-- ============================================================

CREATE TYPE user_role AS ENUM (
  'owner', 'administrator', 'operations', 'content_editor', 'customer_support', 'customer'
);

CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL UNIQUE,
  full_name     TEXT,
  phone         TEXT,
  avatar_url    TEXT,
  role          user_role NOT NULL DEFAULT 'customer',
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL)
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- PRODUCT CATEGORIES
-- ============================================================

CREATE TABLE product_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id   UUID REFERENCES product_categories(id),
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PRODUCTS
-- ============================================================

CREATE TYPE product_family AS ENUM (
  'laundry_pods', 'laundry_beads', 'floor_cleaner', 'kitchen_degreaser', 'shoe_cleaner'
);

CREATE TYPE product_status AS ENUM ('draft', 'active', 'archived');

CREATE TABLE products (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                 TEXT NOT NULL,
  slug                 TEXT NOT NULL UNIQUE,
  family               product_family NOT NULL,
  category_id          UUID REFERENCES product_categories(id),
  short_description    TEXT NOT NULL DEFAULT '',
  description          TEXT NOT NULL DEFAULT '',
  usage_instructions   TEXT,
  safety_precautions   TEXT,
  ingredients_info     TEXT,
  status               product_status NOT NULL DEFAULT 'draft',
  is_featured          BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order           INT NOT NULL DEFAULT 0,
  meta_title           TEXT,
  meta_description     TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_family ON products(family);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;

-- Full-text search
CREATE INDEX idx_products_fts ON products
  USING gin(to_tsvector('english', coalesce(name,'') || ' ' || coalesce(short_description,'')));

-- ============================================================
-- PRODUCT VARIANTS
-- ============================================================

CREATE TABLE product_variants (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id            UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name                  TEXT NOT NULL,
  sku                   TEXT NOT NULL UNIQUE,
  price_paise           BIGINT NOT NULL CHECK (price_paise >= 0),
  compare_at_price_paise BIGINT CHECK (compare_at_price_paise >= 0),
  pack_size             TEXT,
  weight_grams          INT,
  color                 TEXT,
  scent                 TEXT,
  is_default            BOOLEAN NOT NULL DEFAULT FALSE,
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order            INT NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_sku ON product_variants(sku);

-- ============================================================
-- PRODUCT MEDIA
-- ============================================================

CREATE TABLE product_media (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id  UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  type        TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url         TEXT NOT NULL,
  alt_text    TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  is_hero     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_media_product ON product_media(product_id);

-- ============================================================
-- INVENTORY
-- ============================================================

CREATE TABLE inventory (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id          UUID NOT NULL UNIQUE REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity            INT NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  reserved_quantity   INT NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
  low_stock_threshold INT NOT NULL DEFAULT 5,
  track_inventory     BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inventory_low_stock ON inventory(quantity, low_stock_threshold);

CREATE TABLE inventory_movements (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id      UUID NOT NULL REFERENCES product_variants(id),
  quantity_change INT NOT NULL,
  reason          TEXT NOT NULL CHECK (reason IN ('purchase', 'return', 'adjustment', 'reservation', 'reservation_release')),
  reference_id    UUID,
  note            TEXT,
  created_by      UUID REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CARTS
-- ============================================================

CREATE TABLE carts (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id           TEXT,
  discount_code        TEXT,
  discount_amount_paise BIGINT DEFAULT 0,
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT carts_user_or_session CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

CREATE TABLE cart_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id     UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id),
  variant_id  UUID NOT NULL REFERENCES product_variants(id),
  quantity    INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  added_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (cart_id, variant_id)
);

-- ============================================================
-- ADDRESSES
-- ============================================================

CREATE TABLE addresses (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  full_name  TEXT NOT NULL,
  phone      TEXT NOT NULL,
  line1      TEXT NOT NULL,
  line2      TEXT,
  city       TEXT NOT NULL,
  state      TEXT NOT NULL,
  pincode    TEXT NOT NULL,
  country    TEXT NOT NULL DEFAULT 'IN',
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_addresses_user ON addresses(user_id);

-- ============================================================
-- ORDERS
-- ============================================================

CREATE TYPE order_status AS ENUM (
  'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'partially_refunded'
);
CREATE TYPE payment_status AS ENUM (
  'pending', 'paid', 'failed', 'refunded', 'partially_refunded'
);
CREATE TYPE fulfillment_status AS ENUM (
  'unfulfilled', 'partial', 'fulfilled', 'returned'
);

CREATE TABLE orders (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number        TEXT NOT NULL UNIQUE,
  user_id             UUID REFERENCES profiles(id),
  guest_email         TEXT,
  status              order_status NOT NULL DEFAULT 'pending',
  payment_status      payment_status NOT NULL DEFAULT 'pending',
  fulfillment_status  fulfillment_status NOT NULL DEFAULT 'unfulfilled',
  subtotal_paise      BIGINT NOT NULL CHECK (subtotal_paise >= 0),
  discount_paise      BIGINT NOT NULL DEFAULT 0 CHECK (discount_paise >= 0),
  shipping_paise      BIGINT NOT NULL DEFAULT 0 CHECK (shipping_paise >= 0),
  tax_paise           BIGINT NOT NULL DEFAULT 0 CHECK (tax_paise >= 0),
  total_paise         BIGINT NOT NULL CHECK (total_paise >= 0),
  shipping_address    JSONB NOT NULL,
  discount_code       TEXT,
  tracking_number     TEXT,
  tracking_url        TEXT,
  notes               TEXT,
  internal_notes      TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT orders_user_or_guest CHECK (user_id IS NOT NULL OR guest_email IS NOT NULL)
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_orders_number ON orders(order_number);

CREATE TABLE order_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id      UUID NOT NULL REFERENCES products(id),
  variant_id      UUID NOT NULL REFERENCES product_variants(id),
  quantity        INT NOT NULL CHECK (quantity > 0),
  -- Snapshot at purchase time
  product_name    TEXT NOT NULL,
  variant_name    TEXT NOT NULL,
  sku             TEXT NOT NULL,
  unit_price_paise BIGINT NOT NULL,
  total_price_paise BIGINT NOT NULL,
  image_url       TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ============================================================
-- PAYMENTS
-- ============================================================

CREATE TABLE payments (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id              UUID NOT NULL REFERENCES orders(id),
  provider              TEXT NOT NULL DEFAULT 'razorpay',
  provider_order_id     TEXT,
  provider_payment_id   TEXT,
  amount_paise          BIGINT NOT NULL CHECK (amount_paise >= 0),
  currency              TEXT NOT NULL DEFAULT 'INR',
  status                payment_status NOT NULL DEFAULT 'pending',
  metadata              JSONB NOT NULL DEFAULT '{}',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_provider_order ON payments(provider_order_id);

-- ============================================================
-- DISCOUNTS
-- ============================================================

CREATE TABLE discounts (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code                    TEXT NOT NULL UNIQUE,
  type                    TEXT NOT NULL CHECK (type IN ('percentage', 'fixed_amount')),
  value                   NUMERIC(10,2) NOT NULL CHECK (value > 0),
  min_order_paise         BIGINT,
  max_uses                INT,
  used_count              INT NOT NULL DEFAULT 0,
  valid_from              TIMESTAMPTZ,
  valid_until             TIMESTAMPTZ,
  is_active               BOOLEAN NOT NULL DEFAULT TRUE,
  applicable_product_ids  UUID[],
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_discounts_code ON discounts(code);
CREATE INDEX idx_discounts_active ON discounts(is_active, valid_until);

CREATE TABLE discount_redemptions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discount_id  UUID NOT NULL REFERENCES discounts(id),
  order_id     UUID NOT NULL REFERENCES orders(id),
  user_id      UUID REFERENCES profiles(id),
  redeemed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- REVIEWS
-- ============================================================

CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected', 'flagged');

CREATE TABLE reviews (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id           UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id              UUID REFERENCES profiles(id),
  guest_name           TEXT,
  guest_email          TEXT,
  type                 TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'video')),
  rating               INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title                TEXT,
  body                 TEXT,
  video_url            TEXT,
  video_thumbnail      TEXT,
  status               review_status NOT NULL DEFAULT 'pending',
  is_verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
  order_id             UUID REFERENCES orders(id),
  helpful_count        INT NOT NULL DEFAULT 0,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT reviews_user_or_guest CHECK (user_id IS NOT NULL OR guest_name IS NOT NULL)
);

CREATE INDEX idx_reviews_product ON reviews(product_id, status);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_user ON reviews(user_id);

CREATE TABLE review_reports (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id   UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES profiles(id),
  reason      TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- BLOG
-- ============================================================

CREATE TYPE blog_post_status AS ENUM ('draft', 'scheduled', 'published', 'archived');

CREATE TABLE blog_categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE blog_tags (
  id   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE
);

CREATE TABLE blog_posts (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title                TEXT NOT NULL,
  slug                 TEXT NOT NULL UNIQUE,
  excerpt              TEXT,
  content              TEXT NOT NULL DEFAULT '',
  featured_image_url   TEXT,
  author_id            UUID NOT NULL REFERENCES profiles(id),
  status               blog_post_status NOT NULL DEFAULT 'draft',
  published_at         TIMESTAMPTZ,
  scheduled_at         TIMESTAMPTZ,
  reading_time_minutes INT,
  meta_title           TEXT,
  meta_description     TEXT,
  og_image_url         TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blog_posts_status ON blog_posts(status, published_at DESC);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_fts ON blog_posts
  USING gin(to_tsvector('english', coalesce(title,'') || ' ' || coalesce(excerpt,'')));

CREATE TABLE blog_post_categories (
  post_id     UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

CREATE TABLE blog_post_tags (
  post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id  UUID NOT NULL REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- ============================================================
-- CMS / CONTENT
-- ============================================================

CREATE TABLE faqs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question    TEXT NOT NULL,
  answer      TEXT NOT NULL,
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  category    TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE homepage_sections (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key        TEXT NOT NULL UNIQUE,
  title      TEXT,
  content    JSONB NOT NULL DEFAULT '{}',
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE site_settings (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key        TEXT NOT NULL UNIQUE,
  value      JSONB NOT NULL DEFAULT 'null',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE brand_tour_steps (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  emoji      TEXT,
  action_label TEXT,
  action_href  TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE product_education_slides (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  icon       TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE media_assets (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename    TEXT NOT NULL,
  url         TEXT NOT NULL,
  type        TEXT NOT NULL,
  size_bytes  INT,
  alt_text    TEXT,
  caption     TEXT,
  tags        TEXT[],
  uploaded_by UUID REFERENCES profiles(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CONTACT & NEWSLETTER
-- ============================================================

CREATE TABLE contact_messages (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  subject      TEXT,
  message      TEXT NOT NULL,
  order_id     UUID REFERENCES orders(id),
  status       TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  assigned_to  UUID REFERENCES profiles(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE newsletter_subscriptions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email        TEXT NOT NULL UNIQUE,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- ============================================================
-- CHAT & ANALYTICS
-- ============================================================

CREATE TABLE chat_conversations (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  user_id    UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  role            TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content         TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE analytics_events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name  TEXT NOT NULL,
  properties  JSONB NOT NULL DEFAULT '{}',
  user_id     UUID REFERENCES profiles(id),
  session_id  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analytics_event ON analytics_events(event_name, created_at DESC);

CREATE TABLE admin_audit_logs (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES profiles(id),
  action         TEXT NOT NULL,
  resource_type  TEXT NOT NULL,
  resource_id    UUID,
  before_state   JSONB,
  after_state    JSONB,
  ip_address     TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON admin_audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_resource ON admin_audit_logs(resource_type, resource_id);

-- ============================================================
-- UPDATED_AT TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'profiles','products','product_categories','product_variants',
    'inventory','orders','payments','discounts','reviews',
    'blog_posts','faqs','contact_messages','site_settings'
  ]
  LOOP
    EXECUTE format(
      'CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
      tbl
    );
  END LOOP;
END;
$$;
