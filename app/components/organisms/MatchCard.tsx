import { useNavigate } from "react-router";
import {
  CalendarDays,
  Clock3,
  ArrowUpRight,
  Trophy,
  Zap,
  Shield,
} from "lucide-react";
import type { Match } from "~/types/api/matches";

type MatchCardProps = {
  match: Match;
  onClick: () => void;
};

export default function MatchCard({ match, onClick }: MatchCardProps) {
  const navigate = useNavigate();

  const matchDate = match.match_date ? new Date(match.match_date) : null;
  const isFinished = match.status === "finished";
  const homeScore = match.home_score;
  const awayScore = match.away_score;

  const homeWon =
    isFinished &&
    homeScore !== null &&
    awayScore !== null &&
    homeScore > awayScore;

  const awayWon =
    isFinished &&
    homeScore !== null &&
    awayScore !== null &&
    awayScore > homeScore;

  const isDraw =
    isFinished &&
    homeScore !== null &&
    awayScore !== null &&
    homeScore === awayScore;

  const getLogo = (logo?: string | null) => {
    if (!logo) return null;

    return logo.startsWith("http")
      ? logo
      : `http://localhost:3000/images/clubs/${logo}`;
  };

  const homeLogo = getLogo(match.home_club.logo);
  const awayLogo = getLogo(match.away_club.logo);

  const formattedDate = matchDate
    ? matchDate.toLocaleDateString("id-ID", {
        timeZone: "Asia/Jakarta",
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Tanggal belum ditentukan";

  const formattedTime = matchDate
    ? matchDate.toLocaleTimeString("id-ID", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : null;

  const handleClubClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    clubId: string,
  ) => {
    event.stopPropagation();
    navigate(`/club/${clubId}`);
  };

  return (
    <article
      // onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-cyan-400/15 bg-[#080d19] text-white shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_12px_35px_rgba(6,182,212,0.1)]"
    >
      {/* ================= BACKGROUND DECORATION ================= */}
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-500/[0.07] blur-[90px] transition-all duration-500 group-hover:bg-cyan-400/12" />

      <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-purple-500/6 blur-[90px]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size[24px_24px] opacity-40" />
      {/* ================= HEADER ================= */}
      <div className="relative flex items-center justify-between gap-3 border-b border-white/[0.07] bg-[#0c1424]/80 px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.07] text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.05)]">
            <CalendarDays size={18} />
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-500">
              Competition
            </p>

            <p className="mt-0.5 text-sm font-black uppercase tracking-wider text-white">
              Matchday {match.matchday}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[9px] font-black uppercase tracking-[0.15em] ${
            isFinished
              ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-300"
              : "border-amber-400/25 bg-amber-400/10 text-amber-300"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isFinished
                ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                : "animate-pulse bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"
            }`}
          />

          {isFinished ? "Finished" : "Scheduled"}
        </span>
      </div>
      {/* ================= DATE & TIME ================= */}

      <div className="relative flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 pt-5">
        <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          <CalendarDays size={13} className="text-cyan-400" />
          {formattedDate}
        </span>

        {formattedTime && (
          <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            <Clock3 size={13} className="text-purple-400" />
            {formattedTime} WIB
          </span>
        )}
      </div>

      {/* ================= MATCH CENTER ================= */}
      <div
        onClick={() => navigate(`/match/${match._id}`)}
        className="relative grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-3 py-7 sm:gap-5 sm:px-6 sm:py-8"
      >
        {/* HOME TEAM */}
        <div className="flex min-w-0 flex-col items-center gap-3">
          <button
            type="button"
            title={`Lihat profil ${match.home_club.name_club}`}
            // onClick={() => navigate(`/match/${match._id}`)}
            onClick={(event) => handleClubClick(event, match.home_club._id)}
            className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border p-3 transition-all duration-300 hover:scale-105 sm:h-20 sm:w-20 ${
              homeWon
                ? "border-cyan-400/50 bg-cyan-400/10 shadow-[0_0_25px_rgba(34,211,238,0.12)]"
                : "border-white/10 bg-white/[0.035] hover:border-cyan-400/40"
            }`}
          >
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-cyan-400/8 to-transparent" />

            {homeLogo ? (
              <img
                src={homeLogo}
                alt={`Logo ${match.home_club.name_club}`}
                className="relative h-full w-full object-contain drop-shadow-[0_0_10px_rgba(34,211,238,0.15)]"
              />
            ) : (
              <span className="relative text-xl font-black text-cyan-300">
                {match.home_club.name_club.slice(0, 2).toUpperCase()}
              </span>
            )}

            {homeWon && (
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-lg border border-cyan-300/40 bg-[#0b1726] text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.2)]">
                <Trophy size={12} />
              </span>
            )}
          </button>

          <div className="w-full min-w-0 text-center">
            <button
              type="button"
              title={`Lihat profil ${match.home_club.name_club}`}
              onClick={(event) => handleClubClick(event, match.home_club._id)}
              className={`max-w-full truncate text-[11px] font-black uppercase tracking-wide transition hover:text-cyan-300 sm:text-sm ${
                homeWon ? "text-cyan-300" : "text-white"
              }`}
            >
              {match.home_club.name_club}
            </button>

            <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-slate-600">
              Home
            </p>
          </div>
        </div>

        {/* SCOREBOARD */}
        <div className="flex min-w-20 flex-col items-center sm:min-w-28">
          {isFinished ? (
            <>
              <div className="flex items-center gap-2 sm:gap-3">
                <span
                  className={`text-3xl font-black tabular-nums sm:text-5xl ${
                    homeWon
                      ? "text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.25)]"
                      : "text-white"
                  }`}
                >
                  {homeScore ?? 0}
                </span>

                <span className="text-xl font-light text-slate-600 sm:text-2xl">
                  :
                </span>

                <span
                  className={`text-3xl font-black tabular-nums sm:text-5xl ${
                    awayWon
                      ? "text-purple-300 drop-shadow-[0_0_12px_rgba(192,132,252,0.25)]"
                      : "text-white"
                  }`}
                >
                  {awayScore ?? 0}
                </span>
              </div>

              <div
                className={`mt-3 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.16em] ${
                  isDraw
                    ? "border-amber-400/20 bg-amber-400/5 text-amber-300"
                    : "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
                }`}
              >
                {isDraw ? <Shield size={11} /> : <Trophy size={11} />}

                {isDraw ? "Draw" : "Full Time"}
              </div>
            </>
          ) : (
            <>
              <div className="relative flex items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-5 py-3 shadow-[0_0_20px_rgba(34,211,238,0.04)] sm:px-7">
                <span className="text-xl font-black italic tracking-[0.25em] text-cyan-300 sm:text-2xl">
                  VS
                </span>
              </div>

              <p className="mt-3 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                <Zap size={11} className="text-amber-400" />
                Kick Off
              </p>
            </>
          )}
        </div>

        {/* AWAY TEAM */}
        <div className="flex min-w-0 flex-col items-center gap-3">
          <button
            type="button"
            title={`Lihat profil ${match.away_club.name_club}`}
            onClick={(event) => handleClubClick(event, match.away_club._id)}
            className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border p-3 transition-all duration-300 hover:scale-105 sm:h-20 sm:w-20 ${
              awayWon
                ? "border-purple-400/50 bg-purple-400/10 shadow-[0_0_25px_rgba(192,132,252,0.12)]"
                : "border-white/10 bg-white/[0.035] hover:border-purple-400/40"
            }`}
          >
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-purple-400/[8 to-transparent" />

            {awayLogo ? (
              <img
                src={awayLogo}
                alt={`Logo ${match.away_club.name_club}`}
                className="relative h-full w-full object-contain drop-shadow-[0_0_10px_rgba(192,132,252,0.15)]"
              />
            ) : (
              <span className="relative text-xl font-black text-purple-300">
                {match.away_club.name_club.slice(0, 2).toUpperCase()}
              </span>
            )}

            {awayWon && (
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-lg border border-purple-300/40 bg-[#171025] text-purple-300 shadow-[0_0_12px_rgba(192,132,252,0.2)]">
                <Trophy size={12} />
              </span>
            )}
          </button>

          <div className="w-full min-w-0 text-center">
            <button
              type="button"
              title={`Lihat profil ${match.away_club.name_club}`}
              onClick={(event) => handleClubClick(event, match.away_club._id)}
              className={`max-w-full truncate text-[11px] font-black uppercase tracking-wide transition hover:text-purple-300 sm:text-sm ${
                awayWon ? "text-purple-300" : "text-white"
              }`}
            >
              {match.away_club.name_club}
            </button>

            <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-slate-600">
              Away
            </p>
          </div>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="relative flex items-center justify-between gap-3 border-t border-white/[0.07] bg-[#0c1424]/80 px-4 py-3.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <div
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${
              isFinished ? "bg-emerald-400" : "bg-amber-400"
            }`}
          />

          <p className="truncate text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500 sm:text-[10px]">
            {isFinished ? "Match Result" : "Upcoming Match"}
          </p>
        </div>

        <span
          onClick={onClick}
          className="flex shrink-0 items-center gap-2 text-[10px] font-black uppercase tracking-wider text-cyan-400 transition-all group-hover:gap-3 group-hover:text-cyan-300"
        >
          View Match
          <ArrowUpRight
            size={15}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>

      {/* ================= BOTTOM ACCENT ================= */}

      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-cyan-400 via-purple-400 to-cyan-400 transition-all duration-500 group-hover:w-full" />
    </article>
  );
}
