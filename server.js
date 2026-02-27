console.log("THIS IS MY DSSM SERVER FILE");
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* ==========================
   DATABASE CONNECTION
========================== */

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dssm_project"
});

db.connect((err) => {
  if (err) {
    console.log("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});

/* ==========================
   LOGIN API
========================== */

app.post("/login", (req, res) => {

  const { email, password } = req.body;

  const sql = "SELECT * FROM admins WHERE email = ? AND password = ?";

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

  // Insert into reports table
  const reportSql = `
    INSERT INTO reports 
    (fullname, mobile, disasterType, datetime, location, description) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(reportSql,
    [fullname, mobile, disasterType, datetime, location, description],
    (err) => {

      if (err) {
        console.log(err);
        return res.status(500).json({ success: false });
      }

      // Insert into users table (ONLY if not exists)
      const checkUserSql = "SELECT * FROM users WHERE mobile = ?";

      db.query(checkUserSql, [mobile], (err2, result) => {

        if (err2) {
          console.log(err2);
        }

        if (result.length === 0) {

          const userInsertSql = `
            INSERT INTO users (name, mobile, location)
            VALUES (?, ?, ?)
          `;

          db.query(userInsertSql, [fullname, mobile, location], (err3) => {
            if (err3) {
              console.log("User insert error:", err3);
            }
          });

        }

        res.json({ success: true });

      });

  });

});

/* ==========================
   GET ALL REPORTS (Reports Tab)
========================== */

app.get("/get-reports", (req, res) => {

  const sql = "SELECT * FROM reports ORDER BY id DESC";

  db.query(sql, (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }

    res.json(result);

  });

});
app.get("/get-users", async (req, res) => {
    // समजा तुम्ही MongoDB वापरत असाल
    const users = await User.find(); 
    res.json(users);
});
/* ==========================
   GET ALL USERS (Users Tab)
========================== */
app.get("/", (req, res) => {
  res.send("Server is working properly");
});
app.get("/get-users", (req, res) => {

  const sql = "SELECT * FROM users ORDER BY id DESC";

  db.query(sql, (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }

    res.json(result);

  });

});

/* ==========================
   SERVER START
========================== */

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});