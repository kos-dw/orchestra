import type { RouteConfig } from "@react-router/dev/routes";
import { index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  // アプリケーションのルート
  layout("presentation/layouts/default.tsx", [
    index("presentation/routes/_index.ts"),
    route("/dashboard", "presentation/routes/dashboard.tsx"),
    route("/medialibrary", "presentation/routes/mediaLibrary.tsx"),
    route("/signout", "presentation/routes/signOut.tsx"),
    // route("/weblog/entries", "presentation/routes/weblog/entries.tsx"),

    ...prefix("/weblog", [
      index("presentation/routes/weblog/index.tsx"),
      route(":slug", "presentation/routes/weblog/entry.tsx"),
    ]),
  ]),

  // 認証
  route("/signin", "presentation/routes/signIn.tsx"),

  // 保護コンテンツの表示
  route("/resources/:filename", "presentation/routes/_resources.ts"),

  // API
  route(
    "/api/medialibrary/v1/:query",
    "presentation/routes/api/mediaLibrary/v1/index.ts",
  ),
] satisfies RouteConfig;
