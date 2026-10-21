import { useEffect, useState } from "react";

import EditScoreModal from "~/components/organisms/EditScoreModal";
import MatchCard from "~/components/organisms/MatchCard";
import Container from "~/components/templates/Container";
import { generateMatches, updateMatchScore } from "~/services/fixturesServices";
import { getMatches, updateMatch } from "~/services/matchServices";
import type { FixtureGoalInput } from "~/types/api/fixtures";
import type { Match } from "~/types/api/matches";

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [season, setSeason] = useState("2026/2027");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentMatchday, setCurrentMatchday] = useState<number | null>(null);

  // load matches
  const loadMatches = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMatches(season);

      setMatches(data);
      setCurrentMatchday(findNextMatchday(data));
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

  // Load matches saat season berubah
  useEffect(() => {
    loadMatches();
  }, [season]);

  const findNextMatchday = (data: Match[]) => {
    const matchdays = [...new Set(data.map((match) => match.matchday))].sort(
      (a, b) => a - b,
    );

    // Cari Matchday paling awal yang masih memiliki
    // pertandingan yang belum selesai.
    const nextMatchday = matchdays.find((matchday) =>
      data.some(
        (match) => match.matchday === matchday && match.status !== "finished",
      ),
    );

    // Jika semua pertandingan sudah selesai,
    // tampilkan Matchday terakhir.
    return nextMatchday ?? matchdays[matchdays.length - 1] ?? 1;
  };

  const matchdays = [...new Set(matches.map((match) => match.matchday))].sort(
    (a, b) => a - b,
  );

  const displayedMatches = matches.filter(
    (match) => match.matchday === currentMatchday,
  );

  // const matchdays = Array.from(
  //   new Set(matches.map((match) => match.matchday)),
  // ).sort((a, b) => a - b);

  // const displayedMatches = matches.filter(
  //   (match) => match.matchday === matchdays[currentMatchday - 1],
  // );

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
    goals: FixtureGoalInput[],
  ) => {
    if (!selectedMatch) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      // update fixture
      await updateMatch(selectedMatch._id, matchday, matchDate);

      // update score
      await updateMatchScore(selectedMatch._id, homeScore, awayScore);

      // reload matches / refresh data
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

  // =========================
  // HANDLE RESET RESULT
  // =========================
  const handleResetResult = async () => {
    try {
      setLoading(true);
      setError("");

      await loadMatches();

      setSelectedMatch(null);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal memperbarui data pertandingan",
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

        {/* ========================= MATCH LIST ========================= */}
        {!loading && matches.length > 0 && (
          <div className="space-y-5">
            {/* Matchday Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Matchday {currentMatchday}
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  {displayedMatches.length} pertandingan
                </p>
              </div>

              <span className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-300">
                {currentMatchday} / {matchdays.length}
              </span>
            </div>

            {/* Match Cards */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {displayedMatches.map((match) => (
                <MatchCard
                  key={match._id}
                  match={match}
                  onClick={() => setSelectedMatch(match)}
                />
              ))}
            </div>

            {/* Pagination Matchday */}
            <div className="flex items-center justify-between border-t border-zinc-800 pt-5">
              <button
                type="button"
                onClick={() =>
                  setCurrentMatchday((prev) =>
                    prev === null ? 1 : Math.max(matchdays[0] ?? 1, prev - 1),
                  )
                }
                disabled={
                  currentMatchday === null ||
                  currentMatchday <= (matchdays[0] ?? 1)
                }
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-30"
              >
                ← Matchday Sebelumnya
              </button>

              <button
                type="button"
                onClick={() =>
                  setCurrentMatchday((prev) =>
                    prev === null
                      ? 1
                      : Math.min(
                          matchdays[matchdays.length - 1] ?? 1,
                          prev + 1,
                        ),
                  )
                }
                disabled={
                  currentMatchday === null ||
                  currentMatchday >= (matchdays[matchdays.length - 1] ?? 1)
                }
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Matchday Berikutnya →
              </button>
            </div>
          </div>
        )}

        {/* ========================= EDIT MODAL ========================= */}
        {selectedMatch && (
          <EditScoreModal
            match={selectedMatch}
            onClose={() => setSelectedMatch(null)}
            onReset={handleResetResult}
            onSave={handleSaveMatch}
          />
        )}
      </div>
    </Container>
  );
}
