
const EpisodeItem = ({ ep, seasonNumber, watched, onToggle }) => {
  return (
    <div
      className="flex items-center justify-between p-3 rounded cursor-pointer hover:bg-[#111827] transition"
      onClick={() => onToggle(seasonNumber, ep.episode_number)}
    >
      <div className="flex items-center gap-3">
        <div className="text-sm font-medium text-[#F6E7C6]">
          {ep.episode_number}. {ep.name || `Episode ${ep.episode_number}`}
        </div>
        <div className="text-xs text-slate-400">{ep.runtime ? `${ep.runtime}m` : ""}</div>
      </div>

      <input
        type="checkbox"
        checked={Boolean(watched)}
        onClick={(e) => e.stopPropagation()}
        onChange={() => onToggle(seasonNumber, ep.episode_number)}
        className="w-5 h-5"
      />
    </div>
  );
};

export default EpisodeItem;
