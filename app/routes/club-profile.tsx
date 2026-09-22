import { useEffect, useState } from "react";
import { useParams } from "react-router";
import FixtureCard from "~/components/organisms/FictureCard";

import { getClubById } from "~/services/clubsServices";
import { getClubFixtures } from "~/services/fixturesServices";

import type { Club } from "~/types/api/clubs";
import type { Fixture } from "~/types/api/fixtures";

export default function ClubProfile() {
  const { id } = useParams();

  const [club, setClub] = useState<Club | null>(null);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loadingFixtures, setLoadingFixtures] = useState(false);

  useEffect(() => {
    if (!id) return;

    getClubById(id)
      .then((data) => {
        console.log("data in club profile -> ", data);
        setClub(data);
      })
      .catch((error) => {
        console.error(error);
      });

    setLoadingFixtures(true);

    getClubFixtures(id)
      .then((data) => {
        console.log("data match in club profile -> ", data);

        setFixtures(data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoadingFixtures(false);
      });
  }, [id]);

  if (!club) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Club header */}
      <section className="mt-2 flex h-72 items-end justify-between rounded-tl-3xl bg-zinc-600">
        <h1 className="mx-7 mb-7 text-5xl font-bold uppercase tracking-wider">
          {club.name_club}
        </h1>
      </section>

      {/* Club information */}
      <section>
        <p>Stadium: {club.stadium}</p>
        <p>District: {club.district}</p>
      </section>

      {/* Standing */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">Statistics</h2>

        <div className="grid grid-cols-4 gap-4">
          <p>Points: {club.points}</p>
          <p>Match: {club.match}</p>
          <p>Win: {club.win}</p>
          <p>Lose: {club.lose}</p>
          <p>GF: {club.goals_for}</p>
          <p>GA: {club.goals_againts}</p>
          <p>GD: {club.goal_difference}</p>
        </div>
      </section>

      {/* Jadwal pertandingan */}
      <section>
        <h2 className="mb-4 text-2xl font-bold">Schedule</h2>

        {loadingFixtures && <p>Loading schedule...</p>}

        {!loadingFixtures && fixtures.length === 0 && (
          <p className="text-zinc-500">Belum ada jadwal pertandingan.</p>
        )}

        <div className="space-y-3">
          {fixtures.map((fixture) => (
            <FixtureCard key={fixture._id} fixture={fixture} clubId={id!} />
          ))}
        </div>
      </section>
    </div>
  );
}
