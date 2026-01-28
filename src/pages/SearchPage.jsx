import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SearchPageSkeleton from "../components/Skeletons/SearchPageSkeleton";

const SearchPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
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

  const handleCardClick = (item) => {
    const isMovie = item.media_type === "movie";
    if (isMovie) navigate(`/movie/${item.id}`);
    else navigate(`/series/${item.id}`);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-linear-to-b from-[#2f2f2f] via-[#111] to-[#141414] text-white">
        <div className="pt-26 sm:pt-24 md:pt-28 px-3 sm:px-4 lg:px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 sm:mb-12">
              <h1 className="text-2xl sm:text-3xl md:text-4xl anton text-[#F6E7C6] tracking-wide">
                Search Results for{" "}
                <span className="text-[#FF7A1A]">"{query}"</span>
              
              </h1>
              {!loading && results.length > 0 && (
                <p className="text-sm text-slate-400 mt-2 reem-kufi">
                  Found {results.length} result{results.length !== 1 ? "s" : ""}
                </p>
              )}
              <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen h-[5px] bg-black/20 shadow-md mt-4" />
            </div>
            {/* Loading State */}
            {loading ? (
              <SearchPageSkeleton count={18} />
            ) : results.length === 0 ? (
              /* No Results */
              <div className="flex items-center justify-center py-20">
                <p className="text-slate-400 text-lg">
                  No results found for "{query}"
                </p>
              </div>
            ) : (
              /* Results Grid */
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
                {results.map((item) => {
                  const title = item.title || item.name;
                  const year = getYear(item);
                  const isMovie = item.media_type === "movie";
                  const rating = (item.vote_average || 0).toFixed(1);

                  const posterPath = item.poster_path;
                  const imageURL = posterPath
                    ? `https://image.tmdb.org/t/p/w342${posterPath}`
                    : "/no-poster.png";

                  return (
                    <div
                      key={`${item.media_type}-${item.id}`}
                      onClick={() => handleCardClick(item)}
                      className="group cursor-pointer"
                    >
                      {/* Card Container */}
                      <div className="relative rounded-lg overflow-hidden bg-[#0B1120] aspect-2/3 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        {/* Image */}
                        <img
                          src={imageURL}
                          alt={title}
                          className="w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-300"
                          loading="lazy"
                        />

                        {/* Overlay on Hover */}
                        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-end justify-end p-3">
                          <div className="w-full">
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-xs font-semibold bg-[#FF7A1A] text-black px-2 py-1 rounded">
                                {isMovie ? "MOVIE" : "SERIES"}
                              </span>
                              <div className="text-xs text-yellow-300 font-semibold flex items-center gap-1">
                                ★ {rating}
                              </div>
                            </div>
                            <p className="text-xs text-[#F6E7C6] font-semibold line-clamp-2">
                              {title}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Info Section */}
                      <div className="mt-2 sm:mt-3">
                        <p className="text-xs sm:text-sm font-semibold line-clamp-2 text-white group-hover:text-[#FF7A1A] transition-colors">
                          {title}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {year} • {isMovie ? "Movie" : "Series"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default SearchPage;
