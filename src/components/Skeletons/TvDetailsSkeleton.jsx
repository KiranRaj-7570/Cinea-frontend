const TvDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#050816] text-white animate-pulse">
      {/* HERO */}
      <div className="relative">
        {/* Backdrop */}
        <div className="h-[35vh] sm:h-[42vh] md:h-[48vh] w-full bg-slate-700/30" />

        {/* Overlay content */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 -mt-16 sm:-mt-20 md:-mt-24 relative z-20">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* Poster */}
            <div className="w-32 sm:w-40 md:w-[220px] h-[180px] sm:h-[230px] md:h-[300px] rounded-lg bg-slate-700/40 shrink-0" />

            {/* Info */}
            <div className="flex-1 space-y-4">
              {/* Title */}
              <div className="h-8 w-3/4 bg-slate-600/40 rounded" />

              {/* Meta */}
              <div className="flex flex-wrap gap-3">
                <div className="h-4 w-16 bg-slate-600/30 rounded" />
                <div className="h-4 w-40 bg-slate-600/30 rounded" />
                <div className="h-4 w-24 bg-slate-600/30 rounded" />
              </div>

              {/* Overview */}
              <div className="space-y-2 max-w-2xl">
                <div className="h-4 w-full bg-slate-600/30 rounded" />
                <div className="h-4 w-full bg-slate-600/30 rounded" />
                <div className="h-4 w-5/6 bg-slate-600/30 rounded" />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-4 flex-wrap">
                <div className="h-10 w-36 bg-slate-600/40 rounded-full" />
                <div className="h-10 w-28 bg-slate-600/30 rounded-full" />
                <div className="h-10 w-28 bg-slate-600/20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
        {/* Tabs */}
        <div className="flex gap-2 sm:gap-3 mb-6 overflow-x-auto">
          <div className="h-10 w-28 bg-slate-600/30 rounded-lg" />
          <div className="h-10 w-28 bg-slate-600/20 rounded-lg" />
          <div className="h-10 w-28 bg-slate-600/20 rounded-lg" />
        </div>

        {/* Text */}
        <div className="space-y-3">
          <div className="h-4 w-full bg-slate-600/30 rounded" />
          <div className="h-4 w-full bg-slate-600/30 rounded" />
          <div className="h-4 w-4/5 bg-slate-600/30 rounded" />
        </div>

        {/* Similar row */}
        <div className="mt-10">
          <div className="h-6 w-40 bg-slate-600/40 rounded mb-4" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-40 h-60 bg-slate-700/30 rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TvDetailsSkeleton;
