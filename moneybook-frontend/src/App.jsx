import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import TransactionList from "./pages/transactions/TransactionList";
import AddTransaction from "./pages/transactions/AddTransaction";
import EditTransaction from "./pages/transactions/EditTransaction"; // ✅ ADD THIS
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import AuthThemeWrapper from "./components/auth/AuthThemeWrapper";

export default function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* PUBLIC – ALWAYS LIGHT */}
      <Route
        path="/login"
        element={
          <AuthThemeWrapper>
            <Login />
          </AuthThemeWrapper>
        }
      />
      <Route
        path="/register"
        element={
          <AuthThemeWrapper>
            <Register />
          </AuthThemeWrapper>
        }
      />

      {/* PROTECTED */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Layout>
              <TransactionList />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/transactions/add"
        element={
          <ProtectedRoute>
            <Layout>
              <AddTransaction />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* EDIT TRANSACTION */}
      <Route
        path="/transactions/edit/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <EditTransaction />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* FALLBACK – MUST BE LAST */}
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />
    </Routes>
  );
}
