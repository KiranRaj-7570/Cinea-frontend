import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, amount, key, movieId, showId } = location.state || {};

  useEffect(() => {
    if (!orderId || !key || !amount) {
      navigate(`/book/${movieId}/seats/${showId}`, { replace: true });
      return;
    }

    const options = {
      key,
      amount, // ✅ already correct (paise)
      currency: "INR",
      name: "Cinéa",
      description: "Movie Ticket Booking",
      order_id: orderId,

      method: {
        card: true, // ✅ FORCE card + OTP flow
      },

      handler: async (response) => {
        try {
          await api.post("/booking/verify", {
            bookingId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          navigate(`/booking/ticket/${bookingId}`, { replace: true });
        } catch {
          alert("Payment verification failed");
          navigate(`/book/${movieId}/seats/${showId}`, { replace: true });
        }
      },

      modal: {
        ondismiss: async () => {
          await api.post("/booking/failed", { bookingId });
          navigate(`/book/${movieId}/seats/${showId}`, { replace: true });
        },
      },

      theme: { color: "#FF7A1A" },
    };

    const rzp = new window.Razorpay(options);

    // ✅ THIS IS THE MISSING PART
    rzp.on("payment.failed", async () => {
      await api.post("/booking/failed", { bookingId });

      alert("Payment failed. Seats released.");

      navigate(`/book/${movieId}/seats/${showId}`, { replace: true });
    });

    rzp.open();

    return () => {
      // ✅ Restore scrolling
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
      rzp.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="pt-40 text-center text-xl">Redirecting to payment...</div>
    </div>
  );
};

export default PaymentPage;
