-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name JSONB NOT NULL, -- { "en": "Monitors", "fr": "Moniteurs", "ar": "..." }
    slug TEXT UNIQUE NOT NULL,
    parent_id UUID REFERENCES categories(id),
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id),
    brand TEXT NOT NULL,
    name JSONB NOT NULL,
    description JSONB NOT NULL,
    technical_specs JSONB, -- Key-value pairs of specs
    is_professional_only BOOLEAN DEFAULT FALSE,
    image_url_list TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Variants Table (The Key)
CREATE TABLE variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    size_name TEXT NOT NULL, -- e.g., "50ml", "Large Cuff"
    sku TEXT UNIQUE NOT NULL,
    price DECIMAL(10, 3) NOT NULL, -- Tunisian Dinar (3 decimal places)
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    weight DECIMAL(10, 2), -- in kg
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Orders Table
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'in_preparation', 'out_for_delivery', 'completed', 'cancelled');
CREATE TYPE customer_type AS ENUM ('clinic', 'pharmacy', 'individual');
CREATE TYPE logistics_type AS ENUM ('pickup', 'delivery');

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_type customer_type NOT NULL,
    status order_status DEFAULT 'pending',
    total_price DECIMAL(10, 3) NOT NULL,
    customer_details JSONB NOT NULL, -- { name, phone, email, address, city }
    logistics_type logistics_type NOT NULL,
    internal_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Order Items Table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES variants(id),
    quantity INTEGER NOT NULL,
    price_at_time_of_order DECIMAL(10, 3) NOT NULL,
    product_name TEXT, -- Snapshot in case product is deleted
    variant_name TEXT
);

-- Indexes for Performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_variants_product ON variants(product_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_products_brand ON products(brand);
