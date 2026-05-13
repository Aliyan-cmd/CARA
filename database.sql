-- CARA Database Schema

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    location TEXT,
    role TEXT DEFAULT 'customer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total_price DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending',
    shipping_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Seed Initial Data
INSERT INTO categories (name, description) VALUES 
('Men', 'Premium apparel for men'),
('Women', 'Elegant fashion for women'),
('Accessories', 'Stylized additions to your outfit');

INSERT INTO products (category_id, name, description, price, stock_quantity, image_url, is_featured) VALUES 
(1, 'Midnight Silk Shirt', 'A luxurious black silk shirt for evening wear.', 89.99, 50, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', 1),
(2, 'Ethereal Summer Dress', 'Lightweight and breezy white dress.', 120.00, 30, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80', 1),
(3, 'Titanium Chrono Watch', 'Durable and stylish timepiece.', 250.00, 15, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80', 1),
(1, 'Urban Leather Jacket', 'Premium calfskin leather with a sleek matte finish.', 299.99, 10, 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5bab3?auto=format&fit=crop&w=800&q=80', 1),
(2, 'Velvet Night Gown', 'Deep emerald velvet for high-profile events.', 180.00, 20, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80', 0),
(1, 'Oxford Classic Shoes', 'Handcrafted leather shoes for the professional.', 150.00, 25, 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80', 0),
(3, 'Aviator Gold Shades', 'Classic aviator design with 24k gold plating.', 199.00, 40, 'https://images.unsplash.com/photo-1511499767390-91f19760a0ac?auto=format&fit=crop&w=800&q=80', 1),
(2, 'Silk Scarf Collection', 'Hand-painted silk scarves from Italy.', 45.00, 100, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80', 0);

-- Add a default user for testing the account page
INSERT INTO users (username, email, password_hash, location, role) VALUES 
('ali_cara', 'ali@example.com', 'hashed_password_123', 'London, UK', 'customer');
