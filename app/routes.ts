import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "./routes/layout.tsx", [
    // child routes
    index("./routes/matches.tsx"),
    route("standing", "./routes/standing.tsx"),
    route("players", "./routes/players.tsx"),
    route("download", "./routes/download.tsx"),

    route("club/:id", "routes/club-profile.tsx"),

    // Halaman poster pertandingan
    route("match/:id", "routes/Poster.tsx"),

    route("top-scorers", "routes/top-scorers.tsx"),
    route("top-assists", "routes/top-assists.tsx"),

    route("*", "./routes/not-found.tsx"),
  ]),
] satisfies RouteConfig;
