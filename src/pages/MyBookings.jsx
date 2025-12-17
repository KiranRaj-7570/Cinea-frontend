import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/booking/my").then((res) => setBookings(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-[#111] text-white pt-16">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 mt-8">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

        {bookings.length === 0 && (
          <p className="text-gray-400">No bookings yet.</p>
        )}

        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b.bookingId}
              onClick={() =>
                navigate(`/booking/ticket/${b.bookingId}`)
              }
              className="flex gap-4 bg-[#151515] p-4 rounded-xl cursor-pointer hover:bg-[#1c1c1c]"
            >
              {/* Poster */}
              <img
                src={`https://image.tmdb.org/t/p/w200${b.movie.poster}`}
                className="w-20 h-28 object-cover rounded-lg"
                alt={b.movie.title}
              />

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  {b.movie.title}
                </h3>

                <p className="text-sm text-gray-400">
                  {b.show.theatre}
                </p>

                <p className="text-sm">
                  {b.show.date} • {b.show.time}
                </p>

                <p className="text-sm mt-1">
                  Seats: {b.seats.join(", ")}
                </p>
              </div>

              {/* Status */}
              <span
                className={`self-start px-3 py-1 text-xs rounded-full ${
                  b.status === "paid"
                    ? "bg-green-600"
                    : "bg-red-600"
                }`}
              >
                {b.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
