import type { Route } from "./+types/profile";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Profile" },
    { name: "description", content: "Halaman Profile" },
  ];
}

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold">
        Profile
      </h1>

      <p className="mt-4 text-gray-600">
        Ini adalah halaman profile.
      </p>
    </div>
  );
}