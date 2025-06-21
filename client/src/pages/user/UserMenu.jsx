import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; //เอาไว้สร้าง id ไม่ให้เหมือนกันป้องกันการลบ
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Star,
  Clock,
  Users,
} from "lucide-react";
import axios from "axios";
import { useNavigate ,useLocation,useParams} from "react-router-dom";

import Navbar from '../../components/user/Navbar';
import Footer from "../../components/user/Footer";
import UserProduct from "../user/UserProduct";

const API_URL_CAT = `http://localhost:3000/api/user/home/categories`;
const API_URL_IMAGE = "http://localhost:3000/uploads/food"; // เปลี่ยนเป็น URL จริงของ API

const UserMenu = () => {
const { table_number } = useParams();

  // console.log("เลขโต๊ะที่ได้:", table_number);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const [selectedFood, setSelectedFood] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [categorie, setCategorie] = useState([]);
  const [selectedCat, setSelectedCat] = useState("0"); // 0 = ทั้งหมด
  const [products, setProducts] = useState([]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tableNumber = queryParams.get("table") || "ไม่ระบุ";
//  console.log("เลขโต๊ะ:", table_number);  // ตรวจสอบว่าดึงมาได้หรือยัง
  const API_URL_PRODUCT = `http://localhost:3000/api/user/home/products/${selectedCat}`;

  // โหลดข้อมูลจาก API
  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
  if (table_number) {
    localStorage.setItem("table_number", table_number);
  }
}, [table_number]);

  useEffect(() => {
    axios
      .get(API_URL_PRODUCT)
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, [selectedCat]);

  const fetchAll = async () => {
    try {
      const response = await axios.get(API_URL_CAT);
      setCategorie(response.data);

      console.log("DATA:", response.data); // ตรวจสอบ
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการโหลดหมวดหมู่:", error);
    }
  };

  const navigate = useNavigate();

const handleAddToOrder = (menu_id, menu_name, menu_image, price) => {
  const tableNumber = localStorage.getItem("table_number"); // ดึงเลขโต๊ะ

  if (!tableNumber) {
    alert("❌ ไม่พบเลขโต๊ะ กรุณาเข้าสู่ระบบผ่าน QR Code อีกครั้ง");
    return;
  }

  // โหลดข้อมูล cart ปัจจุบัน (เป็น object หรือ null)
  let existingCart = JSON.parse(localStorage.getItem("cart")) || {
    table_number: tableNumber,
    items: []
  };

  // เช็คเลขโต๊ะ ถ้าไม่ตรงกันให้เคลียร์ตะกร้า
  if (existingCart.table_number !== tableNumber) {
    existingCart = {
      table_number: tableNumber,
      items: []
    };
  }

  // สร้างรายการใหม่
  const newItem = {
    cartItemId: uuidv4(),
    id: menu_id,
    name: menu_name,
    image: menu_image,
    price: price
  };

  existingCart.items.push(newItem);

  localStorage.setItem("cart", JSON.stringify(existingCart));
  console.log("🛒 ตะกร้าใหม่:", existingCart);
  alert("✅ เพิ่มเมนูลงตะกร้าเรียบร้อย");
};

  const slides = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "พิซซ่าสุดพิเศษ",
      subtitle: "อร่อยถึงใจ ราคาเพียง 299 บาท",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1646850149335-f15d028036b3?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "อาหารไทยต้นตำรับ",
      subtitle: "รสชาติแท้ สูตรดั้งเดิม",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=1415&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "เบอร์เกอร์สุดอร่อย",
      subtitle: "เนื้อชั้นดี ราคาเริ่มต้น 159 บาท",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  React.useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-orange-50">
       <Navbar tableNumber={table_number} />

      {/* Hero Slider */}
      <div className="pt-16 relative">
        <div className="relative h-96 overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                index === currentSlide
                  ? "translate-x-0"
                  : index < currentSlide
                  ? "-translate-x-full"
                  : "translate-x-full"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs bg-opacity-40 flex items-center justify-center">
                <div className="text-center text-white">
                  <h2 className="text-4xl md:text-6xl font-bold mb-4">
                    {slide.title}
                  </h2>
                  <p className="text-xl md:text-2xl">{slide.subtitle}</p>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full"
          >
            ←
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full"
          >
            →
          </button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentSlide
                    ? "bg-orange-500"
                    : "bg-white bg-opacity-50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          เลือกหมวดอาหาร
        </h2>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setSelectedCat("0")}
            className={`px-4 py-2 rounded-full border text-sm transition ${
              selectedCat === "0"
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-600 hover:text-white"
            }`}
          >
            ทั้งหมด
          </button>
          {categorie.map((cat) => (
            <button
              key={cat.menu_type_id}
              onClick={() => setSelectedCat(cat.menu_type_id.toString())}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                selectedCat === cat.menu_type_id.toString()
                  ? "bg-orange-500 text-white shadow-lg transform scale-105"
                  : "bg-white text-gray-700 hover:bg-orange-100 border border-orange-200"
              }`}
            >
              {cat.type_name}
            </button>
          ))}
        </div>

        {/* Food Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.length === 0 ? (
            <p>ไม่พบสินค้า</p>
          ) : (
            products.map((product) => (
              <div
                key={product.menu_id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105"
                onClick={() => setSelectedFood(product)}
              >
                <img
                  src={`${API_URL_IMAGE}/${product.menu_image}`}
                  // ✅ ลบ /public ออก
                  alt={product.menu_name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {product.menu_name}
                  </h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold text-orange-500">
                      ฿{product.price}
                    </span>
                    <div className="flex items-center text-yellow-500">
                      <Star size={16} fill="currentColor" />
                      <span className="ml-1 text-gray-600">4.5</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock size={14} />
                      <span className="ml-1">20-25 นาที</span>
                    </div>
                    <div className="flex items-center">
                      <Users size={14} />
                      <span className="ml-1">
                        หมวด : {product.category_name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedFood && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="relative">
              <img
                src={`${API_URL_IMAGE}/${selectedFood.menu_image}`}
                // ✅ ลบ /public ออก
                alt={selectedFood.menu_name}
                className="w-full h-64 object-cover rounded-t-xl"
              />
              <button
                onClick={() => setSelectedFood(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                {selectedFood.menu_name}
              </h2>

              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-orange-500">
                  ฿{selectedFood.price}
                </span>
                <div className="flex items-center text-yellow-500">
                  <Star size={20} fill="currentColor" />
                  <span className="ml-2 text-lg text-gray-600">4.5</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Clock size={18} />
                  <span className="ml-2">20-25 นาที</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users size={18} />
                  <span className="ml-2">
                    หมวด : {selectedFood.category_name}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  รายละเอียด
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedFood.detail_menu}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
                  onClick={() => {
                    handleAddToOrder(
                      selectedFood.menu_id,
                      selectedFood.menu_name,
                      selectedFood.menu_image,
                      selectedFood.price,
                    );
                  }}
                >
                  เพิ่มลงตะกร้า
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium transition-colors">
                  ❤️ ชอบ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* <UserProduct /> */}
      <Footer />
    </div>
  );
};

export default UserMenu;