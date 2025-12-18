import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import BookingCard from "../components/BookingCard";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";
import BookingCardSkeleton from "../components/Skeletons/BookingCardSkeleton";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/booking/my?ts=${Date.now()}`);
      setBookings(res.data);
    } catch (err) {
      console.error("Load bookings error", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async () => {
    try {
      await api.post(`/booking/${confirmId}/cancel`);
      setToast("Booking cancelled successfully");
      setConfirmId(null);
      loadBookings();
    } catch (err) {
      setToast(err.response?.data?.message || "Cancel failed");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#2f2f2f] via-[#111] to-[#141414] text-white pt-16">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 mt-12 pb-24">
        <h1 className="text-3xl font-bold mb-6 anton text-[#F6E7C6]">My Bookings</h1>
          <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen h-[5px] bg-black/20 shadow-md mt-5" />

        {/* 🔄 Skeleton */}
        {loading && (
          <div className="space-y-4 mt-5 max-w-5xl mx-auto">
            {Array.from({ length: 3 }).map((_, i) => (
              <BookingCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* ❌ Empty */}
        {!loading && bookings.length === 0 && (
          <p className="text-gray-400 text-center mt-20">No bookings yet.</p>
        )}

        {/* ✅ Data */}
        {!loading && (
          <div className="space-y-4 mt-5 max-w-5xl mx-auto">
            {bookings.map((b) => (
              <BookingCard
                key={b.bookingId}
                booking={b}
                onOpen={() =>
                  b.status !== "cancelled" &&
                  navigate(`/booking/ticket/${b.bookingId}`)
                }
                onCancel={() => setConfirmId(b.bookingId)}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!confirmId}
        onCancel={() => setConfirmId(null)}
        onConfirm={cancelBooking}
      />

      <Toast show={!!toast} message={toast} onClose={() => setToast("")} />
    </div>
  );
};

export default MyBookings;
