import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import TransactionList from "../pages/transactions/TransactionList";
import AddTransaction from "../pages/transactions/AddTransaction";

import Layout from "../components/layout/Layout";
import ProtectedRoute from "./ProtectedRoute";
import RootRedirect from "./RootRedirect";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Root */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
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
    </Routes>
  );
}