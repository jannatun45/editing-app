import { useEffect, useState } from "react";
import Container from "~/components/templates/Container";

import { getMatches, generateMatches } from "~/services/matchesServices";

import type { Match } from "~/types/api/matches";

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [season, setSeason] = useState("2026/2027");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ambil jadwal
  const loadMatches = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMatches(season);

      setMatches(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, [season]);

  // Generate jadwal
  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError("");

      await generateMatches(season);

      await loadMatches();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Gagal membuat jadwal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Matches</h1>

            <p className="text-zinc-500">Jadwal pertandingan liga</p>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="rounded-lg bg-white px-4 py-2 text-black"
          >
            Generate Schedule
          </button>
        </div>

        {/* Season */}
        <div>
          <label className="mb-2 block text-sm text-zinc-400">Season</label>

          <select
            value={season}
            onChange={(event) => setSeason(event.target.value)}
            className="rounded-lg bg-zinc-800 px-4 py-2 text-white"
          >
            <option value="2026/2027">2026/2027</option>

            <option value="2027/2028">2027/2028</option>
          </select>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-500/10 p-4 text-red-400">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && <p className="text-zinc-400">Loading...</p>}

        {/* Matches */}
        {!loading && matches.length === 0 && (
          <p className="text-zinc-500">Belum ada pertandingan.</p>
        )}

        <div className="space-y-8">
          {Object.entries(
            matches.reduce(
              (groups, match) => {
                if (!groups[match.matchday]) {
                  groups[match.matchday] = [];
                }

                groups[match.matchday].push(match);

                return groups;
              },
              {} as Record<number, Match[]>,
            ),
          ).map(([matchday, dayMatches]) => (
            <div key={matchday} className="space-y-3">
              <h2 className="text-lg font-semibold text-white">
                Matchday {matchday}
              </h2>

              {dayMatches.map((match) => (
                <MatchCard key={match._id} match={match} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}

function MatchCard({ match }: { match: Match }) {
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
              {match.home_score}
              {" - "}
              {match.away_score}
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
