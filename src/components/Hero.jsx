import { Link } from "react-router-dom";
import HeroImage from "../assets/hero.jpg";

const Hero = () => {
  return (
    <>
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center max-h-screen"
        style={{ backgroundImage: `url(${HeroImage})` }}
      ></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="anton w-full max-w-[766px] text-[40px] md:text-[64px] leading-tight md:leading-24 mb-4 text-[#E6D1D2]">
          A World Built for Movie Lovers
        </h1>

        <p className="text-[#E6D1D2] reem-kufi w-full max-w-[649px] md:whitespace-nowrap text-[16px] md:text-[18px] lg:text-[20px] leading-snug md:leading-[26px] lg:leading-[30px] font-normal">
          Review movies, follow others, and join conversations that bring stories
          to life.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-3 mt-10 w-full px-4">
          <Link
            to="/signup"
            className="reem-kufi px-[50px] py-3 bg-[#FF7A1A] rounded-full text-base font-semibold text-[#F6E7C6] hover:bg-white hover:text-black transition text-center"
          >
            Get Started
          </Link>

          <Link
            to="/login"
            className="reem-kufi px-16 py-3 border border-[#F6E7C6] rounded-full text-base font-semibold text-[#F6E7C6] hover:bg-white hover:text-black transition text-center"
          >
            Login
          </Link>
        </div>
      </div>
      
    </>
  );
};

export default Hero;