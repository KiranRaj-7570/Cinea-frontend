import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Watchlist from "./pages/Watchlist";
import ProtectedRoute from "./routes/ProtectedRoute";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import SearchPage from "./pages/SearchPage";
import MovieDetails from "./pages/MovieDetails";
import TvDetails from "./pages/TvDetails";


import BookShowPage from "./pages/BookShowPage";
import SeatSelectionPage from "./pages/SeatSelectionPage";
import PaymentPage from "./pages/PaymentPage";
import AdminRoutes from "./routes/adminRoutes";
import BookMoviesPage from "./pages/BookMoviesPage";
import MyBookings from "./pages/MyBookings";
import TicketPage from "./pages/TicketPage";
function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
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
            <BookMoviesPage />
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
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        }
      />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/series/:id" element={<TvDetails />} />
      <Route path="/book/:movieId" element={<BookShowPage />} />
      <Route
  path="/book/:movieId/seats/:showId"
  element={
    <ProtectedRoute>
      <SeatSelectionPage />
    </ProtectedRoute>
  }
/>
      <Route path="/book/payment/:bookingId" element={<PaymentPage />} />

      <Route path="/booking/ticket/:bookingId" element={<TicketPage />} />

      <Route path="/my-bookings" element={<MyBookings/>} />
    </Routes>
  );
}

export default App;
