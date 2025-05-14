const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "expensetracker_db",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to database.");
});

// Create tables if they don't exist
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    age INT,
    address VARCHAR(255),
    birthday DATE,
    gender VARCHAR(50)
  )`);

db.query(`
  CREATE TABLE IF NOT EXISTS budget1 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    available DECIMAL(10,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

db.query(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description VARCHAR(255),
    type ENUM('income', 'expense') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )`);

// User registration
app.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const sql =
      "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";
    db.query(sql, [firstName, lastName, email, hashedPassword], (err) => {
      if (err) return res.status(500).send("Error saving user.");
      res.send("User registered successfully!");
    });
  } catch (error) {
    res.status(500).send("Server error.");
  }
});

// User login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).send("Server error.");
    if (results.length === 0) return res.status(401).send("User not found.");
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send("Incorrect password.");
    res.json({ message: "Login successful!", userId: user.id });
  });
});

// Budget endpoints
app.get("/budget/:userId", (req, res) => {
  const { userId } = req.params;
  const sql =
    "SELECT amount AS total, available FROM budget1 WHERE user_Id = ? ORDER BY id DESC LIMIT 1";
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).send("Error fetching budget");
    res.json(results[0] || { total: 0, available: 0 });
  });
});

app.post("/budget", (req, res) => {
  const { amount, userId } = req.body;

  db.beginTransaction((err) => {
    if (err) return res.status(500).send("Error starting transaction");

    const insertBudget =
      "INSERT INTO budget1 (user_id, amount, available) VALUES (?, ?, ?)";
    db.query(insertBudget, [userId, amount, amount], (err) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).send("Error saving budget");
        });
      }

      db.commit((err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).send("Error committing transaction");
          });
        }
        res.send("Budget saved successfully");
      });
    });
  });
});

app.post("/budget/deduct", (req, res) => {
  const { userId, expense } = req.body;
  const sql =
    "UPDATE budget1 SET available = available - ? WHERE user_id = ? ORDER BY id DESC LIMIT 1";
  db.query(sql, [expense, userId], (err) => {
    if (err) return res.status(500).send("Failed to deduct budget");
    res.send("Budget deducted");
  });
});

app.post("/budget/restore", (req, res) => {
  const { userId, restoreAmount } = req.body;
  const sql = `UPDATE budget1 SET available = available + ? WHERE user_id = ? ORDER BY id DESC LIMIT 1`;
  db.query(sql, [restoreAmount, userId], (err) => {
    if (err) return res.status(500).send("Failed to restore budget");
    res.send("Budget restored");
  });
});



// Transaction endpoints
app.get("/transactions/:userId", (req, res) => {
  const { userId } = req.params;
  const sql = "SELECT * FROM transactions WHERE user_id = ? ORDER BY id DESC";
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).send("Error fetching transactions");
    res.json(results);
  });
});

app.post("/transactions", (req, res) => {
  const { amount, description, type, userId } = req.body;
  const sql =
    "INSERT INTO transactions (user_id, amount, description, type) VALUES (?, ?, ?, ?)";
  db.query(sql, [userId, amount, description, type], (err) => {
    if (err) return res.status(500).send("Error saving transaction");
    res.send("Transaction added successfully");
  });
});

app.delete("/transactions/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM transactions WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send("Failed to delete transaction");
    res.send("Transaction deleted");
  });
});

// User endpoints
app.get("/user/:id", (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT first_name, last_name, email, age, address, birthday, gender FROM users WHERE id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).send("Error fetching user");
      res.json(results[0] || {});
    }
  );
});

app.put("/user/update/:id", (req, res) => {
  const { age, address, birthday, gender } = req.body;
  const { id } = req.params;
  const sql = `UPDATE users SET age = ?, address = ?, birthday = ?, gender = ? WHERE id = ?`;
  db.query(sql, [age, address, birthday, gender, id], (err) => {
    if (err) {
      console.error("❌ Failed to update user profile:", err);
      return res.status(500).send("Failed to update profile");
    }
    res.send("Profile updated successfully");
  });
});

app.put("/user/change-password/:id", async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { id } = req.params;
  db.query(
    "SELECT password FROM users WHERE id = ?",
    [id],
    async (err, results) => {
      if (err) return res.status(500).send("Server error");
      if (results.length === 0) return res.status(404).send("User not found");
      const isMatch = await bcrypt.compare(
        currentPassword,
        results[0].password
      );
      if (!isMatch) return res.status(401).send("Incorrect current password");
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(newPassword, salt);
      db.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashed, id],
        (err) => {
          if (err) return res.status(500).send("Failed to update password");
          res.send("Password updated successfully");
        }
      );
    }
  );
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

/* 

CREATE DATABASE `expensetracker_db`


CREATE TABLE `budget1` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `available` decimal(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `budget1_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=138 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci


 CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `gender` enum('male','female') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci


 CREATE TABLE `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `type` enum('income','expense') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `category` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci










*/
