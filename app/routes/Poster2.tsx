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

        <section className="min-w-0 rounded-2xl border border-white/10 bg-zinc-900/50 p-4 sm:p-6">
          <div className="mb-5">
            <h2 className="font-bold">Live Preview</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Logo klub dan daftar pencetak gol mengikuti data pertandingan.
            </p>
          </div>

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
                className="relative isolate flex w-full flex-col overflow-hidden bg-[#08090d] p-[5%]"
                style={{
                  aspectRatio: `${selectedSize.width}/${selectedSize.height}`,
                  background: `radial-gradient(ellipse at 0% 15%, ${accent}55 0%, transparent 42%), radial-gradient(ellipse at 100% 20%, #1456a855 0%, transparent 42%), linear-gradient(145deg,#15151b 0%,#08090d 55%,#101116 100%)`,
                }}
              >
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 w-0.75"
                  style={{ backgroundColor: accent }}
                />
                <div className="pointer-events-none absolute left-[-25%] top-[12%] h-[30%] w-[80%] rotate-[-25deg] border border-white/10" />
                <div className="pointer-events-none absolute right-[-25%] top-[20%] h-[30%] w-[80%] rotate-[-25deg] border border-white/10" />

                <header className="relative z-10 flex items-center justify-between gap-3 border-b border-white/20 pb-3">
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
                  <div className="text-right">
                    <p className="text-[clamp(8px,1.8vw,12px)] font-black tracking-[0.18em]">
                      MATCHDAY {match.matchday ?? "-"}
                    </p>
                    <p
                      className="mt-1 inline-block px-2 py-1 text-[clamp(7px,1.5vw,10px)] font-black tracking-widest"
                      style={{ backgroundColor: accent, color: "#08090d" }}
                    >
                      {finished
                        ? "FULL TIME"
                        : (match.status ?? "UPCOMING").toUpperCase()}
                    </p>
                  </div>
                </header>

                <div className="relative z-10 mt-[5%] grid grid-cols-[1fr_auto_1fr] items-center gap-[3%]">
                  <div className="min-w-0 text-center">
                    <div
                      className="mx-auto flex aspect-square w-[88%] items-center justify-center rounded-full border border-white/20 bg-white/6 p-[12%]"
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
                    <p className="mt-3 wrap-break-words text-[clamp(10px,2.5vw,19px)] font-black uppercase leading-tight">
                      {homeName}
                    </p>
                    <p className="mt-1 text-[clamp(7px,1.5vw,10px)] font-bold tracking-[0.2em] text-white/40">
                      HOME
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-[clamp(8px,1.6vw,11px)] font-black tracking-[0.2em] text-white/50">
                      SCORE
                    </p>
                    <p className="whitespace-nowrap text-[clamp(30px,8vw,62px)] font-black italic leading-none tracking-tighter">
                      {match.home_score ?? "-"}
                      <span className="mx-1" style={{ color: accent }}>
                        :
                      </span>
                      {match.away_score ?? "-"}
                    </p>
                    <div
                      className="mx-auto mt-2 h-1 w-12"
                      style={{ backgroundColor: accent }}
                    />
                  </div>

                  <div className="min-w-0 text-center">
                    <div className="mx-auto flex aspect-square w-[88%] items-center justify-center rounded-full border border-white/20 bg-white/6 p-[12%]">
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
                    <p className="mt-3 -wrap-break-words text-[clamp(10px,2.5vw,19px)] font-black uppercase leading-tight">
                      {awayName}
                    </p>
                    <p className="mt-1 text-[clamp(7px,1.5vw,10px)] font-bold tracking-[0.2em] text-white/40">
                      AWAY
                    </p>
                  </div>
                </div>

                <div className="relative z-10 my-[5%] flex items-center gap-3">
                  <div className="h-px flex-1 bg-white/20" />
                  <p
                    className="text-[clamp(8px,1.8vw,12px)] font-black tracking-[0.3em]"
                    style={{ color: accent }}
                  >
                    MATCH HIGHLIGHTS
                  </p>
                  <div className="h-px flex-1 bg-white/20" />
                </div>

                <div className="relative z-10 grid grid-cols-2 gap-x-[5%]">
                  {[
                    { name: homeName, clubId: match.home_club?._id },
                    { name: awayName, clubId: match.away_club?._id },
                  ].map((team) => {
                    const teamGoals = goals.filter((goal) => {
                      const goalClubId = goal.club?._id;
                      if (goalClubId && team.clubId)
                        return goalClubId === team.clubId;
                      return (
                        goal.club?.name_club?.toLowerCase() ===
                        team.name.toLowerCase()
                      );
                    });

                    return (
                      <div key={team.name} className="min-w-0 space-y-2">
                        <p className="mb-2 border-b border-white/15 pb-2 text-[clamp(8px,1.7vw,12px)] font-black uppercase tracking-wider text-white/60">
                          {team.name}
                        </p>
                        {teamGoals.length ? (
                          teamGoals.map((goal, index) => (
                            <div
                              key={goal._id ?? `${goal.minute}-${index}`}
                              className="flex min-w-0 items-center gap-2"
                            >
                              {/* image player goal event */}
                              {goal.player?.photo ? (
                                <img
                                  src={getAssetUrl(goal.player.photo)}
                                  alt={goal.player.name_player ?? "Pemain"}
                                  crossOrigin="anonymous"
                                  className="h-[clamp(22px,5vw,42px)] w-[clamp(22px,5vw,42px)] shrink-0 rounded-full border border-white/30 object-cover"
                                />
                              ) : (
                                <div
                                  className="flex h-[clamp(22px,5vw,42px)] w-[clamp(22px,5vw,42px)] shrink-0 items-center justify-center rounded-full border border-white/30 text-[clamp(7px,1.5vw,11px)] font-black"
                                  style={{
                                    backgroundColor: `${accent}25`,
                                    color: accent,
                                  }}
                                >
                                  {initials(goal.player?.name_player)}
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                {/* name player goal */}
                                <p className="wrap-break-words text-[clamp(7px,1.7vw,12px)] font-bold leading-tight">
                                  {goal.is_own_goal ? "OG " : ""}
                                  {goal.player?.name_player ?? "Pencetak gol"}
                                </p>
                                {goal.assist?.name_player && (
                                  // assist goal name
                                  <p className="wrap-break-words text-[clamp(6px,1.35vw,9px)] leading-tight text-white/50">
                                    Assist: {goal.assist.name_player}
                                  </p>
                                )}
                              </div>
                              <span
                                className="shrink-0 text-[clamp(8px,1.7vw,12px)] font-black"
                                style={{ color: accent }}
                              >
                                {formatMinute(goal.minute)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-[clamp(7px,1.5vw,10px)] text-white/35"></p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <footer className="relative z-10 mt-auto border-t border-white/20 pt-[4%]">
                  <div className="grid grid-cols-[1fr_1fr] gap-3">
                    <div className="flex min-w-0 items-start gap-2">
                      <CalendarDays
                        size={14}
                        style={{ color: accent }}
                        className="mt-0.5 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-[clamp(7px,1.6vw,11px)] font-black">
                          {dateLabel}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-[clamp(7px,1.5vw,10px)] text-white/60">
                          <Clock3 size={11} /> {timeLabel}
                        </p>
                      </div>
                    </div>
                    <div className="flex min-w-0 items-start gap-2">
                      <MapPin
                        size={14}
                        style={{ color: accent }}
                        className="mt-0.5 shrink-0"
                      />
                      <p className="wrap-break-words text-[clamp(7px,1.6vw,11px)] font-bold uppercase">
                        {match.home_club?.stadium ?? "Stadion belum tersedia"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-[4%] flex items-center justify-between gap-2">
                    <p className="text-[clamp(7px,1.5vw,10px)] font-black tracking-[0.22em] text-white/40">
                      FINAL WHISTLE
                    </p>
                    <p
                      className="text-right text-[clamp(8px,1.7vw,12px)] font-black italic tracking-wider"
                      style={{ color: accent }}
                    >
                      ONE MATCH. ONE STORY.
                    </p>
                  </div>
                </footer>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-zinc-500">
            {selectedSize.width} × {selectedSize.height} px · PNG
          </p>
        </section>
      </div>
    </main>
  );
}
