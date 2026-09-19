import { useEffect, useState } from "react";
import { getClubs } from "~/services/clubsServices";
import type { Club } from "~/types/api/clubs";
import { tableFeatures, useTable, type ColumnDef } from "@tanstack/react-table";
import Container from "~/components/templates/Container";
import AddClubModal from "~/components/organisms/AddClubModal";
import Button from "~/components/atoms/Button";
import { Link } from "react-router";

// 2. Declare which features this table uses / Sebutkan fitur-fitur apa saja yang digunakan oleh tabel ini
const features = tableFeatures({});

// 3. Define your columns /  Selecting a column / menentukan kolom
const columns: Array<ColumnDef<typeof features, Club>> = [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "name_club",
    header: "Club",
    cell: ({ row }) => (
      <Link
        to={`/club/${row.original._id}`}
        className="font-semibold hover:underline"
      >
        {row.original.name_club}
      </Link>
    ),
  },
  {
    accessorKey: "points",
    header: "pts",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "match",
    header: "M",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "win",
    header: "W",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "lose",
    header: "L",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "goals_for",
    header: "GF",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "goals_againts",
    header: "GA",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "goal_difference",
    header: "GD",
    cell: (info) => info.getValue(),
  },
];

export default function Standing() {
  // 4. data awal berasal dari API
  const [data, setData] = useState<Club[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadClubs = () => {
    getClubs()
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // 5. ambil data dari express api
  useEffect(() => {
    loadClubs();
  }, []);

  // 5. Create the table instance
  const table = useTable({
    key: "club-table",
    features,
    columns,
    data,
  });

  return (
    <Container>
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
                        header.column.id === "name_club"
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
                        cell.column.id === "name_club"
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
      </div>{" "}
      <div className="">
        <div className="mb-6 ">
          <h1 className="text-2xl font-bold uppercase">crud</h1>

          <Button onClick={() => setIsModalOpen(true)} className="">
            + Add Club
          </Button>
        </div>

        {/* Tabel club kamu */}

        {isModalOpen && (
          <AddClubModal
            onClose={() => setIsModalOpen(false)}
            onSuccess={loadClubs}
          />
        )}
      </div>
    </Container>
  );
}
