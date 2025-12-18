const ScreenEditor = ({ screens, setScreens }) => {
  const addScreen = () => {
    setScreens([
      ...screens,
      {
        screenNumber: screens.length + 1,
        seatLayout: { rows: [] },
      },
    ]);
  };

  const addRow = (screenIdx) => {
    const copy = [...screens];
    copy[screenIdx].seatLayout.rows.push({
      row: String.fromCharCode(65 + copy[screenIdx].seatLayout.rows.length),
      seats: 20,
      price: 200,
    });
    setScreens(copy);
  };

  const removeRow = (screenIdx, rowIdx) => {
    const copy = [...screens];
    copy[screenIdx].seatLayout.rows.splice(rowIdx, 1);
    setScreens(copy);
  };

  const updateRow = (screenIdx, rowIdx, key, value) => {
    const copy = [...screens];
    copy[screenIdx].seatLayout.rows[rowIdx][key] =
      key === "row" ? value : Number(value);
    setScreens(copy);
  };

  return (
    <div className="space-y-6">
      {screens.map((screen, sIdx) => (
        <div key={sIdx} className="border border-white/10 rounded-xl p-4">
          <h3 className="font-semibold mb-3">
            Screen {screen.screenNumber}
          </h3>

          {screen.seatLayout.rows.map((r, rIdx) => (
            <div key={rIdx} className="flex gap-2 mb-2 items-center">
              <input
                value={r.row}
                onChange={(e) =>
                  updateRow(sIdx, rIdx, "row", e.target.value)
                }
                className="w-12 p-1 bg-[#151515]"
              />
              <input
                type="number"
                value={r.seats}
                onChange={(e) =>
                  updateRow(sIdx, rIdx, "seats", e.target.value)
                }
                className="w-20 p-1 bg-[#151515]"
              />
              <input
                type="number"
                value={r.price}
                onChange={(e) =>
                  updateRow(sIdx, rIdx, "price", e.target.value)
                }
                className="w-24 p-1 bg-[#151515]"
              />

              <button
                onClick={() => removeRow(sIdx, rIdx)}
                className="text-red-400 text-sm"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            onClick={() => addRow(sIdx)}
            className="text-sm text-[#FF7A1A] mt-2"
          >
            + Add Row
          </button>
        </div>
      ))}

      <button
        onClick={addScreen}
        className="px-4 py-2 bg-[#FF7A1A] text-black rounded"
      >
        + Add Screen
      </button>
    </div>
  );
};

export default ScreenEditor;
