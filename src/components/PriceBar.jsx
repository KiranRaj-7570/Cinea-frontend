const PriceBar = ({ selectedSeats, priceMap = {}, onBack, onConfirm }) => {
  // 💰 calculate total dynamically
  const totalAmount = selectedSeats.reduce((sum, seatId) => {
    const row = seatId[0]; // A1 → A
    const price = priceMap[row] || 0;
    return sum + price;
  }, 0);

  return (
    <div className="bg-[#0C0C0C] border-t border-white/10 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between md:items-center">
        {/* 💰 Total */}
        <div>
          <p className="anton text-2xl md:text-4xl text-[#FBF4E2]">
            Total
          </p>
          <p className="text-2xl text-[#FBF4E2]">
            ₹{totalAmount}
          </p>
        </div>

        {/* 🎟 Seats */}
        <div>
          <p className="anton text-2xl md:text-4xl text-[#FBF4E2]">
            Seats
          </p>
          <p className="text-xl">
            {selectedSeats.join(", ")}
          </p>
        </div>

        {/* 🔘 Actions */}
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-full bg-[#FF7A1A] hover:bg-white text-black font-semibold"
          >
            Confirm
          </button>

          <button
            onClick={onBack}
            className="px-6 py-2 rounded-full border hover:bg-white/10 border-white/30"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceBar;
