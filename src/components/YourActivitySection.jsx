import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import SectionSkeleton from "./Skeletons/SectionSkeleton";
import ActivityCard from "./ActivityCard";

const YourActivitySection = () => {
  const [items, setItems] = useState([]);
  const [fallback, setFallback] = useState(false);
  const [loading, setLoading] = useState(true);
  const isMountedRef = useRef(true);
  const lastFetchRef = useRef(0);

  // Function to fetch activity data
  const fetchActivity = async () => {
    const now = Date.now();
    // Debounce: only fetch if last fetch was more than 1 second ago
    if (now - lastFetchRef.current < 1000) return;
    lastFetchRef.current = now;

    try {
      setLoading(true);
      const res = await api.get("/home/your-activity");
      console.log("API Response:", res.data.items); // DEBUG
      if (isMountedRef.current) {
        setItems(res.data.items || []);
        setFallback(res.data.fallback);
      }
    } catch (err) {
      console.error("Failed to fetch activity:", err);
      if (isMountedRef.current) {
        setFallback(true);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  // Fetch on mount
  useEffect(() => {
    isMountedRef.current = true;
    fetchActivity();
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Refetch when window gains focus
  useEffect(() => {
    const onFocus = () => {
      fetchActivity();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  if (!loading && fallback) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 mt-14 mb-5">
      <h2 className="text-3xl md:text-4xl anton text-[#F6E7C6] mb-5">
        Your Activity
      </h2>
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen h-[5px] bg-black/20 shadow-md mt-5 mb-5" />
      {loading ? (
        <SectionSkeleton />
      ) : (
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {items.map((item, idx) => (
            <ActivityCard key={item.tmdbId ? `${item.mediaType}-${item.tmdbId}` : idx} item={item} />
          ))}
        </div>
      )}
    </section>
  );
};

export default YourActivitySection;