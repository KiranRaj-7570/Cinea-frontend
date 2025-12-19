const ProfileSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* HEADER */}
      <div className="h-[180px] bg-orange-500" />

      <div className="max-w-6xl mx-auto px-6 -mt-14">
        <div className="flex justify-between">
          {/* Avatar + Name */}
          <div className="flex gap-10">
            <div>
              <div className="h-28 w-28 rounded-full bg-slate-700 mb-4" />
              <div className="h-5 w-40 bg-slate-700 rounded mb-2 ml-5" />
              <div className="h-3 w-56 bg-slate-700 rounded ml-5" />
            </div>

            {/* Followers */}
            <div className="flex gap-12 mt-10">
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
          <div className="h-10 w-32 bg-slate-700 rounded-full mt-2" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Genre donut */}
          <div className="bg-[#111] rounded-xl p-5 h-[300px]" />

          {/* Watch time */}
          <div className="bg-[#111] rounded-xl p-5 h-[260px]" />
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top 5 */}
          <div className="bg-[#111] rounded-xl p-5 h-[220px]" />

          {/* Recent reviews */}
          <div className="bg-[#111] rounded-xl p-5 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 bg-slate-700/40 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
