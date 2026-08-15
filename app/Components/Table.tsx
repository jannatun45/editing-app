import { tableFeatures, useTable } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import { teamsData,type Teams } from '~/data/LeagueTable'

// 3. New in v9: declare which features this table uses (none yet)
const features = tableFeatures({})

// 4. Define your columns
const columns: Array<ColumnDef<typeof features, Teams>> = [
  {
    accessorKey: "position",
    header: "Pos",
  },
  {
    accessorKey: "name",
    header: "Teams",
    cell: (info) => <span>{info.getValue<string>()}</span>,
  },
  {
    accessorKey: "points",
    header: "PTS",
    cell: (info) => <span className='font-bold'>{info.getValue<number>()}</span>,
  },
  {
    accessorKey: "played",
    header: "P",
  },
  {
    accessorKey: "wins",
    header: "W",
  },
  {
    accessorKey: "draws",
    header: "D",
  },
  {
    accessorKey: "losses",
    header: "L",
  },
  {
    accessorKey: "goalsFor",
    header: "GF",
  },
  {
    accessorKey: "goalsAgainst",
    header: "GA",
  },
  {
    accessorKey: "goalDifference",
    header: "GD",
    cell: (info) => {
      const value = info.getValue<number>();

      return <span>{value > 0 ? `+${value}` : value}</span>;
    },
  },
];

export default function Table() {
  // 5. Create the table instance
  const table = useTable({
    key: 'person-table', // needed for devtools, omit if you don't want to use the devtools
    features,
    columns,
    data: teamsData,
  })

  // 6. Render markup from the table instance APIs
return (
  <div className="overflow-hidden rounded-tl-2xl shadow-sm">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`whitespace-nowrap border-b border-gray-200 px-4 py-3 text-xl font-semibold uppercase tracking-wide text-gray-500 ${
                    header.column.id === "name" ? "text-left" : "text-center"
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
            <tr key={row.id} className="transition-colors hover:bg-gray-200">
              {row.getAllCells().map((cell) => (
                <td
                  key={cell.id}
                  className={`whitespace-nowrap px-4 py-4 text-2xl text-gray-700 ${
                    cell.column.id === "name" ? "text-left" : "text-center"
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
);
}