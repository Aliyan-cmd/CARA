-- CARA Clothing Brand Database Schema

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    location TEXT, -- New field for user location
    role TEXT DEFAULT 'customer', -- 'customer', 'admin'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total_price DECIMAL(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'shipped', 'delivered', 'cancelled'
    shipping_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

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
INSERT OR IGNORE INTO categories (id, name, description) VALUES 
(1, 'Men', 'Premium apparel for men'),
(2, 'Women', 'Elegant fashion for women'),
(3, 'Accessories', 'Stylized additions to your outfit');

INSERT OR IGNORE INTO products (id, category_id, name, description, price, stock_quantity, image_url, is_featured) VALUES 
(1, 1, 'Midnight Silk Shirt', 'A luxurious black silk shirt for evening wear.', 89.99, 50, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', 1),
(2, 2, 'Ethereal Summer Dress', 'Lightweight and breezy white dress.', 120.00, 30, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80', 1),
(3, 3, 'Titanium Chrono Watch', 'Durable and stylish timepiece.', 250.00, 15, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80', 1),
(4, 1, 'Urban Leather Jacket', 'Premium calfskin leather with a sleek matte finish.', 299.99, 10, 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5bab3?auto=format&fit=crop&w=800&q=80', 1),
(5, 2, 'Velvet Night Gown', 'Deep emerald velvet for high-profile events.', 180.00, 20, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80', 0),
(6, 1, 'Oxford Classic Shoes', 'Handcrafted leather shoes for the professional.', 150.00, 25, 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80', 0),
(7, 3, 'Aviator Gold Shades', 'Classic aviator design with 24k gold plating.', 199.00, 40, 'https://images.unsplash.com/photo-1511499767390-91f19760a0ac?auto=format&fit=crop&w=800&q=80', 1),
(8, 2, 'Silk Scarf Collection', 'Hand-painted silk scarves from Italy.', 45.00, 100, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80', 0);

-- Add users
INSERT OR IGNORE INTO users (id, username, email, password_hash, location, role) VALUES 
(1, 'ali_cara', 'ali@example.com', 'hashed_password_123', 'London, UK', 'customer'),
(2, 'admin_cara', 'admin@cara.com', 'admin_hashed_123', 'Milan, Italy', 'admin'),
(3, 'sarah_m', 'sarah@example.com', 'hashed_password_123', 'New York, US', 'customer'),
(4, 'john_d', 'john@example.com', 'hashed_password_123', 'Paris, FR', 'customer'),
(5, 'emma_w', 'emma@example.com', 'hashed_password_123', 'Tokyo, JP', 'customer');

-- Add orders
INSERT OR IGNORE INTO orders (id, user_id, total_price, status, shipping_address, created_at) VALUES
(1, 1, 339.99, 'delivered', 'London, UK', '2026-05-10 14:32:00'),
(2, 3, 180.00, 'shipped', 'New York, US', '2026-05-15 09:15:00'),
(3, 4, 240.00, 'pending', 'Paris, FR', '2026-05-20 18:45:00'),
(4, 5, 498.99, 'delivered', 'Tokyo, JP', '2026-05-18 11:20:00'),
(5, 1, 135.00, 'pending', 'London, UK', '2026-05-21 08:30:00');

-- Add order items
INSERT OR IGNORE INTO order_items (id, order_id, product_id, quantity, price_at_purchase) VALUES
(1, 1, 1, 1, 89.99),
(2, 1, 3, 1, 250.00),
(3, 2, 5, 1, 180.00),
(4, 3, 2, 2, 120.00),
(5, 4, 4, 1, 299.99),
(6, 4, 7, 1, 199.00),
(7, 5, 8, 3, 45.00);

