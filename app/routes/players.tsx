import { useEffect, useMemo, useState } from "react";
import type { Player } from "~/types/api/player";
import type { Club } from "~/types/api/clubs";

import {
  getAllPlayers,
  createPlayer,
  updatePlayer,
  transferPlayer,
  deletePlayer,
  type PlayerListResponse,
  type PlayerFilters,
} from "~/services/playerServices";

import PlayerFormModal from "~/components/organisms/PlayerFormModal";
import TransferPlayerModal from "~/components/organisms/TransferPlayerModal";

const API_BASE = import.meta.env.VITE_API_URL;

type Position = "GK" | "DF" | "MF" | "FW";

const positionLabels: Record<Position, string> = {
  GK: "Goalkeeper",
  DF: "Defender",
  MF: "Midfielder",
  FW: "Forward",
};

const positionStyles: Record<Position, string> = {
  GK: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  DF: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  MF: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  FW: "bg-rose-400/10 text-rose-400 border-rose-400/20",
};

function getClubId(club: Player["club"]) {
  return typeof club === "string" ? club : club?._id;
}

function getClubName(club: Player["club"]) {
  return typeof club === "string"
    ? "Unknown Club"
    : club?.name_club || "Unknown Club";
}

function getAge(dateOfBirth: string | null | undefined): number | null {
  if (!dateOfBirth) return null;

  const birthDate = new Date(dateOfBirth);

  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}
// function getAge(dateOfBirth?: string) {
//   if (!dateOfBirth) return null;

//   const birth = new Date(dateOfBirth);

//   if (Number.isNaN(birth.getTime())) return null;

//   const today = new Date();
//   let age = today.getFullYear() - birth.getFullYear();

//   const birthdayHasPassed =
//     today.getMonth() > birth.getMonth() ||
//     (today.getMonth() === birth.getMonth() &&
//       today.getDate() >= birth.getDate());

//   if (!birthdayHasPassed) age--;

//   return age >= 0 ? age : null;
// }

function getPhotoUrl(photo?: string) {
  if (!photo) return "";

  if (/^https?:\/\//i.test(photo)) return photo;

  return `${API_BASE.replace(/\/api\/?$/, "")}/${photo.replace(/^\/+/, "")}`;
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [pagination, setPagination] = useState<
    PlayerListResponse["pagination"]
  >({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [clubFilter, setClubFilter] = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [nationalFilter, setNationalFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");
  const [season, setSeason] = useState("2026/2027");
  const [sort, setSort] = useState("name");
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [limit, setLimit] = useState(12);

  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [transferringPlayer, setTransferringPlayer] = useState<Player | null>(
    null,
  );
  const [showAddPlayer, setShowAddPlayer] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      try {
        setLoading(true);
        setError("");

        const [playersResponse, clubsResponse] = await Promise.all([
          fetch(`${API_BASE}/players`, {
            signal: controller.signal,
          }),
          fetch(`${API_BASE}/club`, {
            signal: controller.signal,
          }),
        ]);

        if (!playersResponse.ok || !clubsResponse.ok) {
          throw new Error(
            "Gagal mengambil data pemain atau klub. Periksa endpoint API.",
          );
        }

        const playersData = await playersResponse.json();
        const clubsData = await clubsResponse.json();

        // Mendukung response array langsung atau { data: [...] }.
        const playerList = Array.isArray(playersData)
          ? playersData
          : playersData.data;

        const clubList = Array.isArray(clubsData) ? clubsData : clubsData.data;

        if (!Array.isArray(playerList) || !Array.isArray(clubList)) {
          throw new Error("Format response API tidak sesuai.");
        }

        setPlayers(playerList);
        setClubs(clubList);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;

        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat mengambil data.",
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    loadData();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadPlayers() {
      try {
        setLoading(true);
        setError("");

        const filters: PlayerFilters = {
          page,
          limit,
          search,
          club: clubFilter,
          position: positionFilter,
          national: nationalFilter,
          ageGroup: ageFilter,
          season,
          sort,
        };

        const result = await getAllPlayers(filters);

        if (cancelled) return;

        setPlayers(result.data);
        setPagination(result.pagination);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Gagal mengambil data pemain.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadPlayers();

    return () => {
      cancelled = true;
    };
  }, [
    page,
    limit,
    search,
    clubFilter,
    positionFilter,
    nationalFilter,
    ageFilter,
    season,
    sort,
  ]);

  useEffect(() => {
    let cancelled = false;

    async function loadClubs() {
      try {
        const API_URL =
          import.meta.env.VITE_API_URL || "http://localhost:3000/api";

        const response = await fetch(`${API_URL}/clubs`);
        if (!response.ok) throw new Error("Gagal mengambil klub");

        const result = await response.json();
        const list = Array.isArray(result) ? result : result.data;

        if (!cancelled && Array.isArray(list)) {
          setClubs(list);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Gagal mengambil klub.",
          );
        }
      }
    }

    loadClubs();

    return () => {
      cancelled = true;
    };
  }, []);

  async function refreshPlayers() {
    const result = await getAllPlayers({
      page,
      limit,
      search,
      club: clubFilter,
      position: positionFilter,
      national: nationalFilter,
      ageGroup: ageFilter,
      season,
      sort,
    });

    setPlayers(result.data);
    setPagination(result.pagination);
  }

  async function handleCreatePlayer(formData: FormData) {
    await createPlayer(formData);
    setPage(1);

    const result = await getAllPlayers({
      page: 1,
      limit,
      search,
      club: clubFilter,
      position: positionFilter,
      national: nationalFilter,
      ageGroup: ageFilter,
      season,
      sort,
    });

    setPlayers(result.data);
    setPagination(result.pagination);
  }

  async function handleUpdatePlayer(formData: FormData) {
    if (!editingPlayer) return;

    await updatePlayer(editingPlayer._id, formData);
    setEditingPlayer(null);
    await refreshPlayers();
  }

  async function handleTransferPlayer(clubId: string) {
    if (!transferringPlayer) return;

    await transferPlayer(transferringPlayer._id, clubId);
    setTransferringPlayer(null);
    await refreshPlayers();
  }

  async function handleDeletePlayer(player: Player) {
    const confirmed = window.confirm(
      `Yakin ingin menghapus ${player.name_player}?`,
    );

    if (!confirmed) return;

    try {
      setError("");
      await deletePlayer(player._id);

      // Jika item terakhir di halaman dihapus, kembali satu halaman.
      const nextPage = players.length === 1 && page > 1 ? page - 1 : page;

      setPage(nextPage);

      const result = await getAllPlayers({
        page: nextPage,
        limit,
        search,
        club: clubFilter,
        position: positionFilter,
        national: nationalFilter,
        ageGroup: ageFilter,
        season,
        sort,
      });

      setPlayers(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus pemain.");
    }
  }

  const nationalities = useMemo(
    () =>
      Array.from(
        new Set(
          players
            .map((player) => player.national)
            .filter((value): value is string => Boolean(value)),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [players],
  );

  const filteredPlayers = useMemo(() => {
    const result = players.filter((player) => {
      const nameMatches = player.name_player
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const clubMatches =
        clubFilter === "all" || getClubId(player.club) === clubFilter;

      const positionMatches =
        positionFilter === "all" || player.position === positionFilter;

      const nationalMatches =
        nationalFilter === "all" || player.national === nationalFilter;

      const age = getAge(player.date_of_birth);

      const ageMatches =
        ageFilter === "all" ||
        (age !== null &&
          (ageFilter === "u21"
            ? age <= 21
            : ageFilter === "22-29"
              ? age >= 22 && age <= 29
              : age >= 30));

      return (
        nameMatches &&
        clubMatches &&
        positionMatches &&
        nationalMatches &&
        ageMatches
      );
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "number":
          return (a.number ?? 999) - (b.number ?? 999);
        case "age":
          return (
            (getAge(b.date_of_birth) ?? -1) - (getAge(a.date_of_birth) ?? -1)
          );
        case "goals":
          return (b.goals ?? 0) - (a.goals ?? 0);
        case "assists":
          return (b.assists ?? 0) - (a.assists ?? 0);
        default:
          return a.name_player.localeCompare(b.name_player);
      }
    });

    return result;
  }, [
    players,
    search,
    clubFilter,
    positionFilter,
    nationalFilter,
    ageFilter,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredPlayers.length / pageSize));

  const currentPage = Math.min(page, totalPages);

  const visiblePlayers = filteredPlayers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const positionCounts = useMemo(
    () => ({
      GK: players.filter((p) => p.position === "GK").length,
      DF: players.filter((p) => p.position === "DF").length,
      MF: players.filter((p) => p.position === "MF").length,
      FW: players.filter((p) => p.position === "FW").length,
    }),
    [players],
  );

  function resetFilters() {
    setSearch("");
    setClubFilter("all");
    setPositionFilter("all");
    setNationalFilter("all");
    setAgeFilter("all");
    setSortBy("name");
    setPage(1);
  }

  function updateFilter(setter: (value: string) => void, value: string) {
    setter(value);
    setPage(1);
  }

  return (
    <main className="min-h-screen bg-[#0c0d10] p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px] space-y-7">
        {/* Header */}
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              League Management
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Players
            </h1>

            <p className="mt-2 text-sm text-zinc-400">
              Kelola seluruh pemain, klub, dan statistik individu.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className="text-xs text-zinc-500">Total Players</p>
              <p className="mt-1 text-xl font-bold text-amber-400">
                {loading ? "—" : players.length}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <p className="text-xs text-zinc-500">Total Clubs</p>
              <p className="mt-1 text-xl font-bold">
                {loading ? "—" : clubs.length}
              </p>
            </div>
          </div>
        </header>

        {/* Position statistics */}
        <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {(
            [
              ["GK", "Goalkeepers", "text-amber-400"],
              ["DF", "Defenders", "text-blue-400"],
              ["MF", "Midfielders", "text-emerald-400"],
              ["FW", "Forwards", "text-rose-400"],
            ] as const
          ).map(([position, label, color]) => (
            <button
              key={position}
              onClick={() => {
                updateFilter(
                  setPositionFilter,
                  positionFilter === position ? "all" : position,
                );
              }}
              className={`rounded-2xl border p-4 text-left transition ${
                positionFilter === position
                  ? "border-amber-400/50 bg-amber-400/[0.07]"
                  : "border-white/[0.08] bg-[#131419] hover:border-white/20"
              }`}
            >
              <p className="text-sm text-zinc-400">{label}</p>
              <p className={`mt-2 text-3xl font-bold ${color}`}>
                {loading ? "—" : positionCounts[position]}
              </p>
              <p className="mt-2 text-xs text-zinc-500">Klik untuk memfilter</p>
            </button>
          ))}
        </section>

        {/* Filters */}
        <section className="space-y-4 rounded-2xl border border-white/[0.08] bg-[#131419] p-4 sm:p-5">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold">Player Directory</h2>
              <p className="mt-1 text-xs text-zinc-500">
                Cari dan filter pemain sesuai kebutuhan.
              </p>
            </div>

            <button
              onClick={resetFilters}
              className="text-left text-sm text-amber-400 transition hover:text-amber-300 sm:text-right"
            >
              Reset semua filter
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <label className="relative block">
              <span className="sr-only">Cari pemain</span>
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                ⌕
              </span>
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Cari nama pemain..."
                className="w-full rounded-xl border border-white/10 bg-[#0c0d10] py-3 pl-9 pr-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-amber-400/60"
              />
            </label>

            <select
              value={clubFilter}
              onChange={(e) => updateFilter(setClubFilter, e.target.value)}
              className="rounded-xl border border-white/10 bg-[#0c0d10] px-3 py-3 text-sm text-zinc-300 outline-none focus:border-amber-400/60"
            >
              <option value="all">Semua klub</option>
              {clubs.map((club) => (
                <option key={club._id} value={club._id}>
                  {club.name_club}
                </option>
              ))}
            </select>

            <select
              value={positionFilter}
              onChange={(e) => updateFilter(setPositionFilter, e.target.value)}
              className="rounded-xl border border-white/10 bg-[#0c0d10] px-3 py-3 text-sm text-zinc-300 outline-none focus:border-amber-400/60"
            >
              <option value="all">Semua posisi</option>
              {Object.entries(positionLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            <select
              value={nationalFilter}
              onChange={(e) => updateFilter(setNationalFilter, e.target.value)}
              className="rounded-xl border border-white/10 bg-[#0c0d10] px-3 py-3 text-sm text-zinc-300 outline-none focus:border-amber-400/60"
            >
              <option value="all">Semua kewarganegaraan</option>
              {nationalities.map((nationality) => (
                <option key={nationality} value={nationality}>
                  {nationality}
                </option>
              ))}
            </select>

            <select
              value={ageFilter}
              onChange={(e) => updateFilter(setAgeFilter, e.target.value)}
              className="rounded-xl border border-white/10 bg-[#0c0d10] px-3 py-3 text-sm text-zinc-300 outline-none focus:border-amber-400/60"
            >
              <option value="all">Semua usia</option>
              <option value="u21">21 tahun ke bawah</option>
              <option value="22-29">22–29 tahun</option>
              <option value="30+">30 tahun ke atas</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => updateFilter(setSortBy, e.target.value)}
              className="rounded-xl border border-white/10 bg-[#0c0d10] px-3 py-3 text-sm text-zinc-300 outline-none focus:border-amber-400/60"
            >
              <option value="name">Urutkan: Nama</option>
              <option value="number">Urutkan: Nomor punggung</option>
              <option value="age">Urutkan: Usia tertinggi</option>
              <option value="goals">Urutkan: Gol terbanyak</option>
              <option value="assists">Urutkan: Assist terbanyak</option>
            </select>
          </div>
        </section>

        {/* Results */}
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">All Players</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Menampilkan {filteredPlayers.length} pemain
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <label className="flex items-center gap-2 text-sm text-zinc-400">
                Per halaman
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="rounded-lg border border-white/10 bg-[#131419] px-2 py-2 text-white outline-none"
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </select>
              </label>

              <button
                onClick={() => setShowAddPlayer(true)}
                className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-amber-300"
              >
                + Add Player
              </button>
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-300"
            >
              {error}
              <p className="mt-2 text-xs text-rose-200/70">
                Pastikan server backend aktif dan endpoint API benar.
              </p>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-64 animate-pulse rounded-2xl border border-white/[0.06] bg-[#131419]"
                />
              ))}
            </div>
          ) : filteredPlayers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-16 text-center">
              <div className="text-3xl text-zinc-600">◎</div>
              <h3 className="mt-3 font-semibold">Pemain tidak ditemukan</h3>
              <p className="mt-2 text-sm text-zinc-500">
                Coba ubah pencarian atau kombinasi filter.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-amber-300"
              >
                Reset filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {visiblePlayers.map((player) => (
                <article
                  key={player._id}
                  className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#131419] transition duration-200 hover:-translate-y-1 hover:border-amber-400/30"
                >
                  <div className="relative flex h-44 items-center justify-center overflow-hidden bg-gradient-to-br from-[#24242a] via-[#17181d] to-[#101115]">
                    <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-amber-400/[0.07] blur-2xl" />

                    {/* number */}
                    <div className="absolute left-4 top-4 rounded-lg border border-white/10 bg-black/30 px-3 py-1.5">
                      <span className="text-xs text-zinc-400">PLAYER</span>
                      <p className="text-xl font-bold text-amber-400">
                        {player.number ?? "—"}
                      </p>
                    </div>

                    {/* img */}
                    {player.photo ? (
                      <img
                        src={getPhotoUrl(player.photo)}
                        alt={player.name_player}
                        loading="lazy"
                        className="relative z-10 h-full max-w-[70%] object-contain object-bottom transition duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/10 text-3xl font-bold text-amber-400">
                        {player.name_player
                          .split(" ")
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                    )}

                    {/* position */}
                    <span className="absolute bottom-3 right-3 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-xs text-zinc-300">
                      {positionLabels[player.position] ?? player.position}
                    </span>
                  </div>

                  <div className="space-y-4 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-white transition group-hover:text-amber-300">
                          {player.name_player}
                        </h3>
                        <p className="mt-1 truncate text-sm text-zinc-500">
                          {getClubName(player.club)}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-lg border px-2 py-1 text-xs ${
                          positionStyles[player.position] ??
                          "border-white/10 text-zinc-400"
                        }`}
                      >
                        {player.position}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 divide-x divide-white/[0.08] rounded-xl border border-white/[0.06] bg-black/20 py-3">
                      {/* age */}
                      <div className="text-center">
                        <p className="text-lg font-bold">
                          {getAge(player.date_of_birth) ?? "—"}
                        </p>
                        <p className="mt-1 text-[11px] text-zinc-500">Age</p>
                      </div>
                      {/* goals */}
                      <div className="text-center">
                        <p className="text-lg font-bold text-amber-400">
                          {player.goals ?? 0}
                        </p>
                        <p className="mt-1 text-[11px] text-zinc-500">Goals</p>
                      </div>
                      {/* assists */}
                      <div className="text-center">
                        <p className="text-lg font-bold">
                          {player.assists ?? 0}
                        </p>
                        <p className="mt-1 text-[11px] text-zinc-500">
                          Assists
                        </p>
                      </div>
                    </div>

                    {/* national */}
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-xs text-zinc-500">
                        {player.national || "Nationality not available"}
                      </p>

                      {/* views detail */}
                      <button
                        onClick={() => setSelectedPlayer(player)}
                        className="shrink-0 rounded-lg border border-amber-400/20 px-3 py-2 text-xs font-semibold text-amber-400 transition hover:bg-amber-400 hover:text-black"
                      >
                        View details
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredPlayers.length > 0 && (
            <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
              <p className="text-sm text-zinc-500">
                Total {pagination.total} pemain
                {" · "}
                Halaman {pagination.page} dari {pagination.totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((current) => current - 1)}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm disabled:opacity-30"
                >
                  Previous
                </button>

                <button
                  disabled={page >= pagination.totalPages || loading}
                  onClick={() => setPage((current) => current + 1)}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            </div>
            // <div className="mt-6 flex flex-col justify-between gap-4 border-t border-white/[0.08] pt-5 sm:flex-row sm:items-center">
            //   <p className="text-sm text-zinc-500">
            //     Halaman {currentPage} dari {totalPages}
            //     {" · "}
            //     {filteredPlayers.length} pemain
            //   </p>

            //   <div className="flex items-center gap-2">
            //     <button
            //       disabled={currentPage === 1}
            //       onClick={() => setPage((p) => Math.max(1, p - 1))}
            //       className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
            //     >
            //       Previous
            //     </button>

            //     <span className="min-w-10 rounded-lg bg-amber-400 px-3 py-2 text-center text-sm font-bold text-black">
            //       {currentPage}
            //     </span>

            //     <button
            //       disabled={currentPage === totalPages}
            //       onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            //       className="rounded-lg border border-white/10 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
            //     >
            //       Next
            //     </button>
            //   </div>
            // </div>
          )}
        </section>
      </div>

      {/* Player detail modal */}
      {selectedPlayer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedPlayer(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="player-detail-title"
            className="my-auto w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#15161b] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] p-5">
              <h2 id="player-detail-title" className="font-semibold">
                Player Details
              </h2>
              <button
                onClick={() => setSelectedPlayer(null)}
                aria-label="Close player details"
                className="rounded-lg px-3 py-1 text-xl text-zinc-400 hover:bg-white/5 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-amber-400/20 bg-amber-400/10">
                  {selectedPlayer.photo ? (
                    <img
                      src={getPhotoUrl(selectedPlayer.photo)}
                      alt={selectedPlayer.name_player}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-amber-400">
                      {selectedPlayer.name_player.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="text-xl font-bold">
                    {selectedPlayer.name_player}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    {getClubName(selectedPlayer.club)}
                  </p>
                  <span
                    className={`mt-2 inline-block rounded-full border px-2.5 py-1 text-xs ${
                      positionStyles[selectedPlayer.position] ?? ""
                    }`}
                  >
                    {positionLabels[selectedPlayer.position] ??
                      selectedPlayer.position}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  ["Jersey Number", selectedPlayer.number ?? "—"],
                  ["Age", getAge(selectedPlayer.date_of_birth) ?? "—"],
                  ["Nationality", selectedPlayer.national || "—"],
                  [
                    "Date of Birth",
                    selectedPlayer.date_of_birth
                      ? new Date(
                          selectedPlayer.date_of_birth,
                        ).toLocaleDateString("id-ID")
                      : "—",
                  ],
                  ["Goals", selectedPlayer.goals ?? 0],
                  ["Assists", selectedPlayer.assists ?? 0],
                  [
                    "Market Value",
                    selectedPlayer.market_value != null
                      ? String(selectedPlayer.market_value)
                      : "—",
                  ],
                ].map(([label, value]) => (
                  <div
                    key={String(label)}
                    className="rounded-xl border border-white/[0.07] bg-black/20 p-3"
                  >
                    <p className="text-xs text-zinc-500">{label}</p>
                    <p className="mt-2 break-words text-sm font-semibold">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelectedPlayer(null)}
                className="mt-6 w-full rounded-xl bg-amber-400 py-3 text-sm font-bold text-black transition hover:bg-amber-300"
              >
                Close details
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddPlayer && (
        <PlayerFormModal
          clubs={clubs}
          onClose={() => setShowAddPlayer(false)}
          onSave={handleCreatePlayer}
        />
      )}

      {editingPlayer && (
        <PlayerFormModal
          player={editingPlayer}
          clubs={clubs}
          onClose={() => setEditingPlayer(null)}
          onSave={handleUpdatePlayer}
        />
      )}

      {transferringPlayer && (
        <TransferPlayerModal
          player={transferringPlayer}
          clubs={clubs}
          onClose={() => setTransferringPlayer(null)}
          onTransfer={handleTransferPlayer}
        />
      )}
    </main>
  );
}
