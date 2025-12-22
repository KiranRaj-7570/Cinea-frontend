const SectionSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="flex gap-4 bg-[#111] border border-white/10 rounded-2xl p-4 animate-pulse"
        >
          <div className="w-24 h-36 bg-[#222] rounded-lg" />

          <div className="flex-1 space-y-3">
            <div className="h-4 w-2/3 bg-[#222] rounded" />
            <div className="h-3 w-1/3 bg-[#222] rounded" />
            <div className="h-3 w-full bg-[#222] rounded" />
            <div className="h-3 w-5/6 bg-[#222] rounded" />

            <div className="flex gap-3 pt-3">
              <div className="h-8 w-24 bg-[#222] rounded-full" />
              <div className="h-8 w-28 bg-[#222] rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionSkeleton;
