import { useEffect, useState } from "react";
import {
  getTopScorers,
  getTopAssists,
  type PlayerStatistic,
} from "~/services/statisticsServices";

type StatisticType = "scorers" | "assists";

interface Props {
  type: StatisticType;
}

export default function PlayerStatistics({ type }: Props) {
  const [season, setSeason] = useState("2026/2027");
  const [players, setPlayers] = useState<PlayerStatistic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isScorers = type === "scorers";
  const title = isScorers ? "Top Scorers" : "Top Assists";
  const statLabel = isScorers ? "Gol" : "Assist";

  useEffect(() => {
    let active = true;

    async function loadStatistics() {
      setLoading(true);
      setError("");

      try {
        const result = isScorers
          ? await getTopScorers(season)
          : await getTopAssists(season);

        if (active) {
          setPlayers(result.data);
        }
      } catch {
        if (active) {
          setError("Statistik gagal dimuat. Silakan coba kembali.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadStatistics();

    return () => {
      active = false;
    };
  }, [type, season, isScorers]);

  const totalStats = players.reduce(
    (total, player) =>
      total +
      (Number(isScorers ? player.totalGoals : player.totalAssists) || 0),
    0,
  );

  const topPlayer = players[0];

  return (
    <main className="min-h-screen bg-[#0b0d10] px-4 py-8 text-[#e5e5e5] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-7">
        {/* Header */}
        <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121519] p-6 sm:p-9">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#c5a46d]/[0.04] to-transparent" />

          <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-end">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-8 bg-[#b9a078]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#b9a078]">
                  Football Analytics
                </span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                {title}
                <span className="text-[#b9a078]">.</span>
              </h1>

              <p className="mt-3 max-w-lg text-sm leading-6 text-[#858b94]">
                {isScorers
                  ? "Performa para pencetak gol terbaik sepanjang musim."
                  : "Kontribusi kreatif para pemain dengan assist terbanyak."}
              </p>
            </div>

            <label className="relative flex min-w-48 flex-col gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#858b94]">
                Season
              </span>

              <select
                value={season}
                onChange={(event) => setSeason(event.target.value)}
                className="cursor-pointer appearance-none rounded-lg border border-white/[0.10] bg-[#191d22] px-4 py-3 pr-10 text-sm font-medium text-[#e5e5e5] outline-none transition hover:border-[#b9a078]/50 focus:border-[#b9a078]"
              >
                <option value="2026/2027">2026/2027</option>
                <option value="2025/2026">2025/2026</option>
                <option value="2024/2025">2024/2025</option>
              </select>

              <span className="pointer-events-none absolute bottom-3.5 right-4 text-xs text-[#858b94]">
                ▾
              </span>
            </label>
          </div>
        </section>

        {/* Table */}
        <section className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#121519]">
          <div className="flex flex-col justify-between gap-3 border-b border-white/[0.07] px-5 py-5 sm:flex-row sm:items-center sm:px-7">
            <div>
              <h2 className="text-base font-semibold text-white">
                Player Rankings
              </h2>
              <p className="mt-1 text-xs text-[#858b94]">
                Season {season} <span className="mx-2 text-[#41464e]">/</span>{" "}
                Statistik {statLabel.toLowerCase()}
              </p>
            </div>

            <span className="w-fit rounded-md border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] font-medium text-[#a5aab2]">
              {loading ? "Memuat data..." : `${players.length} pemain`}
            </span>
          </div>

          {loading ? (
            <div className="space-y-5 p-6">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="flex animate-pulse items-center gap-4"
                >
                  <div className="h-9 w-9 rounded-lg bg-white/[0.06]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/3 rounded bg-white/[0.06]" />
                    <div className="h-2 w-1/5 rounded bg-white/[0.04]" />
                  </div>
                  <div className="h-7 w-10 rounded bg-white/[0.06]" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="px-5 py-14 text-center">
              <p className="text-sm text-[#d18b83]">{error}</p>
              <button
                onClick={() => setSeason((current) => current)}
                className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/[0.06]"
              >
                Coba lagi
              </button>
            </div>
          ) : players.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-xl text-[#b9a078]">
                ⚽
              </div>
              <h3 className="mt-4 text-sm font-semibold text-white">
                Belum ada statistik
              </h3>
              <p className="mt-2 text-xs text-[#858b94]">
                Belum ada data untuk musim {season}.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02] text-[10px] uppercase tracking-[0.16em] text-[#777f8a]">
                    <th className="px-5 py-4 font-medium sm:px-7">Rank</th>
                    <th className="px-5 py-4 font-medium">Pemain</th>
                    <th className="px-5 py-4 font-medium">Klub</th>
                    <th className="px-5 py-4 text-right font-medium sm:px-7">
                      {statLabel}
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.05]">
                  {players.map((item, index) => {
                    const statValue =
                      Number(isScorers ? item.totalGoals : item.totalAssists) ||
                      0;

                    return (
                      <tr
                        key={`${item.playerName}-${item.clubName}-${index}`}
                        className="group transition-colors hover:bg-white/[0.025]"
                      >
                        <td className="px-5 py-4 sm:px-7">
                          <span
                            className={`flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-semibold ${
                              index === 0
                                ? "border-[#b9a078]/30 bg-[#b9a078]/10 text-[#c7ae83]"
                                : "border-white/[0.06] bg-white/[0.025] text-[#858b94]"
                            }`}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/[0.08] bg-[#1b2026] text-sm font-semibold text-[#b9a078]">
                              {(item.playerName || "?")
                                .trim()
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium text-[#e5e5e5] transition-colors group-hover:text-white">
                                {item.playerName || "Nama pemain"}
                              </p>
                              {index === 0 && (
                                <span className="mt-1 block text-[9px] font-medium uppercase tracking-[0.18em] text-[#b9a078]">
                                  Top Performer
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm text-[#9299a3]">
                          {item.clubName || "Klub tidak tersedia"}
                        </td>

                        <td className="px-5 py-4 text-right sm:px-7">
                          <span className="text-lg font-semibold tabular-nums text-white">
                            {statValue}
                          </span>
                          <span className="ml-2 text-[10px] text-[#777f8a]">
                            {statLabel.toLowerCase()}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="border-t border-white/[0.06] px-5 py-4 sm:px-7">
            <p className="text-[10px] tracking-wide text-[#666d77]">
              FOOTBALL ANALYTICS
              <span className="mx-2">·</span>
              SEASON {season}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
