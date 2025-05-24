import type { Route } from ".react-router/types/app/presentation/routes/+types/_index";
import {
  logger,
  sessionsService,
} from "app/di/.server/inversify.config";
import { INFO } from "app/shared/constants";
import { getCallerInfo } from "app/shared/utils/.server";
import { redirect } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: INFO.TITLE },
    { name: "description", content: INFO.DESCRIPTION },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const { getSession } = sessionsService.getSessionStorage();

  try {
    const session = await getSession(request.headers.get("Cookie"));
    const { auth } = session.data;

    // 認証済みならダッシュボードへリダイレクト
    if (auth) return redirect("/dashboard");

    // 未認証ならサインインページへリダイレクト
    return redirect("/signin");
  } catch (error) {
    logger.error(
      error instanceof Error ? error.message : "Unknown error.",
      getCallerInfo(),
    );
  }
}
