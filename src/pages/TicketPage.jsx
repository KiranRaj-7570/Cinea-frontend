import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import GoBackButton from "../components/GoBackButton";
import { QRCodeCanvas } from "qrcode.react";
import TicketPageSkeleton from "../components/Skeletons/TicketPageSkeleton";

/* 🦴 Skeleton */


const TicketPage = () => {
  const { bookingId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTicket = async () => {
      try {
        const res = await api.get(`/booking/${bookingId}`);
        setTicket(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load this ticket"
        );
      } finally {
        setLoading(false);
      }
    };

    loadTicket();
  }, [bookingId]);

  /* ⏳ Loading */
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-10">
        <TicketPageSkeleton />
      </div>
    );
  }

  /* ❌ Error */
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white pt-16">
        <div className="max-w-md mx-auto mt-32 text-center px-6">
          <p className="text-lg font-semibold mb-3">
            Ticket unavailable
          </p>
          <p className="text-slate-400 mb-6">{error}</p>

          <div className="flex justify-center">
            <GoBackButton label="My Bookings" />
          </div>
        </div>
      </div>
    );
  }

  /* 🕒 Time formatter */
  const formatTime12h = (time) => {
    if (!time) return "";
    const [h, m] = time.split(":");
    const hour = Number(h);
    const suffix = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${suffix}`;
  };

  /* 🔐 QR payload */
  const qrValue = `CINEA|${bookingId}|${ticket.show.screen}`;
  const bookingCode = `CN-${bookingId.slice(-6).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-black text-white pt-5 pb-5">
      <div className="max-w-md mx-auto px-4 py-2">
        {/* 🔙 Back */}
        <div className="mb-4">
          <GoBackButton label="Go Back" />
        </div>

        {/* 🎟 Ticket */}
        <div className="bg-[#f8fafc] text-black rounded-3xl overflow-hidden shadow-2xl">
          {/* 🎬 Movie */}
          <div className="flex gap-4 p-6">
            <img
              src={`https://image.tmdb.org/t/p/w300${ticket.movie.poster}`}
              className="w-28 h-40 object-cover rounded-xl"
              alt={ticket.movie.title}
            />

            <div className="flex-1 space-y-1">
              <h2 className="text-2xl anton">
                {ticket.movie.title}
              </h2>

              <p className="text-xl reem-kufi">
                {ticket.show.theatre}
              </p>

              <p className="text-lg reem-kufi">
                {ticket.show.date}
              </p>

              <p className="text-lg reem-kufi">
                {formatTime12h(ticket.show.time)}
              </p>
            </div>
          </div>

          {/* 🎟 Seats & price */}
          <div className="px-6 pb-2 text-center">
            <div className="text-4xl anton tracking-wide">
              {ticket.seats.join(", ")}
            </div>

            <div className="text-gray-600 mt-1 poppins-regular">
              Total Amount: ₹{ticket.amount}
            </div>
          </div>

          {/* ✂️ Perforation */}
          <div className="relative my-2">
            <div className="border-t border-dashed border-gray-300" />
            <div className="absolute -left-4 top-1/2 w-8 h-8 bg-black rounded-full -translate-y-1/2" />
            <div className="absolute -right-4 top-1/2 w-8 h-8 bg-black rounded-full -translate-y-1/2" />
          </div>

          {/* 📱 QR */}
          <div className="p-4 flex flex-col items-center gap-3 poppins-regular">
            <QRCodeCanvas
              value={qrValue}
              size={130}
              bgColor="#ffffff"
              fgColor="#000000"
            />

      

            <div className="font-mono tracking-widest text-md anton">
              {bookingCode}
            </div>
            <div className="text-xs text-gray-500 text-center">
              Show this QR code at the theatre entrance
            </div>


            <div className="text-[11px] text-gray-400 mt-0.5 text-center">
              Entry allowed for a limited time after show start
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
