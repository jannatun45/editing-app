import { useState } from "react";
import type { Match } from "~/types/api/matches";

type EditScoreModalProps = {
  match: Match;
  onClose: () => void;
  onSave: (homeScore: number, awayScore: number) => void;
};

export default function EditScoreModal({
  match,
  onClose,
  onSave,
}: EditScoreModalProps) {
  const [homeScore, setHomeScore] = useState(match.home_score ?? 0);

  const [awayScore, setAwayScore] = useState(match.away_score ?? 0);

  const handleSubmit = () => {
    onSave(homeScore, awayScore);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl bg-zinc-900 p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Edit Score</h2>

          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Club */}
        <div className="mb-6 grid grid-cols-3 items-center gap-4">
          {/* Home */}
          <div className="text-center">
            <p className="font-semibold text-white">
              {match.home_club.name_club}
            </p>

            <p className="text-sm text-zinc-500">Home</p>
          </div>

          <div className="text-center text-zinc-500">VS</div>

          {/* Away */}
          <div className="text-center">
            <p className="font-semibold text-white">
              {match.away_club.name_club}
            </p>

            <p className="text-sm text-zinc-500">Away</p>
          </div>
        </div>

        {/* Score */}
        <div className="mb-6 grid grid-cols-3 items-center gap-4">
          <input
            type="number"
            min="0"
            value={homeScore}
            onChange={(event) => setHomeScore(Number(event.target.value))}
            className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-center text-xl text-white outline-none"
          />

          <div className="text-center text-xl font-bold text-white">-</div>

          <input
            type="number"
            min="0"
            value={awayScore}
            onChange={(event) => setAwayScore(Number(event.target.value))}
            className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-center text-xl text-white outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-zinc-800 px-4 py-2 text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded-lg bg-white px-4 py-2 font-medium text-black"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
