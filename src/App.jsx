import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Watchlist from "./pages/Watchlist";
import Booking from "./pages/Booking";
import ProtectedRoute from "./routes/ProtectedRoute";
import Profile from "./pages/Profile";
function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>

    
      <Route path="/" element={<Landing />} />
      
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/home" replace />}
      />
      
      <Route
        path="/signup"
        element={!user ? <Signup /> : <Navigate to="/home" replace />}
      />

     
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/explore"
        element={
          <ProtectedRoute>
            <Explore />
          </ProtectedRoute>
        }
      />

      <Route
        path="/watchlist"
        element={
          <ProtectedRoute>
            <Watchlist />
          </ProtectedRoute>
        }
      />

      <Route
        path="/booking"
        element={
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;