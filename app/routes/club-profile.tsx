import { useEffect, useState } from "react";
import { useParams } from "react-router";

import FixtureCard from "~/components/organisms/FictureCard";

import { getClubById } from "~/services/clubsServices";
import { getClubFixtures } from "~/services/fixturesServices";
import { getStandings } from "~/services/standingServices";

import type { Club } from "~/types/api/clubs";
import type { Fixture } from "~/types/api/fixtures";
import type { Standing } from "~/types/api/standings";

import { getPlayersByClub } from "~/services/playerServices";
import type { Player } from "~/types/api/player";
import AddPlayerModal from "~/components/organisms/AddPlayerModal";

export default function ClubProfile() {
  const { id } = useParams();

  const [players, setPlayers] = useState<Player[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);

  const [club, setClub] = useState<Club | null>(null);
  const [standing, setStanding] = useState<Standing | null>(null);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingFixtures, setLoadingFixtures] = useState(false);

  const [showAddPlayer, setShowAddPlayer] = useState(false);

  const [error, setError] = useState("");

  const season = "2026/2027";

  useEffect(() => {
    if (!id) return;

    const loadPlayers = async () => {
      try {
        setLoadingPlayers(true);

        const data = await getPlayersByClub(id);

        console.log("players in club profile -> ", data);

        setPlayers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingPlayers(false);
      }
    };

    const loadClubProfile = async () => {
      try {
        setLoading(true);
        setError("");

        // Ambil data club
        const clubData = await getClubById(id);

        setClub(clubData);

        // Ambil semua standing season
        const standings = await getStandings(season);

        // Cari standing milik club ini
        const clubStanding = standings.find(
          (standing) => standing.club._id === id,
        );

        setStanding(clubStanding ?? null);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Gagal mengambil data club",
        );
      } finally {
        setLoading(false);
      }
    };

    const loadFixtures = async () => {
      try {
        setLoadingFixtures(true);

        const data = await getClubFixtures(id);

        setFixtures(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingFixtures(false);
      }
    };
    loadPlayers();
    loadClubProfile();
    loadFixtures();
  }, [id]);

  if (loading) {
    return <div>Loading club...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!club) {
    return <div>Club tidak ditemukan.</div>;
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

        {standing ? (
          <div className="grid grid-cols-4 gap-4">
            <p>Points: {standing.points}</p>
            <p>Match: {standing.match}</p>
            <p>Win: {standing.win}</p>
            <p>Draw: {standing.draw}</p>
            <p>Lose: {standing.lose}</p>
            <p>GF: {standing.goals_for}</p>
            <p>GA: {standing.goals_againts}</p>
            <p>GD: {standing.goal_difference}</p>
          </div>
        ) : (
          <p className="text-zinc-500">Belum ada data statistik.</p>
        )}
      </section>

      {/* palyaer */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Players</h2>

          <button
            type="button"
            onClick={() => setShowAddPlayer(true)}
            className="rounded-lg bg-white px-4 py-2 font-medium text-black hover:bg-zinc-200"
          >
            + Add Player
          </button>
        </div>

        {loadingPlayers && <p className="text-zinc-500">Loading players...</p>}

        {!loadingPlayers && players.length === 0 && (
          <p className="text-zinc-500">Belum ada player.</p>
        )}

        {!loadingPlayers && players.length > 0 && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {players.map((player) => (
              <div
                key={player._id}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
              >
                {/* <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-zinc-800">
                  <span className="text-4xl font-bold text-zinc-500">
                    {player.number}
                  </span>
                </div> */}
                <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-zinc-800">
                  {player.photo ? (
                    <img
                      src={`http://localhost:3000${player.photo}`}
                      alt={player.name_player}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  ) : (
                    <span className="text-5xl font-bold text-zinc-600">
                      {player.number}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">
                      {player.name_player}
                    </p>

                    <p className="text-sm text-zinc-500">{player.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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

      {/* modal add player */}
      {showAddPlayer && id && (
        <AddPlayerModal
          clubId={id}
          onClose={() => setShowAddPlayer(false)}
          onSuccess={() => {
            setShowAddPlayer(false);

            getPlayersByClub(id)
              .then((data) => {
                setPlayers(data);
              })
              .catch((error) => {
                console.error(error);
              });
          }}
        />
      )}
    </div>
  );
}
