import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "./routes/layout.tsx", [
    // child routes
    index("./routes/home.tsx"),
    route("standing", "./routes/standing.tsx"),
    route("download", "./routes/download.tsx"),

    route("club/:id", "routes/club-profile.tsx"),
    route("matches", "routes/matches.tsx"),

    // nested route
    route("learning/snippet", "./routes/learning/snippet.tsx"),
    route("learning/git", "./routes/learning/git.tsx"),

    route("*", "./routes/not-found.tsx"),
  ]),
] satisfies RouteConfig;
