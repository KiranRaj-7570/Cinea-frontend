import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const SearchPage = () => {
  const [params] = useSearchParams();
  const query = params.get("q") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const getYear = (item) => {
    return (
      item.release_date?.split("-")[0] ||
      item.first_air_date?.split("-")[0] ||
      "N/A"
    );
  };

 
  const sortResults = (list, q) => {
    const lower = q.toLowerCase();

    return list.sort((a, b) => {
      const nameA = (a.title || a.name).toLowerCase();
      const nameB = (b.title || b.name).toLowerCase();

      let scoreA = 0;
      let scoreB = 0;

     
      if (nameA.startsWith(lower)) scoreA += 10000;
      if (nameB.startsWith(lower)) scoreB += 10000;

      
      if (nameA.includes(lower)) scoreA += 5000;
      if (nameB.includes(lower)) scoreB += 5000;

   
      scoreA += (a.popularity || 0) * 10;
      scoreB += (b.popularity || 0) * 10;

  
      scoreA += (a.vote_average || 0) * 100;
      scoreB += (b.vote_average || 0) * 100;

      return scoreB - scoreA; 
    });
  };

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [movieRes, tvRes] = await Promise.all([
          api.get(`/movies/search?query=${encodeURIComponent(query)}`),
          api.get(`/tvshows/search?query=${encodeURIComponent(query)}`),
        ]);

        const movies = (movieRes.data.results || []).map((m) => ({
          ...m,
          media_type: "movie",
        }));

        const series = (tvRes.data.results || []).map((s) => ({
          ...s,
          media_type: "tv",
        }));

        
        const map = new Map();
        [...movies, ...series].forEach((item) => {
          map.set(`${item.media_type}-${item.id}`, item);
        });

        const unique = Array.from(map.values());
        const sorted = sortResults(unique, query);

        setResults(sorted);
      } catch (err) {
        console.error("Search Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  return (
    <>
      <Navbar />

      <div className="pt-28 min-h-screen bg-[#050816] text-white px-6">
        <h1 className="text-3xl font-bold mb-6">
          Search Results for{" "}
          <span className="text-orange-400">"{query}"</span>
        </h1>

        {loading ? (
          <p className="text-slate-300">Loading...</p>
        ) : results.length === 0 ? (
          <p className="text-slate-400">No results found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {results.map((item) => {
              const title = item.title || item.name;
              const year = getYear(item);
              const isMovie = item.media_type === "movie";

              const image = item.poster_path || item.backdrop_path;

              const imageURL = image
                ? `https://image.tmdb.org/t/p/w500${image}`
                : "https://via.placeholder.com/500x750?text=No+Image";

              return (
                <div key={`${item.media_type}-${item.id}`} className="cursor-pointer group">
                  <div
                    className={`w-full overflow-hidden rounded-xl bg-slate-800 
                    ${isMovie ? "aspect-2/3" : "aspect-video"} 
                    group-hover:opacity-80 transition`}
                  >
                    <img
                      src={imageURL}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <p className="mt-2 text-sm font-semibold line-clamp-1">{title}</p>
                  <p className="text-xs text-slate-400">
                    {year} • {isMovie ? "Movie" : "Series"}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchPage;