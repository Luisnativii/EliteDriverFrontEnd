import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/admin/DashboardPage';
import MaintenancePage from './pages/admin/MaintenancePage';
import ReservationManagementPage from './pages/admin/ReservationManagementPage';
import VehicleManagementPage from './pages/admin/VehicleManagementPage';
import HomePage from './pages/customer/HomePage';
import MyReservationPage from './pages/customer/MyReservationsPage';
import ReservationPage from './pages/customer/ReservationPage';
import VehiclesPage from './pages/customer/VehiclesPage';
import VehicleDetailPage from './pages/customer/VehicleDetailPage';
import LoginTemp from './pages/auth/LoginTemp';
import Login from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VehicleTypeDetailPage from './pages/customer/VehicleTypeDetailPage'; // Descomenta cuando crees el archivo

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginTemp />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Private routes with Layout */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="maintenance" element={<MaintenancePage />} />
          <Route path="reservation" element={<ReservationManagementPage />} />
          <Route path="vehicle" element={<VehicleManagementPage />} />
        </Route>
        
        <Route path="/customer" element={
          <ProtectedRoute requiredRole="customer">
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<HomePage />} />
          <Route path="my-reservations" element={<MyReservationPage />} />
          <Route path="reservation-page/:vehicleId" element={<ReservationPage />} />
          <Route path="vehicles" element={<VehiclesPage />} />
          <Route path="vehicles/:id" element={<VehicleDetailPage />} />
           {/*  ruta para tipos de vehículos */}
          <Route path="vehicle-type/:vehicleType" element={<VehicleTypeDetailPage />} />
        </Route>
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;