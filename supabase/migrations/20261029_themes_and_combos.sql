-- Site settings (key-value store for theme, banners, etc.)
create table if not exists site_settings (
  key   text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Seed default theme
insert into site_settings (key, value) values
  ('active_theme', '"default"'),
  ('theme_banner', 'null')
on conflict (key) do nothing;

-- Product combos / bundles
create table if not exists product_combos (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  slug         text not null unique,
  description  text not null default '',
  price_paise  integer not null check (price_paise > 0),
  compare_price_paise integer,
  products     jsonb not null default '[]',  -- [{slug, name}]
  is_active    boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Seed demo combos
insert into product_combos (name, slug, description, price_paise, compare_price_paise, products, sort_order) values
  (
    'Clean Home Starter Pack',
    'clean-home-starter',
    'Kitchen Cleaner + Multipurpose Cleaner — tackle the whole house at one price.',
    124900,
    149800,
    '[{"slug":"kitchen-cleaner","name":"Kitchen Cleaner"},{"slug":"multipurpose-cleaner","name":"Multipurpose Cleaner"}]',
    1
  ),
  (
    'Grime-Fighting Trio',
    'grime-fighting-trio',
    'All three cleaners — Kitchen, Multipurpose and Shoe — one bundle, maximum savings.',
    174900,
    229700,
    '[{"slug":"kitchen-cleaner","name":"Kitchen Cleaner"},{"slug":"multipurpose-cleaner","name":"Multipurpose Cleaner"},{"slug":"shoe-cleaner","name":"Shoe Cleaner"}]',
    2
  )
on conflict (slug) do nothing;

