import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Handle Chrome DevTools and other clients that probe /.well-known/*
  route("/.well-known/*", "routes/well-known.tsx"),
  index("routes/home.tsx"),
  route("/login", "routes/login.tsx"),
  route("/register", "routes/register.tsx"),
  route("/forgot-password", "routes/forgot-password.tsx"),
  route("/reset-password", "routes/reset-password.tsx"),
] satisfies RouteConfig;
