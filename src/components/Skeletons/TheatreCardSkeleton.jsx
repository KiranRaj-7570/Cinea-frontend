import ShowTimeSkeleton from "./ShowTimeSkeleton";

const TheatreCardSkeleton = () => {
  return (
    <div className="bg-[#151515] border border-white/10 rounded-2xl p-5 animate-pulse">
      {/* Theatre name */}
      <div className="h-5 w-48 bg-[#2a2a2a] rounded mb-4" />

      {/* Showtimes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-2 gap-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <ShowTimeSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export default TheatreCardSkeleton;
