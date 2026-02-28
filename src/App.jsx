import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import WalletAuth from "./components/WalletAuth";

import Dashboard from "./pages/Dashboard";
import GridMap from "./pages/GridMap";
import Exchange from "./pages/Exchange";
import Connect from "./pages/Connect";
import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <WalletAuth>
        {(user) => (
          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/gridmap" element={<GridMap user={user} />} />
            <Route path="/exchange" element={<Exchange user={user} />} />
            <Route path="/connect" element={<Connect user={user} />} />
            <Route
              path="/admin"
              element={
                user?.role === "admin" ? (
                  <Admin user={user} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        )}
      </WalletAuth>
    </BrowserRouter>
  );
}

export default App;
