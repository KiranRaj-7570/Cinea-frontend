const ProfileSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* HEADER */}
      <div className="h-[180px] w-full bg-orange-500" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-14 pb-6 relative">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-0">
          {/* LEFT SECTION */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 w-full md:w-auto">
            {/* Avatar + Name */}
            <div>
              <div className="h-28 w-28 rounded-full bg-slate-700 mb-4 mx-auto sm:mx-0" />
              <div className="h-5 w-40 bg-slate-700 rounded mb-2 ml-5" />
              <div className="h-3 w-56 bg-slate-700 rounded ml-5" />
            </div>

            {/* Followers / Following */}
            <div className="flex items-start gap-8 sm:gap-12 sm:ml-4 sm:mt-10 w-full sm:w-auto">
              <div>
                <div className="h-10 w-16 bg-slate-700 rounded mb-2" />
                <div className="h-4 w-20 bg-slate-700 rounded" />
              </div>
              <div>
                <div className="h-10 w-16 bg-slate-700 rounded mb-2" />
                <div className="h-4 w-20 bg-slate-700 rounded" />
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="h-10 w-32 bg-slate-700 rounded-full mt-2 w-full sm:w-auto" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-12 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Genre */}
          <div className="bg-[#151515] rounded-3xl p-7 border border-white/5 h-[350px]" />

          {/* Watch time */}
          <div className="bg-[#151515] rounded-3xl p-7 border border-white/5 h-[350px]" />

          {/* Top 5 */}
          <div className="bg-[#151515] rounded-3xl p-7 border border-white/5 h-[350px]" />
        </div>

        {/* Recent reviews */}
        <div className="mt-10 bg-[#151515] rounded-3xl p-7 border border-white/5">
          <div className="h-6 w-40 bg-slate-700 rounded mb-6" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 bg-slate-700/30 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
