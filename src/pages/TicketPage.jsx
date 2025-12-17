import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const TicketPage = () => {
  const { bookingId } = useParams();
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    api.get(`/booking/${bookingId}`).then((res) => {
      setTicket(res.data);
    });
  }, [bookingId]);

  if (!ticket) return null;

  return (
    <div className="min-h-screen bg-black text-white pt-16">
      <Navbar />

      <div className="max-w-md mx-auto mt-10 bg-[#151515] rounded-2xl p-6 border border-white/10">
        <img
          src={`https://image.tmdb.org/t/p/w500${ticket.movie.poster}`}
          className="rounded-xl mb-4"
        />

        <h2 className="text-xl font-bold">
          {ticket.movie.title}
        </h2>

        <p className="text-gray-400 mt-1">
          {ticket.show.theatre}
        </p>

        <p className="mt-2">
          {ticket.show.date} • {ticket.show.time}
        </p>

        <p className="mt-2">
          Seats: {ticket.seats.join(", ")}
        </p>

        <p className="mt-2 font-semibold">
          ₹{ticket.amount}
        </p>
      </div>
    </div>
  );
};


export default TicketPage;
