import MainLayout from "../components/templates/MainLayout";
export default function Home() {
  return (
    <MainLayout>
      <section className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.3em]  text-gray-400">
            Welcome
          </p>

          <h1 className="text-6xl font-black uppercase">Global</h1>

          <p className="mt-4 text-gray-400">Your next interactive experience</p>
        </div>
      </section>
    </MainLayout>
  );
}
