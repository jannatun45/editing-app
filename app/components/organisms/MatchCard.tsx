import { useNavigate } from "react-router";
import { CalendarDays, Clock3, ArrowUpRight, Trophy } from "lucide-react";
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
    <article className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-700/70 bg-linear-to-br from-[#101d30] via-[#0a1423] to-[#070d17] text-white transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-xl hover:shadow-amber-950/20">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-amber-400/4 blur-3xl transition group-hover:bg-amber-400/9" />

      {/* ================= HEADER ================= */}
      <div className="relative flex items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-400/15 bg-amber-400/8 text-amber-300">
            <CalendarDays size={17} />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Matchday
            </p>
            <p className="mt-0.5 text-sm font-bold text-white">
              {match.matchday}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider sm:px-3 sm:text-[10px] ${
            isFinished
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
              : "border-amber-400/20 bg-amber-400/10 text-amber-300"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {isFinished ? "Finished" : "Scheduled"}
        </span>
      </div>

      {/* ================= DATE & TIME ================= */}
      <div className="relative flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 pt-4 text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <CalendarDays size={13} className="text-amber-400" />
          {formattedDate}
        </span>

        {formattedTime && (
          <span className="flex items-center gap-1.5">
            <Clock3 size={13} className="text-amber-400" />
            {formattedTime}
          </span>
        )}
      </div>

      {/* ================= TEAMS & SCORE ================= */}
      <div
        onClick={() => navigate(`/match/${match._id}`)}
        className="relative grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-3 py-6 sm:gap-4 sm:px-5 sm:py-7"
      >
        {/* Home club */}
        <div className="flex min-w-0 flex-col items-center gap-3">
          <button
            type="button"
            title={`Lihat profil ${match.home_club.name_club}`}
            onClick={(event) => handleClubClick(event, match.home_club._id)}
            className={`flex h-14 w-14 items-center justify-center rounded-2xl border p-2 transition hover:scale-105 sm:h-18 sm:w-18 ${
              homeWon
                ? "border-amber-400/40 bg-amber-400/10 shadow-lg shadow-amber-950/20"
                : "border-white/10 bg-white/[0.035] hover:border-amber-400/30"
            }`}
          >
            {homeLogo ? (
              <img
                src={homeLogo}
                alt={`Logo ${match.home_club.name_club}`}
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-lg font-black text-amber-300">
                {match.home_club.name_club.slice(0, 2).toUpperCase()}
              </span>
            )}
          </button>

          <div className="w-full min-w-0 text-center">
            <button
              type="button"
              title={`Lihat profil ${match.home_club.name_club}`}
              onClick={(event) => handleClubClick(event, match.home_club._id)}
              className={`max-w-full truncate text-xs font-bold uppercase transition hover:text-amber-300 sm:text-sm ${
                homeWon ? "text-amber-300" : "text-white"
              }`}
            >
              {match.home_club.name_club}
            </button>

            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Home
            </p>
          </div>
        </div>

        {/* Score */}
        <div className="flex min-w-19 flex-col items-center sm:min-w-27.5">
          {isFinished ? (
            <>
              <div className="flex items-center gap-2 sm:gap-3">
                <span
                  className={`text-3xl font-black tabular-nums sm:text-4xl ${
                    homeWon ? "text-amber-300" : "text-white"
                  }`}
                >
                  {homeScore ?? 0}
                </span>

                <span className="text-xl font-light text-slate-600">:</span>

                <span
                  className={`text-3xl font-black tabular-nums sm:text-4xl ${
                    awayWon ? "text-amber-300" : "text-white"
                  }`}
                >
                  {awayScore ?? 0}
                </span>
              </div>

              <div className="mt-2 flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.15em] text-emerald-400">
                <Trophy size={11} />
                Full Time
              </div>
            </>
          ) : (
            <>
              <span className="rounded-xl border border-white/10 bg-white/4 px-4 py-2 text-lg font-black tracking-widest text-slate-300">
                VS
              </span>

              <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">
                Kick Off
              </p>
            </>
          )}
        </div>

        {/* Away club */}
        <div className="flex min-w-0 flex-col items-center gap-3">
          <button
            type="button"
            title={`Lihat profil ${match.away_club.name_club}`}
            onClick={(event) => handleClubClick(event, match.away_club._id)}
            className={`flex h-14 w-14 items-center justify-center rounded-2xl border p-2 transition hover:scale-105 sm:h-18 sm:w-18 ${
              awayWon
                ? "border-amber-400/40 bg-amber-400/10 shadow-lg shadow-amber-950/20"
                : "border-white/10 bg-white/[0.035] hover:border-amber-400/30"
            }`}
          >
            {awayLogo ? (
              <img
                src={awayLogo}
                alt={`Logo ${match.away_club.name_club}`}
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-lg font-black text-amber-300">
                {match.away_club.name_club.slice(0, 2).toUpperCase()}
              </span>
            )}
          </button>

          <div className="w-full min-w-0 text-center">
            <button
              type="button"
              title={`Lihat profil ${match.away_club.name_club}`}
              onClick={(event) => handleClubClick(event, match.away_club._id)}
              className={`max-w-full truncate text-xs font-bold uppercase transition hover:text-amber-300 sm:text-sm ${
                awayWon ? "text-amber-300" : "text-white"
              }`}
            >
              {match.away_club.name_club}
            </button>

            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Away
            </p>
          </div>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div
        onClick={onClick}
        className="relative flex items-center justify-between gap-3 border-t border-white/[0.07] bg-black/10 px-4 py-3 sm:px-5"
      >
        <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-slate-500">
          {isFinished ? "Match Result" : "Upcoming Match"}
        </p>

        <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 transition group-hover:text-amber-300">
          Edit Match
          <ArrowUpRight
            size={14}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-linear-to-r from-amber-400 to-yellow-200 transition-all duration-300 group-hover:w-full" />
    </article>
  );
}
