import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "./routes/layout.tsx", [
    // child routes
    index("./routes/home.tsx"),
    route("list", "./routes/list.tsx"),
    route("pertanyaan", "./routes/pertanyaan.tsx"),
    route("playground", "./routes/playground.tsx"),
    route("standing", "./routes/standing.tsx"),
    route("notifications", "./routes/notification.tsx"),
    route("learning/snippet", "./routes/learning/snippet.tsx"),
    route("coffee", "./routes/coffeeRoute.tsx"),

    route("*", "./routes/not-found.tsx"),
  ]),
] satisfies RouteConfig;
