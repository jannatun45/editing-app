import { useEffect, useState, type FormEvent } from "react";
// import services
import { resetMatchResult } from "~/services/matchServices";
import { getPlayersByClub } from "~/services/playerServices";
// import types
import type { Match, MatchGoalInput } from "~/types/api/matches";
import type { Player } from "~/types/api/player";

type EditScoreModalProps = {
  match: Match;
  onClose: () => void;
  onReset: () => Promise<void>;

  onSave: (
    matchday: number,
    matchDate: string,
    homeScore: number,
    awayScore: number,
    goals: MatchGoalInput[],
    posterFile?: File | null,
    shouldUpdateScore?: boolean,
  ) => void;
};

export default function EditScoreModal({
  match,
  onClose,
  onSave,
  onReset,
}: EditScoreModalProps) {
  const [matchday, setMatchday] = useState(match.matchday.toString());
  const [matchDate, setMatchDate] = useState(() => {
    if (!match.match_date) return "";
    const date = new Date(match.match_date);
    // Sesuaikan dengan zona waktu lokal browser
    const timezoneOffset = date.getTimezoneOffset() * 60_000;
    return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
  });
  const [homeScore, setHomeScore] = useState(
    match.home_score?.toString() ?? "0",
  );
  const [awayScore, setAwayScore] = useState(
    match.away_score?.toString() ?? "0",
  );
  const [homePlayers, setHomePlayers] = useState<Player[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<Player[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [goals, setGoals] = useState<MatchGoalInput[]>([]);
  const [error, setError] = useState("");
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string>(
    match.poster ?? "",
  );

  // console.log("posterPreview: ", posterPreview);
  // console.log(import.meta.env.VITE_API_URL);
  // console.log(posterFile);

  // =========================
  // LOAD PLAYERS
  // =========================
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        setLoadingPlayers(true);
        setError("");

        const [homeData, awayData] = await Promise.all([
          getPlayersByClub(match.home_club._id),
          getPlayersByClub(match.away_club._id),
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
  }, [match.home_club._id, match.away_club._id]);

  // =========================
  // LOAD EXISTING GOALS
  // =========================
  useEffect(() => {
    if (!match.goals) {
      setGoals([]);
      return;
    }

    const existingGoals: MatchGoalInput[] = match.goals.map((goal) => ({
      club: typeof goal.club === "object" ? goal.club._id : goal.club,

      scorer:
        typeof goal.player === "object"
          ? goal.player._id
          : typeof goal.scorer === "object"
            ? goal.scorer._id
            : (goal.player ?? goal.scorer ?? ""),

      minute: String(goal.minute),

      assist:
        typeof goal.assist === "object"
          ? (goal.assist?._id ?? "")
          : (goal.assist ?? ""),
      is_own_goal: goal.is_own_goal ?? false,
    }));

    setGoals(existingGoals);
  }, [match.goals]);

  // =========================
  // ADD GOAL
  // =========================
  const handleAddGoal = () => {
    setGoals((currentGoals) => [
      {
        club: match.home_club._id,
        scorer: "",
        minute: "",
        assist: "",
        is_own_goal: false,
      },
      ...currentGoals,
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

      await resetMatchResult(match._id);

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
    field: keyof MatchGoalInput,
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const day = Number(matchday);
    const home = Number(homeScore);
    const away = Number(awayScore);

    // 1. Validasi jadwal
    if (!Number.isInteger(day) || day < 1) {
      setError("Matchday minimal 1");
      return;
    }

    if (!matchDate || Number.isNaN(new Date(matchDate).getTime())) {
      setError("Tanggal dan waktu pertandingan wajib diisi");
      return;
    }

    // 2. Bandingkan skor sekarang dengan skor sebelumnya
    const originalHomeScore = Number(match.home_score ?? 0);
    const originalAwayScore = Number(match.away_score ?? 0);

    const scoreChanged =
      home !== originalHomeScore || away !== originalAwayScore;

    // 3. Normalisasi goal lama dari database
    const originalGoals: MatchGoalInput[] = (match.goals ?? []).map((goal) => ({
      club: typeof goal.club === "object" ? goal.club._id : goal.club,

      scorer:
        typeof goal.player === "object"
          ? goal.player._id
          : typeof goal.scorer === "object"
            ? goal.scorer._id
            : (goal.player ?? goal.scorer ?? ""),

      minute: String(goal.minute),
      assist:
        typeof goal.assist === "object"
          ? (goal.assist?._id ?? "")
          : (goal.assist ?? ""),

      is_own_goal: goal.is_own_goal ?? false,
    }));

    // 4. Normalisasi goal agar perbandingan konsisten
    const normalizeGoals = (items: MatchGoalInput[]) =>
      items
        .map((goal) => ({
          club: goal.club,
          scorer: goal.scorer,
          minute: String(goal.minute),
          assist: goal.assist || "",
          is_own_goal: goal.is_own_goal ?? false,
        }))
        .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));

    const goalsChanged =
      JSON.stringify(normalizeGoals(goals)) !==
      JSON.stringify(normalizeGoals(originalGoals));

    const shouldUpdateScore = scoreChanged || goalsChanged;

    // 5. Validasi hasil hanya jika skor atau goal berubah
    if (shouldUpdateScore) {
      if (
        !Number.isInteger(home) ||
        !Number.isInteger(away) ||
        home < 0 ||
        away < 0
      ) {
        setError("Skor harus berupa bilangan bulat dan tidak boleh negatif");
        return;
      }

      if (goals.length !== home + away) {
        setError("Jumlah goal event harus sesuai dengan total skor");
        return;
      }

      for (const goal of goals) {
        if (!goal.club || !goal.scorer || !String(goal.minute).trim()) {
          setError("Lengkapi club, pencetak gol, dan menit setiap goal");
          return;
        }

        const minute = Number(goal.minute);

        if (!Number.isInteger(minute) || minute < 1 || minute > 120) {
          setError("Menit gol harus berupa bilangan bulat antara 1–120");
          return;
        }
      }
    }

    // 6. Simpan jadwal dan kirim penanda perubahan skor
    onSave(day, matchDate, home, away, goals, posterFile, shouldUpdateScore);
  }

  // =========================
  // GET PLAYERS
  // =========================
  const getPlayers = (clubId: string) => {
    if (clubId === match.home_club._id) {
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
        {/* ========================= HEADER ========================= */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Edit Pertandingan</h2>

            <p className="mt-1 text-sm text-zinc-500">
              {match.home_club.name_club}
              {" vs "}
              {match.away_club.name_club}
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
          {/* ========================= SCHEDULE ========================= */}
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
          {/* ========================= SCORE ========================= */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Score</h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Home */}

              <div>
                <label className="mb-2 block text-sm text-zinc-400">
                  {match.home_club.name_club}
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
                  {match.away_club.name_club}
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
          {/* ========================= GOALS ========================= */}
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
                const players = getPlayers(
                  goal.is_own_goal
                    ? goal.club === match.home_club._id
                      ? match.away_club._id
                      : match.home_club._id
                    : goal.club,
                );

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

                    {/* Club */}
                    <div className="grid grid-cols-2 gap-4">
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
                          <option value={match.home_club._id}>
                            {match.home_club.name_club}
                          </option>

                          <option value={match.away_club._id}>
                            {match.away_club.name_club}
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
                      {/* is own goal */}
                      <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
                        <input
                          type="checkbox"
                          checked={goal.is_own_goal}
                          onChange={(event) => {
                            const checked = event.target.checked;

                            setGoals((currentGoals) =>
                              currentGoals.map((item, goalIndex) =>
                                goalIndex === index
                                  ? {
                                      ...item,
                                      is_own_goal: checked,
                                      scorer: "",
                                      assist: "",
                                    }
                                  : item,
                              ),
                            );
                          }}
                          className="h-4 w-4 accent-white"
                        />

                        <div>
                          <p className="text-sm font-medium text-white">
                            Gol Bunuh Diri
                          </p>
                          <p className="text-xs text-zinc-500">
                            Pemain mencetak gol ke gawang timnya sendiri
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Preview */}
                    {goal.scorer && (
                      <div className="mt-4 rounded-lg bg-zinc-900 p-3 text-sm">
                        <span className="text-white">
                          {getPlayerName(goal.scorer)}
                        </span>

                        <span className="text-zinc-500"> {goal.minute}'</span>

                        {!goal.is_own_goal && (
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
          {/* ========================= POSTER PERTANDINGAN ========================= */}
          <div className="space-y-3">
            <label
              htmlFor="match-poster"
              className="block text-sm font-medium text-white"
            >
              Poster Pertandingan
            </label>

            {/* Preview poster lama atau poster baru */}
            {posterPreview && (
              <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-3">
                <img
                  src={
                    posterFile
                      ? URL.createObjectURL(posterFile)
                      : posterPreview.startsWith("http")
                        ? posterPreview
                        : `http://localhost:3000${posterPreview.startsWith("/") ? posterPreview : `/images/matches/${posterPreview}`}`
                  }
                  alt="Poster pertandingan"
                  className="max-h-72 w-full rounded-lg object-contain"
                />
                <p className="mt-2 text-xs text-zinc-500">
                  {posterFile ? "Poster baru yang dipilih" : "Poster saat ini"}
                </p>
              </div>
            )}

            {!posterPreview && !posterFile && (
              <div className="rounded-xl border border-dashed border-zinc-700 p-6 text-center">
                <p className="text-sm text-zinc-500">
                  Belum ada poster pertandingan.
                </p>
              </div>
            )}

            <input
              id="match-poster"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setPosterFile(file);
              }}
              className="block w-full rounded-lg border border-white/10 bg-[#191d22] p-3 text-sm text-zinc-300 file:mr-3 file:rounded-md file:border-0 file:bg-[#b9a078] file:px-3 file:py-2 file:font-medium file:text-black"
            />

            {posterFile && (
              <p className="text-xs text-zinc-400">
                File dipilih: {posterFile.name}
              </p>
            )}
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
