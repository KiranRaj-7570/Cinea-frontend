const BookingCardSkeleton = () => {
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-[#151515] animate-pulse">
      {/* Poster */}
      <div className="w-20 h-28 bg-gray-700 rounded-lg" />

      {/* Info */}
      <div className="flex-1 space-y-3">
        <div className="h-4 w-2/3 bg-gray-700 rounded" />
        <div className="h-3 w-1/2 bg-gray-700 rounded" />
        <div className="h-3 w-1/3 bg-gray-700 rounded" />
        <div className="h-3 w-1/4 bg-gray-700 rounded" />
      </div>

      {/* Status */}
      <div className="h-6 w-16 bg-gray-700 rounded-full" />
    </div>
  );
};

export default BookingCardSkeleton;
