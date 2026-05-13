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

// Get products by category
app.get('/api/products/category/:id', (req, res) => {
    const limit = parseInt(req.query.limit) || 8;
    const offset = parseInt(req.query.offset) || 0;
    const sql = 'SELECT * FROM products WHERE category_id = ? LIMIT ? OFFSET ?';
    const params = [req.params.id, limit, offset];
    db.all(sql, params, (err, rows) => {
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

// Get user profile
app.get('/api/users/:id', (req, res) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
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

// Create order
app.post('/api/orders', (req, res) => {
    const { user_id, total_price, shipping_address } = req.body;
    const sql = 'INSERT INTO orders (user_id, total_price, shipping_address) VALUES (?, ?, ?)';
    const params = [user_id, total_price, shipping_address];
    
    db.run(sql, params, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        const orderId = this.lastID;
        res.json({
            message: 'Order placed successfully',
            order_id: orderId
        });
    });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
