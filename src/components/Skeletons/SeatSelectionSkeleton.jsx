const SeatSelectionSkeleton = () => {
  return (
    <div className="animate-pulse">

      {/* 🎬 Title */}
      <div className="px-6 md:px-16 lg:px-36 mt-6">
        <div className="h-10 w-56 bg-white/10 rounded mb-3" />
        <div className="h-6 w-40 bg-white/10 rounded" />
      </div>

      {/* 🎟 Legend */}
      <div className="px-6 md:px-16 lg:px-56 mt-10">
        <div className="flex gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-5 h-5 bg-white/10 rounded" />
              <div className="w-16 h-4 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* 💺 Seat Grid */}
      <div className="mt-12 flex justify-center">
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, row) => (
            <div key={row} className="flex gap-2">
              {Array.from({ length: 10 }).map((_, seat) => (
                <div
                  key={seat}
                  className="w-9 h-8 bg-white/10 rounded-md"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionSkeleton;
