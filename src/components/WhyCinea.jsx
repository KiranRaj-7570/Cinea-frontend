import DiscoverFilmsIcon from "./icons/DiscoverFilmsIcon";
import BookTicketsIcon from "./icons/BookTicketsIcon";
import FollowPeopleIcon from "./icons/FollowPeopleIcon";
import WriteReviewsIcon from "./icons/WriteReviewsIcon";
import WatchlistIcon from "./icons/WatchlistIcon";
import Hero2Image from "../assets/hero2.jpg";

export default function WhyCinea() {
  return (
    <section
      className="relative min-h-screen w-full py-24 text-white"
      style={{
        backgroundImage: `url(${Hero2Image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto text-center px-4">
        <h2 className="anton text-[46px] md:text-[70px] text-[#F6E7C6] mb-6">
          Why Cinéa?
        </h2>

        <p
          className="reem-kufi text-[#E6D1D2]
          text-[18px] md:text-[22px]
          leading-[30px] md:leading-[38px]
          max-w-[950px] mx-auto
          mb-20 px-4"
        >
          Cinéa is a modern movie-social platform where film lovers can write
          reviews, build personal watchlists, and chat with fellow cinemates. It
          brings together everything you love about movies — discovering,
          discussing, and sharing — all in one simple, stylish space.
        </p>

        {/* Icon Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          
          <div className="flex flex-col items-center text-center gap-4">
            <DiscoverFilmsIcon className="w-16 h-16" />
            <h3 className="reem-kufi text-white text-[24px]">Discover Films</h3>
          </div>

          <div className="flex flex-col items-center text-center gap-4">
            <BookTicketsIcon className="w-16 h-16" />
            <h3 className="reem-kufi text-white text-[24px]">Book Tickets</h3>
          </div>

          <div className="flex flex-col items-center text-center gap-4">
            <FollowPeopleIcon className="w-16 h-16" />
            <h3 className="reem-kufi text-white text-[24px]">Meet People</h3>
          </div>

          <div className="flex flex-col items-center text-center gap-4">
            <WriteReviewsIcon className="w-16 h-16" />
            <h3 className="reem-kufi text-white text-[24px]">Write Reviews</h3>
          </div>

          <div className="flex flex-col items-center text-center gap-4">
            <WatchlistIcon className="w-16 h-16" />
            <h3 className="reem-kufi text-white text-[24px]">Build Watchlist</h3>
          </div>

        </div>
      </div>
    </section>
  );
}