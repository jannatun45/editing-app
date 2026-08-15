import { Link } from "react-router";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-200 px-6">
      <div className="text-center">
        <h1 className="text-9xl font-black tracking-tight text-gray-800">
          404
        </h1>

        <h2 className="mt-4 text-3xl font-bold text-gray-700">
          Halaman Tidak Ditemukan
        </h2>

        <p className="mt-3 max-w-md text-gray-500">
          Maaf, halaman yang kamu cari tidak tersedia atau URL yang kamu
          masukkan tidak benar.
        </p>

        <Link
          to="/"
          className="
            mt-8
            inline-flex
            items-center
            rounded-lg
            bg-blue-500
            px-6
            py-3
            font-medium
            text-white
            transition
            hover:bg-blue-600
          "
        >
          Kembali ke Home
        </Link>
      </div>
    </main>
  );
}