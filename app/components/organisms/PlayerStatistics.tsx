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

  useEffect(() => {
    let active = true;

    async function loadStatistics() {
      setLoading(true);
      setError("");

      try {
        const result =
          type === "scorers"
            ? await getTopScorers(season)
            : await getTopAssists(season);

        if (active) {
          setPlayers(result.data);
        }
      } catch {
        if (active) {
          setError("Statistik gagal dimuat.");
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
  }, [type, season]);

  const title = type === "scorers" ? "Top Score" : "Top Assist";

  const statLabel = type === "scorers" ? "Gol" : "Assist";

  const statKey = type === "scorers" ? "goals" : "assists";

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{title}</h1>

        <label className="flex items-center gap-2">
          <span>Musim</span>
          <select
            value={season}
            onChange={(event) => setSeason(event.target.value)}
            className="rounded border px-3 py-2"
          >
            <option value="2026/2027">2026/2027</option>
            <option value="2025/2026">2025/2026</option>
            <option value="2024/2025">2024/2025</option>
          </select>
        </label>
      </div>

      {loading && <p>Memuat statistik...</p>}

      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Pemain</th>
                <th className="p-3">Klub</th>
                <th className="p-3 text-right">{statLabel}</th>
              </tr>
            </thead>

            <tbody>
              {players.map((item, index) => {
                const playerName =
                  item.player.name_player ?? item.player.name ?? "Nama pemain";

                return (
                  <tr
                    key={`${item.player._id}-${item.club._id}`}
                    className="border-t"
                  >
                    <td className="p-3">{index + 1}</td>

                    <td className="p-3 font-medium">{String(playerName)}</td>

                    <td className="p-3">{item.club.name_club}</td>

                    <td className="p-3 text-right font-bold">
                      {item[statKey] ?? 0}
                    </td>
                  </tr>
                );
              })}

              {players.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-gray-500">
                    Belum ada statistik untuk musim ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
