import { useEffect, useState } from "react";
import type { CreateMatchInput } from "~/components/organisms/CreateMatchModal";
import CreateMatchModal from "~/components/organisms/CreateMatchModal";

import EditScoreModal from "~/components/organisms/EditScoreModal";
import MatchCard from "~/components/organisms/MatchCard";
import { getClubs } from "~/services/clubsServices";
// import { generateMatches } from "~/services/fixturesServices";
import {
  createMatch,
  deleteMatch,
  getMatches,
  resetMatch,
  updateMatch,
  updateMatchScore,
} from "~/services/matchServices";
import type { Club } from "~/types/api/clubs";
import type { Match, MatchGoalInput } from "~/types/api/matches";

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

  // ========================= GENERATE MATCHES sudah tidak di pakai =========================
  // const handleGenerate = async () => {
  //   try {
  //     setLoading(true);
  //     setError("");

  //     await generateMatches(season);

  //     await loadMatches();
  //   } catch (error) {
  //     setError(error instanceof Error ? error.message : "Gagal membuat jadwal");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // ========================= HANDLE SAVE MATCH =========================
  const handleSaveMatch = async (
    matchday: number,
    matchDate: string,
    homeScore: number,
    awayScore: number,
    goals: MatchGoalInput[],
    posterFile?: File | null,
    shouldUpdateScore = false,
  ) => {
    // Pastikan ada fixture yang sedang dipilih.
    if (!selectedMatch) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (shouldUpdateScore) {
        await updateMatchScore(selectedMatch._id, {
          matchday,
          match_date: matchDate,
          home_score: homeScore,
          away_score: awayScore,
          goals,
        });
      }
      // 2. update jadwal pertandingan
      await updateMatch(selectedMatch._id, matchday, matchDate, posterFile);

      // 3. tutup modal dan muat ulang data
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

  // ========================= HANDLE DELETE MATCH =========================
  const handleDeleteMatch = async () => {
    if (!selectedMatch) return;

    try {
      setLoading(true);
      setError("");
      await deleteMatch(selectedMatch._id);

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

  // ========================= HANDLE RESET MATCH =========================
  const handleResetMatch = async () => {
    if (!selectedMatch) return;

    try {
      setLoading(true);
      setError("");
      await resetMatch(selectedMatch._id);

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

  // ========================= HNDLE CREATE OPEN MODAL =========================
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

  // ========================= CREATE MATCH =========================
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

      <div className="group relative overflow-hidden rounded-2xl border border-cyan-400/15 bg-[#090e19] p-5 shadow-[0_10px_50px_rgba(0,0,0,0.25)] sm:p-7">
        {/* Background Effects */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.025)_1px,transparent_1px)] bg-[size:30px_30px]" />

        <div className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-56 w-56 rounded-full bg-purple-600/10 blur-[100px]" />

        {/* Top Accent */}
        <div className="absolute left-0 top-0 h-[2px] w-40 bg-gradient-to-r from-cyan-400 to-transparent shadow-[0_0_12px_#00f0ff]" />

        <div className="relative flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="h-px w-7 bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />

              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400">
                League Management
              </span>

              <span className="text-[10px] text-white/20">/</span>

              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                Fixtures
              </span>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Matches<span className="text-cyan-400">.</span>
                </h1>

                <span className="rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-[9px] font-bold tracking-widest text-cyan-400">
                  CONTROL CENTER
                </span>
              </div>

              <p className="mt-2 text-sm text-zinc-500">
                Manage fixtures, schedules and match results.
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            {/* Season */}
            <label className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                Season
              </span>

              <div className="relative">
                <select
                  value={season}
                  onChange={(event) => setSeason(event.target.value)}
                  className="min-h-11 w-full cursor-pointer appearance-none rounded-lg border border-white/10 bg-[#111a29] px-4 pr-10 text-sm font-semibold text-white outline-none transition hover:border-cyan-400/40 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 sm:w-36"
                >
                  <option value="2026/2027">2026/2027</option>
                  <option value="2027/2028">2027/2028</option>
                </select>

                <svg
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </label>

            {/* Create Match */}
            <button
              type="button"
              onClick={handleOpenCreateModal}
              disabled={loading || creatingMatch}
              className="group/btn inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="text-xl leading-none text-cyan-400 transition-transform group-hover/btn:rotate-90">
                +
              </span>
              Create Match
            </button>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="pointer-events-none absolute bottom-0 right-0 flex items-center gap-2 p-3 opacity-30">
          <span className="h-1 w-8 bg-cyan-400" />
          <span className="h-1 w-2 bg-purple-400" />
          <span className="h-1 w-1 bg-white" />
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
          onReset={handleResetMatch}
          onDelete={handleDeleteMatch}
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
