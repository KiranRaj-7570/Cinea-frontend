import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import ReviewItem from "./ReviewItem";

const ReviewsTab = ({
  mediaType,
  tmdbId,
  poster,
  title,
  onToast = () => {},
  onReviewCreated,
  onWatchlistChange = () => {},
  onCompleted = () => {},
}) => {
  const { user } = useContext(AuthContext);

  const [reviews, setReviews] = useState([]);
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load reviews when sort/page/tmdbId changes
  useEffect(() => {
    load();
  }, [sort, page, tmdbId]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/reviews/${mediaType}/${tmdbId}?sort=${sort}&page=${page}&limit=${limit}`
      );
      setReviews(res.data.reviews || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Load reviews err", err);
      onToast("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (rating, text) => {
  if (!user) {
    onToast("Login to post review");
    return;
  }

  try {
    const res = await api.post("/reviews", {
      tmdbId,
      mediaType,
      rating,
      text,
      title,
      poster,
    });

    const newReview = res.data.review;

    // 🔥 OPTIMISTIC UI UPDATE (NO REFRESH)
    setReviews((prev) => [newReview, ...prev]);
    setTotal((t) => t + 1);

    onToast("Review posted");

    // Ensure sort is recent (without reload)
    setSort("recent");
    setPage(1);

    // 🔁 WATCHLIST SYNC (unchanged)
    onWatchlistChange(true);
    try {
      await api.post("/watchlist", { tmdbId, mediaType, title, poster });
    } catch {}

    // 🔁 AUTO COMPLETE (unchanged)
    try {
      await api.post(`/watchlist/${mediaType}/${Number(tmdbId)}/complete`);
      onCompleted(true);
    } catch (err) {
      console.error("Auto-complete error:", err);
    }

    if (onReviewCreated) {
      onReviewCreated();
    }
  } catch (err) {
    console.error("Create review err", err);
    onToast("Failed to post review");
  }
};


  const handleReply = async (reviewId, text) => {
    try {
      await api.post(`/reviews/${reviewId}/reply`, { text });
      onToast("Replied");
      setTimeout(() => load(), 300);
    } catch (err) {
      console.error("Reply err", err);
      onToast("Failed to reply");
    }
  };

  const handleLike = async (reviewId) => {
    try {
      await api.post(`/reviews/${reviewId}/like`);
      // Update likes count locally without full refresh
      setReviews((prev) =>
        prev.map((r) => {
          if (r._id === reviewId) {
            const liked = r.likes?.some((id) => id === user._id);
            if (liked) {
              return {
                ...r,
                likes: r.likes.filter((id) => id !== user._id),
              };
            } else {
              return {
                ...r,
                likes: [...(r.likes || []), user._id],
              };
            }
          }
          return r;
        })
      );
    } catch (err) {
      console.error("Like err", err);
    }
  };

  const handleDelete = (reviewId) => {
    setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    onToast("Review deleted");
  };

  const handleEdit = (reviewId, updates) => {
    setReviews((prev) =>
      prev.map((r) => (r._id === reviewId ? { ...r, ...updates } : r))
    );
    onToast("Review updated");
  };

  // Calculate if there are more pages
  const hasNextPage = page * limit < total;
  const hasPrevPage = page > 1;

  return (
    <div>
      {/* CREATE REVIEW */}
      <CreateReviewForm onSubmit={createReview} />

      <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-sm text-slate-400">
          {total > 0 ? `${total} Reviews` : "Reviews"}
        </div>

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="bg-[#222222] border border-slate-700 text-[#F6E7C6] text-sm px-2 py-1 rounded w-full sm:w-auto"
        >
          <option value="recent">Most recent</option>
          <option value="top">Top rated</option>
        </select>
      </div>

      <div className="mt-3 space-y-3">
        {loading ? (
          <p className="text-slate-400 text-sm">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-slate-400 text-sm">
            No reviews yet — be the first!
          </p>
        ) : (
          reviews.map((r) => (
            <ReviewItem
              key={r._id}
              review={r}
              onReply={handleReply}
              onLike={handleLike}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))
        )}
      </div>

      {/* PAGINATION */}
      {total > limit && (
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 bg-[#0B1120] border border-slate-700 text-slate-300 rounded text-sm hover:bg-slate-800 transition disabled:opacity-50"
            disabled={!hasPrevPage}
          >
            Prev
          </button>

          <div className="text-sm text-slate-400 px-3 py-1">
            Page {page} of {Math.ceil(total / limit)}
          </div>

          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-[#0B1120] border border-slate-700 text-slate-300 rounded text-sm hover:bg-slate-800 transition disabled:opacity-50"
            disabled={!hasNextPage}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const CreateReviewForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  return (
    <div className="bg-[#1e1e1e] border border-slate-800 p-3 sm:p-4 rounded-lg poppins-regular">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <label className="text-sm text-[#F6E7C6]">Your rating</label>

        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="bg-[#3f3f3f] text-[#F6E7C6] px-2 py-1 rounded text-sm"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} ★
            </option>
          ))}
        </select>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your review..."
        className="w-full mt-3 p-2 bg-transparent border border-slate-700 text-[#F6E7C6] rounded text-sm"
        rows={3}
      />

      <div className="mt-3 flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => {
            if (text.trim()) {
              onSubmit(rating, text.trim());
              setText("");
              setRating(5);
            }
          }}
          className="px-4 py-2 bg-[#FF7A1A] rounded text-black  text-sm hover:bg-orange-600 transition"
        >
          Post Review
        </button>

        <button
          onClick={() => {
            setText("");
            setRating(5);
          }}
          className="px-4 py-2 border border-slate-700 rounded text-[#F6E7C6] text-sm hover:bg-slate-800 transition"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default ReviewsTab;