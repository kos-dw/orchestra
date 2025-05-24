import type { Route } from ".react-router/types/app/presentation/routes/api/mediaLibrary/v1/+types/index";
import {
  logger,
  mediaLibraryService,
  sessionsService,
} from "app/di/.server/inversify.config";
import { HTTP_STATUS } from "app/shared/constants";
import { catchException } from "app/shared/errors";
import { getCallerInfo } from "app/shared/utils/.server";

export function headers() {
  return {
    "X-Robots-Tag": "noindex, nofollow",
    "Cache-Control":
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };
}

export async function loader({ request, params }: Route.LoaderArgs) {
  const { commitSession, getSession } =
    sessionsService.getSessionStorage();
  const session = await getSession(request.headers.get("Cookie"));

  try {
    const { auth } = session.data;

    if (!auth) {
      // 認証チェック(リソースの存在を隠匿したいので、認証されてない時は404を返す)
      return new Response(null, {
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    if (params.query === "findall") {
      // メディアライブラリの全件取得
      const mediaLibraryList = await mediaLibraryService.getListAll();
      return new Response(
        JSON.stringify({
          Ok: { mediaLibraryList },
          Err: null,
        }),
      );
    } else {
      // メディアライブラリのクエリが不正な場合
      return new Response(
        JSON.stringify({
          Ok: null,
          Err: {
            message: HTTP_STATUS[HTTP_STATUS.NOT_FOUND],
            status: HTTP_STATUS.NOT_FOUND,
          },
        }),
        {
          status: HTTP_STATUS.NOT_FOUND,
        },
      );
    }
  } catch (error) {
    logger.error(
      error instanceof Error ? error.message : "Unknown error.",
      getCallerInfo(),
    );

    const payload = catchException(error);

    // 異常系のレスポンス
    return new Response(JSON.stringify(payload), {
      status: payload.Err.status,
    });
  }
}
