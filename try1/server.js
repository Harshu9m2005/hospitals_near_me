const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Harshu@955',
    database: 'uber_app'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

// Register Endpoint
app.post('/register', async (req, res) => {
    const { name, email, phone, license, password } = req.body;

    try {
        const checkEmailQuery = SELECT * FROM drivers WHERE email = ?;
        db.query(checkEmailQuery, [email], async (err, results) => {
            if (err) {
                console.error('Error checking email:', err.message);
                return res.status(500).json({ message: "Error registering driver" });
            }

            if (results.length > 0) {
                return res.status(400).json({ message: "Email already in use" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const query = INSERT INTO drivers (name, email, phone, license, password) VALUES (?, ?, ?, ?, ?);
            db.query(query, [name, email, phone, license, hashedPassword], (err, results) => {
                if (err) {
                    console.error('Error saving driver data:', err.message);
                    return res.status(500).json({ message: "Error registering driver" });
                }
                res.status(201).json({ message: "Driver registered successfully" });
            });
        });
    } catch (error) {
        console.error('Error during registration:', error.message);
        res.status(500).json({ message: "Error registering driver" });
    }
});

// Login Endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = SELECT * FROM drivers WHERE email = ?;
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).json({ message: "Error logging in" });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const driver = results[0];
        const passwordMatch = await bcrypt.compare(password, driver.password);

        if (passwordMatch) {
            res.status(200).json({ message: "Login successful" });
        } else {
            res.status(400).json({ message: "Invalid credentials" });
        }
    });
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});