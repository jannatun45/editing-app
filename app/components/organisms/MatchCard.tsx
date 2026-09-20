import type { Match } from "~/types/api/matches";

type MatchCardProps = {
  match: Match;
};

export default function MatchCard({ match }: MatchCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
        {/* Home */}
        <div className="text-right">
          <p className="font-semibold text-white">
            {match.home_club.name_club}
          </p>

          <p className="text-sm text-zinc-500">Home</p>
        </div>

        {/* Score */}
        <div className="text-center">
          {match.status === "finished" ? (
            <div className="text-2xl font-bold text-white">
              {match.home_score} - {match.away_score}
            </div>
          ) : (
            <div className="text-sm text-zinc-500">VS</div>
          )}

          <p className="mt-1 text-xs text-zinc-600">{match.status}</p>
        </div>

        {/* Away */}
        <div>
          <p className="font-semibold text-white">
            {match.away_club.name_club}
          </p>

          <p className="text-sm text-zinc-500">Away</p>
        </div>
      </div>
    </div>
  );
}
