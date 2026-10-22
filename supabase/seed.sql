-- ============================================================
-- MR GRIMEGURU — SEED DATA
-- ============================================================

-- ============================================================
-- Product Categories
-- ============================================================

INSERT INTO product_categories (id, name, slug, description, sort_order) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Laundry Care', 'laundry-care', 'Products for washing and caring for your clothes', 1),
  ('a1000000-0000-0000-0000-000000000002', 'Floor Care', 'floor-care', 'Products for cleaning and maintaining your floors', 2),
  ('a1000000-0000-0000-0000-000000000003', 'Kitchen Cleaning', 'kitchen-cleaning', 'Products for a spotless kitchen', 3),
  ('a1000000-0000-0000-0000-000000000004', 'Shoe Care', 'shoe-care', 'Products for cleaning and maintaining footwear', 4);

-- ============================================================
-- Products
-- ============================================================

INSERT INTO products (id, name, slug, family, category_id, short_description, description, usage_instructions, safety_precautions, status, is_featured, sort_order) VALUES
  (
    'b1000000-0000-0000-0000-000000000001',
    'Premium Laundry Pods',
    'laundry-pods',
    'laundry_pods',
    'a1000000-0000-0000-0000-000000000001',
    '3-in-1 cleaning power — works in all temperatures and all washing machines.',
    'Mr GrimeGuru Laundry Pods are pre-measured, dissolvable laundry pods packed with 3-in-1 action: powerful stain removal, long-lasting freshness, and gentle fabric care. No measuring, no mess. Just drop one pod into the drum and let it work.',
    'Place one pod at the bottom of the drum before loading laundry. Use 2 pods for very large or heavily soiled loads. Works in all wash cycles and temperatures. Do not place in dispenser drawer.',
    'Keep out of reach of children. Do not break, puncture, or cut the pod. Wash hands after handling. In case of eye contact, rinse with water immediately.',
    'active',
    TRUE,
    1
  ),
  (
    'b1000000-0000-0000-0000-000000000002',
    'Scented Laundry Beads',
    'laundry-beads',
    'laundry_beads',
    'a1000000-0000-0000-0000-000000000001',
    'Long-lasting fragrance boosters in 4 signature scents. Up to 12 weeks of freshness.',
    'Mr GrimeGuru Scented Laundry Beads are small, dissolvable beads that release a burst of fragrance during washing and keep your clothes smelling fresh for up to 12 weeks. Use alone or alongside your regular detergent.',
    'Shake the desired amount of beads into the drum before adding laundry. 1 capful for small loads, 2 capfuls for large loads. Compatible with any detergent and all machine types.',
    'Not a detergent substitute — for fragrance enhancement only. Keep out of reach of children. Avoid direct contact with eyes.',
    'active',
    TRUE,
    2
  ),
  (
    'b1000000-0000-0000-0000-000000000003',
    'Floor Cleaner',
    'floor-cleaner',
    'floor_cleaner',
    'a1000000-0000-0000-0000-000000000002',
    'Lemon-fresh formula for all common floor surfaces. No rinsing required.',
    'Mr GrimeGuru Floor Cleaner effectively removes dirt, grime, and bacteria from all common floor surfaces, leaving them streak-free and pleasantly fragrant. The lemon formula is safe for use around the family when used as directed.',
    'Dilute 20ml of Floor Cleaner in 1 litre of clean water. Apply to floor with a mop. No rinsing required. Allow to air dry. Do not walk on wet floor.',
    'Test on a small inconspicuous area before first use. Not for use on untreated/waxed wood without testing. Keep away from children and pets during use. Store in a cool, dry place.',
    'active',
    TRUE,
    3
  ),
  (
    'b1000000-0000-0000-0000-000000000004',
    'Kitchen Degreaser',
    'kitchen-degreaser',
    'kitchen_degreaser',
    'a1000000-0000-0000-0000-000000000003',
    'Powerful spray cuts through cooking oil, grease, and food residue instantly.',
    'Mr GrimeGuru Kitchen Degreaser is a powerful, ready-to-use spray that tackles the toughest kitchen grease and food residue. It works on stovetops, range hoods, tiles, and most kitchen surfaces.',
    'Hold 15–20cm from surface and spray a light even coat. Wait 30 seconds for heavy grease, or apply directly for light soil. Wipe with a damp cloth or sponge. Rinse food-contact surfaces with clean water after use.',
    'Do not use on hot surfaces. Not suitable for painted or lacquered surfaces without testing. Avoid contact with eyes and skin. Keep away from children.',
    'active',
    FALSE,
    4
  ),
  (
    'b1000000-0000-0000-0000-000000000005',
    'Shoe Cleaner',
    'shoe-cleaner',
    'shoe_cleaner',
    'a1000000-0000-0000-0000-000000000004',
    'Restores all materials — canvas, leather, mesh, and synthetic uppers.',
    'Mr GrimeGuru Shoe Cleaner is a gentle yet effective cleaning formula that removes dirt and stains from a wide range of shoe materials. Bring your footwear back to life without damaging the material.',
    'Remove loose dirt with a soft brush. Apply a small amount to a clean cloth or soft brush. Scrub gently in circular motions. Wipe away residue with a damp cloth. Air dry away from direct heat and sunlight.',
    'Test on a small area first, particularly for leather and suede. Do not soak materials. Keep away from eyes. Not for use on rubber soles or highly polished leather without testing.',
    'active',
    FALSE,
    5
  );

-- ============================================================
-- Product Variants
-- ============================================================

INSERT INTO product_variants (id, product_id, name, sku, price_paise, compare_at_price_paise, pack_size, is_default, sort_order) VALUES
  -- Laundry Pods
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', '30 Pods', 'MGG-LP-30', 89900, 109900, '30 pods', TRUE, 1),
  ('c1000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000001', '60 Pods — Best Value', 'MGG-LP-60', 159900, 199900, '60 pods', FALSE, 2),
  -- Laundry Beads
  ('c1000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000002', 'Lavender Dreams — 250g', 'MGG-LB-LD-250', 34900, NULL, '250g', FALSE, 1),
  ('c1000000-0000-0000-0000-000000000004', 'b1000000-0000-0000-0000-000000000002', 'Lavender Dreams — 500g', 'MGG-LB-LD-500', 59900, NULL, '500g', TRUE, 2),
  ('c1000000-0000-0000-0000-000000000005', 'b1000000-0000-0000-0000-000000000002', 'Ocean Breeze — 500g', 'MGG-LB-OB-500', 59900, NULL, '500g', FALSE, 3),
  ('c1000000-0000-0000-0000-000000000006', 'b1000000-0000-0000-0000-000000000002', 'Citrus Fresh — 500g', 'MGG-LB-CF-500', 59900, NULL, '500g', FALSE, 4),
  ('c1000000-0000-0000-0000-000000000007', 'b1000000-0000-0000-0000-000000000002', 'Velvet Rose — 500g', 'MGG-LB-VR-500', 59900, NULL, '500g', FALSE, 5),
  -- Floor Cleaner
  ('c1000000-0000-0000-0000-000000000008', 'b1000000-0000-0000-0000-000000000003', '500ml', 'MGG-FC-500', 19900, 24900, '500ml', FALSE, 1),
  ('c1000000-0000-0000-0000-000000000009', 'b1000000-0000-0000-0000-000000000003', '1 Litre', 'MGG-FC-1L', 29900, 39900, '1 litre', TRUE, 2),
  ('c1000000-0000-0000-0000-000000000010', 'b1000000-0000-0000-0000-000000000003', '2 Litres — Family Pack', 'MGG-FC-2L', 49900, NULL, '2 litres', FALSE, 3),
  -- Kitchen Degreaser
  ('c1000000-0000-0000-0000-000000000011', 'b1000000-0000-0000-0000-000000000004', '500ml Spray', 'MGG-KD-500', 34900, NULL, '500ml', TRUE, 1),
  -- Shoe Cleaner
  ('c1000000-0000-0000-0000-000000000012', 'b1000000-0000-0000-0000-000000000005', '200ml Kit', 'MGG-SC-200', 44900, 54900, '200ml', TRUE, 1),
  ('c1000000-0000-0000-0000-000000000013', 'b1000000-0000-0000-0000-000000000005', '100ml Travel Kit', 'MGG-SC-100', 29900, NULL, '100ml', FALSE, 2);

-- ============================================================
-- Inventory
-- ============================================================

INSERT INTO inventory (variant_id, quantity, low_stock_threshold) VALUES
  ('c1000000-0000-0000-0000-000000000001', 150, 10),
  ('c1000000-0000-0000-0000-000000000002', 80, 5),
  ('c1000000-0000-0000-0000-000000000003', 200, 15),
  ('c1000000-0000-0000-0000-000000000004', 120, 10),
  ('c1000000-0000-0000-0000-000000000005', 100, 10),
  ('c1000000-0000-0000-0000-000000000006', 90, 10),
  ('c1000000-0000-0000-0000-000000000007', 75, 10),
  ('c1000000-0000-0000-0000-000000000008', 180, 15),
  ('c1000000-0000-0000-0000-000000000009', 140, 10),
  ('c1000000-0000-0000-0000-000000000010', 60, 5),
  ('c1000000-0000-0000-0000-000000000011', 110, 10),
  ('c1000000-0000-0000-0000-000000000012', 95, 10),
  ('c1000000-0000-0000-0000-000000000013', 50, 5);

-- ============================================================
-- Blog Categories & Tags
-- ============================================================

INSERT INTO blog_categories (id, name, slug, description) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'Laundry Care', 'laundry-care', 'Tips for washing and caring for your clothes'),
  ('d1000000-0000-0000-0000-000000000002', 'Floor Care', 'floor-care', 'Guides for keeping your floors clean'),
  ('d1000000-0000-0000-0000-000000000003', 'Kitchen Cleaning', 'kitchen-cleaning', 'Tips for a spotless, hygienic kitchen'),
  ('d1000000-0000-0000-0000-000000000004', 'Shoe Care', 'shoe-care', 'Advice for keeping your footwear looking great');

INSERT INTO blog_tags (name, slug) VALUES
  ('laundry', 'laundry'), ('stain removal', 'stain-removal'), ('tips', 'tips'),
  ('floor cleaning', 'floor-cleaning'), ('kitchen', 'kitchen'), ('shoes', 'shoes'),
  ('eco-friendly', 'eco-friendly'), ('how-to', 'how-to'), ('guide', 'guide');

-- ============================================================
-- FAQs
-- ============================================================

INSERT INTO faqs (question, answer, product_id, category, sort_order, is_published) VALUES
  ('How many pods do I need per wash?', 'Use 1 pod for a standard load (up to 5kg). Use 2 pods for very large or heavily soiled loads.', 'b1000000-0000-0000-0000-000000000001', 'Usage', 1, TRUE),
  ('Do laundry pods work in cold water?', 'Yes! Our pods are formulated to dissolve completely in both hot and cold water, so they work with any wash cycle.', 'b1000000-0000-0000-0000-000000000001', 'Usage', 2, TRUE),
  ('Where should I put the pod — drum or drawer?', 'Always place the pod directly into the drum, before adding your laundry. Never place it in the dispenser drawer.', 'b1000000-0000-0000-0000-000000000001', 'Usage', 3, TRUE),
  ('Can I use laundry beads without a detergent?', 'Laundry beads are a fragrance booster, not a detergent. You should use them alongside your regular detergent for both cleaning and freshness.', 'b1000000-0000-0000-0000-000000000002', 'Usage', 1, TRUE),
  ('How long does the bead fragrance last?', 'The scent from our beads lasts up to 12 weeks on garments when stored in a wardrobe. Fragrance is reactivated each time you wear or move the clothes.', 'b1000000-0000-0000-0000-000000000002', 'Usage', 2, TRUE),
  ('What floor types can I use the Floor Cleaner on?', 'Our Floor Cleaner is safe for marble, ceramic tile, vinyl, and laminate floors. Test on an inconspicuous area before use on other surfaces.', 'b1000000-0000-0000-0000-000000000003', 'Usage', 1, TRUE),
  ('What is the correct dilution for Floor Cleaner?', 'Use 20ml (about 4 teaspoons) in 1 litre of clean water. For extra heavy soiling, you can increase to 30ml per litre.', 'b1000000-0000-0000-0000-000000000003', 'Usage', 2, TRUE),
  ('Is the Kitchen Degreaser safe on food surfaces?', 'Yes — rinse any food-contact surface thoroughly with clean water after cleaning. The degreaser is effective and safe when used as directed.', 'b1000000-0000-0000-0000-000000000004', 'Safety', 1, TRUE),
  ('Is your shipping free?', 'Yes! We offer free shipping on all orders above ₹499. Orders below ₹499 attract a flat shipping fee of ₹49.', NULL, 'Shipping', 1, TRUE),
  ('What is your return policy?', 'We accept returns of unused, sealed products within 7 days of delivery. Please contact our support team to initiate a return.', NULL, 'Returns', 1, TRUE);

-- ============================================================
-- Site Settings (defaults)
-- ============================================================

INSERT INTO site_settings (key, value) VALUES
  ('announcement_bar_text', '"🚚 Free shipping on orders above ₹499 · New: Laundry Beads in 4 amazing scents!"'),
  ('announcement_bar_enabled', 'true'),
  ('free_shipping_threshold_paise', '49900'),
  ('flat_shipping_paise', '4900'),
  ('contact_email', '"hello@mrgrimeguru.com"'),
  ('social_instagram', '"https://instagram.com/mrgrimeguru"'),
  ('social_youtube', '"https://youtube.com/@mrgrimeguru"'),
  ('razorpay_enabled', 'false'),
  ('groq_chat_enabled', 'false');
