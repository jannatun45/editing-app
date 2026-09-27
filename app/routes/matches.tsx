import { useEffect, useState } from "react";

import EditScoreModal from "~/components/organisms/EditScoreModal";
import MatchCard from "~/components/organisms/MatchCard";
import Container from "~/components/templates/Container";

import {
  getMatches,
  generateMatches,
  updateMatch,
  updateMatchScore,
} from "~/services/matchesServices";

import type { Match, MatchGoalInput } from "~/types/api/matches";

export default function Matches() {
  // =========================
  // STATE
  // =========================

  const [matches, setMatches] = useState<Match[]>([]);

  const [season, setSeason] = useState("2026/2027");

  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // =========================
  // LOAD MATCHES
  // =========================
  const loadMatches = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMatches(season);

      setMatches(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengambil jadwal pertandingan",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD SAAT SEASON BERUBAH
  // =========================

  useEffect(() => {
    loadMatches();
  }, [season]);

  // =========================
  // GENERATE MATCHES
  // =========================

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

  // =========================
  // SAVE EDIT MATCH
  // =========================

  const handleSaveMatch = async (
    matchday: number,
    matchDate: string,
    homeScore: number,
    awayScore: number,
    goals: MatchGoalInput[],
  ) => {
    if (!selectedMatch) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      // =========================
      // UPDATE JADWAL
      // =========================

      await updateMatch(selectedMatch._id, matchday, matchDate);

      // =========================
      // UPDATE SCORE + GOALS
      // =========================

      await updateMatchScore(selectedMatch._id, homeScore, awayScore);

      // =========================
      // REFRESH DATA
      // =========================

      await loadMatches();

      // Tutup modal
      setSelectedMatch(null);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal memperbarui pertandingan",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="space-y-6">
        {/* ========================= HEADER ========================= */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Matches</h1>

            <p className="mt-1 text-sm text-zinc-500">
              Jadwal dan hasil pertandingan
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Season */}

            <select
              value={season}
              onChange={(event) => setSeason(event.target.value)}
              className="rounded-lg bg-zinc-800 px-4 py-2 text-white outline-none"
            >
              <option value="2026/2027">2026/2027</option>

              <option value="2027/2028">2027/2028</option>
            </select>

            {/* Generate */}

            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="rounded-lg bg-white px-4 py-2 font-medium text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Processing..." : "Generate Schedule"}
            </button>
          </div>
        </div>

        {/* ========================= ERROR ========================= */}

        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ========================= LOADING ========================= */}

        {loading && (
          <div className="py-10 text-center text-sm text-zinc-500">
            Loading matches...
          </div>
        )}

        {/* ========================= EMPTY ========================= */}

        {!loading && matches.length === 0 && (
          <div className="rounded-xl border border-dashed border-zinc-800 p-10 text-center">
            <p className="text-zinc-500">
              Belum ada jadwal pertandingan untuk season {season}.
            </p>

            <button
              type="button"
              onClick={handleGenerate}
              className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-zinc-200"
            >
              Generate Schedule
            </button>
          </div>
        )}

        {/* ========================= MATCH LIST ========================= */}

        {!loading && matches.length > 0 && (
          <div className=" grid grid-cols-2 gap-3">
            {matches.map((match) => (
              <MatchCard
                key={match._id}
                match={match}
                onClick={() => setSelectedMatch(match)}
              />
            ))}
          </div>
        )}

        {/* ========================= EDIT MODAL ========================= */}

        {selectedMatch && (
          <EditScoreModal
            match={selectedMatch}
            onClose={() => setSelectedMatch(null)}
            onSave={handleSaveMatch}
          />
        )}
      </div>
    </Container>
  );
}
