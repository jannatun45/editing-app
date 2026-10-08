import { useParams } from "react-router";

export default function MatchPosterPage() {
  const { id } = useParams();

  return (
    <main className="min-h-screen  p-6">
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-bold">Poster Pertandingan</h1>

        <p className="mt-4">ID pertandingan: {id}</p>
      </div>
    </main>
  );
}
