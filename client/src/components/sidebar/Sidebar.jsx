import React, { useState } from 'react';
import {
  Home,
  BarChart3,
  Users,
  ShoppingCart,
  Menu,
  Settings,
  Gift,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Utensils,
  FileText,
  Star,
  CreditCard,
  Bell,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Sidebar = ({ children, isOpen = true, onToggle }) => {
  const [collapsed, setCollapsed] = useState(!isOpen);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    if (onToggle) onToggle(!collapsed);
  };
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'หน้าหลัก',
      icon: Home,
      // active: true,
      path: '/billing',
    },
    {
      id: 'orders',
      label: 'ออเดอร์',
      icon: ShoppingCart,
      badge: '3',
      path: '/orders',
    },
    {
      id: 'menu',
      label: 'จัดการเมนู',
      icon: Utensils,
      children: [
        { id: 'menu-list', label: 'รายการเมนู', path: '/menu', },
        { id: 'menu-category', label: 'หมวดหมู่', path: '/category', },
        { id: 'menu-ingredients', label: 'วัตถุดิบ', path: '/billing', }
      ]
    },
    {
      id: 'customers',
      label: 'จัดการพนักงาน',
      icon: Users, 
      path: '/staff'
    },
    {
      id: 'reports',
      label: 'รายงาน',
      icon: BarChart3,
      children: [
        { id: 'sales-report', label: 'รายงานขาย' },
        { id: 'menu-report', label: 'รายงานเมนู' },
        { id: 'customer-report', label: 'รายงานลูกค้า' }
      ]
    },
    {
      id: 'promotions',
      label: 'จัดการโต๊ะอาหาร',
      icon: Gift
      , path: '/table'

    },
    // {
    //   id: 'reviews',
    //   label: 'รีวิว',
    //   icon: Star,
    //   badge: '2'
    // },
    {
      id: 'billing',
      label: 'บิลและชำระเงิน',
      icon: CreditCard
    },
    // {
    //   id: 'calendar',
    //   label: 'ปฏิทิน',
    //   icon: Calendar
    // },
    {
      id: 'notifications',
      label: 'การแจ้งเตือน',
      icon: Bell
    }
  ];

  const bottomMenuItems = [
    // {
    //   id: 'settings',
    //   label: 'ตั้งค่า',
    //   icon: Settings
    // },
    // {
    //   id: 'help',
    //   label: 'ช่วยเหลือ',
    //   icon: HelpCircle
    // }
  ];

  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const renderMenuItem = (item, isChild = false) => {
    const IconComponent = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);

    return (
      <div key={item.id}>
        <div
          className={`
            flex items-center px-3 py-2.5 mx-2 rounded-xl cursor-pointer transition-all duration-200 group
            ${item.active
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
              : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
            }
            ${isChild ? 'ml-4 py-2' : ''}
            ${collapsed && !isChild ? 'justify-center' : ''}
          `}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else if (item.path) {
              navigate(item.path);
            }
          }}

        >
          {IconComponent && (
            <IconComponent
              size={20}
              className={`${collapsed && !isChild ? '' : 'mr-3'} ${item.active ? 'text-white' : ''}`}
            />
          )}

          {(!collapsed || isChild) && (
            <span className={`flex-1 font-medium ${isChild ? 'text-sm' : ''}`}>
              {item.label}
            </span>
          )}

          {item.badge && (!collapsed || isChild) && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">
              {item.badge}
            </span>
          )}

          {hasChildren && (!collapsed || isChild) && (
            <ChevronRight
              size={16}
              className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
            />
          )}
        </div>

        {hasChildren && isExpanded && (!collapsed || isChild) && (
          <div className="mt-1 mb-2">
            {item.children.map(child => renderMenuItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Sidebar */}
      <div className={`
        bg-white shadow-2xl transition-all duration-300 ease-in-out flex flex-col
        sticky top-0 h-screen
        ${collapsed ? 'w-16' : 'w-64'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-orange-100">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🍽️</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-800">ร้านอาหาร</h1>
                  <p className="text-xs text-gray-600">ระบบจัดการ</p>
                </div>
              </div>
            )}
            {collapsed && (
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-white text-sm">🍽️</span>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="space-y-1">
            {menuItems.map(item => renderMenuItem(item))}
          </nav>
        </div>

        {/* Bottom Menu */}
        {/* <div className="border-t border-orange-100 py-4">
          <nav className="space-y-1">
            {bottomMenuItems.map(item => renderMenuItem(item))}
          </nav>
        </div> */}

        {/* Toggle Button */}
        <div className="p-4 border-t border-orange-100">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            {!collapsed && <span className="ml-2 text-sm">ซ่อนเมนู</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Sidebar;