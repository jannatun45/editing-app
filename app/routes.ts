import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("/", "./routes/layout.tsx", [
    // child routes
    index("./routes/home.tsx"),
    route("list", "./routes/list.tsx"),
  ]),

  route("*", "./routes/not-found.tsx"),
] satisfies RouteConfig;
