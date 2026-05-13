const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const isVercel = process.env.VERCEL === '1';
const dbPath = isVercel 
    ? path.resolve('/tmp', 'cara.db') 
    : path.resolve(__dirname, 'cara.db');
const schemaPath = path.resolve(__dirname, '../database.sql');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log(`Connected to the SQLite database at ${dbPath}`);
        initializeDatabase();
    }
});

function initializeDatabase() {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema, (err) => {
        if (err) {
            console.error('Error initializing database', err.message);
        } else {
            console.log('Database initialized successfully.');
        }
    });
}

module.exports = db;
