import React from "react";

const Stat = ({ value, label }) => (
  <div className="text-center flex-1">
    <p className="text-5xl font-extralight tracking-tight text-white">
      {value}
    </p>
    <p className="text-sm text-slate-300 mt-1">{label}</p>
  </div>
);

const HeaderStats = ({
  followers = 0,
  following = 0,
  totalWatches = 0,
  totalBookings = 0,
}) => {
  return (
    <div className="w-full flex justify-between items-center bg-transparent">
      <Stat value={followers} label="Followers" />
      <Stat value={following} label="Following" />
      <Stat value={totalWatches} label="Total watches" />
      <Stat value={totalBookings} label="Total Bookings" />
    </div>
  );
};

export default HeaderStats;