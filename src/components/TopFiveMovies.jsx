const TopFiveMovies = ({ movies = [], loading }) => {
  if (loading) {
    return <p className="text-sm text-slate-400">Loading...</p>;
  }

  if (!movies.length) {
    return <p className="text-sm text-slate-500">No top movies yet</p>;
  }

  return (
    <ul className="space-y-3">
      {movies.map((movie, i) => (
        <li key={movie.tmdbId} className="flex items-center gap-3">
          <span className="text-[16px] text-[#F6E7C6]">{i + 1}</span>

          <img
            src={movie.poster}
            alt={movie.title}
            className="w-10 h-14 rounded object-cover"
          />

          <div className="flex-1">
            <p className="text-sm font-semibold text-[#FF7A1A]">{movie.title}</p>
            <p className="text-xs text-[#F6E7C6]">
              Rating: {movie.rating}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TopFiveMovies;
