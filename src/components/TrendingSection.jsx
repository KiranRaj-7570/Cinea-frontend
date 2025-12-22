import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import TrendingCard from "./TrendingCard";
import SectionSkeleton from "./Skeletons/SectionSkeleton";

const CARD_WIDTH = 220;
const GAP = 16;

const TrendingSection = () => {
  const [items, setItems] = useState([]);
  const [watchlistIds, setWatchlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  // Load trending
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/home/trending");
        setItems((res.data.items || []).slice(0, 6));
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Load watchlist ids ONCE
  useEffect(() => {
    api.get("/home/watchlist/ids").then((res) => {
      setWatchlistIds(new Set(res.data.ids || []));
    });
  }, []);

  // Auto scroll
  useEffect(() => {
    if (!scrollRef.current || items.length <= 2) return;

    const el = scrollRef.current;
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % items.length;
      el.scrollTo({
        left: index * (CARD_WIDTH + GAP),
        behavior: "smooth",
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [items]);

  return (
    <section className="max-w-7xl mx-auto px-4">
      <h2 className="text-3xl md:text-4xl anton text-[#F6E7C6] mb-5">
        Trending Right Now
      </h2>

      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen h-[5px] bg-black/20 shadow-md mt-5 mb-5" />

      {loading ? (
        <SectionSkeleton />
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {items.map((item) => (
            <div
              key={`${item.mediaType}-${item.tmdbId}`}
              style={{ scrollSnapAlign: "start" }}
            >
              <TrendingCard
                item={item}
                inWatchlist={watchlistIds.has(item.tmdbId)}
                onToggleWatchlist={(tmdbId, next) => {
                  setWatchlistIds((prev) => {
                    const updated = new Set(prev);
                    next ? updated.add(tmdbId) : updated.delete(tmdbId);
                    return updated;
                  });
                }}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default TrendingSection;
