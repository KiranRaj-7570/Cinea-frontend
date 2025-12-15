import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const BookingSuccess = () => {
  const { bookingId } = useParams();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="pt-40 text-center">
        <h1 className="text-4xl text-[#FF7A1A]">Booking Confirmed 🎉</h1>
        <p className="mt-4">Booking ID: {bookingId}</p>
      </div>
    </div>
  );
};

export default BookingSuccess;
