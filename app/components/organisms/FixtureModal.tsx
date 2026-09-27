import type { Fixture } from "~/types/api/fixtures";

type FixtureModalProps = {
  fixture: Fixture;
  onClose: () => void;
};

export default function FixtureModal({ fixture, onClose }: FixtureModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-md rounded-xl bg-zinc-900 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Detail Pertandingan</h2>

          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-zinc-500">Matchday</p>

            <p className="text-white">{fixture.matchday}</p>
          </div>

          <div>
            <p className="text-sm text-zinc-500">Home</p>

            <p className="text-white">{fixture.home_club.name_club}</p>
          </div>

          <div>
            <p className="text-sm text-zinc-500">Away</p>

            <p className="text-white">{fixture.away_club.name_club}</p>
          </div>

          <div>
            <p className="text-sm text-zinc-500">Score</p>

            <p className="text-2xl font-bold text-white">
              {fixture.home_score ?? 0} - {fixture.away_score ?? 0}
            </p>
          </div>

          <div>
            <p className="text-sm text-zinc-500">Status</p>

            <p className="text-white">{fixture.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
