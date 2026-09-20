import type { Fixture } from "~/types/api/fixtures";

export default function FixtureCard({
  fixture,
  clubId,
}: {
  fixture: Fixture;
  clubId: string;
}) {
  const isHome = fixture.home_club._id === clubId;

  const opponent = isHome ? fixture.away_club : fixture.home_club;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="grid grid-cols-[80px_1fr_auto_1fr] items-center gap-4">
        {/* Matchday */}
        <div className="text-sm text-zinc-500">
          <p>Matchday</p>
          <p className="text-lg font-bold text-white">{fixture.matchday}</p>
        </div>

        {/* Club */}
        <div className="text-right">
          <p className="font-semibold">{fixture.home_club.name_club}</p>

          <p className="text-xs text-zinc-500">Home</p>
        </div>

        {/* Score */}
        <div className="text-center">
          {fixture.status === "finished" ? (
            <p className="text-xl font-bold">
              {fixture.home_score} - {fixture.away_score}
            </p>
          ) : (
            <p className="text-sm text-zinc-500">VS</p>
          )}
        </div>

        {/* Away */}
        <div>
          <p className="font-semibold">{fixture.away_club.name_club}</p>

          <p className="text-xs text-zinc-500">Away</p>
        </div>
      </div>

      <div className="mt-3 border-t border-zinc-800 pt-3 text-sm text-zinc-500">
        {isHome ? "Home" : "Away"} • {fixture.status}
      </div>
    </div>
  );
}
