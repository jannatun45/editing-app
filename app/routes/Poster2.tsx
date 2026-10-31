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
  Zap,
  Monitor,
  Palette,
  Image,
  ChevronDown,
  Radio,
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

export default function MatchPosterPage() {
  const { id } = useParams();
  const posterRef = useRef<HTMLDivElement>(null);

  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [size, setSize] = useState("ig");
  const [accent, setAccent] = useState("#00f0ff");

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
            injury_time?: number;
            is_penalty?: boolean;
            is_own_goal?: boolean;
            player?: {
              _id?: string;
              name_player?: string;
              photo?: string | null;
            };
            assist?: {
              name_player?: string;
              photo?: string | null;
            } | null;
            club?: {
              _id?: string;
              name_club?: string;
            };
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
        backgroundColor: "#050711",
      });

      const link = document.createElement("a");
      link.download = `match-poster-${id ?? "preview"}-${size}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Gagal mengunduh poster:", error);
      alert("Poster gagal diunduh. Periksa URL gambar dan izin CORS backend.");
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050711] text-cyan-400">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="animate-spin" size={32} />
          <p className="text-sm font-bold tracking-[0.3em]">
            LOADING MATCH DATA...
          </p>
        </div>
      </main>
    );
  }

  if (!match) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050711] text-white">
        Pertandingan tidak ditemukan.
      </main>
    );
  }

  const homeName = match.home_club?.name_club ?? "HOME";
  const awayName = match.away_club?.name_club ?? "AWAY";

  const homeLogo = getAssetUrl(match.home_club?.logo);
  const awayLogo = getAssetUrl(match.away_club?.logo);

  const matchDate = match.match_date ? new Date(match.match_date) : null;

  const matchPoster = match.poster
    ? `${API_BASE}/images/matches/${match.poster}`
    : "";

  const dateLabel = matchDate
    ? matchDate
        .toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Jakarta",
        })
        .toUpperCase()
    : "DATE NOT AVAILABLE";

  const timeLabel = matchDate
    ? `${matchDate.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Jakarta",
      })} WIB`
    : "";

  const finished = match.status === "finished";

  const colors = [
    { color: "#00f0ff", label: "Cyber Cyan" },
    { color: "#a855f7", label: "Neon Purple" },
    { color: "#ff2d75", label: "Neon Pink" },
    { color: "#c6ff00", label: "Electric Lime" },
    { color: "#facc15", label: "Cyber Gold" },
    { color: "#3b82f6", label: "Electric Blue" },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050711] px-4 py-8 text-white sm:px-8">
      {/* BACKGROUND EFFECT */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,240,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(0,240,255,.3) 1px,transparent 1px)",
          backgroundSize: "45px 45px",
        }}
      />

      <div className="pointer-events-none fixed -left-40 top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[130px]" />
      <div className="pointer-events-none fixed -right-40 bottom-0 h-96 w-96 rounded-full bg-purple-600/10 blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-[1500px]">
        {/* PAGE HEADER */}
        <header className="mb-8 flex flex-col justify-between gap-5 border-b border-white/10 pb-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.12)]">
              <Zap size={25} />
            </div>

            <div>
              <p className="text-[10px] font-bold tracking-[0.35em] text-cyan-400">
                FUTURE SPORTS TECHNOLOGY
              </p>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                MATCH POSTER <span className="text-cyan-400">STUDIO.</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full border border-green-400/20 bg-green-400/5 px-4 py-2 md:self-center">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-green-400">
              DESIGN SYSTEM ONLINE
            </span>
          </div>
        </header>

        <div className="grid items-start gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          {/* SIDEBAR */}
          <aside className="space-y-5">
            {/* SETTINGS CARD */}
            <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020]/90 shadow-2xl backdrop-blur-xl">
              <div className="border-b border-white/10 bg-white/[0.025] p-5">
                <div className="flex items-center gap-2">
                  <Monitor size={17} className="text-cyan-400" />
                  <h2 className="text-sm font-black tracking-wider">
                    DESIGN CONTROL
                  </h2>
                </div>

                <p className="mt-2 text-xs text-zinc-500">
                  Customize your match poster appearance.
                </p>
              </div>

              <div className="space-y-6 p-5">
                {/* SIZE */}
                <div>
                  <label className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                    <Image size={15} className="text-cyan-400" />
                    Poster Resolution
                  </label>

                  <div className="relative">
                    <select
                      value={size}
                      onChange={(event) => setSize(event.target.value)}
                      className="w-full appearance-none rounded-xl border border-white/10 bg-[#080c18] px-4 py-3.5 pr-10 text-sm font-semibold text-white outline-none transition focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30"
                    >
                      {posterSizes.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400"
                    />
                  </div>
                </div>

                {/* ACCENT COLOR */}
                <div>
                  <label className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
                    <Palette size={15} className="text-cyan-400" />
                    Neon Accent Color
                  </label>

                  <div className="grid grid-cols-3 gap-3">
                    {colors.map(({ color, label }) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setAccent(color)}
                        className={`group flex flex-col items-center gap-2 rounded-xl border p-3 transition ${
                          accent === color
                            ? "border-white/40 bg-white/10"
                            : "border-white/5 bg-white/[0.02] hover:border-white/20"
                        }`}
                      >
                        <span
                          className="h-7 w-7 rounded-full transition group-hover:scale-110"
                          style={{
                            backgroundColor: color,
                            boxShadow: `0 0 18px ${color}90`,
                          }}
                        />
                        <span className="text-[9px] font-bold text-zinc-400">
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* RESOLUTION */}
                <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] p-4">
                  <p className="text-[10px] font-bold tracking-[0.2em] text-cyan-400">
                    EXPORT RESOLUTION
                  </p>

                  <p className="mt-2 text-xl font-black tracking-tight">
                    {selectedSize.width}
                    <span className="mx-2 text-zinc-600">×</span>
                    {selectedSize.height}
                    <span className="ml-2 text-xs font-medium text-zinc-500">
                      PX
                    </span>
                  </p>

                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: "75%",
                        backgroundColor: accent,
                        boxShadow: `0 0 12px ${accent}`,
                      }}
                    />
                  </div>
                </div>

                {/* DOWNLOAD */}
                <button
                  type="button"
                  onClick={downloadPoster}
                  disabled={downloading}
                  className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl px-5 py-4 text-sm font-black tracking-wider text-[#050711] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    backgroundColor: accent,
                    boxShadow: `0 0 25px ${accent}35`,
                  }}
                >
                  {downloading ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <Download size={18} />
                  )}

                  {downloading ? "GENERATING PNG..." : "EXPORT POSTER"}

                  <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-700 group-hover:translate-x-full" />
                </button>

                <p className="text-center text-[10px] text-zinc-600">
                  HIGH QUALITY PNG · READY TO PUBLISH
                </p>
              </div>
            </section>

            {/* MATCH INFO */}
            <section className="rounded-2xl border border-white/10 bg-[#0b1020]/90 p-5">
              <div className="mb-4 flex items-center gap-2">
                <Radio size={16} className="text-purple-400" />
                <h3 className="text-xs font-black tracking-wider">
                  MATCH INFORMATION
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Competition</span>
                  <span className="text-xs font-bold">
                    {match.season ?? "Football League"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Matchday</span>
                  <span className="text-xs font-bold text-cyan-400">
                    #{match.matchday ?? "-"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Status</span>
                  <span
                    className={`rounded-md px-2 py-1 text-[9px] font-black tracking-wider ${
                      finished
                        ? "bg-green-400/10 text-green-400"
                        : "bg-yellow-400/10 text-yellow-400"
                    }`}
                  >
                    {finished ? "FINISHED" : "UPCOMING"}
                  </span>
                </div>
              </div>
            </section>
          </aside>

          {/* PREVIEW SECTION */}
          <section className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020]/90 shadow-2xl">
            {/* PREVIEW HEADER */}
            <div className="flex flex-col justify-between gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:px-7">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                  <h2 className="text-sm font-black tracking-wider">
                    LIVE PREVIEW
                  </h2>
                </div>

                <p className="mt-1 text-xs text-zinc-500">
                  Real-time poster visualization.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
                <Monitor size={14} className="text-cyan-400" />
                <span className="text-[10px] font-bold text-zinc-400">
                  {selectedSize.label}
                </span>
              </div>
            </div>

            {/* POSTER CANVAS */}
            <div className="flex justify-center overflow-auto bg-[#050711] p-4 sm:p-8">
              <div
                className="w-full"
                style={{
                  maxWidth:
                    size === "story" ? 380 : size === "facebook" ? 720 : 500,
                }}
              >
                <div
                  ref={posterRef}
                  className="relative isolate flex w-full flex-col overflow-hidden bg-[#050711] text-white"
                  style={{
                    aspectRatio: `${selectedSize.width}/${selectedSize.height}`,
                    backgroundImage: `
                      radial-gradient(ellipse at 0% 10%, ${accent}45, transparent 45%),
                      radial-gradient(ellipse at 100% 90%, #7c3aed35, transparent 45%),
                      linear-gradient(145deg, #090d1b 0%, #050711 65%, #101027 100%)
                      ${matchPoster ? `, url("${matchPoster}")` : ""}
                    `,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* POSTER BACKGROUND EFFECTS */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.12]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.15) 1px,transparent 1px)",
                      backgroundSize: "30px 30px",
                    }}
                  />

                  <div
                    className="pointer-events-none absolute -right-[20%] top-[15%] h-[35%] w-[70%] rotate-[-25deg] border opacity-30"
                    style={{ borderColor: accent }}
                  />

                  <div
                    className="pointer-events-none absolute -left-[30%] bottom-[15%] h-[30%] w-[80%] rotate-[-25deg] border opacity-20"
                    style={{ borderColor: accent }}
                  />

                  <div
                    className="pointer-events-none absolute left-0 top-0 h-full w-[3px]"
                    style={{
                      backgroundColor: accent,
                      boxShadow: `0 0 25px ${accent}`,
                    }}
                  />

                  {/* POSTER HEADER */}
                  <header className="relative z-10 mx-[7%] mt-[7%] flex items-start justify-between border-b border-white/20 pb-[4%]">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{
                          backgroundColor: `${accent}20`,
                          color: accent,
                        }}
                      >
                        <Trophy size={22} />
                      </div>

                      <div>
                        <p className="text-[clamp(9px,2vw,15px)] font-black tracking-[0.25em]">
                          FOOTBALL
                        </p>
                        <p className="text-[clamp(7px,1.4vw,10px)] tracking-[0.25em] text-white/50">
                          {match.season ?? "MATCH REPORT"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className="inline-block px-3 py-1 text-[clamp(8px,1.6vw,12px)] font-black tracking-widest text-black"
                        style={{ backgroundColor: accent }}
                      >
                        MATCHDAY {match.matchday ?? "-"}
                      </div>

                      <p className="mt-2 text-[clamp(7px,1.5vw,11px)] font-bold tracking-wider">
                        {dateLabel}
                      </p>

                      <p className="mt-1 flex items-center justify-end gap-1 text-[clamp(7px,1.4vw,10px)] text-white/50">
                        <Clock3 size={10} />
                        {timeLabel}
                      </p>
                    </div>
                  </header>

                  {/* MAIN SCOREBOARD */}
                  <main className="relative z-10 my-auto w-full px-[7%] py-[8%]">
                    <div className="mb-[7%] text-center">
                      <p
                        className="text-[clamp(10px,2vw,14px)] font-black tracking-[0.5em]"
                        style={{ color: accent }}
                      >
                        {finished ? "FULL TIME" : "MATCH CENTER"}
                      </p>

                      <p className="mt-2 text-[clamp(7px,1.3vw,10px)] font-bold tracking-[0.3em] text-white/40">
                        THE ULTIMATE FOOTBALL EXPERIENCE
                      </p>
                    </div>

                    {/* TEAM + SCORE */}
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-[3%]">
                      {/* HOME */}
                      <div className="min-w-0 text-center">
                        <div
                          className="mx-auto flex aspect-square w-[85%] max-w-32 items-center justify-center rounded-2xl border bg-white/[0.04] p-[13%] backdrop-blur-md"
                          style={{
                            borderColor: `${accent}70`,
                            boxShadow: `0 0 35px ${accent}20, inset 0 0 20px ${accent}10`,
                          }}
                        >
                          {homeLogo ? (
                            <img
                              src={homeLogo}
                              alt={`${homeName} logo`}
                              crossOrigin="anonymous"
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <Shield
                              className="h-full w-full"
                              style={{ color: accent }}
                            />
                          )}
                        </div>

                        <p className="mt-4 break-words text-[clamp(9px,2vw,15px)] font-black uppercase tracking-wider">
                          {homeName}
                        </p>

                        <p className="mt-1 text-[clamp(7px,1.3vw,10px)] tracking-[0.2em] text-white/40">
                          HOME
                        </p>
                      </div>

                      {/* SCORE */}
                      <div className="min-w-0 text-center">
                        <div
                          className="text-[clamp(34px,9vw,68px)] font-black leading-none tracking-[-0.08em]"
                          style={{
                            textShadow: `0 0 30px ${accent}60`,
                          }}
                        >
                          {match.home_score ?? "-"}
                          <span className="mx-1" style={{ color: accent }}>
                            :
                          </span>
                          {match.away_score ?? "-"}
                        </div>

                        <div
                          className="mx-auto mt-4 h-[2px] w-full"
                          style={{
                            backgroundColor: accent,
                            boxShadow: `0 0 12px ${accent}`,
                          }}
                        />

                        <p className="mt-3 text-[clamp(7px,1.3vw,10px)] font-black tracking-widest text-white/40">
                          VS
                        </p>
                      </div>

                      {/* AWAY */}
                      <div className="min-w-0 text-center">
                        <div
                          className="mx-auto flex aspect-square w-[85%] max-w-32 items-center justify-center rounded-2xl border border-purple-400/40 bg-white/[0.04] p-[13%] backdrop-blur-md"
                          style={{
                            boxShadow: "0 0 35px rgba(168,85,247,0.15)",
                          }}
                        >
                          {awayLogo ? (
                            <img
                              src={awayLogo}
                              alt={`${awayName} logo`}
                              crossOrigin="anonymous"
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <Shield className="h-full w-full text-purple-400" />
                          )}
                        </div>

                        <p className="mt-4 break-words text-[clamp(9px,2vw,15px)] font-black uppercase tracking-wider">
                          {awayName}
                        </p>

                        <p className="mt-1 text-[clamp(7px,1.3vw,10px)] tracking-[0.2em] text-white/40">
                          AWAY
                        </p>
                      </div>
                    </div>

                    {/* STADIUM */}
                    <div className="mt-[8%] flex items-center justify-center gap-2 border-y border-white/10 py-3">
                      <MapPin size={13} style={{ color: accent }} />

                      <p className="text-center text-[clamp(7px,1.6vw,11px)] font-bold uppercase tracking-widest">
                        {match.home_club?.stadium || "STADIUM NOT AVAILABLE"}
                      </p>
                    </div>

                    {/* GOAL EVENTS */}
                    <div className="mt-[8%]">
                      <div className="mb-5 flex items-center justify-between">
                        <p className="text-[clamp(9px,1.8vw,13px)] font-black tracking-[0.25em]">
                          MATCH EVENTS
                        </p>

                        <span
                          className="rounded-md px-2 py-1 text-[clamp(7px,1.3vw,9px)] font-black"
                          style={{
                            backgroundColor: `${accent}20`,
                            color: accent,
                          }}
                        >
                          {goals.length} GOALS
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-[6%]">
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
                            <div key={team.name} className="min-w-0">
                              <div
                                className="mb-3 border-b pb-2 text-[clamp(8px,1.5vw,10px)] font-black tracking-widest"
                                style={{ borderColor: `${accent}50` }}
                              >
                                {team.side === "home"
                                  ? "HOME TEAM"
                                  : "AWAY TEAM"}
                              </div>

                              {teamGoals.length > 0 ? (
                                <div className="space-y-3">
                                  {teamGoals.map((goal, index) => (
                                    <div
                                      key={
                                        goal._id ?? `${goal.minute}-${index}`
                                      }
                                      className={`flex min-w-0 items-start gap-2 ${
                                        team.side === "away"
                                          ? "flex-row-reverse"
                                          : ""
                                      }`}
                                    >
                                      <div
                                        className="shrink-0 rounded-md px-2 py-1 text-[clamp(7px,1.4vw,10px)] font-black"
                                        style={{
                                          backgroundColor: `${accent}20`,
                                          color: accent,
                                        }}
                                      >
                                        {formatMinute(goal.minute)}
                                        {goal.injury_time
                                          ? `+${goal.injury_time}`
                                          : ""}
                                        {goal.is_penalty ? " P" : ""}
                                        {goal.is_own_goal ? " OG" : ""}
                                      </div>

                                      <div
                                        className={`min-w-0 ${
                                          team.side === "away"
                                            ? "text-right"
                                            : "text-left"
                                        }`}
                                      >
                                        <p className="break-words text-[clamp(8px,1.6vw,11px)] font-bold leading-tight">
                                          {goal.player?.name_player ??
                                            "Unknown Player"}
                                        </p>

                                        {goal.assist?.name_player && (
                                          <p className="mt-1 break-words text-[clamp(6px,1.2vw,9px)] text-white/40">
                                            AST: {goal.assist.name_player}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[clamp(7px,1.3vw,10px)] text-white/30">
                                  No goals recorded
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </main>

                  {/* FOOTER */}
                  <footer className="relative z-10 mx-[7%] mb-[6%] flex items-center justify-between border-t border-white/20 pt-4">
                    <div>
                      <p
                        className="text-[clamp(8px,1.5vw,11px)] font-black tracking-[0.25em]"
                        style={{ color: accent }}
                      >
                        MATCHDAY EXPERIENCE
                      </p>

                      <p className="mt-1 text-[clamp(6px,1.2vw,9px)] tracking-widest text-white/40">
                        FOOTBALL NEVER STOPS.
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: accent }}
                      />
                      <span className="text-[clamp(7px,1.2vw,9px)] font-black tracking-widest text-white/50">
                        OFFICIAL MATCH
                      </span>
                    </div>
                  </footer>
                </div>
              </div>
            </div>

            {/* PREVIEW FOOTER */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-white/[0.02] px-5 py-4 sm:px-7">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: accent }}
                />
                <span className="text-[10px] font-bold tracking-wider text-zinc-400">
                  CYBERPUNK THEME ACTIVE
                </span>
              </div>

              <p className="text-[10px] font-bold text-zinc-500">
                {selectedSize.width} × {selectedSize.height} PX · PNG
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
