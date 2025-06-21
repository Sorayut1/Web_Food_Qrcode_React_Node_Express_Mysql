import React, { useEffect, useState } from "react";
import Navbar from '../../components/user/Navbar';
import Footer from "../../components/user/Footer";
import { useParams } from "react-router-dom";

const API_URL_IMAGE = "http://localhost:3000/uploads/food";

const UserProduct = () => {
  const [cart, setCart] = useState([]);
  const { table_number } = useParams();
  const [localTable, setLocalTable] = useState("");

useEffect(() => {
  const storedCart = JSON.parse(localStorage.getItem("cart"));
  const storedTable = localStorage.getItem("table_number"); // ✅ ดึงจาก localStorage

  if (storedTable) setLocalTable(storedTable);

  if (storedCart && Array.isArray(storedCart.items)) {
    setCart(storedCart.items);
  } else {
    setCart([]);
  }
}, []);

  const handleRemoveItem = (cartItemIdToDelete) => {
    const existingCart = JSON.parse(localStorage.getItem("cart"));
    if (!Array.isArray(existingCart)) return;
    
    const updatedCart = existingCart.filter(
      (item) => item.cartItemId !== cartItemIdToDelete
    );

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    alert("ยกเลิกคําสั่งซื้อเรียบร้อยแล้ว");
  };

  const totalPrice = Array.isArray(cart)
    ? cart.reduce((sum, item) => sum + (parseInt(item.price) || 0), 0)
    : 0;

  return (
    <div className="min-h-screen bg-orange-50">
      <Navbar tableNumber={table_number} />

      <div className="container mx-auto px-4 py-8 pt-18 relative">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-orange-900 via-black/90 to-orange-800 text-white px-6 py-4">
            <h1 className="text-2xl font-bold text-white">
              รายการรอคําสั่งซื้อ
            </h1>
            <p className="text-orange-100">โต๊ะที่ {table_number}</p>
          </div>

          {/* Cart Items */}
          <div className="p-6">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">
                  ยังไม่มีสินค้าในคําสั่งซื้อ
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="border-b border-orange-100 pb-4 last:border-0"
                  >
                    <div className="flex flex-col md:flex-row gap-4 p-4 border border-orange-100 rounded-lg bg-white shadow-sm">
                      {/* Image */}
                      <div className="w-full md:w-1/3">
                        <img
                          src={`${API_URL_IMAGE}/${item.image}`}
                          alt={item.name}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-orange-800 mb-2">
                            {item.name}
                          </h3>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-gray-500">รหัสเมนู:</div>
                            <div>{item.id}</div>

                            <div className="text-gray-500">รหัสตะกร้า:</div>
                            <div>{item.cartItemId}</div>
                          </div>
                        </div>

                        {/* Price & Button */}
                        <div className="flex flex-col items-end justify-between">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-orange-600 mb-2">
                              {parseFloat(item.price).toLocaleString()} บาท
                            </p>
                          </div>

                          <button
                            className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors flex items-center gap-2"
                            onClick={() => {
                              const confirmCancel = window.confirm(
                                `คุณแน่ใจว่าต้องการยกเลิกคำสั่งซื้อเมนู ${item.name} จริงหรือไม่?`
                              );
                              if (confirmCancel) {
                                handleRemoveItem(item.cartItemId);
                              }
                            }}
                          >
                            {/* Trash icon */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            ยกเลิกรายการ
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
                {totalPrice.toLocaleString()} บาท
              </p>
            </div>

            <div className="flex space-x-4">
              <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                ยืนยันการสั่งซื้อ
              </button>
              <button
                className="flex-1 bg-white border border-orange-500 text-orange-500 hover:bg-orange-50 font-bold py-3 px-4 rounded-lg transition-colors"
                onClick={() => {
                  const confirmCannel = window.confirm(
                    `คุณแน่ใจว่าต้องการยกเลิกคําสั่งซื้อทั้งหมดจริงหรือไม่?`
                  );
                  if (confirmCannel) {
                    localStorage.removeItem("cart");
                    setCart([]);
                    alert("ยกเลิกคําสั่งซื้อเรียบร้อยแล้ว");
                  }
                }}
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
