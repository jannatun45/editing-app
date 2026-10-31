import { useEffect, useState } from "react";
import type { Club } from "~/types/api/clubs";
const API_URL = import.meta.env.VITE_API_URL;

interface CreateMatchModalProps {
  clubs: Club[];
  onClose: () => void;
  onSave: (data: CreateMatchInput) => Promise<void>;
}
export interface CreateMatchInput {
  season: string;
  matchday: number;
  home_club: string;
  away_club: string;
  match_date: string;
}

export default function CreateMatchModal({
  clubs,
  onClose,
  onSave,
}: CreateMatchModalProps) {
  const [season, setSeason] = useState("2026/2027");
  const [matchday, setMatchday] = useState(10);
  const [matchDate, setMatchDate] = useState("");
  const [homeClub, setHomeClub] = useState("");
  const [awayClub, setAwayClub] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // MENGAMBIL MATCHDAY TERBARU
  // =========================

  console.log("Clubs: ", clubs);

  useEffect(() => {
    async function loadMatchday() {
      try {
        const response = await fetch(
          `${API_URL}/matches?season=${encodeURIComponent(season)}`,
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data pekan.");
        }

        const result = await response.json();

        // Mendukung respons berupa array atau object berisi data
        const fixtures = Array.isArray(result)
          ? result
          : (result.data ?? result.matches ?? []);

        const playedMatchdays = fixtures
          .filter(
            (fixture: { matchday?: number; status?: string }) =>
              fixture.status === "scheduled" &&
              typeof fixture.matchday === "number",
          )
          .map((fixture: { matchday: number }) => fixture.matchday);

        setMatchday(
          playedMatchdays.length > 0 ? Math.max(...playedMatchdays) : 1,
        );
        console.log(
          "matchday didalam useeffect creat match modal-> ",
          matchday,
        );
      } catch (error) {
        console.error("Gagal mengambil pekan pertandingan:", error);
      }
    }

    loadMatchday();
  }, [season]);

  // handle submit
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!homeClub || !awayClub) {
      setError("Silakan pilih klub kandang dan tandang.");
      return;
    }

    if (homeClub === awayClub) {
      setError("Klub kandang dan tandang tidak boleh sama.");
      return;
    }

    if (!Number.isInteger(Number(matchday)) || Number(matchday) < 1) {
      setError("Matchday harus berupa bilangan bulat positif.");
      return;
    }

    try {
      setLoading(true);

      await onSave({
        season,
        matchday: Number(matchday),
        home_club: homeClub,
        away_club: awayClub,
        match_date: new Date(matchDate).toISOString(),
      });

      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal membuat pertandingan.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-match-title"
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#121519] text-[#e5e5e5] shadow-2xl"
      >
        <header className="border-b border-white/8 px-6 py-5 sm:px-8">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#b9a078]">
            Football Analytics
          </p>

          <div className="flex items-center justify-between gap-4">
            <div>
              <h2
                id="create-match-title"
                className="text-xl font-semibold text-white"
              >
                Buat Pertandingan
              </h2>
              <p className="mt-1 text-sm text-[#858b94]">
                Tambahkan jadwal pertandingan baru.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              aria-label="Tutup modal"
              className="rounded-lg border border-white/10 px-3 py-2 text-[#858b94] transition hover:bg-white/6 hover:text-white disabled:opacity-50"
            >
              ✕
            </button>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
          {/* season */}
          <div>
            <label
              htmlFor="season"
              className="mb-2 block text-xs font-medium text-[#a5aab2]"
            >
              Season
            </label>
            <select
              id="season"
              value={season}
              onChange={(event) => setSeason(event.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-[#191d22] px-4 py-3 text-sm text-white outline-none focus:border-[#b9a078]"
            >
              <option value="2026/2027">2026/2027</option>
              <option value="2025/2026">2025/2026</option>
              <option value="2024/2025">2024/2025</option>
            </select>
          </div>
          {/* matchday */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="matchday"
                className="mb-2 block text-xs font-medium text-[#a5aab2]"
              >
                Matchday
              </label>
              <input
                id="matchday"
                type="number"
                min="1"
                step="1"
                value={matchday}
                onChange={(event) => setMatchday(Number(event.target.value))}
                required
                className="w-full rounded-lg border border-white/10 bg-[#191d22] px-4 py-3 text-sm text-white outline-none focus:border-[#b9a078]"
              />
            </div>

            <div>
              <label
                htmlFor="match-date"
                className="mb-2 block text-xs font-medium text-[#a5aab2]"
              >
                Tanggal dan waktu
              </label>
              <input
                id="match-date"
                type="datetime-local"
                value={matchDate}
                onChange={(event) => setMatchDate(event.target.value)}
                required
                className="w-full min-w-0 rounded-lg border border-white/10 bg-[#191d22] px-3 py-3 text-sm text-white outline-none focus:border-[#b9a078]"
              />
            </div>
          </div>
          {/* input match club */}
          <div className="rounded-xl border border-white/8 bg-[#0b0d10] p-4 sm:p-5">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#858b94]">
              Pertandingan
            </p>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="home-club"
                  className="mb-2 block text-xs font-medium text-[#a5aab2]"
                >
                  Klub kandang
                </label>
                <select
                  id="home-club"
                  value={homeClub}
                  onChange={(event) => setHomeClub(event.target.value)}
                  required
                  className="w-full rounded-lg border border-white/10 bg-[#191d22] px-4 py-3 text-sm text-white outline-none focus:border-[#b9a078]"
                >
                  <option value="">Pilih klub kandang</option>
                  {clubs.map((club) => (
                    <option key={club._id} value={club._id}>
                      {club.name_club}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-white/[0.08]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b9a078]">
                  VS
                </span>
                <span className="h-px flex-1 bg-white/[0.08]" />
              </div>

              <div>
                <label
                  htmlFor="away-club"
                  className="mb-2 block text-xs font-medium text-[#a5aab2]"
                >
                  Klub tandang
                </label>
                <select
                  id="away-club"
                  value={awayClub}
                  onChange={(event) => setAwayClub(event.target.value)}
                  required
                  className="w-full rounded-lg border border-white/10 bg-[#191d22] px-4 py-3 text-sm text-white outline-none focus:border-[#b9a078]"
                >
                  <option value="">Pilih klub tandang</option>
                  {clubs
                    .filter((club) => club._id !== homeClub)
                    .map((club) => (
                      <option key={club._id} value={club._id}>
                        {club.name_club}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm text-red-300"
            >
              {error}
            </p>
          )}

          <footer className="flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-white/10 px-5 py-3 text-sm font-medium text-[#a5aab2] transition hover:bg-white/[0.05] hover:text-white disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading || clubs.length < 2}
              className="rounded-lg bg-[#b9a078] px-5 py-3 text-sm font-semibold text-[#111317] transition hover:bg-[#c9b18b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan Pertandingan"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
