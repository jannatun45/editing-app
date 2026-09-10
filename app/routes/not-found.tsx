import { useLocation } from "react-router";
import Strong from "~/components/atoms/Strong";
import MainLayout from "~/components/templates/MainLayout";

export default function NotFound() {
  const location = useLocation();
  const currentUrl =
    window.location.origin + location.pathname + location.search;
  return (
    <MainLayout>
      <section className="flex min-h-screen items-center justify-center  px-6">
        <div className="text-center">
          <h1 className="text-9xl font-black tracking-tight text-gray-800">
            404
          </h1>

          <h2 className="mt-4 text-3xl font-bold text-gray-700">
            Halaman Tidak Ditemukan
          </h2>

          <p className="mt-3 max-w-md text-gray-500">
            Maaf, <Strong>{currentUrl}</Strong> halaman yang kamu cari tidak
            tersedia atau URL yang kamu masukkan tidak benar.
          </p>
        </div>
      </section>
    </MainLayout>
  );
}
