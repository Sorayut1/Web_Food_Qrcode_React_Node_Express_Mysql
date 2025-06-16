const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// อนุญาตให้ frontend เข้าถึง
app.use(cors({
  origin: 'http://localhost:5173', // หรือใช้ * เพื่ออนุญาตทุก origin (เฉพาะ dev)
  credentials: true
}));

// ✅ Serve static files (รูปภาพ)
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));



const manageCategory = require('./routes/owner/manageCategory');
app.use('/api/owner/menu-types', manageCategory);

const manageMenu = require('./routes/owner/manageMenu');
app.use('/api/owner/menu', manageMenu);

const manageTables = require('./routes/owner/manageTables');
app.use('/api/owner/tables', manageTables);


module.exports = app; // <-- export app ไปใช้ใน server.js
app.listen(3000, ()=>{
    console.log('server running at http://localhost:3000')
})