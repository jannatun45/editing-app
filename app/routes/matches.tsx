import { useEffect, useState } from "react";
import EditScoreModal from "~/components/organisms/EditScoreModal";
import MatchCard from "~/components/organisms/MatchCard";
import Container from "~/components/templates/Container";

import {
  getMatches,
  generateMatches,
  updateMatchScore,
} from "~/services/matchesServices";
import type { Fixture } from "~/types/api/fixtures";

import type { Match } from "~/types/api/matches";

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [season, setSeason] = useState("2026/2027");

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

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

  // save update match
  const handleSaveScore = async (homeScore: number, awayScore: number) => {
    if (!selectedMatch) return;
    console.log("testing");
    try {
      setLoading(true);
      setError("");
      await updateMatchScore(selectedMatch._id, homeScore, awayScore);

      // Ambil ulang data dari database
      await loadMatches();

      // Tutup modal
      setSelectedMatch(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Gagal mengupdate score",
      );
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
          {/*
           */}
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

              <div className="grid grid-cols-2 gap-3">
                {dayMatches.map((match) => (
                  <MatchCard
                    key={match._id}
                    match={match}
                    onClick={() => setSelectedMatch(match)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {selectedMatch && (
          <EditScoreModal
            match={selectedMatch}
            onClose={() => setSelectedMatch(null)}
            onSave={handleSaveScore}
          />
        )}
      </div>
    </Container>
  );
}
