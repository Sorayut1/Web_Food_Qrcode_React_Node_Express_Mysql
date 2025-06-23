import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/user/Navbar";
import Footer from "../../components/user/Footer";

const API_URL_IMAGE = "http://localhost:3000/uploads/food";

const UserProduct = () => {
  const [cart, setCart] = useState([]);
  const { table_number } = useParams();
  const navigate = useNavigate();

  // โหลด cart และตรวจสอบโต๊ะ
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || { items: [] };
    setCart(Array.isArray(storedCart.items) ? storedCart.items : []);

    // ตรวจสอบว่า table_number เป็นเลขจริง
    if (!/^\d+$/.test(table_number)) {
      alert("❌ เลขโต๊ะไม่ถูกต้อง");
      return navigate("/404");
    }

    // ตรวจสอบว่าโต๊ะมีอยู่จริง (เรียก route ใหม่)
    axios
      .get(`http://localhost:3000/api/user/check-table/${table_number}`)
      .then((res) => {
        console.log("✅ โต๊ะมีอยู่:", res.data);
      })
      .catch((err) => {
        console.error("❌ ไม่พบโต๊ะ:", err);
        alert("❌ ไม่พบโต๊ะนี้ในระบบ");
        navigate("/404"); // redirect
      });
  }, [table_number, navigate]);

  const handleRemoveItem = (cartItemIdToDelete) => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || { items: [] };
    const updatedItems = storedCart.items.filter(
      (item) => item.cartItemId !== cartItemIdToDelete
    );

    const updatedCart = { ...storedCart, items: updatedItems };
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedItems);
    alert("ยกเลิกรายการเรียบร้อยแล้ว");
  };

  const handleCancelAll = () => {
    const confirmCancel = window.confirm("คุณแน่ใจว่าต้องการยกเลิกคำสั่งซื้อทั้งหมด?");
    if (confirmCancel) {
      localStorage.removeItem("cart");
      setCart([]);
      alert("ยกเลิกคำสั่งซื้อเรียบร้อยแล้ว");
    }
  };

  const handleSubmitOrder = async () => {
    if (!cart.length) {
      alert("❌ ไม่มีรายการอาหารในคำสั่งซื้อ");
      return;
    }

    const orderData = {
      table_number,
      items: cart.map((item) => ({
        menu_id: item.id,
        quantity: 1,
        price: parseFloat(item.price),
      })),
    };

    try {
      const res = await axios.post("http://localhost:3000/api/user/order", orderData);
      console.log("✅ คำสั่งซื้อสำเร็จ:", res.data);
      alert("✅ คำสั่งซื้อสำเร็จ!");
      localStorage.removeItem("cart");
      setCart([]);
    } catch (error) {
      console.error("❌ ส่งคำสั่งซื้อไม่สำเร็จ:", error);
      alert("❌ เกิดข้อผิดพลาดในการส่งคำสั่งซื้อ");
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar tableNumber={table_number} />

      <div className="container mx-auto px-4 py-8 pt-18">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-orange-900 via-black/90 to-orange-800 text-white px-6 py-4">
            <h1 className="text-2xl font-bold">รายการรอคําสั่งซื้อ</h1>
            <p className="text-orange-100">โต๊ะที่ {table_number}</p>
          </div>

          {/* รายการสินค้า */}
          <div className="p-6">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-lg">
                ยังไม่มีสินค้าในคําสั่งซื้อ
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={item.cartItemId || index}
                    className="border-b border-orange-100 pb-4 last:border-0"
                  >
                    <div className="flex flex-col md:flex-row gap-4 p-4 border border-orange-100 rounded-lg bg-white shadow-sm">
                      <div className="w-full md:w-1/3">
                        <img
                          src={`${API_URL_IMAGE}/${item.image}`}
                          alt={item.name || "image"}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1 flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-orange-800 mb-2">{item.name}</h3>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-gray-500">รหัสเมนู:</div>
                            <div>{item.id}</div>
                            <div className="text-gray-500">รหัสตะกร้า:</div>
                            <div>{item.cartItemId}</div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between">
                          <p className="text-2xl font-bold text-orange-600 mb-2">
                            {parseFloat(item.price).toFixed(2)} บาท
                          </p>
                          <button
                            className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors flex items-center gap-2"
                            onClick={() => {
                              if (window.confirm(`ต้องการลบเมนู "${item.name}" หรือไม่?`)) {
                                handleRemoveItem(item.cartItemId);
                              }
                            }}
                          >
                            🗑 ยกเลิกรายการ
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-orange-50 px-6 py-4 border-t border-orange-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-orange-800">ราคารวม :</h3>
              <p className="text-2xl font-bold text-orange-600">
                {totalPrice.toFixed(2)} บาท
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                onClick={handleSubmitOrder}
              >
                ยืนยันการสั่งซื้อ
              </button>
              <button
                className="flex-1 bg-white border border-orange-500 text-orange-500 hover:bg-orange-50 font-bold py-3 px-4 rounded-lg transition-colors"
                onClick={handleCancelAll}
              >
                ยกเลิกคําสั่งซื้อทั้งหมด
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserProduct;
