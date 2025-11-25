import express from "express";
import mysql from "mysql2/promise";

const app = express();
const port = 3001;

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password1234",
  database: "planit",
  port: 3306
});

app.get("/test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS time");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("DB Error");
  }
});

app.listen(port, () => console.log(`Backend running on port ${port}`));
