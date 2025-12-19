import { useNavigate } from "react-router-dom";

const RecentReviews = ({ reviews = [], loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return <p className="text-sm text-slate-400">Loading reviews...</p>;
  }

  if (!reviews.length) {
    return <p className="text-sm text-slate-500">No reviews yet</p>;
  }

  const handleClick = (review) => {
    if (review.mediaType === "tv") {
      navigate(`/series/${review.tmdbId}`);
    } else {
      navigate(`/movie/${review.tmdbId}`);
    }
  };

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div
          key={r._id}
          onClick={() => handleClick(r)}
          className="bg-[#111] p-4 rounded-xl border border-white/5 cursor-pointer hover:opacity-90 transition"
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
