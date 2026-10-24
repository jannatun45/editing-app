import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router";
import { toPng } from "html-to-image";
import {
  CalendarDays,
  Clock3,
  Download,
  MapPin,
  RefreshCw,
  Trophy,
  Shield,
} from "lucide-react";
import { getMatchById } from "~/services/matchServices";
import type { Match } from "~/types/api/matches";

const posterSizes = [
  { label: "Instagram Portrait", value: "ig", width: 1080, height: 1350 },
  { label: "Instagram Square", value: "square", width: 1080, height: 1080 },
  {
    label: "Story / Reels / TikTok",
    value: "story",
    width: 1080,
    height: 1920,
  },
  { label: "Facebook Landscape", value: "facebook", width: 1200, height: 630 },
  { label: "Poster HD", value: "hd", width: 2160, height: 2700 },
];

const API_BASE = "http://localhost:3000";

/**
 * Ubah path ini agar sesuai dengan express.static di backend.
 * Contoh: app.use("/images", express.static("uploads"));
 * maka logo klub bisa diakses dari /images/clubs/nama-file.svg.
 */
function getAssetUrl(file?: string | null) {
  if (!file) return "";
  if (/^https?:\/\//i.test(file)) return file;
  const cleanPath = file.replace(/^\/+/, "");
  if (cleanPath.startsWith("uploads/") || cleanPath.startsWith("images/")) {
    return `${API_BASE}/${cleanPath}`;
  }
  return `${API_BASE}/images/clubs/${cleanPath}`;
}

function formatMinute(minute?: number) {
  return minute == null ? "" : `${minute}'`;
}

function initials(name?: string) {
  return (name ?? "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

export default function MatchPosterPage() {
  const { id } = useParams();
  const posterRef = useRef<HTMLDivElement>(null);
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [size, setSize] = useState("ig");
  const [accent, setAccent] = useState("#ef233c");
  const selectedSize =
    posterSizes.find((item) => item.value === size) ?? posterSizes[0];

  useEffect(() => {
    let cancelled = false;

    async function fetchMatch() {
      if (!id) {
        setMatch(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getMatchById(id);
        if (!cancelled) setMatch(data);
      } catch (error) {
        console.error("Gagal mengambil data pertandingan:", error);
        if (!cancelled) setMatch(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchMatch();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const goals = useMemo(() => {
    const matchWithGoals = match as
      | (Match & {
          goals?: Array<{
            _id?: string;
            minute?: number;
            is_own_goal?: boolean;
            player?: {
              _id?: string;
              name_player?: string;
              photo?: string | null;
            };
            assist?: { name_player?: string; photo?: string | null } | null;
            club?: { _id?: string; name_club?: string };
          }>;
        })
      | null;

    return [...(matchWithGoals?.goals ?? [])].sort(
      (a, b) => (a.minute ?? 0) - (b.minute ?? 0),
    );
  }, [match]);

  async function downloadPoster() {
    if (!posterRef.current) return;

    try {
      setDownloading(true);
      // Beri waktu agar gambar logo/foto selesai dirender.
      await Promise.all(
        Array.from(posterRef.current.querySelectorAll("img")).map((image) =>
          image.complete
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                image.onload = () => resolve();
                image.onerror = () => resolve();
              }),
        ),
      );

      const node = posterRef.current;
      const pixelRatio = selectedSize.width / node.offsetWidth;
      const dataUrl = await toPng(node, {
        pixelRatio,
        cacheBust: true,
        backgroundColor: "#08090d",
      });

      const link = document.createElement("a");
      link.download = `match-poster-${id ?? "preview"}-${size}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Gagal mengunduh poster:", error);
      alert(
        "Poster gagal diunduh. Periksa URL logo/foto dan izin CORS backend.",
      );
    } finally {
      setDownloading(false);
    }
  }

  if (loading) return <p className="p-6">Memuat pertandingan...</p>;
  if (!match) return <p className="p-6">Pertandingan tidak ditemukan.</p>;

  const homeName = match.home_club?.name_club ?? "HOME";
  const awayName = match.away_club?.name_club ?? "AWAY";
  const homeLogo = getAssetUrl(match.home_club?.logo);
  const awayLogo = getAssetUrl(match.away_club?.logo);
  const matchDate = match.match_date ? new Date(match.match_date) : null;
  const dateLabel = matchDate
    ? matchDate
        .toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Jakarta",
        })
        .toUpperCase()
    : "TANGGAL BELUM TERSEDIA";
  const timeLabel = matchDate
    ? `${matchDate.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Jakarta",
      })} WIB`
    : "";
  const finished = match.status === "finished";

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-8 text-white sm:px-8">
      <div className="mx-auto grid max-w-7xl items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* awal aside */}
        <aside className="space-y-5 rounded-2xl border border-white/10 bg-zinc-900/70 p-5">
          <div>
            <h1 className="text-2xl font-black">
              Match Poster <span className="text-red-500">Studio</span>
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              Poster hasil pertandingan bergaya sports editorial.
            </p>
          </div>

          <label className="block text-sm">
            <span className="mb-2 block text-zinc-400">Ukuran poster</span>
            <select
              value={size}
              onChange={(event) => setSize(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-3"
            >
              {posterSizes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label} — {item.width} × {item.height}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="mb-3 block text-sm text-zinc-400">
              Warna poster
            </span>
            <div className="flex flex-wrap gap-3">
              {[
                { color: "#ef233c", label: "Merah" },
                { color: "#eab308", label: "Emas" },
                { color: "#38bdf8", label: "Biru" },
                { color: "#22c55e", label: "Hijau" },
                { color: "#a78bfa", label: "Ungu" },
              ].map(({ color, label }) => (
                <button
                  key={color}
                  type="button"
                  aria-label={`Pilih warna ${label}`}
                  onClick={() => setAccent(color)}
                  className={`h-8 w-8 rounded-full ${
                    accent === color
                      ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-black/30 p-3 text-sm">
            <p className="text-xs text-zinc-500">Resolusi ekspor</p>
            <p className="mt-1 font-bold">
              {selectedSize.width} × {selectedSize.height} px
            </p>
          </div>

          <button
            type="button"
            onClick={downloadPoster}
            disabled={downloading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-3.5 font-bold text-white transition hover:bg-red-400 disabled:opacity-60"
          >
            {downloading ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <Download size={18} />
            )}
            {downloading ? "Menyiapkan PNG..." : "Download Poster PNG"}
          </button>
        </aside>
        {/* akhir aside */}

        {/* awal teks di luar views posater */}
        <section className="min-w-0 rounded-2xl border border-white/10 bg-zinc-900/50 p-4 sm:p-6">
          <div className="mb-5">
            <h2 className="font-bold">Live Preview</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Logo klub dan daftar pencetak gol mengikuti data pertandingan.
            </p>
          </div>
          {/* akhir teks di luar views posater */}

          {/* awal poster */}
          <div className="flex justify-center overflow-auto rounded-xl bg-black/40 p-3 sm:p-6">
            <div
              className="w-full"
              style={{
                maxWidth:
                  size === "story" ? 380 : size === "facebook" ? 720 : 500,
              }}
            >
              <div
                ref={posterRef}
                className="relative isolate flex w-full flex-col overflow-hidden bg-[#08090d]"
                style={{
                  aspectRatio: `${selectedSize.width}/${selectedSize.height}`,
                  backgroundImage: `
      radial-gradient(
        ellipse at 0% 15%,
        ${accent}55 0%,
        transparent 42%
      ),
      linear-gradient(
        rgba(0, 0, 0, 0.35),
        rgba(0, 0, 0, 0.75)
      ),
      url("/poster.png")
    `,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {/* garis horizontal sebelah kiri */}
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 w-0.75"
                  style={{ backgroundColor: accent }}
                />
                {/* garis diagonal pada background */}
                <div className="pointer-events-none absolute left-[-25%] top-[12%] h-[30%] w-[80%] rotate-[-25deg] border border-white/10" />
                <div className="pointer-events-none absolute right-[-25%] top-[20%] h-[30%] w-[80%] rotate-[-25deg] border border-white/10" />

                {/* header */}
                <header className="relative z-10 flex items-start justify-between gap-3 border-b border-white/5 pb-3 mt-4 mx-4">
                  <div className="flex items-center gap-2">
                    <Trophy size={22} style={{ color: accent }} />
                    <div>
                      <p className="text-[clamp(8px,1.8vw,12px)] font-black tracking-[0.2em]">
                        FOOTBALL
                      </p>
                      <p className="text-[clamp(7px,1.4vw,10px)] tracking-[0.25em] text-white/50">
                        {match.season ?? "MATCH REPORT"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p
                      className="text-[clamp(8px,1.8vw,12px)] text-zinc-900 font-black tracking-[0.18em] px-2"
                      style={{ backgroundColor: accent }}
                    >
                      MATCHDAY {match.matchday ?? "-"}
                    </p>
                    <div className="flex flex-col ">
                      <p className="whitespace-nowrap leading-none text-[clamp(7px,1.6vw,11px)] font-black">
                        {dateLabel}
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-[clamp(7px,1.5vw,10px)] text-white/60">
                        <Clock3 size={11} /> {timeLabel}
                      </p>
                    </div>
                  </div>
                </header>

                {/* main */}
                <main className="relative z-10 mt-auto w-full py-9 px-16">
                  <div className="relative z-10 mt-[5%] grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-[3%] mb-4">
                    {/* home logo */}
                    <div className="">
                      <div
                        className="mx-auto flex aspect-square w-24 items-center justify-center border border-white/20 bg-white/6 p-[12%] rounded-tl-2xl"
                        style={{ boxShadow: `0 0 32px ${accent}22` }}
                      >
                        {homeLogo ? (
                          <img
                            src={homeLogo}
                            alt={`${homeName} logo`}
                            crossOrigin="anonymous"
                            onError={(event) => {
                              console.error(
                                "Logo kandang gagal dimuat:",
                                event.currentTarget.src,
                              );
                              event.currentTarget.style.display = "none";
                            }}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <Shield
                            style={{ color: accent }}
                            className="h-full w-full"
                          />
                        )}
                      </div>
                    </div>

                    {/* Score home & away */}
                    <div className="min-w-0 max-w-full text-center">
                      <p className="whitespace-nowrap py-0 leading-none text-5xl font-extrabold">
                        {match.home_score ?? "-"}
                        <span className="mx-2" style={{ color: accent }}>
                          -
                        </span>
                        {match.away_score ?? "-"}
                      </p>

                      {/* stadion */}
                      <div className="min-w-0 max-w-40">
                        <span className="text-sm" style={{ color: accent }}>
                          Std.
                        </span>
                        <p className="max-w-full wrap-break-words text-[clamp(7px,8px,11px)] font-bold uppercase">
                          {match.home_club?.stadium || "Stadion belum tersedia"}
                        </p>
                      </div>
                    </div>

                    {/* logo away */}
                    <div className="min-w-0 text-center">
                      <div className="mx-auto flex aspect-square w-24 items-center justify-center rounded-tl-2xl border border-white/20 bg-white/6 p-[12%]">
                        {awayLogo ? (
                          <img
                            src={awayLogo}
                            alt={`${awayName} logo`}
                            crossOrigin="anonymous"
                            onError={(event) => {
                              console.error(
                                "Logo tandang gagal dimuat:",
                                event.currentTarget.src,
                              );
                              event.currentTarget.style.display = "none";
                            }}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <Shield
                            style={{ color: accent }}
                            className="h-full w-full"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* goal events */}
                  <div className="relative z-10 grid grid-cols-2 gap-x-[5%]">
                    {[
                      {
                        name: homeName,
                        clubId: match.home_club?._id,
                        side: "home",
                      },
                      {
                        name: awayName,
                        clubId: match.away_club?._id,
                        side: "away",
                      },
                    ].map((team) => {
                      const teamGoals = goals.filter((goal) => {
                        const goalClubId = goal.club?._id;

                        if (goalClubId && team.clubId) {
                          return goalClubId === team.clubId;
                        }

                        return (
                          goal.club?.name_club?.toLowerCase() ===
                          team.name.toLowerCase()
                        );
                      });

                      return (
                        <div key={team.name} className="min-w-0 space-y-2">
                          {teamGoals.map((goal, index) => (
                            <div
                              key={goal._id ?? `${goal.minute}-${index}`}
                              className={`flex min-w-0 items-start gap-2 ${
                                team.side === "away" ? "justify-between" : ""
                              }`}
                            >
                              {/* minute goal tim away */}
                              {team.side === "away" && (
                                <span
                                  className="shrink-0 text-xs font-black"
                                  style={{ color: accent }}
                                >
                                  {formatMinute(goal.minute)}
                                </span>
                              )}

                              <div
                                className={`min-w-0  ${team.side === "away" ? "flex-none text-right " : "flex-1"}`}
                              >
                                {/* name player home n away */}
                                <p className="wrap-break-words text-xs font-bold leading-tight">
                                  {goal.is_own_goal ? "OG " : ""}
                                  {goal.player?.name_player ?? "Pencetak gol"}
                                </p>

                                {/* assists tim home */}
                                {goal.assist?.name_player && (
                                  <p className="wrap-break-words text-[clamp(6px,1.35vw,9px)] leading-tight text-white/50">
                                    {goal.assist.name_player}
                                  </p>
                                )}
                              </div>

                              {/* minute tim home */}
                              {team.side === "home" && (
                                <span
                                  className="shrink-0 text-xs font-black"
                                  style={{ color: accent }}
                                >
                                  {formatMinute(goal.minute)}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </main>
              </div>
            </div>
          </div>
          {/* akhir poster */}

          <p className="mt-4 text-center text-xs text-zinc-500">
            {selectedSize.width} × {selectedSize.height} px · PNG
          </p>
        </section>
      </div>
    </main>
  );
}
