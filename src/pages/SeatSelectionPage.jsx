import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import SeatGrid from "../components/SeatGrid";
import SeatLegend from "../components/SeatLegend";
import ScreenBar from "../components/ScreenBar";
import PriceBar from "../components/PriceBar";
import Footer from "../components/Footer";
import GoBackButton from "../components/GoBackButton";
import SeatSelectionSkeleton from "../components/Skeletons/SeatSelectionSkeleton";

const SeatSelectionPage = () => {
  const { showId, movieId } = useParams();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [showInfo, setShowInfo] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [lockedSeats, setLockedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [layout, setLayout] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadShowInfo = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/shows/${showId}`);
      setShowInfo(res.data);
      setLayout(res.data.seatLayout.rows);
      await loadSeats();
    } finally {
      setLoading(false);
    }
  };

  loadShowInfo();
}, [showId]);

  const handleConfirm = async () => {
    if (confirming) return;
    setConfirming(true);
    try {

      await api.post(`/shows/${showId}/lock-seats`, {
        seats: selectedSeats,
      });

   
      const res = await api.post("/booking/create", {
        movieId: Number(movieId),
        showId,
        seats: selectedSeats,
      });

  
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
      await loadSeats(); 
      alert(err.response?.data?.message || "Booking failed");
    } finally {
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
    <div className="min-h-screen bg-linear-to-b from-[#2f2f2f] via-[#111] to-[#141414] text-white overflow-y-hidden max-w-screen">

      <div className="pt-24 md:pt-28">
        <div className="absolute top-0 left-0 z-20">
          <GoBackButton label="Go Back" />
        </div>
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

       
       {loading ? (
  <SeatSelectionSkeleton />
) : (
  <SeatGrid
    layout={layout}
    bookedSeats={bookedSeats}
    lockedSeats={lockedSeats}
    selectedSeats={selectedSeats}
    setSelectedSeats={setSelectedSeats}
  />
)}

        <ScreenBar />

        {selectedSeats.length > 0 && showInfo && (
          <PriceBar
            selectedSeats={selectedSeats}
            priceMap={showInfo.priceMap}
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
