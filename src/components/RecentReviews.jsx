const RecentReviews = ({ reviews = [], loading }) => {
  if (loading) {
    return <p className="text-sm text-slate-400">Loading reviews...</p>;
  }

  if (!reviews.length) {
    return <p className="text-sm text-slate-500">No reviews yet</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div
          key={r._id}
          className="bg-[#111] p-4 rounded-xl border border-white/5"
        >
          <p className="text-sm font-semibold text-[#FF7A1A]">{r.title}</p>
          <p className="text-xs text-[#F6E7C6] mb-2">
            Rating: {r.rating}
          </p>
          <p className="text-sm text-slate-200 line-clamp-3">{r.text}</p>
        </div>
      ))}
    </div>
  );
};

export default RecentReviews;
