import { useEffect, useState } from "react";
import { useParams } from "react-router";

// import services
import { getClubById, updateClub } from "~/services/clubsServices";
import {
  deleteMatch,
  getClubMatches,
  resetMatch,
  updateMatchScore,
} from "~/services/matchServices";
import { getStandings } from "~/services/standingServices";
import { getPlayersByClub } from "~/services/playerServices";
import {
  getGoalEventsByClub,
  type GoalEvent,
} from "~/services/goalEventServices";
// import types
import type { Club } from "~/types/api/clubs";
import type { Standing } from "~/types/api/standings";
import type { Player } from "~/types/api/player";
import type { Match, MatchGoalInput } from "~/types/api/matches";
// import components
import AddPlayerModal from "~/components/organisms/AddPlayerModal";
import EditScoreModal from "~/components/organisms/EditScoreModal";
import EditClubModal from "~/components/organisms/EditClubModal";
import MatchCard from "~/components/organisms/MatchCard";

export default function ClubProfile() {
  const { id } = useParams();

  const [goalEvents, setGoalEvents] = useState<GoalEvent[]>([]);
  const [loadingGoals, setLoadingGoals] = useState(false);
  const [goalError, setGoalError] = useState("");

  const [players, setPlayers] = useState<Player[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);

  const [club, setClub] = useState<Club | null>(null);
  const [standing, setStanding] = useState<Standing | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingFixtures, setLoadingFixtures] = useState(false);

  // modal state
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showEditClub, setShowEditClub] = useState(false);

  const [error, setError] = useState("");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const season = "2026/2027";

  // ========================= LOAD CLUB DATA =========================
  useEffect(() => {
    if (!id) return;

    const loadPlayers = async () => {
      try {
        setLoadingPlayers(true);

        const data = await getPlayersByClub(id);

        setPlayers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingPlayers(false);
      }
    };

    const loadClubProfile = async () => {
      try {
        setLoading(true);
        setError("");

        // Ambil data club
        const clubData = await getClubById(id);
        console.log("club data in useeffect: ", clubData);

        setClub(clubData);

        // Ambil semua standing season
        const standings = await getStandings(season);

        // Cari standing milik club ini
        const clubStanding = standings.find(
          (standing) => standing.club._id === id,
        );

        setStanding(clubStanding ?? null);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Gagal mengambil data club",
        );
      } finally {
        setLoading(false);
      }
    };
    const loadFixtures = async () => {
      try {
        setLoadingFixtures(true);

        const data = await getClubMatches(id);

        setMatches(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingFixtures(false);
      }
    };
    loadPlayers();
    loadClubProfile();
    loadFixtures();
  }, [id]);

  // ======================== LOAD GOAL EVENTS ========================
  useEffect(() => {
    if (!id) return;

    const loadGoalEvents = async () => {
      try {
        setLoadingGoals(true);
        setGoalError("");

        const data = await getGoalEventsByClub(id, season);

        setGoalEvents(data);
      } catch (error) {
        setGoalError(
          error instanceof Error ? error.message : "Gagal mengambil data gol",
        );
      } finally {
        setLoadingGoals(false);
      }
    };

    loadGoalEvents();
  }, [id, season]);

  if (loading) {
    return <div>Loading club...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!club) {
    return <div>Club tidak ditemukan.</div>;
  }

  // HANDLE SAVE SCORE
  const handleSaveScore = async (
    matchday: number,
    matchDate: string,
    homeScore: number,
    awayScore: number,
    goals: MatchGoalInput[],
  ) => {
    // Pastikan ada fixture yang sedang dipilih.
    if (!selectedMatch) {
      return;
    }
    if (!id) {
      setError("ID club tidak ditemukan");
      return;
    }
    console.log("submit pada page --club profile");
    console.log("handle save di page club profile");
    console.log("data selected: ", selectedMatch);

    try {
      setLoading(true);
      setError("");

      // UPDATE SCORE + GOALS
      // Simpan jadwal, skor, dan seluruh Goal Event dalam satu request.
      await updateMatchScore(selectedMatch._id, {
        matchday,
        match_date: matchDate,
        home_score: homeScore,
        away_score: awayScore,
        goals,
      });

      // REFRESH DATA
      const updatedMatches = await getClubMatches(id!);

      // Ambil semua standing season
      const standings = await getStandings(season);

      // Cari standing milik club ini
      const clubStanding = standings.find(
        (standing) => standing.club._id === id,
      );

      // Ambil ulang Goal Event agar tampilan langsung diperbarui.
      const updatedGoals = await getGoalEventsByClub(id, season);

      setGoalEvents(updatedGoals);
      setStanding(clubStanding ?? null);
      setMatches(updatedMatches);

      // TUTUP MODAL setelah perubahan berhasil disimpan
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

  // Handle save club edit
  const handleSaveClub = async (formData: FormData) => {
    if (!id) {
      setError("ID club tidak ditemukan");
      return;
    }

    // simpan perubahan ke backend
    await updateClub(id, formData);

    // ambil ulang data club terbaru
    const updatedClub = await getClubById(id);

    // perbarui state club dengan data terbaru
    setClub(updatedClub);

    // tutup modal edit
    setShowEditClub(false);
  };

  // ========================= HANDLE DELETE MATCH =========================
  const handleDeleteMatch = async () => {
    // posisi scroll saat ini
    const scrollPosition = window.scrollY;
    try {
      setLoading(true);
      setError("");

      if (!selectedMatch) {
        return;
      }

      // DELETE MATCH
      await deleteMatch(selectedMatch._id);

      // REFRESH DATA
      const updatedMatch = await getClubMatches(id!);

      // Ambil semua standing season
      const standings = await getStandings(season);

      // Cari standing milik club ini
      const clubStanding = standings.find(
        (standing) => standing.club._id === id,
      );

      setMatches(updatedMatch);
      setSelectedMatch(null);
      setStanding(clubStanding ?? null);

      // Kembalikan posisi scroll
      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: "instant",
        });
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal mereset hasil pertandingan",
      );
    } finally {
      setLoading(false);
    }
  };
  // ========================= HANDLE RESET MATCH =========================
  const handleResetMatch = async () => {
    // posisi scroll saat ini
    const scrollPosition = window.scrollY;
    try {
      setLoading(true);
      setError("");

      if (!selectedMatch) {
        return;
      }

      // RESET MATCH
      await resetMatch(selectedMatch._id);

      // REFRESH DATA
      const updatedMatch = await getClubMatches(id!);

      // Ambil semua standing season
      const standings = await getStandings(season);

      // Cari standing milik club ini
      const clubStanding = standings.find(
        (standing) => standing.club._id === id,
      );

      setMatches(updatedMatch);
      setSelectedMatch(null);
      setStanding(clubStanding ?? null);

      // Kembalikan posisi scroll
      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: "instant",
        });
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal mereset hasil pertandingan",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-48">
      {/* ========================= CLUB HEADER ========================= */}
      <section className="group relative isolate mt-2 min-h-90 overflow-hidden rounded-2xl border border-cyan-400/20 bg-[#050711] shadow-[0_0_35px_rgba(6,182,212,0.08)] md:min-h-105">
        {/* Background stadion */}
        <img
          src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=2000&q=85"
          alt="Stadion sepak bola"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-50"
        />

        {/* Cyberpunk overlays */}
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#050711] via-[#080d1c]/95 to-[#080d1c]/40" />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-[#050711] via-transparent to-[#050711]/50" />

        {/* Neon glow */}
        <div className="absolute -right-20 -top-28 -z-10 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute -bottom-32 left-1/3 -z-10 h-80 w-80 rounded-full bg-purple-600/10 blur-[100px]" />

        {/* Grid decoration */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "linear-gradient(to bottom, black, transparent 85%)",
          }}
        />

        <div className="flex min-h-90 flex-col justify-between p-6 md:min-h-105 md:p-10">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
              <span className="border border-cyan-400/30 bg-cyan-400/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-300 backdrop-blur-md">
                Club Profile / System
              </span>
            </div>

            <span className="border border-purple-400/30 bg-purple-500/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-purple-300">
              ◈ Season 2026/2027
            </span>
          </div>

          {/* Main content */}
          <div className="mt-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              {/* Club Logo */}
              <div className="relative mb-6 flex h-24 w-24 items-center justify-center border border-cyan-400/50 bg-[#080d1c]/80 p-3 shadow-[0_0_25px_rgba(34,211,238,0.15)] backdrop-blur-xl">
                {/* Corner decoration */}
                <div className="absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2 border-cyan-300" />
                <div className="absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-cyan-300" />

                {club.logo ? (
                  <img
                    src={`http://localhost:3000/images/clubs/${club.logo}`}
                    alt={`Logo ${club.name_club}`}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-3xl font-black text-cyan-400">
                    {(club.name_club ?? "Club").slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Subtitle */}
              <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-cyan-400">
                <span className="h-px w-8 bg-cyan-400" />
                Stronger Together
              </p>

              {/* Club name */}
              <h1 className="text-4xl font-black uppercase leading-none tracking-tight text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.2)] md:text-6xl">
                {club.name_club}
              </h1>

              {/* Accent line */}
              <div className="mt-4 h-[2px] w-32 bg-linear-to-r from-cyan-400 via-purple-500 to-transparent shadow-[0_0_10px_rgba(34,211,238,0.5)]" />

              {/* Club information */}
              <div className="mt-7 flex flex-wrap gap-3">
                {/* Stadium */}
                <div className="flex min-w-55 items-center gap-3 border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-md transition hover:border-cyan-400/40">
                  <div className="flex h-10 w-10 items-center justify-center border border-cyan-400/20 bg-cyan-400/10 text-xl text-cyan-400">
                    ⌂
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-cyan-400">
                      Home Stadium
                    </p>
                    <p className="mt-1 text-sm font-bold capitalize text-white">
                      {club.stadium?.name_stadium || "Stadion belum diatur"}
                    </p>
                  </div>
                </div>

                {/* District */}
                <div className="flex min-w-55 items-center gap-3 border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-md transition hover:border-purple-400/40">
                  <div className="flex h-10 w-10 items-center justify-center border border-purple-400/20 bg-purple-400/10 text-xl text-purple-400">
                    ⌖
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-purple-400">
                      District
                    </p>
                    <p className="mt-1 text-sm font-bold capitalize text-white">
                      {club.district || "Distrik belum diatur"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit button */}
            <button
              type="button"
              onClick={() => setShowEditClub(true)}
              className="group/btn relative inline-flex shrink-0 items-center justify-center gap-3 overflow-hidden border border-cyan-400/60 bg-cyan-400 px-6 py-3.5 font-black uppercase tracking-wider text-[#050711] shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-[#050711]"
            >
              <span aria-hidden="true">✎</span>
              Edit Club
              <span className="transition-transform group-hover/btn:translate-x-1">
                →
              </span>
            </button>
          </div>

          {/* Footer decoration */}
          <div className="mt-8 flex items-center gap-3">
            <div className="h-[2px] flex-1 bg-linear-to-r from-cyan-400/70 via-purple-500/30 to-transparent" />
            <span className="text-[9px] font-bold tracking-[0.3em] text-cyan-400/50">
              FOOTBALL MANAGEMENT SYSTEM
            </span>
            <div className="h-1.5 w-1.5 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          </div>
        </div>
      </section>
      {/* ========================= STANDING STATISTICS ========================= */}
      <section className="relative isolate overflow-hidden rounded-3xl border border-cyan-400/15 bg-[#050711] p-5 shadow-[0_0_40px_rgba(6,182,212,0.06)] md:p-8">
        {/* Cyberpunk background */}
        <div className="pointer-events-none absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 -z-10 h-96 w-96 rounded-full bg-purple-600/10 blur-[100px]" />

        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.5) 1px, transparent 1px)",
            backgroundSize: "35px 35px",
            maskImage: "linear-gradient(to bottom, black, transparent 90%)",
          }}
        />

        {/* Header */}
        <div className="relative mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex h-12 w-12 items-center justify-center border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
              <i data-lucide="chart-no-axes-combined" className="h-6 w-6" />
              <span className="absolute -right-px -top-px h-2 w-2 bg-cyan-300 shadow-[0_0_8px_#22d3ee]" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
                  Team Statistics
                </h2>

                <span className="border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-cyan-300">
                  Overview
                </span>
              </div>

              <p className="mt-1 text-xs font-medium tracking-wide text-slate-500">
                Performance Analytics / {season}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 border border-purple-400/20 bg-purple-400/5 px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-purple-200">
              Season {season}
            </span>
          </div>
        </div>

        {standing ? (
          <>
            {/* Main statistics */}
            <div className="relative grid gap-5 lg:grid-cols-5">
              {/* Match Results */}
              <div className="relative overflow-hidden border border-cyan-400/15 bg-[#090f1e]/80 p-5 backdrop-blur-xl sm:p-7 lg:col-span-3">
                {/* Panel decoration */}
                <div className="absolute right-0 top-0 h-px w-1/3 bg-linear-to-l from-cyan-400 to-transparent" />
                <div className="absolute bottom-0 left-0 h-px w-1/3 bg-linear-to-r from-purple-500/60 to-transparent" />

                <div className="mb-7 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-cyan-400">
                      01 / Match Analysis
                    </p>
                    <h3 className="mt-2 text-lg font-black uppercase tracking-wide text-white">
                      Match Results
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Distribution of team results
                    </p>
                  </div>

                  <span className="border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    {standing.match > 0 ? "Season Stats" : "No Matches"}
                  </span>
                </div>

                {(() => {
                  const wins = Math.max(0, Number(standing.win) || 0);
                  const draws = Math.max(0, Number(standing.draw) || 0);
                  const losses = Math.max(0, Number(standing.lose) || 0);
                  const matches = Math.max(0, Number(standing.match) || 0);

                  const totalResults = wins + draws + losses;
                  const radius = 70;
                  const circumference = 2 * Math.PI * radius;

                  const winLength =
                    totalResults > 0
                      ? (wins / totalResults) * circumference
                      : 0;

                  const drawLength =
                    totalResults > 0
                      ? (draws / totalResults) * circumference
                      : 0;

                  const lossLength =
                    totalResults > 0
                      ? (losses / totalResults) * circumference
                      : 0;

                  const segments = [
                    {
                      label: "Wins",
                      value: wins,
                      color: "#22d3ee",
                      length: winLength,
                      offset: 0,
                    },
                    {
                      label: "Draws",
                      value: draws,
                      color: "#a78bfa",
                      length: drawLength,
                      offset: winLength,
                    },
                    {
                      label: "Losses",
                      value: losses,
                      color: "#fb7185",
                      length: lossLength,
                      offset: winLength + drawLength,
                    },
                  ];

                  return (
                    <div className="grid items-center gap-8 sm:grid-cols-2">
                      {/* Donut chart */}
                      <div className="mx-auto w-full max-w-[240px]">
                        <div className="relative mx-auto aspect-square w-full">
                          <div className="pointer-events-none absolute inset-[15%] rounded-full bg-cyan-400/10 blur-2xl" />

                          <svg
                            viewBox="0 0 180 180"
                            className="relative h-full w-full -rotate-90 overflow-visible"
                            role="img"
                            aria-label={`Match results: ${wins} wins, ${draws} draws, ${losses} losses`}
                          >
                            <circle
                              cx="90"
                              cy="90"
                              r={radius}
                              fill="none"
                              stroke="rgba(255,255,255,0.06)"
                              strokeWidth="15"
                            />

                            {segments.map((segment) => (
                              <circle
                                key={segment.label}
                                cx="90"
                                cy="90"
                                r={radius}
                                fill="none"
                                stroke={segment.color}
                                strokeWidth="15"
                                strokeDasharray={`${Math.max(0, segment.length - (segment.value > 0 ? 2 : 0))} ${circumference}`}
                                strokeDashoffset={-segment.offset}
                                strokeLinecap="round"
                                className="transition-all duration-700 ease-out"
                                style={{
                                  filter: `drop-shadow(0 0 5px ${segment.color}88)`,
                                }}
                              />
                            ))}
                          </svg>

                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-cyan-400">
                              Matches
                            </span>

                            <span className="mt-1 text-5xl font-black tracking-tighter text-white">
                              {matches}
                            </span>

                            <span className="mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                              Played
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Result legend */}
                      <div className="space-y-6">
                        {segments.map((segment) => {
                          const percentage =
                            totalResults > 0
                              ? (segment.value / totalResults) * 100
                              : 0;

                          return (
                            <div key={segment.label} className="group">
                              <div className="mb-2 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5">
                                  <span
                                    className="h-2.5 w-2.5"
                                    style={{
                                      backgroundColor: segment.color,
                                      boxShadow: `0 0 12px ${segment.color}`,
                                    }}
                                  />

                                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                                    {segment.label}
                                  </span>
                                </div>

                                <div>
                                  <span className="text-lg font-black text-white">
                                    {segment.value}
                                  </span>
                                  <span className="ml-2 text-[10px] font-bold text-slate-500">
                                    {percentage.toFixed(0)}%
                                  </span>
                                </div>
                              </div>

                              <div className="h-1.5 overflow-hidden bg-white/[0.06]">
                                <div
                                  className="h-full transition-all duration-700"
                                  style={{
                                    width: `${percentage}%`,
                                    backgroundColor: segment.color,
                                    boxShadow: `0 0 10px ${segment.color}66`,
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}

                        <div className="border-t border-white/10 pt-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                              Win Rate
                            </span>

                            <span className="text-xl font-black text-cyan-300">
                              {totalResults > 0
                                ? `${((wins / totalResults) * 100).toFixed(1)}%`
                                : "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Total Points */}
              <div className="group relative flex flex-col justify-between overflow-hidden border border-purple-400/25 bg-[#0c0b20] p-6 lg:col-span-2">
                <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-purple-500/15 blur-[70px]" />
                <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-cyan-400/10 blur-[70px]" />

                {/* Corner decoration */}
                <div className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-purple-400/60" />
                <div className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-purple-400/60" />

                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-purple-300">
                      02 / Performance
                    </p>

                    <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      Total Points
                    </p>

                    <p className="mt-2 text-6xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(167,139,250,0.25)]">
                      {standing.points}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      Points earned this season
                    </p>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-purple-400/30 bg-purple-400/10 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.12)]">
                    <i data-lucide="trophy" className="h-6 w-6" />
                  </div>
                </div>

                <div className="relative mt-10 border-t border-white/10 pt-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Points Per Match
                    </span>

                    <span className="text-sm font-black text-purple-300">
                      {Number(standing.match) > 0
                        ? (
                            Number(standing.points) / Number(standing.match)
                          ).toFixed(2)
                        : "—"}
                    </span>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden bg-white/[0.06]">
                    <div
                      className="h-full bg-linear-to-r from-purple-600 via-purple-400 to-cyan-300 shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                      style={{
                        width: `${Math.min(
                          100,
                          Number(standing.match) > 0
                            ? (Number(standing.points) /
                                (Number(standing.match) * 3)) *
                                100
                            : 0,
                        )}%`,
                      }}
                    />
                  </div>

                  <p className="mt-3 text-[9px] leading-relaxed text-slate-500">
                    Points earned compared with the maximum available
                  </p>
                </div>
              </div>
            </div>

            {/* Supporting Statistics */}
            <div className="relative mt-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-7 bg-cyan-400" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">
                  03 / Advanced Metrics
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  {
                    label: "Goals For",
                    value: standing.goals_for,
                    icon: "goal",
                    color: "text-cyan-300",
                    bg: "bg-cyan-400/10",
                    border: "hover:border-cyan-400/40",
                    glow: "group-hover:shadow-[0_0_20px_rgba(34,211,238,0.08)]",
                  },
                  {
                    label: "Goals Against",
                    value: standing.goals_againts,
                    icon: "shield",
                    color: "text-rose-300",
                    bg: "bg-rose-400/10",
                    border: "hover:border-rose-400/40",
                    glow: "group-hover:shadow-[0_0_20px_rgba(251,113,133,0.08)]",
                  },
                  {
                    label: "Goal Difference",
                    value:
                      standing.goal_difference > 0
                        ? `+${standing.goal_difference}`
                        : standing.goal_difference,
                    icon: "trending-up",
                    color:
                      standing.goal_difference > 0
                        ? "text-cyan-300"
                        : standing.goal_difference < 0
                          ? "text-rose-300"
                          : "text-slate-300",
                    bg:
                      standing.goal_difference > 0
                        ? "bg-cyan-400/10"
                        : standing.goal_difference < 0
                          ? "bg-rose-400/10"
                          : "bg-white/[0.05]",
                    border: "hover:border-purple-400/40",
                    glow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.08)]",
                  },
                  {
                    label: "Avg. Goals",
                    value:
                      Number(standing.match) > 0
                        ? (
                            Number(standing.goals_for) / Number(standing.match)
                          ).toFixed(2)
                        : "—",
                    icon: "chart-no-axes-combined",
                    color: "text-purple-300",
                    bg: "bg-purple-400/10",
                    border: "hover:border-purple-400/40",
                    glow: "group-hover:shadow-[0_0_20px_rgba(168,85,247,0.08)]",
                  },
                ].map((stat, index) => (
                  <div
                    key={stat.label}
                    className={`group relative overflow-hidden border border-white/10 bg-[#090f1e]/80 p-4 transition-all duration-300 hover:-translate-y-1 ${stat.border} ${stat.glow} sm:p-5`}
                  >
                    <div className="absolute right-0 top-0 h-px w-1/2 bg-linear-to-l from-white/20 to-transparent" />

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-500 sm:text-[10px]">
                        {stat.label}
                      </span>

                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center border border-white/5 ${stat.bg} ${stat.color}`}
                      >
                        <i data-lucide={stat.icon} className="h-4 w-4" />
                      </span>
                    </div>

                    <p
                      className={`mt-5 text-2xl font-black tracking-tight ${stat.color} sm:text-3xl`}
                    >
                      {stat.value}
                    </p>

                    <div className="mt-4 flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className={`h-[2px] flex-1 ${
                            i <= index ? "bg-cyan-400/50" : "bg-white/[0.06]"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="relative mt-8 flex flex-wrap items-center gap-3 border-t border-cyan-400/10 pt-5">
              <div className="flex h-9 w-9 items-center justify-center border border-purple-400/20 bg-purple-400/10 text-purple-300">
                <i data-lucide="trophy" className="h-4 w-4" />
              </div>

              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.25em] text-purple-300">
                  Bigger Dreams
                </p>

                <p className="mt-1 text-[9px] font-medium tracking-wide text-slate-500">
                  Stronger Together / {season}
                </p>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-cyan-400/50">
                  Analytics System
                </span>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="relative overflow-hidden border border-dashed border-cyan-400/20 bg-[#090f1e]/70 px-6 py-16 text-center">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-3xl" />

            <div className="relative mx-auto flex h-16 w-16 items-center justify-center border border-cyan-400/20 bg-cyan-400/5 text-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.08)]">
              <i data-lucide="chart-no-axes-combined" className="h-7 w-7" />
            </div>

            <p className="relative mt-5 text-[9px] font-black uppercase tracking-[0.3em] text-cyan-400">
              System / Data Unavailable
            </p>

            <h3 className="relative mt-3 text-lg font-black uppercase tracking-wide text-white">
              No Statistics Yet
            </h3>

            <p className="relative mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Belum ada statistik untuk klub ini pada musim {season}.
            </p>
          </div>
        )}
      </section>

      {/* ========================= PLAYERS ========================= */}
      <section className="relative mt-12">
        {/* Background glow */}
        <div className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full bg-cyan-500/[0.05] blur-[100px]" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-purple-500/[0.05] blur-[100px]" />

        {/* Header */}
        <div className="relative mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />

              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-cyan-400">
                Squad Management / Database
              </p>
            </div>

            <h2 className="text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
              Team <span className="text-cyan-400">Players</span>
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Daftar pemain yang terdaftar di klub ini.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Player counter */}
            <div className="border border-white/10 bg-white/[0.03] px-4 py-2.5">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
                Total Squad
              </p>

              <p className="mt-0.5 text-xl font-black text-cyan-300">
                {players.length.toString().padStart(2, "0")}
              </p>
            </div>

            {/* Add player */}
            <button
              type="button"
              onClick={() => setShowAddPlayer(true)}
              className="group relative inline-flex items-center gap-2 overflow-hidden border border-cyan-400/50 bg-cyan-400 px-5 py-3 text-xs font-black uppercase tracking-wider text-[#050711] shadow-[0_0_15px_rgba(34,211,238,0.12)] transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_0_25px_rgba(34,211,238,0.35)]"
            >
              <span className="text-lg leading-none transition-transform group-hover:rotate-90">
                +
              </span>
              Add Player
            </button>
          </div>
        </div>

        {/* Section separator */}
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-linear-to-r from-cyan-400/50 via-white/10 to-transparent" />

          <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-slate-600">
            Squad Members
          </span>
        </div>

        {/* Loading */}
        {loadingPlayers && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden border border-cyan-400/10 bg-[#090f1e]"
              >
                <div className="aspect-[4/4.5] animate-pulse bg-slate-800/70" />

                <div className="space-y-3 p-4">
                  <div className="h-5 w-2/3 animate-pulse bg-slate-800" />
                  <div className="h-3 w-1/3 animate-pulse bg-slate-800" />
                  <div className="h-8 animate-pulse bg-slate-800/60" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loadingPlayers && players.length === 0 && (
          <div className="relative flex min-h-80 flex-col items-center justify-center overflow-hidden border border-dashed border-cyan-400/20 bg-[#090f1e]/70 px-6 text-center">
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-[80px]" />

            <div className="relative flex h-20 w-20 items-center justify-center border border-cyan-400/20 bg-cyan-400/5 text-cyan-400 shadow-[0_0_25px_rgba(34,211,238,0.08)]">
              <i data-lucide="users" className="h-9 w-9" />
            </div>

            <p className="relative mt-6 text-[9px] font-black uppercase tracking-[0.3em] text-cyan-400">
              Database / Empty
            </p>

            <h3 className="relative mt-2 text-xl font-black uppercase text-white">
              No Players Found
            </h3>

            <p className="relative mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Belum ada pemain yang terdaftar. Tambahkan pemain untuk mulai
              membangun squad klub ini.
            </p>

            <button
              type="button"
              onClick={() => setShowAddPlayer(true)}
              className="relative mt-6 border border-cyan-400/50 bg-cyan-400 px-6 py-3 text-xs font-black uppercase tracking-wider text-[#050711] transition hover:bg-white hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
            >
              + Add First Player
            </button>
          </div>
        )}

        {/* Players Grid */}
        {!loadingPlayers && players.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {players.map((player) => (
              <div
                key={player._id}
                className="group relative min-w-0 overflow-hidden border border-white/10 bg-[#090f1e] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(34,211,238,0.10)]"
              >
                {/* Top accent */}
                <div className="absolute left-0 right-0 top-0 z-20 h-[2px] bg-linear-to-r from-transparent via-cyan-400 to-transparent opacity-40 transition-opacity group-hover:opacity-100" />

                {/* Player image */}
                <div className="relative aspect-[4/4.5] overflow-hidden bg-[#111827]">
                  {player.photo ? (
                    <img
                      src={`http://localhost:3000${player.photo}`}
                      alt={player.name_player}
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#111827] to-[#080d19]">
                      <span className="text-8xl font-black italic text-cyan-400/15">
                        {player.number}
                      </span>
                    </div>
                  )}

                  {/* Image overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-[#050711] via-[#050711]/10 to-[#050711]/20" />

                  {/* Jersey number */}
                  <div className="absolute left-4 top-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-cyan-400">
                      Jersey
                    </p>

                    <span className="block text-5xl font-black italic leading-none tracking-tighter text-white drop-shadow-[0_0_12px_rgba(34,211,238,0.3)]">
                      {player.number}
                    </span>
                  </div>

                  {/* Position badge */}
                  <div className="absolute right-3 top-3 border border-cyan-400/40 bg-[#050711]/80 px-3 py-1.5 backdrop-blur-md">
                    <span className="text-[9px] font-black uppercase tracking-wider text-cyan-300">
                      {player.position}
                    </span>
                  </div>

                  {/* Player name */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.25em] text-cyan-400">
                      Squad Member
                    </p>

                    <h3 className="break-words text-xl font-black uppercase leading-tight tracking-tight text-white">
                      {player.name_player}
                    </h3>

                    <div className="mt-3 h-px w-full bg-linear-to-r from-cyan-400/60 via-white/20 to-transparent" />
                  </div>
                </div>

                {/* Player information */}
                <div className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      Playing Position
                    </p>

                    <p className="mt-1 truncate text-sm font-bold text-slate-200">
                      {player.position}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-cyan-400/20 bg-cyan-400/5 text-sm font-black text-cyan-300 transition-all group-hover:border-cyan-400/50 group-hover:bg-cyan-400/10">
                    {player.number}
                  </div>
                </div>

                {/* Bottom decoration */}
                <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2.5">
                  <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-600">
                    Player Database
                  </span>

                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                    <span className="text-[8px] font-bold uppercase tracking-widest text-cyan-400/60">
                      Registered
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {!loadingPlayers && players.length > 0 && (
          <div className="mt-7 flex items-center gap-3 border-t border-white/[0.07] pt-5">
            <i data-lucide="database" className="h-4 w-4 text-cyan-400" />

            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Squad Database / {players.length} Registered Players
            </p>

            <div className="ml-auto h-px flex-1 bg-linear-to-r from-cyan-400/30 to-transparent" />
          </div>
        )}
      </section>

      {/* ========================= JADWAL PERTANDINGAN / SCHEDULE========================= */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">Schedule</h2>

        {loadingFixtures && <p>Loading schedule...</p>}

        {!loadingFixtures && matches.length === 0 && (
          <p className="text-zinc-500">Belum ada jadwal pertandingan.</p>
        )}

        <div className=" grid grid-cols-2 gap-3">
          {matches.map((match) => (
            <MatchCard
              key={match._id}
              match={match}
              // clubId={match._id!}
              onClick={() => setSelectedMatch(match)}
            />
          ))}
        </div>
      </section>
      {/* ========================= MODAL ADD PLAYER ========================= */}
      {showAddPlayer && id && (
        <AddPlayerModal
          clubId={id}
          onClose={() => setShowAddPlayer(false)}
          onSuccess={() => {
            setShowAddPlayer(false);

            getPlayersByClub(id)
              .then((data) => {
                setPlayers(data);
              })
              .catch((error) => {
                console.error(error);
              });
          }}
        />
      )}
      {/* ========================= MODAL EDIT CLUB ========================= */}
      {showEditClub && (
        <EditClubModal
          club={club}
          onClose={() => setShowEditClub(false)}
          onSave={handleSaveClub}
        />
      )}
      {/* ========================= MODAL ADD EDIT SCORE ========================= */}
      {selectedMatch && (
        <EditScoreModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onSave={handleSaveScore}
          onReset={handleResetMatch}
          onDelete={handleDeleteMatch}
        />
      )}
    </div>
  );
}
