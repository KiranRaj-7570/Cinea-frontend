const SearchPageSkeleton = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          {/* Poster skeleton */}
          <div className="relative rounded-lg overflow-hidden bg-[#0B1120] aspect-2/3">
            <div className="absolute inset-0 bg-slate-700/40" />
          </div>

          {/* Text skeleton */}
          <div className="mt-2 sm:mt-3 space-y-2">
            <div className="h-4 bg-slate-600/40 rounded w-5/6" />
            <div className="h-3 bg-slate-600/30 rounded w-3/5" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchPageSkeleton;
