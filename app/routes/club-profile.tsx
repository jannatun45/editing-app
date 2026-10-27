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
      <section className="relative isolate mt-2 min-h-90 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 md:min-h-105">
        {/* Background stadion */}
        <img
          src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=2000&q=85"
          alt="Stadion sepak bola"
          className="absolute inset-0 -z-20 h-full w-full object-cover mask-y-from-70% mask-y-to-90%"
        />

        {/* Overlay agar teks terbaca */}
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-black via-black/80 to-black/20" />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/90 via-transparent to-black/20" />

        <div className="flex min-h-90 flex-col justify-between p-6 md:min-h-105 md:p-10">
          {/* Label atas */}
          <div className="flex items-center justify-between">
            <span className="rounded-full border border-white/15 bg-black/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-300 backdrop-blur-md">
              Club Profile
            </span>

            <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-300">
              Season 2026/2027
            </span>
          </div>

          {/* Informasi utama */}
          <div className="mt-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              {/* Logo klub */}
              <div className="mb-5 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-amber-400/40 bg-black/50 p-2 shadow-xl shadow-black/30 backdrop-blur-md">
                {club.logo ? (
                  <img
                    src={`http://localhost:3000/images/clubs/${club.logo}`}
                    alt={`Logo ${club.name_club}`}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-3xl font-black text-amber-400">
                    {club.name_club.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>

              <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-amber-400">
                Stronger Together
              </p>

              <h1 className="text-4xl font-black uppercase tracking-tight text-white drop-shadow-lg md:text-6xl">
                {club.name_club}
              </h1>

              <div className="mt-5 flex flex-wrap gap-x-7 gap-y-3 text-sm text-zinc-300">
                <div className="flex items-center gap-2">
                  <span className="text-lg text-amber-400">⌂</span>
                  <div>
                    <p className="font-semibold text-white">
                      {club.stadium || "Stadion belum diatur"}
                    </p>
                    <p className="text-xs text-zinc-400">Home Stadium</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-lg text-amber-400">⌖</span>
                  <div>
                    <p className="font-semibold text-white">
                      {club.district || "Distrik belum diatur"}
                    </p>
                    <p className="text-xs text-zinc-400">District</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tombol edit tetap berfungsi */}
            <button
              type="button"
              onClick={() => setShowEditClub(true)}
              className="inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-amber-400 px-6 py-3.5 font-bold text-zinc-950 shadow-lg shadow-amber-950/30 transition hover:-translate-y-0.5 hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-zinc-950"
            >
              <span aria-hidden="true">✎</span>
              Edit Club
              <span aria-hidden="true">→</span>
            </button>
          </div>

          {/* Garis dekoratif */}
          <div className="mt-8 h-px bg-gradient-to-r from-amber-400/70 via-white/20 to-transparent" />
        </div>
      </section>
      {/* ========================= CLUB LOCATION ========================= */}

      {/* ========================= STANDING STATISTICS ========================= */}

      <section className="relative overflow-hidden rounded-3xl border border-white/8 bg-[#080e19] p-5 shadow-2xl shadow-black/20 md:p-8">
        {/* Background decoration */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-emerald-400/[0.06] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-amber-400/[0.04] blur-3xl" />

        {/* Header */}
        <div className="relative mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
              <i data-lucide="chart-no-axes-combined" className="h-6 w-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight text-white md:text-3xl">
                  Team Statistics
                </h2>
                <span className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                  Overview
                </span>
              </div>
              <p className="mt-1 text-xs font-medium tracking-wide text-slate-500">
                Performance Analytics · {season}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
            <span className="text-xs font-semibold text-slate-300">
              Season {season}
            </span>
          </div>
        </div>

        {standing ? (
          <>
            {/* Main layout */}
            <div className="relative grid gap-5 lg:grid-cols-5">
              {/* Donut chart panel */}
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 sm:p-7 lg:col-span-3">
                <div className="mb-6 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Match Results
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Distribution of team results
                    </p>
                  </div>

                  <span className="rounded-lg bg-white/[0.05] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {standing.match > 0 ? "Season stats" : "No matches"}
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
                      color: "#34d399",
                      length: winLength,
                      offset: 0,
                    },
                    {
                      label: "Draws",
                      value: draws,
                      color: "#fbbf24",
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
                    <div className="grid items-center gap-7 sm:grid-cols-2 sm:gap-5">
                      {/* SVG donut */}
                      <div className="mx-auto w-full max-w-[240px]">
                        <div className="relative mx-auto aspect-square w-full">
                          <div className="pointer-events-none absolute inset-[15%] rounded-full bg-emerald-400/[0.04] blur-2xl" />

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
                              stroke="rgba(255,255,255,0.055)"
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
                              />
                            ))}
                          </svg>

                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                              Matches
                            </span>
                            <span className="mt-1 text-4xl font-black tracking-tighter text-white sm:text-5xl">
                              {matches}
                            </span>
                            <span className="mt-1 text-[10px] font-medium text-slate-500">
                              Played
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="space-y-5">
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
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{
                                      backgroundColor: segment.color,
                                      boxShadow: `0 0 12px ${segment.color}55`,
                                    }}
                                  />
                                  <span className="text-sm font-semibold text-slate-300">
                                    {segment.label}
                                  </span>
                                </div>

                                <div className="text-right">
                                  <span className="text-base font-black text-white">
                                    {segment.value}
                                  </span>
                                  <span className="ml-1.5 text-xs text-slate-500">
                                    {percentage.toFixed(0)}%
                                  </span>
                                </div>
                              </div>

                              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                                <div
                                  className="h-full rounded-full transition-all duration-700"
                                  style={{
                                    width: `${percentage}%`,
                                    backgroundColor: segment.color,
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}

                        <div className="border-t border-white/[0.07] pt-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-slate-500">
                              Win rate
                            </span>
                            <span className="text-lg font-black text-emerald-300">
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

              {/* Points highlight */}
              <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-300/15 bg-gradient-to-br from-amber-300/[0.12] via-[#15140f] to-[#0d1019] p-6 lg:col-span-2">
                <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-amber-300/[0.08] blur-2xl" />

                <div className="relative flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200/70">
                      Total Points
                    </p>
                    <p className="mt-3 text-5xl font-black tracking-tighter text-white sm:text-6xl">
                      {standing.points}
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      Points earned this season
                    </p>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-300/20 bg-amber-300/10 text-amber-300">
                    <i data-lucide="trophy" className="h-6 w-6" />
                  </div>
                </div>

                <div className="relative mt-8 border-t border-white/[0.08] pt-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-slate-400">
                      Points per match
                    </span>
                    <span className="text-sm font-bold text-amber-200">
                      {Number(standing.match) > 0
                        ? (
                            Number(standing.points) / Number(standing.match)
                          ).toFixed(2)
                        : "—"}
                    </span>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-amber-500 to-yellow-200"
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

                  <p className="mt-2 text-[10px] text-slate-500">
                    Points earned compared with the maximum available
                  </p>
                </div>
              </div>
            </div>

            {/* Supporting statistics */}
            <div className="relative mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                {
                  label: "Goals For",
                  value: standing.goals_for,
                  icon: "goal",
                  color: "text-emerald-300",
                  bg: "bg-emerald-400/10",
                  border: "border-emerald-400/10",
                },
                {
                  label: "Goals Against",
                  value: standing.goals_againts,
                  icon: "shield",
                  color: "text-rose-300",
                  bg: "bg-rose-400/10",
                  border: "border-rose-400/10",
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
                      ? "text-emerald-300"
                      : standing.goal_difference < 0
                        ? "text-rose-300"
                        : "text-slate-300",
                  bg:
                    standing.goal_difference > 0
                      ? "bg-emerald-400/10"
                      : standing.goal_difference < 0
                        ? "bg-rose-400/10"
                        : "bg-white/[0.05]",
                  border: "border-white/[0.07]",
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
                  color: "text-sky-300",
                  bg: "bg-sky-400/10",
                  border: "border-sky-400/10",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`group relative overflow-hidden rounded-2xl border ${stat.border} bg-white/[0.025] p-4 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.05] sm:p-5`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 sm:text-xs">
                      {stat.label}
                    </span>
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}
                    >
                      <i data-lucide={stat.icon} className="h-4 w-4" />
                    </span>
                  </div>

                  <p
                    className={`mt-4 text-2xl font-black tracking-tight ${stat.color} sm:text-3xl`}
                  >
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="relative mt-7 flex flex-wrap items-center gap-3 border-t border-white/[0.07] pt-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-300/10 bg-amber-300/[0.06] text-amber-300">
                <i data-lucide="trophy" className="h-4 w-4" />
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-200">
                  Bigger Dreams
                </p>
                <p className="mt-1 text-[10px] font-medium tracking-wide text-slate-500">
                  Stronger Together · {season}
                </p>
              </div>

              <div className="ml-auto hidden h-px min-w-10 flex-1 bg-linear-to-r from-amber-300/30 to-transparent sm:block" />
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04] text-slate-500">
              <i data-lucide="chart-no-axes-combined" className="h-6 w-6" />
            </div>

            <h3 className="mt-5 text-base font-bold text-white">
              No Statistics Yet
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Belum ada statistik untuk klub ini pada musim {season}.
            </p>
          </div>
        )}
      </section>

      {/* ========================= PLAYERS ========================= */}
      <section className="mt-10">
        {/* Header */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Squad
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
              Players
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Daftar pemain yang terdaftar di klub ini.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddPlayer(true)}
            className="group flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-200 hover:shadow-lg"
          >
            <span className="text-lg leading-none transition-transform duration-300 group-hover:rotate-90">
              +
            </span>
            Add Player
          </button>
        </div>

        {/* Loading */}
        {loadingPlayers && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900"
              >
                <div className="h-56 animate-pulse bg-zinc-800" />

                <div className="space-y-3 p-4">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-800" />
                  <div className="h-3 w-1/3 animate-pulse rounded bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loadingPlayers && players.length === 0 && (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/50 px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800">
              <span className="text-2xl text-zinc-500">⚽</span>
            </div>

            <h3 className="font-semibold text-white">Belum Ada Player</h3>

            <p className="mt-1 max-w-sm text-sm text-zinc-500">
              Tambahkan pemain untuk mulai membangun squad klub ini.
            </p>

            <button
              type="button"
              onClick={() => setShowAddPlayer(true)}
              className="mt-5 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              + Add First Player
            </button>
          </div>
        )}

        {/* Players */}
        {!loadingPlayers && players.length > 0 && (
          <div className="players-scroll flex flex-nowrap gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
            {players.map((player) => (
              <div
                key={player._id}
                className="group relative w-64 shrink-0 snap-start overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-2xl"
              >
                {/* Player Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-zinc-800">
                  {player.photo ? (
                    <img
                      src={`http://localhost:3000${player.photo}`}
                      alt={player.name_player}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-[100px] font-black leading-none text-zinc-700">
                        {player.number}
                      </span>
                    </div>
                  )}

                  {/* Dark Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                  {/* Jersey Number */}
                  <div className="absolute left-4 top-4">
                    <span className="text-5xl font-black italic tracking-tighter text-white/90 drop-shadow-lg">
                      {player.number}
                    </span>
                  </div>

                  {/* Position Badge */}
                  <div className="absolute right-3 top-3">
                    <span className="rounded-full border border-white/20 bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                      {player.position}
                    </span>
                  </div>

                  {/* Player Name On Image */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="truncate text-lg font-bold text-white">
                      {player.name_player}
                    </p>

                    <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-zinc-400">
                      Player
                    </p>
                  </div>
                </div>

                {/* Bottom Info */}
                <div className="flex items-center justify-between border-t border-zinc-800 px-4 py-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                      Position
                    </p>

                    <p className="mt-0.5 text-sm font-semibold text-zinc-200">
                      {player.position}
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-sm font-bold text-zinc-300 transition-colors group-hover:bg-white group-hover:text-black">
                    {player.number}
                  </div>
                </div>
              </div>
            ))}
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
