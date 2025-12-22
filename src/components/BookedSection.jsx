import { useEffect, useState } from "react";
import api from "../api/axios";
import SectionSkeleton from "./Skeletons/SectionSkeleton";
import NowInCinemasSection from "./NowInCinemasSection";
import BookedHeroCard from "./BookedHeroCard";

const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

const BookedSection = () => {
  const [items, setItems] = useState([]);
  const [fallback, setFallback] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await api.get("/home/booked");

        setFallback(res.data.fallback === true);

        if (!res.data?.items?.length) {
          setItems([]);
          return;
        }
        const enriched = await Promise.all(
          res.data.items.map(async (b) => {
            try {
              const tmdb = await api.get(`/movies/details/${b.tmdbId}`);

              return {
                tmdbId: b.tmdbId,
                mediaType: tmdb.data.mediaType,
                title: tmdb.data.title || tmdb.data.name,
                backdrop: tmdb.data.backdrop_path
                  ? `${TMDB_IMG}${tmdb.data.backdrop_path}`
                  : tmdb.data.poster_path
                  ? `${TMDB_IMG}${tmdb.data.poster_path}`
                  : "/poster-placeholder.png",
              };
            } catch {
              return null;
            }
          })
        );

        if (mounted) {
          setItems(enriched.filter(Boolean));
        }
      } catch (err) {
        console.error("Booked section failed", err);
      } finally {
        mounted && setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (!loading && fallback) {
    return <NowInCinemasSection />;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 mt-14">
      <h2 className="text-3xl md:text-4xl anton text-[#F6E7C6] mb-5">
        Since You Booked This
      </h2>
      <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen h-[5px] bg-black/20 shadow-md mt-5 mb-5" />
      {loading ? (
        <SectionSkeleton />
      ) : (
        <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2">
          {items.map((item) => (
            <BookedHeroCard key={item.tmdbId} item={item} />
          ))}
        </div>
      )}
    </section>
  );
};

export default BookedSection;
