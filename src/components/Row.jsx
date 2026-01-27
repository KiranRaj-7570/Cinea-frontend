import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import PosterCard from "./PosterCard";
import BackdropCard from "./BackdropCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const Row = ({ title, fetchUrl, cardType = "poster", onSelect }) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);
  const [titleDim, setTitleDim] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);

  const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const idleTimer = useRef(null);

  // Responsive slide sizes
  const SLIDE_CONFIG = {
    poster: {
      xs: 130,
      sm: 150,
      md: 180,
      lg: 180,
    },
    backdrop: {
      xs: 240,
      sm: 280,
      md: 320,
      lg: 340,
    },
  };

  const getSlideSizes = () => {
    if (windowWidth < 640) return cardType === "poster" ? SLIDE_CONFIG.poster.xs : SLIDE_CONFIG.backdrop.xs;
    if (windowWidth < 768) return cardType === "poster" ? SLIDE_CONFIG.poster.sm : SLIDE_CONFIG.backdrop.sm;
    if (windowWidth < 1024) return cardType === "poster" ? SLIDE_CONFIG.poster.md : SLIDE_CONFIG.backdrop.md;
    return cardType === "poster" ? SLIDE_CONFIG.poster.lg : SLIDE_CONFIG.backdrop.lg;
  };

  const SLIDE_SIZE = getSlideSizes();
  const SPACE_BETWEEN = windowWidth < 768 ? 12 : 18;
  const ARROW_SCROLL_SPEED_MS = 700;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(fetchUrl);
        const filtered = (res.data?.results || []).filter((i) =>
          cardType === "poster" ? i.poster_path : i.backdrop_path
        );
        setItems(filtered);
      } catch (err) {
        console.error("Row fetch failed:", err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchUrl, cardType]);

  const updateFade = (swiper) => {
    if (!swiper) return;
    setShowLeftFade(!swiper.isBeginning);
    setShowRightFade(!swiper.isEnd);
  };

  const computeStep = (swiper) => {
    if (!swiper) return 2;
    const available = swiper.width || 1000;
    const approx = Math.floor(available / (SLIDE_SIZE + SPACE_BETWEEN));
    return Math.max(1, Math.min(5, approx > 1 ? approx - 1 : 2));
  };

  const setInteracting = (val) => {
    setTitleDim(val);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (val) {
      idleTimer.current = setTimeout(() => setTitleDim(false), 700);
    }
  };

  return (
    <div className="mb-8 sm:mb-10 md:mb-12 relative overflow-visible">
      {/* Title */}
      <h2
        className={`text-xl sm:text-2xl md:text-3xl font-semibold mb-2 sm:mb-3 transition-opacity duration-200 ${
          titleDim ? "opacity-60" : "opacity-100"
        } text-[#FF7A1A] reem-kufi`}
      >
        {title}
      </h2>

      <div className="relative overflow-x-clip px-1 sm:px-2">
        {/* Left Fade */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-8 sm:w-12 md:w-15 z-30 overflow-y-visible pointer-events-none transition-opacity duration-300 ${
            showLeftFade ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: "linear-gradient(90deg, #000000, transparent)",
          }}
        />

        {/* Right Fade */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-8 sm:w-12 md:w-15 z-30 overflow-y-visible pointer-events-none transition-opacity duration-300 ${
            showRightFade ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: "linear-gradient(270deg, #000000, transparent)",
          }}
        />

        {/* Swiper */}
        <Swiper
          modules={[Navigation]}
          slidesPerView="auto"
          spaceBetween={SPACE_BETWEEN}
          centeredSlides={false}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setTimeout(() => {
              if (swiper && prevRef.current && nextRef.current) {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
                updateFade(swiper);
              }
            }, 0);
          }}
          onSlideChange={(s) => {
            updateFade(s);
            setInteracting(true);
          }}
          onProgress={(s) => {
            updateFade(s);
            setInteracting(true);
          }}
          onTouchStart={() => setInteracting(true)}
          onTouchEnd={() => setInteracting(false)}
          style={{ overflow: "visible" }}
        >
          {/* Slide Items */}
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <SwiperSlide
                  key={`skeleton-${i}`}
                  style={{ width: SLIDE_SIZE + "px", overflow: "visible" }}
                >
                  {/* SKELETON CARD */}
                  <div className="animate-pulse">
                    {cardType === "poster" ? (
                      <div className="w-full h-[170px] sm:h-[200px] md:h-[260px] rounded-lg bg-slate-700/40" />
                    ) : (
                      <div className="w-full h-[110px] sm:h-[140px] md:h-[190px] rounded-lg bg-slate-700/40" />
                    )}

                    <div className="mt-2 space-y-1 px-1">
                      <div className="h-3 sm:h-4 w-3/4 bg-slate-600/40 rounded" />
                      <div className="h-2 sm:h-3 w-1/2 bg-slate-600/30 rounded" />
                    </div>
                  </div>
                </SwiperSlide>
              ))
            : items.map((item) => (
                <SwiperSlide
                  key={item.id}
                  style={{ width: SLIDE_SIZE + "px", overflow: "visible" }}
                >
                  {cardType === "poster" ? (
                    <PosterCard item={item} onClick={onSelect} />
                  ) : (
                    <BackdropCard item={item} onClick={onSelect} />
                  )}
                </SwiperSlide>
              ))}
        </Swiper>

        <button
          ref={prevRef}
          className={`absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-40 text-[#FF7A1A] text-6xl sm:text-7xl md:text-8xl font-extralight w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center transition-opacity duration-300 ${
            !showLeftFade ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          onClick={() => {
            const swiper = swiperRef.current;
            if (!swiper) return;

            const step = computeStep(swiper);
            const target = Math.max(0, swiper.activeIndex - step);

            swiper.slideTo(target, ARROW_SCROLL_SPEED_MS);
            setInteracting(true);
          }}
        >
          ‹
        </button>

        <button
          ref={nextRef}
          className={`absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-40 text-[#FF7A1A] text-6xl sm:text-7xl md:text-8xl font-extralight w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center transition-opacity duration-300 ${
            !showRightFade ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          onClick={() => {
            const swiper = swiperRef.current;
            if (!swiper) return;

            const step = computeStep(swiper);
            const target = Math.min(
              swiper.slides.length - 1,
              swiper.activeIndex + step
            );

            swiper.slideTo(target, ARROW_SCROLL_SPEED_MS);
            setInteracting(true);
          }}
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default Row;