const ShowTimeSkeleton = () => {
  return (
    <div className="bg-[#151515] border border-white/10 rounded-2xl p-5 animate-pulse">
      <div className="h-5 w-48 bg-white/10 rounded mb-6" />

      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-10 rounded-xl bg-white/10"
          />
        ))}
      </div>
    </div>
  );
};

export default ShowTimeSkeleton;
