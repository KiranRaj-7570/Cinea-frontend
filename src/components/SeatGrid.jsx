const SeatGrid = ({
  layout = [],
  bookedSeats,
  lockedSeats,
  selectedSeats,
  setSelectedSeats,
}) => {
  const MAX_SEATS = 10;

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
    <div className="mt-10 overflow-x-auto pb-6">
      <div className="flex justify-start lg:justify-center gap-24 px-8">
        {/* 🔹 Two blocks (left & right) */}
        {[0, 1].map((block) => (
          <div key={block} className="space-y-3">
            {layout.map((row) => {
              const half = Math.ceil(row.seats / 2);
              const start = block === 0 ? 1 : half + 1;
              const end =
                block === 0 ? half : row.seats;

              return (
                <div key={row.row} className="flex items-center gap-3">
                  {/* Row label only on left block */}
                  {block === 0 && (
                    <span className="w-4 text-slate-400">
                      {row.row}
                    </span>
                  )}
                  {block === 1 && <span className="w-4" />}

                  {Array.from(
                    { length: end - start + 1 },
                    (_, i) => {
                      const seatNo = start + i;
                      const seatId = `${row.row}${seatNo}`;

                      const isBooked = bookedSeats.includes(seatId);
                      const isLocked = lockedSeats.includes(seatId);
                      const isSelected =
                        selectedSeats.includes(seatId);

                      return (
                        <button
                          key={seatId}
                          onClick={() => toggleSeat(seatId)}
                          disabled={isBooked || isLocked}
                          className={`
                            w-9 h-8 rounded-md text-xs font-medium border transition

                            ${
                              isSelected &&
                              "bg-[#FF7A1A] text-black border-[#FF7A1A]"
                            }

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
                          {seatNo}
                        </button>
                      );
                    }
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatGrid;
