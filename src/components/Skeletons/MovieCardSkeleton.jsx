const MovieCardSkeleton = () => {
  return (
    <div className=" rounded-2xl p-2 animate-pulse">
      {/* Poster */}
      <div className="h-[280px] bg-[#2a2a2a] rounded-2xl" />

      {/* Text */}
      <div className="mt-4 space-y-2 p-2">
        <div className="h-4 w-3/4 bg-[#2a2a2a] rounded" />
        <div className="h-3 w-1/3 bg-[#2a2a2a] rounded" />
        <div className="h-3 w-2/3 bg-[#2a2a2a] rounded" />
      </div>
    </div>
  );
};

export default MovieCardSkeleton;
