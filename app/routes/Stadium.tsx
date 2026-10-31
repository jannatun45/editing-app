import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Activity,
  ArrowUpRight,
  Building2,
  CalendarDays,
  ChevronDown,
  CirclePlus,
  MapPin,
  Pencil,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  X,
  Zap,
} from "lucide-react";

type Stadium = {
  _id: string;
  name_stadium: string;
  image?: string | null;
  city?: string;
  capacity?: number | null;
  address?: string;
  opened_year?: number | null;
  surface?: string;
};

type StadiumForm = {
  name_stadium: string;
  image: string;
  city: string;
  capacity: string;
  address: string;
  opened_year: string;
  surface: string;
};

const API_URL = import.meta.env.VITE_API_URL;

const EMPTY_FORM: StadiumForm = {
  name_stadium: "",
  image: "",
  city: "",
  capacity: "",
  address: "",
  opened_year: "",
  surface: "grass",
};

const numberFormat = (value?: number | null) =>
  new Intl.NumberFormat("id-ID").format(value ?? 0);

const normalizeList = <T,>(payload: unknown): T[] => {
  if (Array.isArray(payload)) return payload as T[];

  if (payload && typeof payload === "object") {
    const result = payload as {
      data?: unknown;
      stadiums?: unknown;
      clubs?: unknown;
    };

    if (Array.isArray(result.data)) return result.data as T[];
    if (Array.isArray(result.stadiums)) return result.stadiums as T[];
    if (Array.isArray(result.clubs)) return result.clubs as T[];
  }

  return [];
};

export default function StadiumPage() {
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  // const [clubs, setClubs] = useState<Club[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Stadium | null>(null);
  const [form, setForm] = useState<StadiumForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function fetchStadiums() {
    const response = await fetch(`${API_URL}/stadiums`);
    if (!response.ok) throw new Error("Gagal mengambil data stadion.");

    const payload: unknown = await response.json();
    setStadiums(normalizeList<Stadium>(payload));
  }

  // async function fetchClubs() {
  //   const response = await getClubs();
  //   console.log("clubs on fetch stadium function: ", clubs);

  //   setClubs(response);
  // }

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      await fetchStadiums();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memuat data.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  const filteredStadiums = useMemo(() => {
    return stadiums.filter((stadium) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        stadium.name_stadium.toLowerCase().includes(keyword) ||
        (stadium.city ?? "").toLowerCase().includes(keyword);

      const matchesFilter = filter === "all";

      return matchesSearch && matchesFilter;
    });
  }, [stadiums, search, filter]);

  const totalCapacity = stadiums.reduce(
    (total, stadium) => total + (stadium.capacity ?? 0),
    0,
  );

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(stadium: Stadium) {
    setEditing(stadium);
    setForm({
      name_stadium: stadium.name_stadium,
      image: stadium.image ?? "",
      city: stadium.city ?? "",
      capacity: stadium.capacity?.toString() ?? "",
      address: stadium.address ?? "",
      opened_year: stadium.opened_year?.toString() ?? "",
      surface: stadium.surface ?? "grass",
    });
    setModalOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        name_stadium: form.name_stadium.trim(),
        image: form.image.trim() || null,
        city: form.city.trim(),
        capacity: form.capacity === "" ? null : Number(form.capacity),
        address: form.address.trim(),
        opened_year: form.opened_year === "" ? null : Number(form.opened_year),
        surface: form.surface,
      };

      console.log("payload: ", payload);

      console.log("editing:", editing);

      const response = await fetch(
        editing ? `${API_URL}/stadium/${editing._id}` : `${API_URL}/stadium`,
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const result = await response.json();
      console.log("result: ", result);

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Gagal menyimpan stadion. Periksa kembali data kamu.",
        );
      }

      await fetchStadiums();
      console.log(fetchStadiums);
      setModalOpen(false);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan stadion.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(stadium: Stadium) {
    const confirmed = window.confirm(
      `Hapus stadion "${stadium.name_stadium}"?`,
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/stadium/${stadium._id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Gagal menghapus stadion.");

      await fetchStadiums();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus stadion.");
    }
  }

  return (
    <div className="min-h-screen bg-[#080b12] text-zinc-100">
      {/* Ambient cyber lighting */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-cyan-500/[0.07] blur-[120px]" />
        <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-violet-500/[0.06] blur-[120px]" />
      </div>

      <main className="relative mx-auto max-w-[1600px] space-y-8 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        {/* Header */}
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
              Stadium control center
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Stadium <span className="text-cyan-400">Management</span>
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400">
              Kelola infrastruktur stadion, kapasitas penonton, dan afiliasi
              klub dalam satu dashboard.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            <CirclePlus size={18} />
            Add Stadium
          </button>
        </header>

        {/* Status bar */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-white/[0.07] py-3 text-xs text-zinc-500">
          <span className="flex items-center gap-2">
            <Activity size={14} className="text-emerald-400" />
            SYSTEM OPERATIONAL
          </span>
          <span className="hidden text-zinc-700 sm:inline">/</span>
          <span>DATABASE: STADIUMS</span>
          <span className="hidden text-zinc-700 sm:inline">/</span>
          <span className="text-cyan-400">LIVE DATA</span>
        </div>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<Building2 size={20} />}
            label="Total Stadiums"
            value={numberFormat(stadiums.length)}
            detail="Stadion terdaftar"
            color="cyan"
          />

          <StatCard
            icon={<Activity size={20} />}
            label="Total Capacity"
            value={numberFormat(totalCapacity)}
            detail="Estimasi kapasitas seluruh stadion"
            color="emerald"
          />
        </section>

        {/* Stadium list */}
        <section className="space-y-5">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-xl font-bold">Stadium Directory</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Menampilkan {filteredStadiums.length} dari {stadiums.length}{" "}
                stadion
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 focus-within:border-cyan-400/60">
                <Search size={17} className="shrink-0 text-zinc-500" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari stadion atau kota..."
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-zinc-600 sm:w-56"
                />
              </div>

              <div className="relative flex items-center rounded-xl border border-white/10 bg-white/[0.03]">
                <SlidersHorizontal size={15} className="ml-3 text-zinc-500" />
                <select
                  value={filter}
                  onChange={(event) => setFilter(event.target.value)}
                  className="w-full appearance-none bg-transparent py-3 pl-2 pr-9 text-sm text-zinc-300 outline-none"
                >
                  <option value="all" className="bg-[#11151f]">
                    Semua stadion
                  </option>
                  <option value="linked" className="bg-[#11151f]">
                    Terhubung klub
                  </option>
                  <option value="unlinked" className="bg-[#11151f]">
                    Tanpa klub
                  </option>
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 text-zinc-500"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.06] p-4 text-sm text-rose-300">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-80 animate-pulse rounded-2xl border border-white/[0.07] bg-white/[0.03]"
                />
              ))}
            </div>
          ) : filteredStadiums.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 px-6 py-20 text-center">
              <Building2 size={38} className="mb-4 text-zinc-600" />
              <h3 className="font-semibold">Stadion tidak ditemukan</h3>
              <p className="mt-2 text-sm text-zinc-500">
                Coba ubah kata kunci atau tambahkan data stadion baru.
              </p>
              <button
                onClick={openCreate}
                className="mt-5 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
              >
                + Tambah stadion
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredStadiums.map((stadium, index) => {
                return (
                  <article
                    key={stadium._id}
                    className="group overflow-hidden rounded-2xl border border-white/[0.09] bg-[#10141e] transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_12px_45px_-20px_rgba(34,211,238,0.22)]"
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden bg-[#171d2a]">
                      {stadium.image ? (
                        <img
                          src={stadium.image}
                          alt={stadium.name_stadium}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-cyan-950/70 via-[#171d2a] to-violet-950/60">
                          <Building2
                            size={56}
                            strokeWidth={1}
                            className="text-cyan-400/50"
                          />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#10141e] via-transparent to-black/20" />

                      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                        ST-{String(index + 1).padStart(3, "0")}
                      </div>

                      <div className="absolute right-4 top-4 flex gap-2">
                        <button
                          onClick={() => openEdit(stadium)}
                          aria-label={`Edit ${stadium.name_stadium}`}
                          className="rounded-lg border border-white/10 bg-black/50 p-2 text-white backdrop-blur-md transition hover:bg-cyan-400 hover:text-slate-950"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => void handleDelete(stadium)}
                          aria-label={`Hapus ${stadium.name_stadium}`}
                          className="rounded-lg border border-white/10 bg-black/50 p-2 text-white backdrop-blur-md transition hover:bg-rose-500"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300">
                          Stadium facility
                        </p>
                        <h3 className="text-xl font-bold leading-tight text-white">
                          {stadium.name_stadium}
                        </h3>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-4 p-5">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
                          <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                            Capacity
                          </p>
                          <p className="mt-1 text-base font-bold text-white">
                            {numberFormat(stadium.capacity)}
                          </p>
                          <p className="text-[10px] text-zinc-600">Penonton</p>
                        </div>
                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
                          <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                            Opened
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-base font-bold text-white">
                            <CalendarDays size={14} className="text-cyan-400" />
                            {stadium.opened_year ?? "—"}
                          </p>
                          <p className="truncate text-[10px] text-zinc-600">
                            {stadium.surface ?? "Surface —"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 border-t border-white/[0.07] pt-4 text-xs text-zinc-400">
                        <MapPin size={14} className="shrink-0 text-cyan-400" />
                        <span className="truncate">
                          {stadium.city ||
                            stadium.address ||
                            "Lokasi belum tersedia"}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <footer className="flex flex-col justify-between gap-2 border-t border-white/[0.07] pt-5 text-[11px] text-zinc-600 sm:flex-row">
          <p>STADIUM CONTROL SYSTEM · MANAGEMENT DASHBOARD</p>
          <p className="flex items-center gap-2">
            <Zap size={12} className="text-cyan-400" />
            POWERED BY YOUR FOOTBALL DATABASE
          </p>
        </footer>
      </main>

      {/* Create / Edit modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-cyan-400/20 bg-[#0e121c] shadow-2xl shadow-cyan-950/30">
            <div className="flex items-center justify-between border-b border-white/[0.08] p-5 sm:p-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400">
                  Stadium control / configuration
                </p>
                <h2 className="mt-2 text-xl font-bold">
                  {editing ? "Edit Stadium" : "Register New Stadium"}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg border border-white/10 p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
                aria-label="Tutup modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
              {/* name starium */}
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Nama stadion *">
                  <input
                    required
                    value={form.name_stadium}
                    onChange={(e) =>
                      setForm({ ...form, name_stadium: e.target.value })
                    }
                    placeholder="Contoh: Gelora Stadium"
                    className={fieldClass}
                  />
                </FormField>

                {/* city */}
                <FormField label="Kota">
                  <input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Contoh: Jakarta"
                    className={fieldClass}
                  />
                </FormField>

                {/* capacity */}
                <FormField label="Kapasitas penonton">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.capacity}
                    onChange={(e) =>
                      setForm({ ...form, capacity: e.target.value })
                    }
                    placeholder="50000"
                    className={fieldClass}
                  />
                </FormField>

                {/* tahun di buka */}
                <FormField label="Tahun dibuka">
                  <input
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    step="1"
                    value={form.opened_year}
                    onChange={(e) =>
                      setForm({ ...form, opened_year: e.target.value })
                    }
                    placeholder="2000"
                    className={fieldClass}
                  />
                </FormField>

                {/* jenis rumput */}
                <FormField label="Jenis permukaan">
                  <select
                    value={form.surface}
                    onChange={(e) =>
                      setForm({ ...form, surface: e.target.value })
                    }
                    className={fieldClass}
                  >
                    <option>natural grass</option>
                    <option>artificial</option>
                    <option>hybrid</option>
                    <option>grass</option>
                  </select>
                </FormField>

                <div className="sm:col-span-2">
                  <FormField label="URL gambar stadion">
                    <input
                      type="url"
                      value={form.image}
                      onChange={(e) =>
                        setForm({ ...form, image: e.target.value })
                      }
                      placeholder="https://example.com/stadium.jpg"
                      className={fieldClass}
                    />
                  </FormField>
                </div>

                <div className="sm:col-span-2">
                  <FormField label="Alamat">
                    <textarea
                      rows={2}
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      placeholder="Alamat lengkap stadion"
                      className={fieldClass}
                    />
                  </FormField>
                </div>
              </div>

              {error && (
                <p className="rounded-lg border border-rose-400/20 bg-rose-400/5 p-3 text-sm text-rose-300">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-white/[0.08] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/5"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Menyimpan..."
                    : editing
                      ? "Simpan Perubahan"
                      : "Register Stadium"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const fieldClass =
  "w-full rounded-xl border border-white/10 bg-[#151a26] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10";

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-medium text-zinc-400">{label}</span>
      {children}
    </label>
  );
}

function StatCard({
  icon,
  label,
  value,
  detail,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
  color: "cyan" | "violet" | "amber" | "emerald";
}) {
  const colors = {
    cyan: "border-cyan-400/20 bg-cyan-400/[0.07] text-cyan-300",
    violet: "border-violet-400/20 bg-violet-400/[0.07] text-violet-300",
    amber: "border-amber-400/20 bg-amber-400/[0.07] text-amber-300",
    emerald: "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300",
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#10141e] p-5 transition hover:border-white/15">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-zinc-500">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-white">
            {value}
          </p>
        </div>
        <div className={`rounded-xl border p-3 ${colors[color]}`}>{icon}</div>
      </div>
      <p className="mt-4 border-t border-white/[0.06] pt-3 text-xs text-zinc-500">
        {detail}
      </p>
    </div>
  );
}
