// const express = require("express");
// const router = express.Router();
// const db = require("../../config/db");

// router.post("/", (req, res) => {
//   const { table_number, items } = req.body;

//   if (!table_number || !Array.isArray(items) || items.length === 0) {
//     return res.status(400).json({ message: "ข้อมูลไม่ถูกต้อง" });
//   }

//   // คำนวณราคาทั้งหมด
//   const totalPrice = items.reduce((sum, item) => {
//     const price = parseFloat(item.price);
//     return sum + (isNaN(price) ? 0 : price);
//   }, 0);

//   db.query(
//     "INSERT INTO orders (table_number, status, total_price) VALUES (?, ?, ?)",
//     [table_number, "pending", totalPrice],
//     (err, result) => {
//       if (err) {
//         console.error("❌ เพิ่มคำสั่งซื้อไม่สำเร็จ:", err);
//         return res
//           .status(500)
//           .json({ message: "เกิดข้อผิดพลาดในการบันทึกคำสั่งซื้อ" });
//       }

//       const orderId = result.insertId;
//       let completed = 0;
//       let hasError = false;

//       items.forEach((item) => {
//         const menuId = item.menu_id || item.id;

//         if (!menuId || !item.price) {
//           hasError = true;
//           console.error("❌ ข้อมูลรายการอาหารไม่ครบ:", item);
//           return;
//         }

//         db.query(
//           "INSERT INTO order_items (order_id, menu_id, quantity, price) VALUES (?, ?, ?, ?)",
//           [orderId, menuId, 1, item.price],
//           (err) => {
//             if (err) {
//               hasError = true;
//               console.error("❌ เพิ่มรายการอาหารไม่สำเร็จ:", err);
//               return;
//             }

//             completed++;
//             if (completed === items.length && !hasError) {
//               return res.json({
//                 message: "บันทึกคำสั่งซื้อเรียบร้อย",
//                 orderId,
//               });
//             }

//             if (completed === items.length && hasError) {
//               return res.status(500).json({
//                 message: "เกิดข้อผิดพลาดในการเพิ่มรายการอาหารบางรายการ",
//               });
//             }
//           }
//         );
//       });
//     }
//   );
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const db = require("../../config/db");

router.post("/", (req, res) => {
  const { table_number, items } = req.body;

  if (!table_number || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "ข้อมูลไม่ถูกต้อง" });
  }

  const totalPrice = items.reduce((sum, item) => {
    const price = parseFloat(item.price);
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  db.query(
    "INSERT INTO orders (table_number, status, total_price, order_time) VALUES (?, ?, ?, NOW())",
    [table_number, "pending", totalPrice],
    (err, result) => {
      if (err) {
        console.error("❌ เพิ่มคำสั่งซื้อไม่สำเร็จ:", err);
        return res
          .status(500)
          .json({ message: "เกิดข้อผิดพลาดในการบันทึกคำสั่งซื้อ" });
      }

      const orderId = result.insertId;
      let completed = 0;
      let hasError = false;

      items.forEach((item) => {
        const menuId = item.menu_id || item.id;

        if (!menuId || !item.price) {
          hasError = true;
          console.error("❌ ข้อมูลรายการอาหารไม่ครบ:", item);
          return;
        }

        db.query(
          "INSERT INTO order_items (order_id, menu_id, quantity, price) VALUES (?, ?, ?, ?)",
          [orderId, menuId, 1, item.price],
          (err) => {
            if (err) {
              hasError = true;
              console.error("❌ เพิ่มรายการอาหารไม่สำเร็จ:", err);
              return;
            }

            completed++;
            if (completed === items.length) {
              if (!hasError) {
                // Emit ไปยัง client ทุกคน
                const io = req.app.get("io");
                io.emit("new_order", {
                  order_id: orderId,
                  table_number,
                  status: "pending",
                  total_price: totalPrice,
                  items,
                  order_time: new Date().toISOString(), // ส่งเป็น ISO string เพื่อ frontend ใช้งานง่าย
                });

                return res.json({
                  message: "บันทึกคำสั่งซื้อเรียบร้อย",
                  orderId,
                });
              } else {
                return res.status(500).json({
                  message: "เกิดข้อผิดพลาดในการเพิ่มรายการอาหารบางรายการ",
                });
              }
            }
          }
        );
      });
    }
  );
});


module.exports = router;
