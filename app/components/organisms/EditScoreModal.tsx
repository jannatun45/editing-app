import { useEffect, useState, type FormEvent } from "react";
import { resetFixtureResult } from "~/services/fixturesServices";

import { getPlayersByClub } from "~/services/playerServices";
import type { Fixture, FixtureGoalInput } from "~/types/api/fixtures";
import type { Player } from "~/types/api/player";

type GoalInput = {
  club: string;
  scorer: string;
  minute: string;
  assist: string;
};

type EditScoreModalProps = {
  fixture: Fixture;
  onClose: () => void;
  onReset: () => Promise<void>;

  onSave: (
    matchday: number,
    matchDate: string,
    homeScore: number,
    awayScore: number,
    goals: GoalInput[],
  ) => void;
};

export default function EditScoreModal({
  fixture,
  onClose,
  onSave,
  onReset,
}: EditScoreModalProps) {
  // =========================
  // JADWAL
  // =========================

  const [matchday, setMatchday] = useState(fixture.matchday.toString());

  const [matchDate, setMatchDate] = useState(
    fixture.match_date
      ? new Date(fixture.match_date).toISOString().slice(0, 16)
      : "",
  );

  // =========================
  // SCORE
  // =========================

  const [homeScore, setHomeScore] = useState(
    fixture.home_score?.toString() ?? "0",
  );

  const [awayScore, setAwayScore] = useState(
    fixture.away_score?.toString() ?? "0",
  );

  // =========================
  // PLAYERS
  // =========================

  const [homePlayers, setHomePlayers] = useState<Player[]>([]);

  const [awayPlayers, setAwayPlayers] = useState<Player[]>([]);

  const [loadingPlayers, setLoadingPlayers] = useState(true);

  // =========================
  // GOALS
  // =========================

  const [goals, setGoals] = useState<GoalInput[]>([]);

  const [error, setError] = useState("");

  // =========================
  // LOAD PLAYERS
  // =========================

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        setLoadingPlayers(true);
        setError("");

        const [homeData, awayData] = await Promise.all([
          getPlayersByClub(fixture.home_club._id),
          getPlayersByClub(fixture.away_club._id),
        ]);

        setHomePlayers(homeData);
        setAwayPlayers(awayData);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Gagal mengambil player",
        );
      } finally {
        setLoadingPlayers(false);
      }
    };

    loadPlayers();
  }, [fixture.home_club._id, fixture.away_club._id]);

  // =========================
  // LOAD EXISTING GOALS
  // =========================

  useEffect(() => {
    if (!fixture.goals) return;

    const existingGoals: GoalInput[] = fixture.goals.map((goal) => ({
      club: goal.club._id,
      scorer: goal.scorer._id,
      minute: goal.minute.toString(),
      assist: goal.assist?._id ?? "",
    }));

    setGoals(existingGoals);
  }, [fixture.goals]);

  // =========================
  // ADD GOAL
  // =========================

  const handleAddGoal = () => {
    setGoals((currentGoals) => [
      ...currentGoals,
      {
        club: fixture.home_club._id,
        scorer: "",
        minute: "",
        assist: "",
      },
    ]);
  };

  // =========================
  // REMOVE GOAL
  // =========================

  const handleRemoveGoal = (index: number) => {
    setGoals((currentGoals) =>
      currentGoals.filter((_, goalIndex) => goalIndex !== index),
    );
  };

  // =========================
  //  HANDLE RESET RESULT
  // =========================
  const handleResetResult = async () => {
    try {
      setError("");

      await resetFixtureResult(fixture._id);

      await onReset();

      onClose();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal mereset hasil pertandingan",
      );
    }
  };

  // =========================
  // UPDATE GOAL
  // =========================
  const handleGoalChange = (
    index: number,
    field: keyof GoalInput,
    value: string,
  ) => {
    setGoals((currentGoals) =>
      currentGoals.map((goal, goalIndex) => {
        if (goalIndex !== index) {
          return goal;
        }

        // Kalau club pencetak gol berubah,
        // reset scorer dan assist.
        if (field === "club") {
          return {
            ...goal,
            club: value,
            scorer: "",
            assist: "",
          };
        }

        // Kalau scorer berubah dan scorer
        // sama dengan assist, reset assist.
        if (field === "scorer" && goal.assist === value) {
          return {
            ...goal,
            scorer: value,
            assist: "",
          };
        }

        return {
          ...goal,
          [field]: value,
        };
      }),
    );
  };

  // =========================
  // HANDLE SUBMIT
  // =========================
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    const day = Number(matchday);
    const home = Number(homeScore);
    const away = Number(awayScore);

    // Validasi matchday
    if (!matchday || day < 1) {
      setError("Matchday harus diisi.");
      return;
    }

    // Validasi tanggal dan waktu
    if (!matchDate) {
      setError("Tanggal dan waktu pertandingan harus diisi.");
      return;
    }

    // Validasi score
    if (home < 0 || away < 0) {
      setError("Score tidak boleh negatif.");
      return;
    }

    // Jumlah goal harus sama dengan total score
    if (goals.length !== home + away) {
      setError(
        `Jumlah pencetak gol harus ${home + away} karena skor ${home}-${away}.`,
      );
      return;
    }

    // Validasi setiap goal
    for (const goal of goals) {
      if (!goal.club) {
        setError("Club pencetak gol belum dipilih.");
        return;
      }

      if (!goal.scorer) {
        setError("Pencetak gol belum dipilih.");
        return;
      }

      if (!goal.minute) {
        setError("Menit gol belum diisi.");
        return;
      }
    }

    onSave(day, matchDate, home, away, goals);
  };

  // =========================
  // GET PLAYERS
  // =========================
  const getPlayers = (clubId: string) => {
    if (clubId === fixture.home_club._id) {
      return homePlayers;
    }

    return awayPlayers;
  };

  // =========================
  // GET PLAYER NAME
  // =========================
  const getPlayerName = (playerId: string) => {
    const player = [...homePlayers, ...awayPlayers].find(
      (player) => player._id === playerId,
    );

    return player?.name_player ?? "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-zinc-900 p-6">
        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Edit Pertandingan</h2>

            <p className="mt-1 text-sm text-zinc-500">
              {fixture.home_club.name_club}
              {" vs "}
              {fixture.away_club.name_club}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-zinc-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* =========================
              SCHEDULE
          ========================= */}

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
            <h3 className="mb-4 font-semibold text-white">
              Jadwal Pertandingan
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Matchday */}

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Matchday
                </label>

                <input
                  type="number"
                  min="1"
                  value={matchday}
                  onChange={(event) => setMatchday(event.target.value)}
                  className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white outline-none"
                />
              </div>

              {/* Date + Time */}

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  Tanggal & Waktu
                </label>

                <input
                  type="datetime-local"
                  value={matchDate}
                  onChange={(event) => setMatchDate(event.target.value)}
                  className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* =========================
              SCORE
          ========================= */}

          <div>
            <h3 className="mb-4 font-semibold text-white">Score</h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Home */}

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  {fixture.home_club.name_club}
                </label>

                <input
                  type="number"
                  min="0"
                  value={homeScore}
                  onChange={(event) => setHomeScore(event.target.value)}
                  className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-center text-2xl font-bold text-white outline-none"
                />
              </div>

              {/* Away */}

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  {fixture.away_club.name_club}
                </label>

                <input
                  type="number"
                  min="0"
                  value={awayScore}
                  onChange={(event) => setAwayScore(event.target.value)}
                  className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-center text-2xl font-bold text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* =========================
              GOALS
          ========================= */}

          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">Goal Events</h3>

                <p className="text-sm text-zinc-500">
                  {goals.length} goal
                  {goals.length !== 1 ? "s" : ""}
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddGoal}
                disabled={loadingPlayers}
                className="rounded-lg bg-zinc-800 px-4 py-2 text-sm text-white hover:bg-zinc-700 disabled:opacity-50"
              >
                + Add Goal
              </button>
            </div>

            {loadingPlayers && (
              <p className="text-sm text-zinc-500">Loading players...</p>
            )}

            {!loadingPlayers && goals.length === 0 && (
              <div className="rounded-lg border border-dashed border-zinc-700 p-6 text-center">
                <p className="text-sm text-zinc-500">Belum ada pencetak gol.</p>
              </div>
            )}

            <div className="space-y-4">
              {goals.map((goal, index) => {
                const players = getPlayers(goal.club);

                return (
                  <div
                    key={index}
                    className="rounded-xl border border-zinc-800 bg-zinc-950 p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <p className="font-medium text-white">Goal {index + 1}</p>

                      <button
                        type="button"
                        onClick={() => handleRemoveGoal(index)}
                        className="text-sm text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Club */}

                      <div>
                        <label className="mb-2 block text-sm text-zinc-400">
                          Club
                        </label>

                        <select
                          value={goal.club}
                          onChange={(event) =>
                            handleGoalChange(index, "club", event.target.value)
                          }
                          className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white outline-none"
                        >
                          <option value={fixture.home_club._id}>
                            {fixture.home_club.name_club}
                          </option>

                          <option value={fixture.away_club._id}>
                            {fixture.away_club.name_club}
                          </option>
                        </select>
                      </div>

                      {/* Minute */}

                      <div>
                        <label className="mb-2 block text-sm text-zinc-400">
                          Minute
                        </label>

                        <input
                          type="number"
                          min="1"
                          max="120"
                          value={goal.minute}
                          onChange={(event) =>
                            handleGoalChange(
                              index,
                              "minute",
                              event.target.value,
                            )
                          }
                          placeholder="23"
                          className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white outline-none"
                        />
                      </div>

                      {/* Scorer */}

                      <div>
                        <label className="mb-2 block text-sm text-zinc-400">
                          Scorer
                        </label>

                        <select
                          value={goal.scorer}
                          onChange={(event) =>
                            handleGoalChange(
                              index,
                              "scorer",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white outline-none"
                        >
                          <option value="">Select player</option>

                          {players.map((player) => (
                            <option key={player._id} value={player._id}>
                              #{player.number} {player.name_player}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Assist */}

                      <div>
                        <label className="mb-2 block text-sm text-zinc-400">
                          Assist
                        </label>

                        <select
                          value={goal.assist}
                          onChange={(event) =>
                            handleGoalChange(
                              index,
                              "assist",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-lg bg-zinc-800 px-4 py-3 text-white outline-none"
                        >
                          <option value="">No Assist</option>

                          {players
                            .filter((player) => player._id !== goal.scorer)
                            .map((player) => (
                              <option key={player._id} value={player._id}>
                                #{player.number} {player.name_player}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>

                    {/* Preview */}

                    {goal.scorer && (
                      <div className="mt-4 rounded-lg bg-zinc-900 p-3 text-sm">
                        <span className="text-white">
                          {getPlayerName(goal.scorer)}
                        </span>

                        <span className="text-zinc-500"> {goal.minute}'</span>

                        {goal.assist && (
                          <span className="text-zinc-500">
                            {" "}
                            • Assist: {getPlayerName(goal.assist)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ERROR */}

          {error && (
            <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* BUTTON */}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleResetResult}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
            >
              Reset Result
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-zinc-800 px-5 py-2.5 text-white hover:bg-zinc-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-white px-5 py-2.5 font-medium text-black hover:bg-zinc-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
