import { useEffect, useState } from "react";

import { getStandings } from "~/services/standingServices";

import type { Standing } from "~/types/api/standings";
import Td from "../atoms/Td";
import Th from "../atoms/Th";
import { Shield } from "lucide-react";

export default function Table() {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [season, setSeason] = useState("2026/2027");
  // Menentukan apakah data sedang dimuat.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Mengambil data klasemen dari backend.
  const loadStandings = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getStandings(season);

      setStandings(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Gagal mengambil standing",
      );
    } finally {
      setLoading(false);
    }
  };

  // Mengambil ulang data ketika season berubah.
  useEffect(() => {
    loadStandings();
  }, [season]);

  const sanctionedClubIds = [
    "6aaddf8688b36e2c1186f662",
    "6aaddf6288b36e2c1186f661",
  ];

  const adjustedStandings = standings
    .map((standing) => ({
      ...standing,
      adjustedPoints: sanctionedClubIds.includes(standing.club._id)
        ? standing.points - 2
        : standing.points,
    }))
    .sort(
      (a, b) =>
        b.adjustedPoints - a.adjustedPoints ||
        b.goal_difference - a.goal_difference ||
        b.goals_for - a.goals_for,
    );
  console.log(adjustedStandings);

  return (
    <div className="w-full">
      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && <p className="text-zinc-400">Loading...</p>}

      {/* Table */}
      {!loading && standings.length > 0 && (
        <div className="rounded-bl-4xl shadow-xl mr-24 bg-gray-100 border border-gray-200">
          <div>
            <table className="w-full">
              {/* ================= HEADER ================= */}
              <thead className="bg-gray-200 inset-5 inset-shadow-amber-950">
                <tr>
                  {/* Pos */}
                  <Th>Pos</Th>

                  {/* Teams */}
                  <Th className="text-left">Teams</Th>

                  {/* M */}
                  <Th>M</Th>

                  {/* W */}
                  <Th>M</Th>

                  {/* D */}
                  <Th>S</Th>

                  {/* L */}
                  <Th>L</Th>

                  {/* GF */}
                  <Th>GM</Th>

                  {/* GA */}
                  <Th>GK</Th>

                  {/* GD */}
                  <Th>SG</Th>

                  {/* PTS */}
                  <Th>PTS</Th>
                </tr>
              </thead>

              {/* ================= BODY ================= */}
              <tbody className="divide-y divide-gray-100">
                {adjustedStandings.map((standing, index) => {
                  const goalDifference = standing.goal_difference;

                  return (
                    <tr
                      key={standing.club._id}
                      className="transition-colors hover:bg-gray-200"
                    >
                      {/* Posisi */}
                      <Td className="text-center ">{index + 1}</Td>

                      {/* Club */}
                      <Td
                        className="text-left"
                        spanClassName="font-semibold uppercase text-xl tracking-wider text-gray-900 flex items-center gap-3 group"
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
                          <p className="font-bold text-zinc-600 capitalize transition group-hover:text-amber-300">
                            {standing.club.name_club}
                          </p>
                        </div>
                        {/* {standing.club.name_club} */}
                      </Td>

                      {/* M */}
                      <Td className="text-center">{standing.match}</Td>

                      {/* W */}
                      <Td className="text-center text-emerald-400">
                        {standing.win}
                      </Td>

                      {/* D */}
                      <Td className="text-center text-zinc-400">
                        {standing.draw}
                      </Td>

                      {/* L */}
                      <Td className="text-center text-red-400">
                        {standing.lose}
                      </Td>

                      {/* GF */}
                      <Td className="text-center text-emerald-400">
                        {standing.goals_for}
                      </Td>

                      {/* GA */}
                      <Td className="text-center">{standing.goals_againts}</Td>

                      {/* GD */}
                      <Td
                        className="text-center"
                        spanClassName={
                          goalDifference > 0
                            ? "text-emerald-400"
                            : "text-red-400"
                        }
                      >
                        {goalDifference > 0
                          ? `+${goalDifference}`
                          : goalDifference}
                      </Td>

                      {/* PTS */}
                      <Td className="text-center" spanClassName="font-bold">
                        {standing.adjustedPoints}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && standings.length === 0 && !error && (
        <p className="text-zinc-500">Belum ada data klasemen.</p>
      )}
    </div>
  );
}
