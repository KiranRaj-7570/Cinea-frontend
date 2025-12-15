const ScreenBar = () => {
  return (
    <div className="mt-16 mb-6 flex justify-center">
      <div
        className="
          w-[95%] sm:w-[90%] lg:w-[1000px]
          h-14 bg-[#828485]
          text-black flex items-center justify-center
          text-sm font-medium tracking-wide opacity-80
        "
        style={{
          clipPath: "polygon(8% 0%, 92% 0%, 100% 100%, 0% 100%)",
        }}
      >
        SCREEN
      </div>
    </div>
  );
};

export default ScreenBar;
