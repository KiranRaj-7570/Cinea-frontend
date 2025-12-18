import Navbar from "../components/Navbar";
import Row from "../components/Row";
import Footer from "../components/Footer"
import { useNavigate } from "react-router-dom";

const Explore = () => {
 const navigate = useNavigate();

  const handleSelect = (item) => {
    const isTV = item.media_type === "tv" ||
             (!!item.first_air_date && !item.release_date);

    if (isTV) navigate(`/series/${item.id}`);
    else navigate(`/movie/${item.id}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#2f2f2f] via-[#111] to-[#141414] text-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 pt-28 pb-10">

        {/* MOVIE SECTION */}
        <h1 className="text-3xl  tracking-wide mb-6  anton text-[#F6E7C6]">
          Explore Movies & Series
        </h1>
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen h-[5px] bg-black/20 shadow-md mt-5 mb-5" />

        <Row
          title="Trending Movies"
          fetchUrl="/movies/trending"
          cardType="poster"
          onSelect={handleSelect}
        />

        <Row
          title="Popular Movies"
          fetchUrl="/movies/popular"
          cardType="poster"
          onSelect={handleSelect}
        />

        <Row
          title="Top Rated Movies"
          fetchUrl="/movies/top-rated"
          cardType="poster"
          onSelect={handleSelect}
        />

        {/* TV SECTION */}
        <Row
          title="Trending Series"
          fetchUrl="/tvshows/trending"
          cardType="backdrop"
          onSelect={handleSelect}
        />

        <Row
          title="Popular Series"
          fetchUrl="/tvshows/popular"
          cardType="backdrop"
          onSelect={handleSelect}
        />

        <Row
          title="Top Rated Series"
          fetchUrl="/tvshows/top-rated"
          cardType="backdrop"
          onSelect={handleSelect}
        />

      </div>
      <Footer />
    </div>
  );
};

export default Explore;