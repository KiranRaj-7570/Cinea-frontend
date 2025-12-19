
const EpisodeItem = ({ ep, seasonNumber, watched, onToggle, isLast }) => {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 hover:bg-[#111827] transition cursor-pointer"
      onClick={() => onToggle(seasonNumber, ep.episode_number)}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <input
          type="checkbox"
          checked={Boolean(watched)}
          onClick={(e) => e.stopPropagation()}
          onChange={() => onToggle(seasonNumber, ep.episode_number)}
          className="w-5 h-5 accent-[#FF7A1A] cursor-pointer shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-medium transition ${watched ? 'text-slate-400 line-through' : 'text-[#F6E7C6]'}`}>
            Ep {ep.episode_number}. {ep.name || `Episode ${ep.episode_number}`}
          </div>
          {ep.runtime && (
            <div className="text-xs text-slate-500 mt-0.5">{ep.runtime} min</div>
          )}
        </div>
      </div>

      {watched && (
        <div className="text-xs text-[#FF7A1A] font-semibold ml-2 shrink-0">✓</div>
      )}
    </div>
  );
};

export default EpisodeItem;
