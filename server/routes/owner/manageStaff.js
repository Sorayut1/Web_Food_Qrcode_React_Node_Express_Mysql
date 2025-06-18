const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const bcrypt = require("bcrypt");
const { verifyToken, isOwner } = require("../../middleware/auth");

// ใช้ middleware ทุก route
router.use(verifyToken, isOwner);

// ดึง staff ทั้งหมด
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT id, first_name, last_name, username, phone_number FROM users WHERE role = 'staff'");
  res.json(rows);
});

// เพิ่ม staff (random password)
router.post("/", async (req, res) => {
  const { first_name, last_name, username, phone_number } = req.body;
  const rawPassword = Math.random().toString(36).slice(-8);
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  try {
    await db.query(
      "INSERT INTO users (first_name, last_name, username, password, phone_number, role) VALUES (?, ?, ?, ?, ?, 'staff')",
      [first_name, last_name, username, hashedPassword, phone_number]
    );
    res.json({ message: "เพิ่ม staff สำเร็จ", rawPassword });
  } catch (err) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});

// แก้ไขข้อมูล staff
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, phone_number, password } = req.body;
  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

  let sql = "UPDATE users SET first_name=?, last_name=?, phone_number=?";
  const values = [first_name, last_name, phone_number];

  if (hashedPassword) {
    sql += ", password=?";
    values.push(hashedPassword);
  }

  sql += " WHERE id=? AND role='staff'";
  values.push(id);

  try {
    await db.query(sql, values);
    res.json({ message: "แก้ไขข้อมูลสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});

// ลบ staff
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM users WHERE id=? AND role='staff'", [id]);
    res.json({ message: "ลบ staff สำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});

module.exports = router;
