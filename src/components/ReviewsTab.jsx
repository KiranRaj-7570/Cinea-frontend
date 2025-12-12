import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import ReviewItem from "./ReviewItem";

const ReviewsTab = ({ mediaType, tmdbId, poster, title, onToast = () => {} }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);
  const [limit] = useState(8);

  useEffect(() => {
    load();
  }, [sort, page, tmdbId]);

  const load = async () => {
    try {
      const res = await api.get(`/reviews/${mediaType}/${tmdbId}?sort=${sort}&page=${page}&limit=${limit}`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error("Load reviews err", err);
      onToast("Failed to load reviews");
    }
  };

  const createReview = async (rating, text) => {
    if (!user) { onToast("Login to post review"); return; }
    try {
      const res = await api.post("/reviews", { tmdbId, mediaType, rating, text, title, poster });
      onToast("Review posted");
      load();
    } catch (err) {
      console.error("Create review err", err);
      onToast("Failed to post review");
    }
  };

  const handleReply = async (reviewId, text) => {
    try {
      await api.post(`/reviews/${reviewId}/reply`, { text });
      onToast("Replied");
      load();
    } catch (err) {
      console.error("Reply err", err);
      onToast("Failed to reply");
    }
  };

  const handleLike = async (reviewId) => {
    try {
      await api.post(`/reviews/${reviewId}/like`);
      load();
    } catch (err) {
      console.error("Like err", err);
    }
  };

  return (
    <div>
      {/* Create review form */}
      <CreateReviewForm onSubmit={createReview} />

      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-slate-400">Reviews</div>
        <div className="flex items-center gap-2">
          <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="bg-[#0B1120] border border-slate-700 text-slate-300 text-sm px-2 py-1 rounded">
            <option value="recent">Most recent</option>
            <option value="top">Top rated</option>
          </select>
        </div>
      </div>

      <div className="mt-3 space-y-3">
        {reviews.length === 0 ? (
          <p className="text-slate-400">No reviews yet — be the first!</p>
        ) : (
          reviews.map((r) => (
            <ReviewItem key={r._id} review={r} onReply={handleReply} onLike={handleLike} />
          ))
        )}
      </div>

      {/* pagination simple */}
      <div className="mt-4 flex justify-center gap-2">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 bg-[#0B1120] border border-slate-700 text-slate-300 rounded">Prev</button>
        <div className="text-sm text-slate-400 px-3 py-1">Page {page}</div>
        <button onClick={() => setPage((p) => p + 1)} className="px-3 py-1 bg-[#0B1120] border border-slate-700 text-slate-300 rounded">Next</button>
      </div>
    </div>
  );
};

const CreateReviewForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  return (
    <div className="bg-[#0B1120] border border-slate-800 p-4 rounded">
      <div className="flex items-center gap-3">
        <label className="text-sm text-slate-300">Your rating</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="bg-[#020617] text-white px-2 py-1 rounded">
          {[5,4,3,2,1].map((n) => (<option key={n} value={n}>{n} ★</option>))}
        </select>
      </div>

      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Write your review..." className="w-full mt-3 p-2 bg-transparent border border-slate-700 text-white rounded" rows={4} />

      <div className="mt-3 flex gap-2">
        <button onClick={() => { if (text.trim()) { onSubmit(rating, text.trim()); setText(""); setRating(5); } }} className="px-3 py-2 bg-[#FF7A1A] rounded text-black font-semibold">Post Review</button>
        <button onClick={() => { setText(""); setRating(5); }} className="px-3 py-2 border border-slate-700 rounded text-slate-300">Clear</button>
      </div>
    </div>
  );
};

export default ReviewsTab;
