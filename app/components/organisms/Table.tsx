import { useEffect, useState } from "react";

import { tableFeatures, useTable } from "@tanstack/react-table";

import type { ColumnDef } from "@tanstack/react-table";

import { getStandings } from "~/services/standingServices";

import type { Standing } from "~/types/api/standings";

const features = tableFeatures({});

const columns: Array<ColumnDef<typeof features, Standing>> = [
  {
    accessorKey: "position",
    header: "Pos",
    cell: (info) => {
      const rowIndex = info.row.index;

      return <span className="font-medium">{rowIndex + 1}</span>;
    },
  },

  {
    accessorKey: "club",
    header: "Teams",
    cell: (info) => {
      const standing = info.row.original;

      return <span className="font-medium">{standing.club.name_club}</span>;
    },
  },

  {
    accessorKey: "points",
    header: "PTS",
    cell: (info) => (
      <span className="font-bold">{info.getValue<number>()}</span>
    ),
  },

  {
    accessorKey: "match",
    header: "P",
  },

  {
    accessorKey: "win",
    header: "W",
  },

  {
    accessorKey: "draw",
    header: "D",
  },

  {
    accessorKey: "lose",
    header: "L",
  },

  {
    accessorKey: "goals_for",
    header: "GF",
  },

  {
    accessorKey: "goals_againts",
    header: "GA",
  },

  {
    accessorKey: "goal_difference",
    header: "GD",

    cell: (info) => {
      const value = info.getValue<number>();

      return <span>{value > 0 ? `+${value}` : value}</span>;
    },
  },
];

export default function Table() {
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

  const table = useTable({
    key: "standing-table",
    features,
    columns,
    data: standings,
  });

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">League Table</h1>

          <p className="text-zinc-500">
            Klasemen berdasarkan hasil pertandingan
          </p>
        </div>

        {/* Season */}
        <select
          value={season}
          onChange={(event) => setSeason(event.target.value)}
          className="rounded-lg bg-zinc-800 px-4 py-2 text-white outline-none"
        >
          <option value="2026/2027">2026/2027</option>

          <option value="2027/2028">2027/2028</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-500/10 p-4 text-red-400">{error}</div>
      )}

      {/* Loading */}
      {loading && <p className="text-zinc-400">Loading...</p>}

      {/* Table */}
      {!loading && (
        <div className="overflow-hidden rounded-tl-2xl shadow-sm ">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={`whitespace-nowrap border-b border-gray-200 px-4 py-3 text-xl font-semibold uppercase tracking-wide text-gray-500 ${
                          header.column.id === "club"
                            ? "text-left"
                            : "text-center"
                        }`}
                      >
                        {header.isPlaceholder ? null : (
                          <table.FlexRender header={header} />
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody className="divide-y divide-gray-100">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-gray-200"
                  >
                    {row.getAllCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`whitespace-nowrap px-4 py-4 text-2xl text-gray-700 ${
                          cell.column.id === "club"
                            ? "text-left"
                            : "text-center"
                        }`}
                      >
                        <table.FlexRender cell={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && standings.length === 0 && (
        <p className="text-zinc-500">Belum ada data klasemen.</p>
      )}
    </div>
  );
}
