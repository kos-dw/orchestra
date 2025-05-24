import type { Route } from ".react-router/types/app/presentation/routes/+types/_resources";
import {
  logger,
  sessionsService,
} from "app/di/.server/inversify.config";
import { CONFIG, HTTP_STATUS } from "app/shared/constants";
import { getCallerInfo } from "app/shared/utils/.server";
import mime from "mime";
import fs from "node:fs";
import path from "node:path";

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

    // 認証チェック(リソースの存在を隠匿したいので、認証されてない時は404を返す)
    if (!auth) {
      return new Response(null, {
        status: HTTP_STATUS.NOT_FOUND,
      });
    }

    // 画像の保存ディレクトリ（サーバー上の非公開ディレクトリ）
    const filePath = path.join(
      process.cwd(),
      CONFIG.UPLOADS_DIR_PATH,
      params.filename || "",
    );

    // ファイルが存在しない場合は404
    if (!fs.existsSync(filePath)) {
      return new Response(HTTP_STATUS[HTTP_STATUS.NOT_FOUND], {
        status: HTTP_STATUS.NOT_FOUND,
      });
    }
    const mimeType =
      mime.getType(filePath) || "application/octet-stream";

    // ファイルを読み込んでレスポンスとして返す
    const fileStream = fs.createReadStream(filePath);
    const readableStream = new ReadableStream({
      start(controller) {
        fileStream.on("data", (chunk) => controller.enqueue(chunk));
        fileStream.on("end", () => controller.close());
        fileStream.on("error", (err) => controller.error(err));
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    logger.error(
      error instanceof Error ? error.message : "Unknown error.",
      getCallerInfo(),
    );
  }
}
