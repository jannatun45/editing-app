import { useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import {
  CalendarDays,
  Download,
  RefreshCw,
  Shield,
  Trophy,
} from "lucide-react";

import Container from "~/components/templates/Container";
import { getStandings } from "~/services/standingServices";
import type { Standing } from "~/types/api/standings";

const exportFormats = [
  {
    label: "Instagram Portrait · 4:5",
    value: "instagram",
    width: 1080,
    height: 1350,
  },
  {
    label: "Instagram Square · 1:1",
    value: "square",
    width: 1080,
    height: 1080,
  },
  {
    label: "Story / Reels / TikTok · 9:16",
    value: "story",
    width: 1080,
    height: 1920,
  },
  { label: "Landscape · 16:9", value: "landscape", width: 1920, height: 1080 },
  { label: "Poster HD · 4:5", value: "hd", width: 2160, height: 2700 },
];

const accents = [
  { label: "Merah", value: "#ef233c" },
  { label: "Emas", value: "#eab308" },
  { label: "Biru", value: "#38bdf8" },
  { label: "Hijau", value: "#22c55e" },
  { label: "Ungu", value: "#a78bfa" },
  { label: "Putih", value: "#f4f4f5" },
];

const API_BASE = "http://localhost:3000";
const API_URL = import.meta.env.VITE_API_URL;

function getLogoUrl(file?: string | null) {
  if (!file) return "";
  if (/^https?:\/\//i.test(file)) return file;
  const cleanPath = file.replace(/^\/+/, "");
  if (cleanPath.startsWith("uploads/") || cleanPath.startsWith("images/")) {
    return `${API_BASE}/${cleanPath}`;
  }
  return `${API_BASE}/images/clubs/${cleanPath}`;
}

export default function StandingPage() {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [season, setSeason] = useState("2026/2027");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [size, setSize] = useState("instagram");
  const [accent, setAccent] = useState("#ef233c");
  const [downloading, setDownloading] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);
  const [currentMatchday, setCurrentMatchday] = useState(1);

  const selectedSize =
    exportFormats.find((format) => format.value === size) ?? exportFormats[0];

  useEffect(() => {
    let cancelled = false;

    async function loadStandings() {
      try {
        setLoading(true);
        setError("");
        const data = await getStandings(season);
        if (!cancelled) setStandings(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal mengambil data klasemen.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadStandings();
    return () => {
      cancelled = true;
    };
  }, [season, reloadKey]);

  // useaeffect ngambil matchday terbaru
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
              fixture.status === "finished" &&
              typeof fixture.matchday === "number",
          )
          .map((fixture: { matchday: number }) => fixture.matchday);

        setCurrentMatchday(
          playedMatchdays.length > 0 ? Math.max(...playedMatchdays) : 1,
        );
      } catch (error) {
        console.error("Gagal mengambil pekan pertandingan:", error);
      }
    }

    loadMatchday();
  }, [season]);

  const adjustedStandings = useMemo(() => {
    const sanctionedClubIds = [
      "6aaddf8688b36e2c1186f662",
      "6aaddf6288b36e2c1186f661",
    ];

    return standings
      .map((standing) => ({
        ...standing,
        adjustedPoints: sanctionedClubIds.includes(standing.club._id)
          ? standing.points - 2
          : standing.points,
      }))
      .sort(
        (a, b) =>
          b.adjustedPoints - a.adjustedPoints ||
          b.goal_difference - a.goal_difference ||
          b.goals_for - a.goals_for,
      );
  }, [standings]);

  async function downloadStanding() {
    const node = posterRef.current;
    if (!node || downloading || adjustedStandings.length === 0) return;

    try {
      setDownloading(true);
      await Promise.all(
        Array.from(node.querySelectorAll("img")).map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                img.onload = () => resolve();
                img.onerror = () => resolve();
              }),
        ),
      );

      const pixelRatio = selectedSize.width / node.offsetWidth;
      const dataUrl = await toPng(node, {
        pixelRatio,
        cacheBust: true,
        backgroundColor: "#08090d",
      });

      const link = document.createElement("a");
      link.download = `klasemen-${season.replace("/", "-")}-${size}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Gagal mengunduh gambar klasemen:", err);
      setError(
        "Gambar gagal dibuat. Periksa URL logo klub dan izin CORS backend.",
      );
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Container>
      <main className="min-h-screen bg-[#09090b] py-6 text-white sm:py-8">
        <div className="mx-auto grid max-w-7xl items-start gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* aside */}
          <aside className="space-y-6 rounded-2xl border border-white/10 bg-zinc-900/70 p-5">
            <div>
              <div
                className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/4"
                style={{ color: accent }}
              >
                <Trophy size={22} />
              </div>
              <h1 className="text-2xl font-black tracking-tight">
                Standing <span style={{ color: accent }}>Studio</span>
              </h1>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Buat poster klasemen liga dengan tampilan editorial sepak bola.
              </p>
            </div>

            <label className="block text-sm">
              <span className="mb-2 flex items-center gap-2 text-zinc-400">
                <CalendarDays size={15} /> Pilih musim
              </span>
              <select
                value={season}
                onChange={(event) => setSeason(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-3 text-white outline-none focus:border-white/30"
              >
                <option value="2026/2027">2026/2027</option>
                <option value="2027/2028">2027/2028</option>
              </select>
            </label>

            <label className="block text-sm">
              <span className="mb-2 block text-zinc-400">Ukuran poster</span>
              <select
                value={size}
                onChange={(event) => setSize(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-zinc-950 px-3 py-3 text-white outline-none focus:border-white/30"
              >
                {exportFormats.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label} — {format.width} × {format.height}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <span className="mb-3 block text-sm text-zinc-400">
                Warna aksen
              </span>
              <div className="flex flex-wrap gap-3">
                {accents.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    title={item.label}
                    aria-label={`Pilih warna ${item.label}`}
                    onClick={() => setAccent(item.value)}
                    className={`h-8 w-8 rounded-full transition ${
                      accent === item.value
                        ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900"
                        : "hover:scale-110"
                    }`}
                    style={{ backgroundColor: item.value }}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-black/30 p-3">
              <p className="text-xs text-zinc-500">Resolusi ekspor</p>
              <p className="mt-1 font-bold">
                {selectedSize.width} × {selectedSize.height} px
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {adjustedStandings.length} klub · PNG
              </p>
            </div>

            <button
              type="button"
              onClick={downloadStanding}
              disabled={
                downloading || loading || adjustedStandings.length === 0
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: accent }}
            >
              {downloading ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <Download size={18} />
              )}
              {downloading ? "Menyiapkan PNG..." : "Download Klasemen PNG"}
            </button>

            <p className="text-xs leading-5 text-zinc-500">
              File PNG berisi desain poster klasemen saja, bukan seluruh
              halaman.
            </p>
          </aside>
          {/* main content */}
          <section className="min-w-0 rounded-2xl border border-white/10 bg-zinc-900/50 p-4 sm:p-6">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-bold">Live Preview</h2>
                <p className="mt-1 text-xs text-zinc-500">
                  Logo dan statistik mengikuti data klasemen musim terpilih.
                </p>
              </div>
              <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-zinc-400">
                {season}
              </span>
            </div>

            {loading ? (
              <div className="flex min-h-64 items-center justify-center gap-3 text-zinc-400">
                <RefreshCw size={20} className="animate-spin" /> Memuat
                klasemen...
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-5">
                <p className="font-bold text-red-300">Gagal memuat klasemen</p>
                <p className="mt-1 text-sm text-zinc-400">{error}</p>
                <button
                  type="button"
                  onClick={() => setReloadKey((current) => current + 1)}
                  className="mt-3 rounded-lg bg-white/10 px-3 py-2 text-sm font-semibold"
                >
                  Periksa kembali
                </button>
              </div>
            ) : adjustedStandings.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center text-center text-zinc-400">
                <Trophy size={32} className="mb-3" />
                <p className="font-bold text-white">Belum ada data klasemen</p>
                <p className="mt-1 text-sm">
                  Belum ada klub terdaftar pada musim {season}.
                </p>
              </div>
            ) : (
              <div className="flex justify-center overflow-auto rounded-xl bg-black/40 p-2 sm:p-5">
                <div
                  className="w-full"
                  style={{
                    maxWidth:
                      size === "story" ? 380 : size === "landscape" ? 900 : 560,
                  }}
                >
                  <div
                    ref={posterRef}
                    className="relative isolate flex w-full flex-col overflow-hidden bg-[#08090d] py-4 pl-4 pr-18 "
                    style={{
                      aspectRatio: `${selectedSize.width}/${selectedSize.height}`,
                      backgroundImage: `radial-gradient(ellipse at 0% 10%, ${accent}40 0%, transparent 42%), linear-gradient(145deg, #111827 0%, #08090d 68%)`,
                    }}
                  >
                    <div
                      className="pointer-events-none absolute inset-y-0 left-0 w-1"
                      style={{ backgroundColor: accent }}
                    />
                    {/* header */}
                    <header className="flex justify-between relative z-10 border-b  border-green-500/10 pb-1.5 mb-4">
                      <div className="flex flex-col gap-2">
                        {/* <p className="font-extrabold tracking-widest text-[11px]">
                          klasemen sementara 
                        </p> */}
                        <p className="capitalize text-[clamp(7px,1.5vw,11px)] tracking-[0.18em] text-white/45">
                          Klasemen sementara · {season}
                        </p>

                        <h3 className="text-2xl font-black uppercase leading-[0.95] tracking-wider">
                          bri{" "}
                          <span style={{ color: accent }}>super league</span>
                        </h3>
                      </div>
                      <div>
                        {" "}
                        <span
                          className="rounded px-2 py-1 text-[10px] font-black tracking-widest"
                          style={{
                            backgroundColor: accent,
                            color: "#08090d",
                          }}
                        >
                          PEKAN KE-{currentMatchday}
                        </span>
                      </div>
                    </header>

                    {/* main standing */}
                    <div className="relative z-10 min-h-0 flex-1 ">
                      <table className="w-full table-fixed border-collapse text-[clamp(7px,1.45vw,12px)]">
                        <colgroup>
                          <col style={{ width: "9%" }} />
                          <col style={{ width: "39%" }} />
                          <col style={{ width: "8%" }} />
                          <col style={{ width: "8%" }} />
                          <col style={{ width: "8%" }} />
                          <col style={{ width: "8%" }} />
                          <col style={{ width: "9%" }} />
                          <col style={{ width: "11%" }} />
                        </colgroup>
                        <thead>
                          <tr
                            style={{
                              backgroundColor: accent,
                              color: "#08090d",
                            }}
                          >
                            {[
                              "POS",
                              "CLUB",
                              "MP",
                              "W",
                              "D",
                              "L",
                              "GD",
                              "PTS",
                            ].map((heading) => (
                              <th
                                key={heading}
                                className="px-1 py-[1.5%] text-center font-black"
                              >
                                {heading}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {adjustedStandings.map((standing, index) => (
                            <tr
                              key={standing._id}
                              className="border-b border-white/[0.07]"
                              style={{
                                backgroundColor:
                                  index % 2 === 0 ? "#151923" : "#0d1119",
                              }}
                            >
                              <td
                                className="px-1 py-[1.35%] text-center font-black"
                                style={{
                                  color: index === 0 ? accent : "#d4d4d8",
                                }}
                              >
                                {index + 1}
                              </td>
                              <td className="px-1 py-[1.35%]">
                                <div className="flex min-w-0 items-center gap-1.5">
                                  {standing.club.logo ? (
                                    <img
                                      src={getLogoUrl(standing.club.logo)}
                                      alt=""
                                      crossOrigin="anonymous"
                                      className="h-[1.45em] w-[1.45em] shrink-0 object-contain"
                                      onError={(event) => {
                                        event.currentTarget.style.display =
                                          "none";
                                      }}
                                    />
                                  ) : (
                                    <Shield className="h-[1.25em] w-[1.25em] shrink-0 text-white/40" />
                                  )}
                                  <span className="truncate font-bold">
                                    {standing.club.name_club}
                                  </span>
                                </div>
                              </td>
                              <td className="px-0.5 py-[1.35%] text-center text-white/70">
                                {standing.match}
                              </td>
                              <td className="px-0.5 py-[1.35%] text-center text-emerald-400">
                                {standing.win}
                              </td>
                              <td className="px-0.5 py-[1.35%] text-center text-white/60">
                                {standing.draw}
                              </td>
                              <td className="px-0.5 py-[1.35%] text-center text-red-400">
                                {standing.lose}
                              </td>
                              <td className="px-0.5 py-[1.35%] text-center text-white/70">
                                {standing.goal_difference > 0 ? "+" : ""}
                                {standing.goal_difference}
                              </td>
                              <td
                                className="px-0.5 py-[1.35%] text-center font-black"
                                style={{ color: accent }}
                              >
                                {standing.adjustedPoints}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <p className="mt-4 text-center text-xs text-zinc-500">
              {selectedSize.width} × {selectedSize.height} px · PNG
            </p>
          </section>
        </div>
      </main>
    </Container>
  );
}
