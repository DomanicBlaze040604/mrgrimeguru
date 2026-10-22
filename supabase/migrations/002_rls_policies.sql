-- ============================================================
-- MR GRIMEGURU — ROW LEVEL SECURITY POLICIES
-- Migration: 002_rls_policies.sql
-- ============================================================

-- ============================================================
-- Enable RLS on all tables
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_tour_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_education_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION auth_user_role()
RETURNS user_role LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role FROM profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION is_admin_role()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role IN ('owner','administrator','operations','content_editor','customer_support')
  FROM profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION is_owner_or_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role IN ('owner','administrator')
  FROM profiles WHERE id = auth.uid()
$$;

-- ============================================================
-- PROFILES
-- ============================================================

-- Users can read their own profile
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (id = auth.uid());

-- Users can update their own profile (not role)
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid()
    AND role = (SELECT role FROM profiles WHERE id = auth.uid()) -- cannot change own role
  );

-- Admins can read all profiles
CREATE POLICY "profiles_admin_select" ON profiles
  FOR SELECT USING (is_admin_role());

-- Only owners/administrators can change roles
CREATE POLICY "profiles_admin_update" ON profiles
  FOR UPDATE USING (is_owner_or_admin());

-- ============================================================
-- PRODUCTS (public read for active, admin full access)
-- ============================================================

CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (status = 'active');

CREATE POLICY "products_admin_all" ON products
  USING (is_admin_role())
  WITH CHECK (is_admin_role());

-- Same pattern for related tables
CREATE POLICY "product_categories_public" ON product_categories FOR SELECT USING (TRUE);
CREATE POLICY "product_categories_admin" ON product_categories USING (is_admin_role()) WITH CHECK (is_admin_role());

CREATE POLICY "variants_public" ON product_variants FOR SELECT
  USING (EXISTS (SELECT 1 FROM products p WHERE p.id = product_id AND p.status = 'active'));
CREATE POLICY "variants_admin" ON product_variants USING (is_admin_role()) WITH CHECK (is_admin_role());

CREATE POLICY "media_public" ON product_media FOR SELECT
  USING (EXISTS (SELECT 1 FROM products p WHERE p.id = product_id AND p.status = 'active'));
CREATE POLICY "media_admin" ON product_media USING (is_admin_role()) WITH CHECK (is_admin_role());

-- Inventory: public read for stock counts, admin full
CREATE POLICY "inventory_public" ON inventory FOR SELECT USING (TRUE);
CREATE POLICY "inventory_admin" ON inventory USING (is_admin_role()) WITH CHECK (is_admin_role());

CREATE POLICY "inv_movements_admin" ON inventory_movements USING (is_admin_role()) WITH CHECK (is_admin_role());

-- ============================================================
-- CARTS
-- ============================================================

CREATE POLICY "carts_own" ON carts
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "cart_items_own" ON cart_items
  USING (EXISTS (SELECT 1 FROM carts c WHERE c.id = cart_id AND (c.user_id = auth.uid() OR c.user_id IS NULL)));

-- ============================================================
-- ADDRESSES
-- ============================================================

CREATE POLICY "addresses_own" ON addresses
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "addresses_admin" ON addresses FOR SELECT USING (is_admin_role());

-- ============================================================
-- ORDERS
-- ============================================================

-- Customers can only see their own orders
CREATE POLICY "orders_own" ON orders
  FOR SELECT USING (user_id = auth.uid() OR guest_email = auth.email());

-- Customers cannot insert orders directly (must go through server function)
-- Orders are inserted server-side via service_role

-- Admin can see and manage all orders
CREATE POLICY "orders_admin" ON orders USING (is_admin_role());

CREATE POLICY "order_items_own" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR o.guest_email = auth.email()))
  );
CREATE POLICY "order_items_admin" ON order_items USING (is_admin_role());

-- ============================================================
-- PAYMENTS (sensitive — very restricted)
-- ============================================================

-- Customers can check payment status of own orders
CREATE POLICY "payments_own" ON payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders o WHERE o.id = order_id AND (o.user_id = auth.uid() OR o.guest_email = auth.email()))
  );

-- Only owner/admin can manage payments
CREATE POLICY "payments_admin" ON payments USING (is_owner_or_admin());

-- ============================================================
-- DISCOUNTS
-- ============================================================

-- Public can read active discount codes (to validate)
CREATE POLICY "discounts_public_read" ON discounts
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "discounts_admin" ON discounts USING (is_owner_or_admin()) WITH CHECK (is_owner_or_admin());

CREATE POLICY "discount_redemptions_admin" ON discount_redemptions USING (is_admin_role());

-- ============================================================
-- REVIEWS
-- ============================================================

-- Public can read approved reviews
CREATE POLICY "reviews_public" ON reviews
  FOR SELECT USING (status = 'approved');

-- Authenticated users can insert reviews
CREATE POLICY "reviews_insert" ON reviews
  FOR INSERT WITH CHECK (
    (user_id = auth.uid() OR user_id IS NULL) -- Must be own user_id or guest
    AND status = 'pending' -- Cannot self-approve
    AND is_verified_purchase = FALSE -- Cannot self-grant verified badge
  );

-- Users can read their own reviews
CREATE POLICY "reviews_own" ON reviews
  FOR SELECT USING (user_id = auth.uid());

-- Admin can manage all reviews
CREATE POLICY "reviews_admin" ON reviews USING (is_admin_role());

CREATE POLICY "review_reports_insert" ON review_reports
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "review_reports_admin" ON review_reports USING (is_admin_role());

-- ============================================================
-- BLOG
-- ============================================================

-- Public can read published posts
CREATE POLICY "blog_posts_public" ON blog_posts
  FOR SELECT USING (status = 'published' AND (published_at IS NULL OR published_at <= NOW()));

-- Admins full access
CREATE POLICY "blog_posts_admin" ON blog_posts USING (is_admin_role()) WITH CHECK (is_admin_role());

CREATE POLICY "blog_categories_public" ON blog_categories FOR SELECT USING (TRUE);
CREATE POLICY "blog_categories_admin" ON blog_categories USING (is_admin_role()) WITH CHECK (is_admin_role());

CREATE POLICY "blog_tags_public" ON blog_tags FOR SELECT USING (TRUE);
CREATE POLICY "blog_tags_admin" ON blog_tags USING (is_admin_role()) WITH CHECK (is_admin_role());

CREATE POLICY "blog_post_categories_public" ON blog_post_categories
  FOR SELECT USING (EXISTS (SELECT 1 FROM blog_posts p WHERE p.id = post_id AND p.status = 'published'));
CREATE POLICY "blog_post_categories_admin" ON blog_post_categories USING (is_admin_role()) WITH CHECK (is_admin_role());

CREATE POLICY "blog_post_tags_public" ON blog_post_tags
  FOR SELECT USING (EXISTS (SELECT 1 FROM blog_posts p WHERE p.id = post_id AND p.status = 'published'));
CREATE POLICY "blog_post_tags_admin" ON blog_post_tags USING (is_admin_role()) WITH CHECK (is_admin_role());

-- ============================================================
-- CMS / CONTENT (public read, admin write)
-- ============================================================

CREATE POLICY "faqs_public" ON faqs FOR SELECT USING (is_published = TRUE);
CREATE POLICY "faqs_admin" ON faqs USING (is_admin_role()) WITH CHECK (is_admin_role());

CREATE POLICY "homepage_sections_public" ON homepage_sections FOR SELECT USING (is_visible = TRUE);
CREATE POLICY "homepage_sections_admin" ON homepage_sections USING (is_admin_role()) WITH CHECK (is_admin_role());

CREATE POLICY "site_settings_public" ON site_settings FOR SELECT USING (TRUE);
CREATE POLICY "site_settings_admin" ON site_settings USING (is_owner_or_admin()) WITH CHECK (is_owner_or_admin());

CREATE POLICY "brand_tour_steps_public" ON brand_tour_steps FOR SELECT USING (is_active = TRUE);
CREATE POLICY "brand_tour_steps_admin" ON brand_tour_steps USING (is_admin_role()) WITH CHECK (is_admin_role());

CREATE POLICY "edu_slides_public" ON product_education_slides FOR SELECT USING (TRUE);
CREATE POLICY "edu_slides_admin" ON product_education_slides USING (is_admin_role()) WITH CHECK (is_admin_role());

CREATE POLICY "media_assets_public" ON media_assets FOR SELECT USING (TRUE);
CREATE POLICY "media_assets_admin" ON media_assets USING (is_admin_role()) WITH CHECK (is_admin_role());

-- ============================================================
-- CONTACT & NEWSLETTER
-- ============================================================

-- Anyone can submit contact messages
CREATE POLICY "contact_insert" ON contact_messages FOR INSERT WITH CHECK (TRUE);
-- Users can view their own contact messages
CREATE POLICY "contact_own" ON contact_messages FOR SELECT USING (email = auth.email());
CREATE POLICY "contact_admin" ON contact_messages USING (is_admin_role());

-- Anyone can subscribe to newsletter
CREATE POLICY "newsletter_insert" ON newsletter_subscriptions FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "newsletter_own" ON newsletter_subscriptions FOR SELECT USING (email = auth.email());
CREATE POLICY "newsletter_admin" ON newsletter_subscriptions USING (is_admin_role());

-- ============================================================
-- CHAT & ANALYTICS
-- ============================================================

CREATE POLICY "chat_conv_own" ON chat_conversations
  USING (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "chat_conv_admin" ON chat_conversations FOR SELECT USING (is_admin_role());

CREATE POLICY "chat_msgs_own" ON chat_messages
  USING (EXISTS (SELECT 1 FROM chat_conversations c WHERE c.id = conversation_id AND (c.user_id = auth.uid() OR c.user_id IS NULL)));
CREATE POLICY "chat_msgs_admin" ON chat_messages FOR SELECT USING (is_admin_role());

-- Analytics events: anyone can insert (anonymized), only admins can read
CREATE POLICY "analytics_insert" ON analytics_events FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "analytics_admin" ON analytics_events FOR SELECT USING (is_admin_role());

-- Audit logs: only admins can read (system inserts via service_role)
CREATE POLICY "audit_logs_admin" ON admin_audit_logs FOR SELECT USING (is_owner_or_admin());
