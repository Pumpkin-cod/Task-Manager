// src/App.tsx
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { Toaster } from 'react-hot-toast';

import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';
import Header from './components/Header';

const App: React.FC = () => {
  const auth = useAuth();
  const [, setSidebarOpen] = useState(false);

  if (auth.isLoading) return <div>Loading...</div>;
  if (auth.error) return <div>Error: {auth.error.message}</div>;

  const isAuthenticated = auth.isAuthenticated;
  const user = auth.user;
  const groups = (user?.profile["cognito:groups"] as string[]) || [];
  const email = user?.profile?.email ?? "";
  const role = groups.find((g) => g.toLowerCase() === "admin") ? "admin" : "member";


  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Show header only when user is logged in */}
      {isAuthenticated && user && (
        <Header
          user={{ email, role }}
          onLogout={() => auth.signoutRedirect()}
          onMenuClick={() => setSidebarOpen((prev) => !prev)}
        />
      )}

      <Routes>
        {/* Login route */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <div className="flex items-center justify-center h-screen">
                <button
                  onClick={() => auth.signinRedirect()}
                  className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Sign in with AWS
                </button>
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Role-based dashboard */}
        <Route
  path="/"
  element={
    isAuthenticated && user ? (
      role === "admin" ? (
        <AdminDashboard />
      ) : (
        <MemberDashboard />
      )
    ) : (
      <Navigate to="/login" />
    )
  }
/>
      </Routes>

    </div>
  );
};

export default App;
