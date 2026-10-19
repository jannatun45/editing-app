import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Trophy,
  Shield,
  CalendarDays,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

import Container from "~/components/templates/Container";
import { getStandings } from "~/services/standingServices";
import type { Standing } from "~/types/api/standings";

export default function StandingPage() {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [season, setSeason] = useState("2026/2027");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadStandings = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getStandings(season);

      // console.log("Fetched standings for season", season, ":", data);
      setStandings(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data klasemen",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStandings();
  }, [season]);

  const getPositionStyle = (index: number) => {
    if (index === 0) {
      return "bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30";
    }

    if (index === 1) {
      return "bg-zinc-300/10 text-zinc-300 ring-1 ring-zinc-400/20";
    }

    if (index === 2) {
      return "bg-orange-500/10 text-orange-300 ring-1 ring-orange-400/20";
    }

    return "bg-zinc-800 text-zinc-400";
  };

  return (
    <Container>
      <div className="min-h-full space-y-7 pb-8 text-white">
        {/* HEADER */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#182438] via-[#111827] to-[#0b1120] p-6 sm:p-8">
          {/* Background decoration */}
          <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                <Trophy size={14} />
                League Competition
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                League <span className="text-amber-400">Standing</span>
              </h1>

              <p className="mt-2 max-w-lg text-sm leading-6 text-zinc-400 sm:text-base">
                Klasemen liga, statistik pertandingan, dan persaingan klub
                sepanjang musim.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label
                htmlFor="season"
                className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-400"
              >
                <CalendarDays size={15} />
                Pilih Musim
              </label>

              <div className="relative">
                <select
                  id="season"
                  value={season}
                  onChange={(event) => setSeason(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-white/10 bg-[#0b1120] py-3 pl-4 pr-11 text-sm font-bold text-white outline-none transition hover:border-amber-400/40 focus:border-amber-400 sm:min-w-40"
                >
                  <option value="2026/2027">2026/2027</option>
                  <option value="2027/2028">2027/2028</option>
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
              </div>
            </div>
          </div>

          <div className="relative mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-5 text-xs text-zinc-400">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Data klasemen musim {season}
            </span>

            <span className="flex items-center gap-2">
              <Shield size={14} />
              Statistik klub
            </span>
          </div>
        </section>

        {/* LOADING */}
        {loading && (
          <div className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-2xl border border-white/5 bg-[#111827]">
            <RefreshCw size={30} className="animate-spin text-amber-400" />
            <div className="text-center">
              <p className="font-semibold text-white">Memuat klasemen</p>
              <p className="mt-1 text-sm text-zinc-500">
                Mengambil data klub dan statistik musim...
              </p>
            </div>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={22} className="mt-0.5 shrink-0 text-red-400" />

              <div className="flex-1">
                <h2 className="font-bold text-red-300">
                  Gagal memuat klasemen
                </h2>
                <p className="mt-1 text-sm text-zinc-400">{error}</p>

                <button
                  type="button"
                  onClick={loadStandings}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-400/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-400/20"
                >
                  <RefreshCw size={15} />
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STANDINGS TABLE */}
        {!loading && !error && (
          <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#111827] shadow-2xl shadow-black/10">
            {/* Table header */}
            <div className="flex flex-col justify-between gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:p-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
                    <Trophy size={20} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">Klasemen Liga</h2>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      Musim {season}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2 sm:self-auto">
                <TrendingUp size={16} className="text-emerald-400" />
                <span className="text-xs font-medium text-zinc-300">
                  {standings.length} Klub Terdaftar
                </span>
              </div>
            </div>

            {standings.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-500">
                  <Trophy size={28} />
                </div>

                <h3 className="mt-4 font-bold text-white">
                  Belum Ada Data Klasemen
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                  Belum ada klub yang terdaftar pada musim {season}, atau data
                  klasemen belum dibuat.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.025] text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                      <th className="w-16 px-5 py-4 text-center">Pos</th>
                      <th className="min-w-56 px-4 py-4 text-left">Klub</th>
                      <th className="px-3 py-4 text-center">M</th>
                      <th className="px-3 py-4 text-center">M</th>
                      <th className="px-3 py-4 text-center">S</th>
                      <th className="px-3 py-4 text-center">K</th>
                      <th className="px-3 py-4 text-center">GM</th>
                      <th className="px-3 py-4 text-center">GK</th>
                      <th className="px-3 py-4 text-center">SG</th>
                      <th className="px-5 py-4 text-center">PTS</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/[0.05]">
                    {standings.map((standing, index) => (
                      <tr
                        key={standing._id}
                        className="group transition-colors duration-200 hover:bg-white/[0.035]"
                      >
                        {/* Position */}
                        <td className="px-5 py-4 text-center">
                          <span
                            className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-black ${getPositionStyle(index)}`}
                          >
                            {index + 1}
                          </span>
                        </td>

                        {/* Club */}
                        <td className="px-4 py-4">
                          <Link
                            to={`/club/${standing.club._id}`}
                            className="flex w-fit items-center gap-3"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-1.5 transition group-hover:border-amber-400/30 group-hover:bg-amber-400/5">
                              {standing.club.logo ? (
                                <img
                                  src={
                                    standing.club.logo.startsWith("http")
                                      ? standing.club.logo
                                      : `http://localhost:3000/images/clubs/${standing.club.logo}`
                                  }
                                  alt={`Logo ${standing.club.name_club}`}
                                  className="h-full w-full object-contain"
                                />
                              ) : (
                                <Shield size={21} className="text-zinc-500" />
                              )}
                            </div>

                            <div>
                              <p className="font-bold text-zinc-100 transition group-hover:text-amber-300">
                                {standing.club.name_club}
                              </p>
                              <p className="mt-1 text-[11px] text-zinc-500">
                                Football Club
                              </p>
                            </div>
                          </Link>
                        </td>

                        {/* Played */}
                        <td className="px-3 py-4 text-center tabular-nums text-zinc-300">
                          {standing.match}
                        </td>

                        {/* Wins */}
                        <td className="px-3 py-4 text-center tabular-nums text-emerald-400">
                          {standing.win}
                        </td>

                        {/* Draws */}
                        <td className="px-3 py-4 text-center tabular-nums text-zinc-400">
                          {standing.draw}
                        </td>

                        {/* Losses */}
                        <td className="px-3 py-4 text-center tabular-nums text-red-400">
                          {standing.lose}
                        </td>

                        {/* Goals for */}
                        <td className="px-3 py-4 text-center tabular-nums text-zinc-300">
                          {standing.goals_for}
                        </td>

                        {/* Goals against */}
                        <td className="px-3 py-4 text-center tabular-nums text-zinc-400">
                          {standing.goals_againts}
                        </td>

                        {/* Goal difference */}
                        <td className="px-3 py-4 text-center tabular-nums">
                          <span
                            className={
                              standing.goal_difference > 0
                                ? "font-semibold text-emerald-400"
                                : standing.goal_difference < 0
                                  ? "font-semibold text-red-400"
                                  : "text-zinc-400"
                            }
                          >
                            {standing.goal_difference > 0 ? "+" : ""}
                            {standing.goal_difference}
                          </span>
                        </td>

                        {/* Points */}
                        <td className="px-5 py-4 text-center">
                          <span className="inline-flex min-w-12 items-center justify-center rounded-lg bg-amber-400/10 px-3 py-2 text-base font-black tabular-nums text-amber-300 transition group-hover:bg-amber-400/15">
                            {standing.points}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer */}
            {standings.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 bg-white/[0.02] px-5 py-4 text-[11px] text-zinc-500 sm:px-6">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-sm bg-amber-400" />
                  Peringkat 1
                </span>

                <span>M: Main</span>
                <span>S: Seri</span>
                <span>K: Kalah</span>
                <span>GM: Gol Memasukkan</span>
                <span>GK: Gol Kemasukan</span>
                <span>SG: Selisih Gol</span>
              </div>
            )}
          </section>
        )}
      </div>
    </Container>
  );
}
