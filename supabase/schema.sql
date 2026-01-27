-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id TEXT NOT NULL,
    brand TEXT NOT NULL,
    name JSONB NOT NULL, -- { en: "...", fr: "...", ar: "..." }
    description JSONB NOT NULL, -- { en: "...", fr: "...", ar: "..." }
    technical_specs JSONB, -- { "Key": "Value" }
    is_professional_only BOOLEAN DEFAULT FALSE,
    image_url_list TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add slug column for human-readable product URLs
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- Backfill slug from name if missing (prefers French, falls back to English)
UPDATE products
SET slug = lower(regexp_replace(COALESCE(name->>'fr', name->>'en', ''), '[^a-z0-9]+', '-', 'g'))
WHERE slug IS NULL;

-- 2. VARIANTS TABLE
CREATE TABLE IF NOT EXISTS variants (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
    size_name TEXT NOT NULL,
    sku TEXT NOT NULL,
    price DECIMAL(10, 3) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(), -- Will be something like 'ord_...' in application logic if preferred, but UUID is better for DB
    customer_type TEXT CHECK (customer_type IN ('individual', 'clinic')),
    status TEXT CHECK (status IN ('pending', 'confirmed', 'in_preparation', 'out_for_delivery', 'completed', 'cancelled')) DEFAULT 'pending',
    total_price DECIMAL(10, 3) NOT NULL,
    customer_details JSONB NOT NULL, -- { name, phone, city, address }
    logistics_type TEXT CHECK (logistics_type IN ('delivery', 'pickup')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
    variant_id TEXT REFERENCES variants(id),
    product_name TEXT NOT NULL, -- Snapshot of name at time of order
    variant_name TEXT NOT NULL, -- Snapshot of variant name
    quantity INTEGER NOT NULL,
    price_at_time_of_order DECIMAL(10, 3) NOT NULL
);

-- 5. CLINIC REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS clinic_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_name TEXT NOT NULL,
    doctor_name TEXT NOT NULL,
    specialty TEXT,
    license_number TEXT,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT,
    city TEXT,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. ADMIN SETTINGS TABLE (Optional, for site-wide settings)
CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS POLICIES (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_registrations ENABLE ROW LEVEL SECURITY;

-- Public Read Access for Products/Variants
CREATE POLICY "Public products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Public variants are viewable by everyone" ON variants FOR SELECT USING (true);

-- Authenticated Admin Access (Assuming you use Supabase Auth and have an admin role or check email)
-- For simplicity in this phase, we'll allow authenticated users (if you lock registration) or use a specific email check.
-- ideally: auth.jwt() ->> 'email' = 'admin@prestige.tn'

-- Example Policy for Orders (Public can create, only Admin can view all)
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create order items" ON order_items FOR INSERT WITH CHECK (true);

-- Realtime
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE products, variants, orders, clinic_registrations;
COMMIT;
