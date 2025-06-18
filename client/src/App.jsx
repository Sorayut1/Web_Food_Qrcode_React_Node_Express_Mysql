// App.jsx
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import useAuthStore from './stores/authStore';

import ManageCategory from './pages/owner/manageCategory';
import ManageMenu from './pages/owner/ManageMenu';
import ManageTable from './pages/owner/ManageTable';
import Login from './pages/auth/Login';
import Dashboard from './pages/owner/Dashboard';
import OwnerLayout from './layouts/OwnerLayout';

function App() {
  const isHydrated = useAuthStore((state) => state._hasHydrated);

  // ✅ แสดงหน้า Loading จนกว่า Zustand จะ hydrate เสร็จ
  if (!isHydrated) return <div>⏳ Loading authentication...</div>;

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <OwnerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="menu" element={<ManageMenu />} />
          <Route path="category" element={<ManageCategory />} />
          <Route path="table" element={<ManageTable />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
