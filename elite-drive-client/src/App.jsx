import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";
import { DateProvider } from './context/DateContext';
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
import VehicleTypeDetailPage from './pages/customer/VehicleTypeDetailPage';
import RootRedirect from './components/RootRedirect';

const App = () => (
  <Router>
    <AuthProvider>
      <DateProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          
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
            <Route path="vehicle-type/:vehicleType" element={<VehicleTypeDetailPage />} />
          </Route>
          
          {/* Root redirect - handle this after auth check */}
          <Route path="/" element={<ProtectedRoute><Navigate to="/customer" replace /></ProtectedRoute>} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </DateProvider>
    </AuthProvider>
  </Router>
);

export default App;