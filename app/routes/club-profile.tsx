import { useEffect, useState } from "react";
import { useParams } from "react-router";

// import services
import { getClubById, updateClub } from "~/services/clubsServices";
import {
  getClubMatches,
  resetMatchResult,
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

  // =========================
  // LOAD CLUB DATA
  // =========================
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

        console.log("Fixtures for club =>", id, data);

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

  // ========================
  // LOAD GOAL EVENTS
  // ========================
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

  // =========================
  // HANDLE RESET RESULT
  // =========================
  const handleResetResult = async () => {
    // posisi scroll saat ini
    const scrollPosition = window.scrollY;
    try {
      setLoading(true);
      setError("");

      if (!selectedMatch) {
        return;
      }

      // RESET MATCH
      await resetMatchResult(selectedMatch._id);

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
      <section className="relative isolate mt-2 min-h-[360px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 md:min-h-[420px]">
        {/* Background stadion */}
        <img
          src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=2000&q=85"
          alt="Stadion sepak bola"
          className="absolute inset-0 -z-20 h-full w-full object-cover mask-y-from-70% mask-y-to-90%"
        />

        {/* Overlay agar teks terbaca */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/80 to-black/20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-transparent to-black/20" />

        <div className="flex min-h-[360px] flex-col justify-between p-6 md:min-h-[420px] md:p-10">
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
      <section className="relative isolate overflow-hidden rounded-2xl border border-slate-700/70 bg-[#07111f]">
        {/* Background stadion */}
        <img
          src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1600&q=85"
          alt="Football stadium"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-40"
        />

        {/* Overlay */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#07111f] via-[#07111f]/95 to-[#07111f]/35" />

        <div className="grid gap-6 p-6 md:grid-cols-2 md:p-8">
          {/* Stadium */}
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 text-2xl text-amber-400">
              <span aria-hidden="true">⌂</span>
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                Home Ground
              </p>
              <h3 className="mt-2 truncate text-lg font-bold text-white">
                {club.stadium || "Stadium belum diatur"}
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Official Home Stadium
              </p>
            </div>
          </div>

          {/* District */}
          <div className="flex items-center gap-4 border-t border-white/10 pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10 text-2xl text-amber-400">
              <span aria-hidden="true">⌖</span>
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">
                Club District
              </p>
              <h3 className="mt-2 truncate text-lg font-bold text-white">
                {club.district || "District belum diatur"}
              </h3>
              <p className="mt-1 text-sm text-slate-400">Club Location</p>
            </div>
          </div>
        </div>

        {/* Gold accent */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-amber-300/40 to-transparent" />
      </section>
      {/* ========================= STANDING STATISTICS ========================= */}
      <section className="overflow-hidden rounded-2xl border border-slate-700/70 bg-gradient-to-br from-[#0b1728] via-[#07111f] to-[#050b14] p-5 md:p-8">
        {/* Heading */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10 text-3xl text-amber-400">
              <span aria-hidden="true">
                ▥ <i data-lucide="chart-no-axes-combined"></i>{" "}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-tight text-white md:text-3xl">
                Statistics
              </h2>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Team Performance · {season}
              </p>
            </div>
          </div>

          <span className="rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-amber-300">
            Season {season}
          </span>
        </div>

        {standing ? (
          <>
            {/* Statistics cards */}
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {[
                {
                  label: "Points",
                  value: standing.points,
                  icon: "★",
                  color: "amber",
                },
                {
                  label: "Matches",
                  value: standing.match,
                  icon: "⚽",
                  color: "blue",
                },
                {
                  label: "Wins",
                  value: standing.win,
                  icon: "♜",
                  color: "emerald",
                },
                {
                  label: "Draws",
                  value: standing.draw,
                  icon: "⇄",
                  color: "amber",
                },
                {
                  label: "Losses",
                  value: standing.lose,
                  icon: "×",
                  color: "rose",
                },
                {
                  label: "Goals For",
                  value: standing.goals_for,
                  icon: "⚽",
                  color: "violet",
                },
                {
                  label: "Goals Against",
                  value: standing.goals_againts,
                  icon: "⬡",
                  color: "cyan",
                },
                {
                  label: "Goal Difference",
                  value:
                    standing.goal_difference > 0
                      ? `+${standing.goal_difference}`
                      : standing.goal_difference,
                  icon: "◎",
                  color: "teal",
                },
              ].map((stat) => {
                const colors = {
                  amber: {
                    border: "border-amber-400/20",
                    icon: "bg-amber-400/10 text-amber-300 ring-amber-400/20",
                    value: "text-amber-300",
                    bottom: "bg-amber-400",
                  },
                  blue: {
                    border: "border-blue-400/20",
                    icon: "bg-blue-400/10 text-blue-300 ring-blue-400/20",
                    value: "text-blue-300",
                    bottom: "bg-blue-400",
                  },
                  emerald: {
                    border: "border-emerald-400/20",
                    icon: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20",
                    value: "text-emerald-300",
                    bottom: "bg-emerald-400",
                  },
                  rose: {
                    border: "border-rose-400/20",
                    icon: "bg-rose-400/10 text-rose-300 ring-rose-400/20",
                    value: "text-rose-300",
                    bottom: "bg-rose-400",
                  },
                  violet: {
                    border: "border-violet-400/20",
                    icon: "bg-violet-400/10 text-violet-300 ring-violet-400/20",
                    value: "text-violet-300",
                    bottom: "bg-violet-400",
                  },
                  cyan: {
                    border: "border-cyan-400/20",
                    icon: "bg-cyan-400/10 text-cyan-300 ring-cyan-400/20",
                    value: "text-cyan-300",
                    bottom: "bg-cyan-400",
                  },
                  teal: {
                    border: "border-teal-400/20",
                    icon: "bg-teal-400/10 text-teal-300 ring-teal-400/20",
                    value: "text-teal-300",
                    bottom: "bg-teal-400",
                  },
                };

                const style = colors[stat.color as keyof typeof colors];

                return (
                  <div
                    key={stat.label}
                    className={`group relative overflow-hidden rounded-2xl border ${style.border} bg-slate-900/60 p-4 transition duration-300 hover:-translate-y-1 hover:bg-slate-800/80 md:p-5`}
                  >
                    {/* Decorative background */}
                    <div className="pointer-events-none absolute -right-3 -top-5 select-none text-8xl font-black text-white/[0.025] transition group-hover:text-white/[0.06]">
                      {stat.icon}
                    </div>

                    <div className="relative">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-full text-xl ring-1 ${style.icon}`}
                      >
                        {stat.icon}
                      </div>

                      <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                        {stat.label}
                      </p>

                      <p
                        className={`mt-2 text-3xl font-black tracking-tight text-white md:text-4xl`}
                      >
                        {stat.value}
                      </p>
                    </div>

                    <div
                      className={`absolute bottom-0 left-0 h-1 w-full ${style.bottom} opacity-80 transition group-hover:h-1.5`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-xl text-amber-400">
                ★
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">
                  Bigger Dreams
                </p>
                <p className="mt-1 text-xs font-medium tracking-wider text-slate-400">
                  Stronger Together
                </p>
              </div>

              <div className="ml-auto hidden h-px min-w-10 flex-1 bg-gradient-to-r from-amber-400/50 to-transparent sm:block" />
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800 text-2xl text-slate-400">
              ▥
            </div>

            <h3 className="mt-4 font-bold text-white">No Statistics Yet</h3>

            <p className="mt-2 text-sm text-slate-400">
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
          onReset={handleResetResult}
        />
      )}
    </div>
  );
}
