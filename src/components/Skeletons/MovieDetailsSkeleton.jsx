const MovieDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#050816] text-white animate-pulse">
      {/* HERO */}
      <div className="relative">
        {/* Backdrop */}
        <div className="h-[30vh] sm:h-[40vh] md:h-[50vh] lg:h-[55vh] w-full bg-slate-700/30" />

        {/* Content overlay */}
        <div className="w-full px-4 sm:px-6 lg:px-8 -mt-20 sm:-mt-24 md:-mt-32 relative z-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8">
              {/* Poster */}
              <div className="w-32 sm:w-40 md:w-48 shrink-0 rounded-lg overflow-hidden bg-slate-700/40 h-[180px] sm:h-[230px] md:h-[280px]" />

              {/* Info */}
              <div className="flex-1 space-y-4">
                {/* Title */}
                <div className="h-8 w-2/3 bg-slate-600/40 rounded" />

                {/* Meta */}
                <div className="flex gap-3">
                  <div className="h-4 w-20 bg-slate-600/30 rounded" />
                  <div className="h-4 w-32 bg-slate-600/30 rounded" />
                  <div className="h-4 w-16 bg-slate-600/30 rounded" />
                </div>

                {/* Overview */}
                <div className="space-y-2">
                  <div className="h-4 w-full bg-slate-600/30 rounded" />
                  <div className="h-4 w-full bg-slate-600/30 rounded" />
                  <div className="h-4 w-4/5 bg-slate-600/30 rounded" />
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-4">
                  <div className="h-10 w-36 bg-slate-600/40 rounded-lg" />
                  <div className="h-10 w-44 bg-slate-600/30 rounded-lg" />
                  <div className="h-10 w-28 bg-slate-600/20 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-3 mb-6">
            <div className="h-10 w-28 bg-slate-600/30 rounded-t-lg" />
            <div className="h-10 w-28 bg-slate-600/20 rounded-t-lg" />
          </div>

          {/* Text */}
          <div className="space-y-3">
            <div className="h-4 w-full bg-slate-600/30 rounded" />
            <div className="h-4 w-full bg-slate-600/30 rounded" />
            <div className="h-4 w-5/6 bg-slate-600/30 rounded" />
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
    </div>
  );
};

export default MovieDetailsSkeleton;
