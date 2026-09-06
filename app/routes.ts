import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("products", "routes/profile.tsx"),
  route("standing", "routes/standing.tsx"),
  route("list", "routes/list.tsx"),
  route("belajar/snippet", "routes/belajar/snippet.tsx"),

  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
