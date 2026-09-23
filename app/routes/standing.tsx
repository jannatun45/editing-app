import { useEffect, useState } from "react";
import { Link } from "react-router";
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

      setStandings(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Gagal mengambil standing",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStandings();
  }, [season]);

  if (loading) {
    return (
      <Container>
        <p>Loading...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <p>{error}</p>
      </Container>
    );
  }

  return (
    <Container>
      <div className="space-y-6">
        {/* Season */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Standing</h1>

          <select
            value={season}
            onChange={(event) => setSeason(event.target.value)}
            className="rounded-lg bg-zinc-800 px-4 py-2 text-white"
          >
            <option value="2026/2027">2026/2027</option>

            <option value="2027/2028">2027/2028</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 text-sm text-zinc-500">
                <th className="px-4 py-3 text-left">#</th>

                <th className="px-4 py-3 text-left">Club</th>

                <th className="px-4 py-3">M</th>

                <th className="px-4 py-3">W</th>

                <th className="px-4 py-3">D</th>

                <th className="px-4 py-3">L</th>

                <th className="px-4 py-3">GF</th>

                <th className="px-4 py-3">GA</th>

                <th className="px-4 py-3">GD</th>

                <th className="px-4 py-3">PTS</th>
              </tr>
            </thead>

            <tbody>
              {standings.map((standing, index) => (
                <tr key={standing._id} className="border-b border-zinc-900">
                  <td className="px-4 py-4 text-zinc-500">{index + 1}</td>

                  <td className="px-4 py-4">
                    <div className="font-semibold text-white">
                      <Link
                        to={`/club/${standing.club._id}`}
                        className="font-semibold hover:underline"
                      >
                        {standing.club.name_club}
                      </Link>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-center">{standing.match}</td>

                  <td className="px-4 py-4 text-center">{standing.win}</td>

                  <td className="px-4 py-4 text-center">{standing.draw}</td>

                  <td className="px-4 py-4 text-center">{standing.lose}</td>

                  <td className="px-4 py-4 text-center">
                    {standing.goals_for}
                  </td>

                  <td className="px-4 py-4 text-center">
                    {standing.goals_againts}
                  </td>

                  <td className="px-4 py-4 text-center">
                    {standing.goal_difference}
                  </td>

                  <td className="px-4 py-4 text-center font-bold text-white">
                    {standing.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
}
