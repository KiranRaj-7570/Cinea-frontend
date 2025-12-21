const NotificationSkeleton = () => {
  return (
    <div className="space-y-3 p-4 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-lg bg-[#1a1a1a] border border-white/5"
        >
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-[#2a2a2a]" />

            {/* Text */}
            <div className="flex-1 space-y-2">
              <div className="h-3 w-3/4 bg-[#2a2a2a] rounded" />
              <div className="h-2 w-1/3 bg-[#2a2a2a] rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSkeleton;
