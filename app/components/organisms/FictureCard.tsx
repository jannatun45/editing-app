import type { Fixture } from "~/types/api/fixtures";
import { CalendarDays, MapPin, Trophy, ArrowUpRight } from "lucide-react";

type FixtureCardProps = {
  fixture: Fixture;
  clubId: string;
  onClick: () => void;
};

export default function FixtureCard({
  fixture,
  clubId,
  onClick,
}: FixtureCardProps) {
  const isHome = fixture.home_club._id === clubId;

  const isFinished = fixture.status === "finished";

  const homeScore = fixture.home_score;
  const awayScore = fixture.away_score;

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

  const homeLogo = getLogo(fixture.home_club.logo);
  const awayLogo = getLogo(fixture.away_club.logo);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-2xl border border-slate-700/70 bg-gradient-to-br from-[#101d30] via-[#0a1423] to-[#070d17] text-left transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-xl hover:shadow-amber-950/20 focus:outline-none focus:ring-2 focus:ring-amber-400/60"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-amber-400/[0.04] blur-3xl transition group-hover:bg-amber-400/[0.09]" />

      {/* Top information */}
      <div className="relative flex items-center justify-between border-b border-white/[0.07] px-4 py-3 sm:px-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/10 text-amber-300">
            <CalendarDays size={15} />
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Matchday
            </p>
            <p className="text-sm font-bold text-white">{fixture.matchday}</p>
          </div>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
            isFinished
              ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
              : "border-amber-400/20 bg-amber-400/10 text-amber-300"
          }`}
        >
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
          {isFinished ? "Finished" : "Scheduled"}
        </span>
      </div>

      {/* Teams and score */}
      <div className="relative grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-3 py-6 sm:gap-4 sm:px-5 sm:py-8">
        {/* Home club */}
        <div className="flex min-w-0 flex-col items-center gap-3 text-center">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl border p-2 transition sm:h-[68px] sm:w-[68px] ${
              homeWon
                ? "border-amber-400/40 bg-amber-400/10 shadow-lg shadow-amber-950/20"
                : "border-white/10 bg-white/[0.03] group-hover:border-white/20"
            }`}
          >
            {homeLogo ? (
              <img
                src={homeLogo}
                alt={`Logo ${fixture.home_club.name_club}`}
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-lg font-black text-slate-400">
                {fixture.home_club.name_club.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          <div className="w-full min-w-0">
            <p
              className={`truncate text-xs font-bold sm:text-sm ${
                homeWon ? "text-amber-300" : "text-white"
              }`}
              title={fixture.home_club.name_club}
            >
              {fixture.home_club.name_club}
            </p>

            <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Home
            </p>
          </div>
        </div>

        {/* Score */}
        <div className="flex min-w-[74px] flex-col items-center sm:min-w-[100px]">
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

              <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                Full Time
              </p>
            </>
          ) : (
            <>
              <span className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-lg font-black tracking-widest text-slate-300">
                VS
              </span>

              <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Upcoming
              </p>
            </>
          )}
        </div>

        {/* Away club */}
        <div className="flex min-w-0 flex-col items-center gap-3 text-center">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl border p-2 transition sm:h-[68px] sm:w-[68px] ${
              awayWon
                ? "border-amber-400/40 bg-amber-400/10 shadow-lg shadow-amber-950/20"
                : "border-white/10 bg-white/[0.03] group-hover:border-white/20"
            }`}
          >
            {awayLogo ? (
              <img
                src={awayLogo}
                alt={`Logo ${fixture.away_club.name_club}`}
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-lg font-black text-slate-400">
                {fixture.away_club.name_club.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          <div className="w-full min-w-0">
            <p
              className={`truncate text-xs font-bold sm:text-sm ${
                awayWon ? "text-amber-300" : "text-white"
              }`}
              title={fixture.away_club.name_club}
            >
              {fixture.away_club.name_club}
            </p>

            <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-500">
              Away
            </p>
          </div>
        </div>
      </div>

      {/* Bottom information */}
      <div className="relative flex items-center justify-between gap-3 border-t border-white/[0.07] bg-black/10 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2 text-xs text-slate-400">
          <MapPin size={14} className="shrink-0 text-amber-400" />

          <span className="truncate">
            {isHome ? "Home Match" : "Away Match"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isFinished && (
            <span className="hidden items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:flex">
              <Trophy size={12} />
              Result
            </span>
          )}

          <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-slate-500 transition group-hover:border-amber-400/30 group-hover:bg-amber-400/10 group-hover:text-amber-300">
            <ArrowUpRight size={15} />
          </span>
        </div>
      </div>

      {/* Gold accent */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-amber-400 to-yellow-200 transition-all duration-300 group-hover:w-full" />
    </button>
  );
}
