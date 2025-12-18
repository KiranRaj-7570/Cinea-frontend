const TicketPageSkeleton = () => {
  return (
    <div className="max-w-md mx-auto mt-5 px-4 animate-pulse">
      <div className="bg-[#1a1a1a] rounded-3xl p-6 space-y-6">
        <div className="flex gap-4">
          <div className="w-28 h-40 bg-[#2a2a2a] rounded-xl" />
          <div className="flex-1 space-y-3">
            <div className="h-5 w-3/4 bg-[#2a2a2a] rounded" />
            <div className="h-4 w-1/2 bg-[#2a2a2a] rounded" />
            <div className="h-4 w-1/3 bg-[#2a2a2a] rounded" />
          </div>
        </div>

        <div className="h-8 w-2/3 mx-auto bg-[#2a2a2a] rounded" />
        <div className="h-4 w-1/3 mx-auto bg-[#2a2a2a] rounded" />

        <div className="border-t border-dashed border-[#333]" />

        <div className="flex flex-col items-center gap-3">
          <div className="w-36 h-36 bg-[#2a2a2a] rounded" />
          <div className="h-3 w-32 bg-[#2a2a2a] rounded" />
          <div className="h-3 w-40 bg-[#2a2a2a] rounded" />
        </div>
      </div>
    </div>
  );
};
export default TicketPageSkeleton;