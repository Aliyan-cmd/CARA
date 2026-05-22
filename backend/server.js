const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const db = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Endpoints

// Get all products (with pagination)
app.get('/api/products', (req, res) => {
    const limit = parseInt(req.query.limit) || 8;
    const offset = parseInt(req.query.offset) || 0;
    
    const sql = 'SELECT * FROM products LIMIT ? OFFSET ?';
    db.all(sql, [limit, offset], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Get product count
app.get('/api/products/total', (req, res) => {
    const categoryId = req.query.category_id;
    let sql = 'SELECT COUNT(*) as total FROM products';
    let params = [];
    
    if (categoryId) {
        sql += ' WHERE category_id = ?';
        params.push(categoryId);
    }
    
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        // row might be { "total": n } or { "COUNT(*)": n } depending on environment
        const total = row ? (row.total !== undefined ? row.total : row['COUNT(*)']) : 0;
        res.json({
            message: 'success',
            total: total
        });
    });
});

// Get featured products
app.get('/api/products/featured', (req, res) => {
    const sql = 'SELECT * FROM products WHERE is_featured = 1';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
    const sql = 'SELECT * FROM products WHERE id = ?';
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// Get all categories
app.get('/api/categories', (req, res) => {
    const sql = 'SELECT * FROM categories';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Get products by category (with pagination)
app.get('/api/products/category/:id', (req, res) => {
    const limit = parseInt(req.query.limit) || 8;
    const offset = parseInt(req.query.offset) || 0;
    const categoryId = req.params.id;
    
    const sql = 'SELECT * FROM products WHERE category_id = ? LIMIT ? OFFSET ?';
    db.all(sql, [categoryId, limit, offset], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Get user profile (using ID 1 for now as a demo)
app.get('/api/users/:id', (req, res) => {
    const sql = 'SELECT id, username, email, location, role, created_at FROM users WHERE id = ?';
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// Placeholder for Order creation
app.post('/api/orders', (req, res) => {
    const { user_id, total_price, shipping_address, items } = req.body;
    // In a real app, you'd start a transaction here
    const sql = 'INSERT INTO orders (user_id, total_price, shipping_address) VALUES (?, ?, ?)';
    const params = [user_id, total_price, shipping_address];
    
    db.run(sql, params, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        const orderId = this.lastID;
        // Insert items (simplified)
        res.json({
            message: 'Order placed successfully',
            order_id: orderId
        });
    });
});

// --- ADMIN DASHBOARD ENDPOINTS ---

// Get Admin Stats
app.get('/api/admin/stats', (req, res) => {
    const stats = {};
    
    // 1. Get basic counts
    const p1 = new Promise((resolve, reject) => {
        db.get(`
            SELECT 
                (SELECT SUM(total_price) FROM orders WHERE status != 'cancelled') as total_revenue,
                (SELECT COUNT(*) FROM orders) as total_orders,
                (SELECT COUNT(*) FROM users WHERE role = 'customer') as total_customers,
                (SELECT COUNT(*) FROM products WHERE stock_quantity < 15) as low_stock
        `, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });

    // 2. Get sales by category
    const p2 = new Promise((resolve, reject) => {
        db.all(`
            SELECT c.name as category, SUM(oi.quantity * oi.price_at_purchase) as value
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            JOIN categories c ON p.category_id = c.id
            GROUP BY c.id
        `, (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });

    // 3. Get sales trends
    const p3 = new Promise((resolve, reject) => {
        db.all(`
            SELECT DATE(created_at) as date, SUM(total_price) as revenue, COUNT(*) as count
            FROM orders
            WHERE status != 'cancelled'
            GROUP BY DATE(created_at)
            ORDER BY date ASC
            LIMIT 30
        `, (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });

    Promise.all([p1, p2, p3])
        .then(([counts, categorySales, salesTrend]) => {
            res.json({
                message: 'success',
                data: {
                    totalRevenue: counts.total_revenue || 0,
                    totalOrders: counts.total_orders || 0,
                    totalCustomers: counts.total_customers || 0,
                    lowStock: counts.low_stock || 0,
                    categorySales,
                    salesTrend
                }
            });
        })
        .catch(err => {
            res.status(400).json({ error: err.message });
        });
});

// Get all orders (detailed)
app.get('/api/admin/orders', (req, res) => {
    const sql = `
        SELECT o.id as order_id, o.total_price, o.status, o.shipping_address, o.created_at,
               u.username, u.email,
               oi.id as item_id, oi.quantity, oi.price_at_purchase,
               p.name as product_name, p.image_url
        FROM orders o
        JOIN users u ON o.user_id = u.id
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        ORDER BY o.created_at DESC
    `;
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        
        // Group rows by order
        const ordersMap = {};
        rows.forEach(row => {
            if (!ordersMap[row.order_id]) {
                ordersMap[row.order_id] = {
                    id: row.order_id,
                    total_price: row.total_price,
                    status: row.status,
                    shipping_address: row.shipping_address,
                    created_at: row.created_at,
                    user: {
                        username: row.username,
                        email: row.email
                    },
                    items: []
                };
            }
            
            if (row.item_id) {
                ordersMap[row.order_id].items.push({
                    id: row.item_id,
                    quantity: row.quantity,
                    price_at_purchase: row.price_at_purchase,
                    product_name: row.product_name,
                    image_url: row.image_url
                });
            }
        });
        
        res.json({
            message: 'success',
            data: Object.values(ordersMap)
        });
    });
});

// Update order status
app.put('/api/admin/orders/:id/status', (req, res) => {
    const { status } = req.body;
    const sql = 'UPDATE orders SET status = ? WHERE id = ?';
    db.run(sql, [status, req.params.id], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            changes: this.changes
        });
    });
});

// Get all products (admin view with category names)
app.get('/api/admin/products', (req, res) => {
    const sql = `
        SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        ORDER BY p.id DESC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Create product
app.post('/api/admin/products', (req, res) => {
    const { category_id, name, description, price, stock_quantity, image_url, is_featured } = req.body;
    const sql = `
        INSERT INTO products (category_id, name, description, price, stock_quantity, image_url, is_featured)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [category_id, name, description, price, stock_quantity, image_url, is_featured ? 1 : 0];
    db.run(sql, params, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: {
                id: this.lastID,
                category_id,
                name,
                description,
                price,
                stock_quantity,
                image_url,
                is_featured: is_featured ? 1 : 0
            }
        });
    });
});

// Update product
app.put('/api/admin/products/:id', (req, res) => {
    const { category_id, name, description, price, stock_quantity, image_url, is_featured } = req.body;
    const sql = `
        UPDATE products 
        SET category_id = ?, name = ?, description = ?, price = ?, stock_quantity = ?, image_url = ?, is_featured = ?
        WHERE id = ?
    `;
    const params = [category_id, name, description, price, stock_quantity, image_url, is_featured ? 1 : 0, req.params.id];
    db.run(sql, params, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            changes: this.changes
        });
    });
});

// Delete product
app.delete('/api/admin/products/:id', (req, res) => {
    const sql = 'DELETE FROM products WHERE id = ?';
    db.run(sql, [req.params.id], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            changes: this.changes
        });
    });
});

// Get all users (admin view)
app.get('/api/admin/users', (req, res) => {
    const sql = 'SELECT id, username, email, location, role, created_at FROM users ORDER BY created_at DESC';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});


// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    } else {
        next();
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
