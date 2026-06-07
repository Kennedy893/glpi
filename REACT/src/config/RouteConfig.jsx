import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../pages/login/LoginPage';
import { TicketsPage } from '../pages/ticket/TicketsPage';
import { ImportPage } from '../pages/ImportPage';
import { ResetPage } from '../pages/ResetPage';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { BackofficeLayout } from '../components/layout/BackofficeLayout';
import { DashboardPage } from '../pages/dashboard/DashboardPage';

const RouteConfig = () => {
  return (
    <Routes>
      {/* Route publique */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Routes protégées */}
      <Route path="/" element={
        <ProtectedRoute>
          <BackofficeLayout>
            <DashboardPage />
          </BackofficeLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/import" element={
        <ProtectedRoute>
          <BackofficeLayout>
            <ImportPage />
          </BackofficeLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/reset" element={
        <ProtectedRoute>
          <BackofficeLayout>
            <ResetPage />
          </BackofficeLayout>
        </ProtectedRoute>
      } />

      <Route path="/tickets" element={
        <ProtectedRoute>
          <BackofficeLayout>
            <TicketsPage />
          </BackofficeLayout>
        </ProtectedRoute>
      } />
      
      {/* Redirection */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default RouteConfig;