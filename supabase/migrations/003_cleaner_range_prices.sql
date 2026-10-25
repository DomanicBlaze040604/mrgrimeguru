-- Match the homepage reference prices for default cleaner variants.
-- Sync stored prices for admin reporting; runtime offers also enforce these prices at checkout.
UPDATE product_variants AS v
SET price_paise = CASE WHEN p.slug = 'shoe-cleaner' THEN 59900 ELSE 49900 END,
    compare_at_price_paise = CASE WHEN p.slug = 'shoe-cleaner' THEN 69900 ELSE 59900 END
FROM products AS p
WHERE v.product_id = p.id
  AND v.is_default = TRUE
  AND p.slug IN ('shoe-cleaner', 'multipurpose-cleaner', 'floor-cleaner', 'kitchen-cleaner', 'kitchen-degreaser');
