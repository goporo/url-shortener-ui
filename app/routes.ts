import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("shorten/:shortCode", "routes/shorten.tsx"),
] satisfies RouteConfig;
