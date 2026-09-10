import { useEffect, useState } from "react";
import MainLayout from "../components/templates/MainLayout";
import type { Clubs } from "../types/api/clubs";
import { getClubs } from "~/services/productServices";

export default function Pertanyaan() {
  const [clubs, setClubs] = useState<Clubs[]>([]);

  useEffect(() => {
    getClubs()
      .then((data) => {
        setClubs(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <MainLayout>
      <section className="flex min-h-screen items-center justify-center">
        <h1>THIS IS THE QUESTION PAGE.</h1>
        {clubs.map((club) => (
          <div key={club._id}>
            <h2>{club.name_club}</h2>
            <p>{club.stadium}</p>
            <p>{club.city}</p>
          </div>
        ))}
      </section>
    </MainLayout>
  );
}
