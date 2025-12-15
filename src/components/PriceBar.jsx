const PriceBar = ({ selectedSeats, onBack, onConfirm }) => {
  const pricePerSeat = 200;

  return (
    <div className="bg-[#0C0C0C] border-b border-white/10 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between md:items-center">
        <div>
          <p className="anton text-2xl md:text-4xl text-[#FBF4E2]">Total</p>
          <p className="text-2xl text-[#FBF4E2]">
            ₹{selectedSeats.length * pricePerSeat}
          </p>
        </div>

        <div>
          <p className="anton text-2xl md:text-4xl text-[#FBF4E2]">Seats</p>
          <p className="text-xl">{selectedSeats.join(", ")}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-full bg-[#FF7A1A] text-black font-semibold"
          >
            Confirm
          </button>

          <button
            onClick={onBack}
            className="px-6 py-2 rounded-full border border-white/30"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceBar;
