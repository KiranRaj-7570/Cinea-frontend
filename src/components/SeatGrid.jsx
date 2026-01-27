import { useEffect, useState, useRef } from "react";

const SeatGrid = ({
  layout = [],
  bookedSeats,
  lockedSeats,
  selectedSeats,
  setSelectedSeats,
}) => {
  const MAX_SEATS = 10;
  const [scale, setScale] = useState(1);
  const containerRef = useRef(null);

  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId) || lockedSeats.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= MAX_SEATS) return;
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  // Handle pinch zoom on touch devices
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastDistance = 0;

    const handleTouchMove = (e) => {
      if (e.touches.length !== 2) return;

      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      if (lastDistance === 0) {
        lastDistance = distance;
        return;
      }

      const scaleChange = distance / lastDistance;
      setScale((prev) =>
        Math.max(0.6, Math.min(2.5, prev * scaleChange))
      );
      lastDistance = distance;
      e.preventDefault();
    };

    const handleTouchEnd = () => {
      lastDistance = 0;
    };

    // Handle mouse wheel zoom (desktop)
    const handleWheel = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      setScale((prev) =>
        Math.max(0.6, Math.min(2.5, prev - e.deltaY * 0.005))
      );
    };

    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd);
    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="mt-4 overflow-auto pb-4 w-full"
      style={{ height: "600px" }}
    >
      <div
        className="inline-flex justify-center gap-24 px-4 py-4 w-full min-w-max"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          transition: "transform 0.2s ease-out",
        }}
      >
        {[0, 1].map((block) => (
          <div key={block} className="space-y-3">
            {layout.map((row) => {
              const half = Math.ceil(row.seats / 2);
              const start = block === 0 ? 1 : half + 1;
              const end = block === 0 ? half : row.seats;
              return (
                <div key={`${row.row}-${block}`} className="flex items-center gap-3">
                  {block === 0 && (
                    <span className="w-4 text-slate-400 text-sm">
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
                      const isSelected = selectedSeats.includes(seatId);
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
                              "border-[#555] text-[#ddd] hover:border-[#FF7A1A] hover:scale-110"
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