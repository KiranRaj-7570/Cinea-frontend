const BookingCard = ({ booking, onCancel, onOpen }) => {
  const formatTime12h = (time) => {
    if (!time) return "";
    const [h, m] = time.split(":");
    const hour = Number(h);
    const suffix = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${suffix}`;
  };

  const isCancelled = booking.status === "cancelled";

  return (
    <div
      onClick={!isCancelled ? onOpen : undefined}
      className={`flex gap-4 p-4 rounded-xl transition reem-kufi
        ${
          isCancelled
            ? "bg-[#1a1a1a] opacity-60 cursor-not-allowed"
            : "bg-[#151515] cursor-pointer hover:bg-[#1c1c1c]"
        }`}
    >
      {/* 🎬 Poster */}
      <img
        src={
          booking.movie?.poster
            ? `https://image.tmdb.org/t/p/w200${booking.movie.poster}`
            : "/no-poster.png"
        }
        className="w-20 h-28 object-cover rounded-lg text-[#F6E7C6]"
        alt={booking.movie?.title}
      />

      {/* 📄 Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-xl text-[#F6E7C6] ">
          {booking.movie?.title}
        </h3>

        <p className="text-lg text-[#FF7A1A] mt-1">
          {booking.show?.theatre}
        </p>

        <p className="text-[12px] mt-1 text-gray-400">
          {booking.show?.date} • {formatTime12h(booking.show?.time)}
        </p>

        <p className="text-sm mt-1 text-white word-spacing-0.2rem ">
          Seats: {booking.seats.join(", ")}
        </p>

        {/* ❌ Cancel (only if allowed) */}
        {booking.canCancel && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCancel();
            }}
            className="mt-1 text-[11px] text-red-500 border border-transparent hover:border-orange-700 rounded-full py-1 px-1.5 transition poppins-regular "
          >
            Cancel Booking
          </button>
        )}
      </div>

      {/* 🟢 Status */}
      <span
        className={`self-start px-3 py-1 text-sm rounded-full capitalize
          ${
            booking.status === "paid"
              ? "bg-green-500/10 text-green-400"
              : booking.status === "expired"
              ? "bg-orange-500/10 text-orange-400"
              : "bg-red-500/10 text-red-400"
          }`}
      >
        {booking.status}
      </span>
    </div>
  );
};

export default BookingCard;
