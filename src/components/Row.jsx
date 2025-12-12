import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import PosterCard from "./PosterCard";
import BackdropCard from "./BackdropCard";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const Row = ({ title, fetchUrl, cardType = "poster", onSelect }) => {
  const [items, setItems] = useState([]);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);
  const [titleDim, setTitleDim] = useState(false);

  const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const idleTimer = useRef(null);

  const SLIDE_SIZE = cardType === "poster" ? 180 : 340;
  const SPACE_BETWEEN = 18;
  const ARROW_SCROLL_SPEED_MS = 700;

  
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(fetchUrl);
        const filtered = (res.data?.results || []).filter((i) =>
          cardType === "poster" ? i.poster_path : i.backdrop_path
        );
        setItems(filtered);
      } catch (err) {
        console.error("Row fetch failed:", err.message);
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
    <div className="mb-12 relative overflow-visible">
      {/* Title */}
      <h2
        className={`text-2xl font-semibold mb-3 transition-opacity duration-200 ${
          titleDim ? "opacity-60" : "opacity-100"
        } text-[#FF7A1A] reem-kufi`}
      >
        {title}
      </h2>
      
      <div className="relative overflow-x-clip px-2">
        
        {/* Left Fade */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-15 z-30 overflow-y-visible pointer-events-none transition-opacity duration-300 bg-linear-to-b from-[rgba(80,80,80,0.7)] to-[#070707] ${
            showLeftFade ? "opacity-100" : "opacity-0" 
          }`}
          style={{
            background: "linear-gradient(90deg, #000000, transparent)"
          }}
        />

        {/* Right Fade */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-15  z-30 overflow-y-visible pointer-events-none transition-opacity duration-300 ${
            showRightFade ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: "linear-gradient(270deg, #000000, transparent)"
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
          {items.map((item) => (
            <SwiperSlide
              key={item.id}
              style={{
                width: SLIDE_SIZE + "px",
                overflow: "visible",
              }}
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
  className={`absolute left-2 top-1/2 -translate-y-1/2 z-40 text-[#FF7A1A] text-8xl font-extralight w-10 h-10 flex items-center justify-center transition-opacity duration-300 ${
    !showLeftFade ? "opacity-0 pointer-events-none" : "opacity-100"
  }`}
  onClick={() => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const step = computeStep(swiper); // auto choose 3–4 based on screen
    const target = Math.max(0, swiper.activeIndex - step);

    swiper.slideTo(target, ARROW_SCROLL_SPEED_MS);
    setInteracting(true);
  }}
>
  ‹
</button>


<button
  ref={nextRef}
  className={`absolute right-2 top-1/2 -translate-y-1/2 z-40 text-[#FF7A1A] text-8xl font-extralight w-10 h-10 flex items-center justify-center transition-opacity duration-300 ${
    !showRightFade ? "opacity-0 pointer-events-none" : "opacity-100"
  }`}
  onClick={() => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const step = computeStep(swiper); // auto choose 3–4 based on screen
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