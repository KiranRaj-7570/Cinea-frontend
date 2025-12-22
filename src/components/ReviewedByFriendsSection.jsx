import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import SectionSkeleton from "./Skeletons/SectionSkeleton";
import FriendReviewCard from "./FriendReviewCard";
import GlobalReviewsSection from "./GlobalReviewsSection";

const ReviewedByFriendsSection = () => {
  const scrollRef = useRef(null);
  const [items, setItems] = useState([]);
  const [fallback, setFallback] = useState(false);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  let mounted = true;

  const load = async () => {
    try {
      const res = await api.get("/home/reviewed-by-friends");

      if (!mounted) return;

      setItems(res.data.items || []);
      setFallback(res.data.fallback);
    } catch (err) {
      console.error("Reviewed by friends failed", err);
      setFallback(true);
    } finally {
      mounted && setLoading(false);
    }
  };

  load();

  return () => {
    mounted = false;
  };
}, []);

useEffect(() => {
  const el = scrollRef.current;
  if (!el) return;

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  const onMouseDown = (e) => {
    isDown = true;
    el.classList.add("cursor-grabbing");
    startX = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
  };

  const onMouseLeave = () => {
    isDown = false;
    el.classList.remove("cursor-grabbing");
  };

  const onMouseUp = () => {
    isDown = false;
    el.classList.remove("cursor-grabbing");
  };

  const onMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.2;
    el.scrollLeft = scrollLeft - walk;
  };

  el.addEventListener("mousedown", onMouseDown);
  el.addEventListener("mouseleave", onMouseLeave);
  el.addEventListener("mouseup", onMouseUp);
  el.addEventListener("mousemove", onMouseMove);

  return () => {
    el.removeEventListener("mousedown", onMouseDown);
    el.removeEventListener("mouseleave", onMouseLeave);
    el.removeEventListener("mouseup", onMouseUp);
    el.removeEventListener("mousemove", onMouseMove);
  };
}, [items]); // ✅ attach after items render


 if (!loading && fallback) {
  return <GlobalReviewsSection />;
}

  return (
    <section className="max-w-7xl mx-auto px-4 mt-14 mb-5">
      <h2 className="text-3xl md:text-4xl anton text-[#F6E7C6] mb-5">
        Reviewed by Friends
      </h2>
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen h-[5px] bg-black/20 shadow-md mt-5 mb-5" />
      {loading ? (
        <SectionSkeleton />
      ) : (
       <div
  ref={scrollRef}
  className="flex gap-5 overflow-x-auto no-scrollbar pb-2 cursor-grab select-none"
>
          {items.map((item) => (
            <FriendReviewCard
              key={item.reviewId}
              review={item}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ReviewedByFriendsSection;
