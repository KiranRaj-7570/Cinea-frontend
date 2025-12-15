import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import SeatGrid from "../components/SeatGrid";
import SeatLegend from "../components/SeatLegend";
import ScreenBar from "../components/ScreenBar";
import PriceBar from "../components/PriceBar";
import Footer from "../components/Footer";

const SeatSelectionPage = () => {
  const { showId, movieId } = useParams();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [showInfo, setShowInfo] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [lockedSeats, setLockedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const loadShowInfo = async () => {
      const res = await api.get(`/shows/${showId}`);
      setShowInfo(res.data);
    };

    loadShowInfo();
    loadSeats();
  }, [showId]);
  const handleConfirm = async () => {
    if (confirming) return;
  setConfirming(true);
  try {
    // 1️⃣ Lock seats first
    await api.post(`/shows/${showId}/lock-seats`, {
      seats: selectedSeats,
    });

    // 2️⃣ Create booking + Razorpay order
    const res = await api.post("/booking/create", {
      movieId: Number(movieId),
      showId,
      seats: selectedSeats,
    });

    // 3️⃣ Go to payment page
    navigate(`/book/payment/${res.data.bookingId}`, {
  state: {
    orderId: res.data.orderId,
    amount: res.data.amount,
    key: res.data.key,
    movieId,
    showId,
  },
});
  } catch (err) {
    await loadSeats(); // refresh seat state
    alert(err.response?.data?.message || "Booking failed");
  }finally {
    setConfirming(false);
  }
};


  const loadSeats = async () => {
    const res = await api.get(`/shows/${showId}/seats`);
    setBookedSeats(res.data.bookedSeats);
    setLockedSeats(res.data.lockedSeats.map((s) => s.seatId));
  };
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [h, m] = timeStr.split(":");
    const d = new Date();
    d.setHours(h, m);
    return d.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  };
  return (
    <div className="min-h-screen bg-linear-to-b from-black/85 via-[#0b0b0b] to-[#070707] text-white overflow-y-hidden max-w-screen">
      <Navbar />

      <div className="pt-24 md:pt-28">
        <h1 className="text-4xl text-[#FBF4E2] px-6 md:px-16 lg:px-36 anton mb-6">
          Choose Seats
        </h1>

        <div className="w-full h-[5px] bg-black/20 shadow-md" />

        {showInfo && (
          <p className="text-[#FBF4E2] poppins-semibold text-4xl px-6 md:px-16 lg:px-36 mt-4">
            {formatDate(showInfo.date)} <br />
            <span className="text-3xl poppins-medium">
              {formatTime(showInfo.time)}
            </span>
          </p>
        )}

        <div className="px-6 md:px-16 lg:px-56">
          <SeatLegend />
        </div>

        {/* Seat Grid */}
        <SeatGrid
          bookedSeats={bookedSeats}
          lockedSeats={lockedSeats}
          selectedSeats={selectedSeats}
          setSelectedSeats={setSelectedSeats}
        />

        <ScreenBar />

        {selectedSeats.length > 0 && (
          <PriceBar
            selectedSeats={selectedSeats}
            onBack={() => navigate(-1)}
            onConfirm={handleConfirm}
          />
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SeatSelectionPage;
