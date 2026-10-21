import { useEffect, useState } from "react";
import type { CreateMatchInput } from "~/components/organisms/CreateMatchModal";
import CreateMatchModal from "~/components/organisms/CreateMatchModal";

import EditScoreModal from "~/components/organisms/EditScoreModal";
import MatchCard from "~/components/organisms/MatchCard";
import Container from "~/components/templates/Container";
import { getClubs } from "~/services/clubsServices";
import { generateMatches } from "~/services/fixturesServices";
import {
  createMatch,
  getMatches,
  updateMatch,
  updateMatchScore,
} from "~/services/matchServices";
import type { Club } from "~/types/api/clubs";
import type { FixtureGoalInput } from "~/types/api/fixtures";
import type { Match } from "~/types/api/matches";

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [season, setSeason] = useState("2026/2027");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [creatingMatch, setCreatingMatch] = useState(false);

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
  // HANDLE SAVE MATCH
  // =========================
  const handleSaveMatch = async (
    matchday: number,
    matchDate: string,
    homeScore: number,
    awayScore: number,
    goals: FixtureGoalInput[],
  ) => {
    // Pastikan ada fixture yang sedang dipilih.
    if (!selectedMatch) {
      return;
    }
    // if (!id) {
    //   setError("ID club tidak ditemukan");
    //   return;
    // }

    try {
      setLoading(true);
      setError("");

      console.log("1. Mulai menyimpan skor");

      // UPDATE SCORE PERTANDINGAN + GOAL PERTANDINGAN
      // Simpan jadwal, skor, dan seluruh Goal Event dalam satu request.
      await updateMatchScore(selectedMatch._id, {
        matchday,
        match_date: matchDate,
        home_score: homeScore,
        away_score: awayScore,
        goals,
      });

      console.log("2. Skor dan gol berhasil disimpan");

      // update fixture
      await updateMatch(selectedMatch._id, matchday, matchDate);

      console.log("Selected match:", selectedMatch._id);
      console.log("Goals yang dikirim:", goals);
      console.log("Jumlah goals:", goals.length);

      console.log("3. Jadwal berhasil diperbarui");

      // Tutup modal
      setSelectedMatch(null);

      // reload matches / data dimuat ulang
      await loadMatches();
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

  // =========================
  // CREATE MATCH
  // =========================
  const handleOpenCreateModal = async () => {
    try {
      setError("");

      const result = await getClubs();

      setClubs(result);
      setShowCreateModal(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Gagal mengambil data klub",
      );
    }
  };

  const handleCreateMatch = async (data: CreateMatchInput) => {
    try {
      setCreatingMatch(true);
      setError("");

      await createMatch(data);

      // Muat ulang jadwal pertandingan
      await loadMatches();

      setShowCreateModal(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal membuat pertandingan";

      setError(message);
      throw error;
    } finally {
      setCreatingMatch(false);
    }
  };

  return (
    // <Container>
    //   </Container>
    <div className="space-y-6 mt-6 mb-28">
      {/* ========================= HEADER ========================= */}

      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121519] p-5 sm:p-7">
        {/* Decorative accent */}
        <div className="pointer-events-none absolute right-0 top-0 h-40 w-64 bg-gradient-to-bl from-[#b9a078]/[0.08] to-transparent" />

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-px w-7 bg-[#b9a078]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#b9a078]">
                League Management / Fixtures
              </span>
            </div>

            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Matches<span className="text-[#b9a078]">.</span>
              </h1>

              <p className="mt-2 text-sm text-[#858b94]">
                Jadwal dan hasil pertandingan
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            {/* Season */}
            <label className="flex flex-col gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#858b94]">
                Season
              </span>

              <select
                value={season}
                onChange={(event) => setSeason(event.target.value)}
                className="min-h-11 w-full cursor-pointer appearance-none rounded-lg border border-white/[0.10] bg-[#191d22] px-4 text-sm font-medium text-[#e5e5e5] outline-none transition hover:border-[#b9a078]/40 focus:border-[#b9a078] sm:w-36"
              >
                <option value="2026/2027">2026/2027</option>
                <option value="2027/2028">2027/2028</option>
              </select>
            </label>

            {/* Create Match */}
            <button
              type="button"
              onClick={handleOpenCreateModal}
              disabled={loading || creatingMatch}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.03] px-4 text-sm font-medium text-[#e5e5e5] transition hover:border-[#b9a078]/50 hover:bg-[#b9a078]/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="text-lg leading-none text-[#b9a078]">+</span>
              Create Match
            </button>

            {/* Generate Schedule */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#b9a078] px-4 text-sm font-semibold text-[#111111] transition hover:bg-[#cbb58f] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/25 border-t-black" />
                  Processing...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="4" width="18" height="17" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18M9 14l2 2 4-4" />
                  </svg>
                  Generate Schedule
                </>
              )}
            </button>
          </div>
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
                    : Math.min(matchdays[matchdays.length - 1] ?? 1, prev + 1),
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

      {/* ========================= CREATE MATCH MODAL ========================= */}
      {showCreateModal && (
        <CreateMatchModal
          clubs={clubs}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateMatch}
        />
      )}
    </div>
  );
}
