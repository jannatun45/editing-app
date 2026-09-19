import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getClub } from "~/services/clubsServices";
import type { Club } from "~/types/api/clubs";

export default function ClubProfile() {
  const { id } = useParams();

  const [club, setClub] = useState<Club | null>(null);

  useEffect(() => {
    if (!id) return;

    // Ambil data club berdasarkan ID URL
    getClub(id)
      .then((data) => {
        setClub(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  if (!club) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <section className="rounded-tl-3xl bg-zinc-600 h-72 mt-2 flex justify-between items-end">
        <h1 className="text-5xl font-bold uppercase tracking-wider mx-7 mb-7">
          {club.name_club}
        </h1>
      </section>

      <p>Stadium: {club.stadium}</p>
      <p>District: {club.district}</p>

      <div>
        <p>Points: {club.points}</p>
        <p>Match: {club.match}</p>
        <p>Win: {club.win}</p>
        <p>Lose: {club.lose}</p>
        <p>GF: {club.goals_for}</p>
        <p>GA: {club.goals_againts}</p>
        <p>GD: {club.goal_difference}</p>
      </div>
    </div>
  );
}
