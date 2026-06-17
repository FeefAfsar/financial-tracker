const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

// Inisialisasi Database SQLite (Otomatis bikin file finance.db)
const db = new sqlite3.Database('./finance.db', (err) => {
    if (err) console.error(err.message);
    console.log('Terhubung ke database SQLite.');
});

// Membuat tabel transaksi jika belum ada
db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL,
    type TEXT,
    category TEXT,
    description TEXT,
    date TEXT
)`);

// 1. ENDPOINT: Ambil semua transaksi
app.get('/api/transactions', (req, res) => {
    db.all(`SELECT * FROM transactions ORDER BY date DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 2. ENDPOINT: Simpan transaksi baru
app.post('/api/transactions', (req, res) => {
    const { amount, type, category, description, date } = req.body;
    const sql = `INSERT INTO transactions (amount, type, category, description, date) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [amount, type, category, description, date], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, amount, type, category, description, date });
    });
});

// 3. ENDPOINT: Data Ringkasan Dashboard
app.get('/api/dashboard/summary', (req, res) => {
    const query = `
        SELECT 
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense
        FROM transactions
    `;
    
    db.get(query, [], (err, summary) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const total_income = summary.total_income || 0;
        const total_expense = summary.total_expense || 0;
        const balance = total_income - total_expense;

        // Ambil pengeluaran per kategori untuk grafik
        db.all(`SELECT category, SUM(amount) as total FROM transactions WHERE type = 'expense' GROUP BY category`, [], (err, categories) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ balance, total_income, total_expense, category_expenses: categories });
        });
    });
});

app.listen(8000, '0.0.0.0', () => {
    console.log(`Backend Finance Tracker jalan di semua jaringan pada port 8000`);
});