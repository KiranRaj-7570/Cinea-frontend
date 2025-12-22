import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import SectionSkeleton from "./Skeletons/SectionSkeleton";
import { StarIcon } from "lucide-react";

const GlobalReviewsSection = () => {
  const scrollRef = useRef(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 1️⃣ DATA FETCH (unchanged logic)
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await api.get("/home/global-reviews");
        mounted && setItems(res.data.items || []);
      } catch {
        mounted && setItems([]);
      } finally {
        mounted && setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  // 2️⃣ MOUSE DRAG SCROLL (DESKTOP)
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
  }, [items]);

  if (!loading && !items.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 mt-14 mb-5">
      <h2 className="text-3xl md:text-4xl anton text-[#F6E7C6] mb-5">
        Most Reviewed on Cinéa
      </h2>
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen h-[5px] bg-black/20 shadow-md mt-5 mb-5" />
      {loading ? (
        <SectionSkeleton />
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar pb-3 cursor-grab select-none"
        >
          {items.map((m) => (
            <div
              key={`${m.mediaType}-${m.tmdbId}`}
              className="
        min-w-[85%]
        sm:min-w-[48%]
        lg:min-w-[32%]
        xl:min-w-[24%]
        bg-[#F6E7C6]
        border border-white/10
        rounded-2xl
        flex
        overflow-hidden
        hover:border-[#FF7A1A]/40
        transition
      "
            >
              <img
                draggable={false}
                src={m.poster}
                alt={m.title}
                onClick={() =>
                  navigate(
                    m.mediaType === "tv"
                      ? `/series/${m.tmdbId}`
                      : `/movie/${m.tmdbId}`
                  )
                }
                className="w-[110px] h-40 object-cover cursor-pointer shrink-0"
              />

              <div className="p-4 flex flex-col justify-between min-w-0">
                <div>
                  <h3 className="text-xl md:text-2xl anton text-[#222222] truncate">
                    {m.title}
                  </h3>

                  <p className="text-xs md:text-sm text-black mt-1 antonio">
                    <StarIcon
                      className="inline mr-1 border-0 outline-0 mb-1 "
                      size={14}
                      md:size={24}
                      color="#ff8636"
                      fill="#ff8636"
                    />{" "}
                    {Number(m.avgRating).toFixed(1)} · {m.reviewCount} reviews
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate(
                      m.mediaType === "tv"
                        ? `/series/${m.tmdbId}`
                        : `/movie/${m.tmdbId}`
                    )
                  }
                  className="mt-3 self-start px-4 py-1.5 rounded-full bg-[#222] border border-white/10 text-xs text-[#F6E7C6] hover:bg-[#ff6f08] transition"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default GlobalReviewsSection;
