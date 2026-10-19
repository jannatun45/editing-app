// app/components/organisms/Table.tsx

import { useEffect, useState } from "react";
import { getStandings } from "~/services/standingServices";
import type { Standing } from "~/types/api/standings";

export default function Table() {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [season] = useState("2026/2027");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStandings = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getStandings(season);
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

    loadStandings();
  }, [season]);

  const positionStyle = (index: number) => {
    if (index === 0) {
      return "border-amber-400 bg-amber-400 text-[#111827]";
    }

    if (index === 1) {
      return "border-zinc-300 bg-zinc-300 text-[#111827]";
    }

    if (index === 2) {
      return "border-orange-400 bg-orange-400 text-[#111827]";
    }

    return "border-white/10 bg-white/5 text-zinc-400";
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-lg text-zinc-400">
        Memuat klasemen...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-400/20 bg-red-400/5 p-8 text-center text-lg text-red-300">
        {error}
      </div>
    );
  }

  if (standings.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-lg text-zinc-400">
        Belum ada data klasemen.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111827]/95">
      <table className="w-full table-fixed border-collapse">
        <thead>
          <tr className="border-b border-amber-400/30 bg-white/[0.04] text-[17px] font-black uppercase tracking-wider text-zinc-400">
            <th className="w-[76px] px-2 py-5 text-center">Pos</th>
            <th className="px-3 py-5 text-left">Klub</th>
            <th className="w-[62px] px-1 py-5 text-center">MP</th>
            <th className="w-[58px] px-1 py-5 text-center">W</th>
            <th className="w-[58px] px-1 py-5 text-center">D</th>
            <th className="w-[58px] px-1 py-5 text-center">L</th>
            <th className="w-[62px] px-1 py-5 text-center">GF</th>
            <th className="w-[62px] px-1 py-5 text-center">GA</th>
            <th className="w-[68px] px-1 py-5 text-center">GD</th>
            <th className="w-[82px] px-2 py-5 text-center text-amber-400">
              PTS
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-white/[0.07]">
          {standings.map((standing, index) => {
            const goalDifference = standing.goal_difference;

            return (
              <tr
                key={standing._id}
                className="h-[88px] transition-colors hover:bg-white/[0.04]"
              >
                {/* Position */}
                <td className="px-2 py-4 text-center">
                  <span
                    className={`inline-flex h-11 min-w-11 items-center justify-center rounded-xl border text-lg font-black ${positionStyle(index)}`}
                  >
                    {index + 1}
                  </span>
                </td>

                {/* Club */}
                <td className="overflow-hidden px-3 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] p-1.5">
                      {standing.club.logo ? (
                        <img
                          src={
                            standing.club.logo.startsWith("http")
                              ? standing.club.logo
                              : `http://localhost:3000${standing.club.logo}`
                          }
                          alt={`Logo ${standing.club.name_club}`}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-lg font-black text-zinc-500">
                          {standing.club.name_club.slice(0, 1).toUpperCase()}
                        </span>
                      )}
                    </div>

                    <span className="truncate text-[19px] font-extrabold uppercase tracking-wide text-white">
                      {standing.club.name_club}
                    </span>
                  </div>
                </td>

                {/* Matches Played */}
                <td className="px-1 py-4 text-center text-lg font-semibold tabular-nums text-zinc-300">
                  {standing.match}
                </td>

                {/* Wins */}
                <td className="px-1 py-4 text-center text-lg font-bold tabular-nums text-emerald-400">
                  {standing.win}
                </td>

                {/* Draws */}
                <td className="px-1 py-4 text-center text-lg tabular-nums text-zinc-300">
                  {standing.draw}
                </td>

                {/* Losses */}
                <td className="px-1 py-4 text-center text-lg tabular-nums text-red-400">
                  {standing.lose}
                </td>

                {/* Goals For */}
                <td className="px-1 py-4 text-center text-lg tabular-nums text-zinc-300">
                  {standing.goals_for}
                </td>

                {/* Goals Against */}
                <td className="px-1 py-4 text-center text-lg tabular-nums text-zinc-400">
                  {standing.goals_againts}
                </td>

                {/* Goal Difference */}
                <td className="px-1 py-4 text-center text-lg font-bold tabular-nums">
                  <span
                    className={
                      goalDifference > 0
                        ? "text-emerald-400"
                        : goalDifference < 0
                          ? "text-red-400"
                          : "text-zinc-400"
                    }
                  >
                    {goalDifference > 0 ? "+" : ""}
                    {goalDifference}
                  </span>
                </td>

                {/* Points */}
                <td className="px-2 py-4 text-center">
                  <span className="inline-flex min-w-[54px] items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 px-2 py-2 text-xl font-black tabular-nums text-amber-300">
                    {standing.points}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-white/10 bg-white/[0.025] px-5 py-5 text-sm font-medium text-zinc-500">
        <span>MP: Main</span>
        <span>W: Menang</span>
        <span>D: Seri</span>
        <span>L: Kalah</span>
        <span>GF: Gol memasukkan</span>
        <span>GA: Gol kemasukan</span>
        <span>GD: Selisih gol</span>
      </div>
    </div>
  );
}
