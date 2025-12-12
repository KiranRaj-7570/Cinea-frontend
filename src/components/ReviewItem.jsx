import { useState } from "react";


const ReviewItem = ({ review, onReply, onLike }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReply = () => {
    if (!replyText.trim()) return;
    onReply(review._id, replyText.trim());
    setReplyText("");
    setShowReply(false);
  };

  return (
    <div className="bg-[#0B1120] border border-slate-800 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center text-sm text-white">
          {review.userAvatar ? <img src={review.userAvatar} alt="avatar" className="w-full h-full object-cover" /> : (review.username?.[0] || "U")}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-[#F6E7C6]">{review.username}</div>
              <div className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleString()}</div>
            </div>
            <div className="text-sm text-yellow-400">{"★".repeat(Math.round(review.rating))}</div>
          </div>

          <p className="mt-2 text-sm text-slate-200">{review.text}</p>

          {review.replies && review.replies.length > 0 && (
            <div className="mt-3 space-y-2">
              {review.replies.map((r, idx) => (
                <div key={idx} className="text-xs text-slate-300 bg-slate-900 p-2 rounded">
                  <div className="font-semibold text-xs">{r.username}</div>
                  <div className="text-xs">{r.text}</div>
                </div>
              ))}
            </div>
          )}

         
          <div className="mt-3 flex items-center gap-3">
            <button onClick={() => setShowReply((s) => !s)} className="text-xs text-slate-400 hover:text-slate-200">Reply</button>
            <button onClick={() => onLike(review._id)} className="text-xs text-slate-400 hover:text-slate-200">
              {review.likes?.length || 0} Likes
            </button>
          </div>

          {showReply && (
            <div className="mt-2">
              <textarea className="w-full bg-transparent border border-slate-700 rounded p-2 text-sm text-white" value={replyText} onChange={(e) => setReplyText(e.target.value)} />
              <div className="flex gap-2 mt-2">
                <button onClick={handleReply} className="px-3 py-1 rounded bg-[#FF7A1A] text-black text-sm">Send</button>
                <button onClick={() => setShowReply(false)} className="px-3 py-1 rounded bg-transparent border border-slate-700 text-slate-300 text-sm">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
