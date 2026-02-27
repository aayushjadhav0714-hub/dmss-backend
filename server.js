console.log("🚀 STARTING DSSM SERVER (AIVEN EDITION)");
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* ==========================
   AIVEN DATABASE CONNECTION
========================== */
const db = mysql.createConnection({
  host: "mysql-725ccaa-aayushjadhav0714-09ac.j.aivencloud.com",
  port: 15574,
  user: "avnadmin",
  password: "AVNS_3cvjMgTfZPjbzm0e9Uy",
  database: "defaultdb", // Aiven var default naav 'defaultdb' aste
  ssl: {
    rejectUnauthorized: false // AIVEN sathi he garjeche aahe
  }
});

db.connect((err) => {
  if (err) {
    console.log("❌ Aiven connection failed:", err.message);
  } else {
    console.log("✅ Connected to Aiven MySQL Database");
  }
});

/* ==========================
   BASIC ROUTE (Check karnyathi)
========================== */
app.get("/", (req, res) => {
  res.send("DSSM Server is running live on Aiven & Render!");
});

/* ==========================
   LOGIN API
========================== */
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  // NOTE: Aiven setup script madhe aapan 'users' table banvla hota
  // Jar tula 'admins' pahije asel tar table naav check kar
  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false });
    }
    if (result.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  });
});

/* ==========================
   ADD REPORT API
========================== */
app.post("/add-report", (req, res) => {
  const { fullname, mobile, disasterType, datetime, location, description } = req.body;

  const reportSql = `
    INSERT INTO reports 
    (fullname, mobile, disasterType, datetime, location, description) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(reportSql, [fullname, mobile, disasterType, datetime, location, description], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false });
    }

    // Insert into users table (ONLY if not exists)
    const checkUserSql = "SELECT * FROM users WHERE mobile = ?";
    db.query(checkUserSql, [mobile], (err2, result) => {
      if (err2) console.log(err2);

      if (result && result.length === 0) {
        const userInsertSql = "INSERT INTO users (username, mobile, location) VALUES (?, ?, ?)";
        db.query(userInsertSql, [fullname, mobile, location], (err3) => {
          if (err3) console.log("User insert error:", err3);
        });
      }
      res.json({ success: true });
    });
  });
});

/* ==========================
   GET DATA APIS
========================== */
app.get("/get-reports", (req, res) => {
  const sql = "SELECT * FROM reports ORDER BY id DESC";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json([]);
    res.json(result);
  });
});

app.get("/get-users", (req, res) => {
  const sql = "SELECT * FROM users ORDER BY id DESC";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json([]);
    res.json(result);
  });
});

/* ==========================
   SERVER START (Render Friendly)
========================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is flying on port ${PORT}`);
});