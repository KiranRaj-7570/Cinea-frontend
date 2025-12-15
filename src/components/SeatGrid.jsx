const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const SEATS_PER_ROW = 20;
const MAX_SEATS = 10;

const SeatGrid = ({
  bookedSeats,
  lockedSeats,
  selectedSeats,
  setSelectedSeats,
}) => {
  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId) || lockedSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= MAX_SEATS) return;
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  return (
    <div
      className="
        mt-10
        overflow-x-auto overflow-y-visible
        pb-6
      "
    >
      <div
        className="
          flex
          justify-start lg:justify-center
          gap-24
          pl-8
          pr-12 sm:pr-16 lg:pr-10
        "
      >
        {[0, 1].map((block) => (
          <div key={block} className="space-y-3">
            {ROWS.map((row) => (
              <div key={row} className="flex items-center gap-3">
                {/* Row label only on left */}
                {block === 0 && (
                  <span className="w-4 text-slate-400">{row}</span>
                )}
                {block === 1 && <span className="w-4" />}

                {[...Array(SEATS_PER_ROW / 2)].map((_, i) => {
                  const seatNo = block === 0 ? i + 1 : i + 11;
                  const seatId = `${row}${seatNo}`;

                  const isBooked = bookedSeats.includes(seatId);
                  const isLocked = lockedSeats.includes(seatId);
                  const isSelected = selectedSeats.includes(seatId);

                  return (
                    <button
                      key={seatId}
                      onClick={() => toggleSeat(seatId)}
                      disabled={isBooked || isLocked}
                      className={`
  w-9 h-8 rounded-md text-xs font-medium border transition

  ${isSelected && "bg-[#FF7A1A] text-black border-[#FF7A1A]"}

  ${
    (isBooked || isLocked) &&
    "bg-[#D6D6D6] text-black border-[#D6D6D6] cursor-not-allowed"
  }

  ${
    !isSelected &&
    !isBooked &&
    !isLocked &&
    "border-[#555] text-[#ddd] hover:border-[#FF7A1A]"
  }
`}
                    >
                      {seatId}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatGrid;
