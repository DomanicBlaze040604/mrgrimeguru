-- Additive only: existing products, enum values and orders are unchanged.
-- Run separately before scripts/publish-vehicle-cleaner.cjs.
ALTER TYPE public.product_family ADD VALUE IF NOT EXISTS 'vehicle_cleaner';
