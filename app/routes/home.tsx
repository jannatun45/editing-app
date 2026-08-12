import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {


  return (
    <div className="min-h-screen bg-gray-200">
      {/* Toolbar */}
      <div className="h-16 bg-gray-300 flex items-center px-5">
        <h1 className="text-xl font-bold">My Editor</h1>

      </div>
      {/* Workspace */}
      <div className="min-h-[calc(100vh-64px)] flex justify-center items-start p-10">
        {/* Kertas */}
        <div className="relative w-198.5 h-280.75 bg-white text-gray-600 shadow-lg rounded-md">

        </div>
      </div>
    </div>
  );
}
