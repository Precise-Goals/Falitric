import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { Web3Provider } from "./contexts/Web3Context.jsx";
import Navbar from "./components/Layout/Navbar.jsx";
import Sidebar from "./components/Layout/Sidebar.jsx";
import Login from "./components/Auth/Login.jsx";
import GridMap from "./components/GridMap/GridMap.jsx";
import Exchange from "./components/Exchange/Exchange.jsx";
import Predict from "./components/Predict/Predict.jsx";
import Connect from "./components/Connect/Connect.jsx";
import AdminDashboard from "./components/Admin/AdminDashboard.jsx";
import { useAuth } from "./contexts/AuthContext.jsx";

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

function AppLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Web3Provider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <GridMap />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/exchange"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Exchange />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/predict"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Predict />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/connect"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Connect />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AppLayout>
                    <AdminDashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Web3Provider>
      </AuthProvider>
    </BrowserRouter>
  );
}
