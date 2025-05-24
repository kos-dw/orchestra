import { logger, weblogService } from "app/di/.server/inversify.config";
import Container from "app/presentation/components/container";
import Marquee from "app/presentation/components/marquee";
import { INFO } from "app/shared/constants";
import { catchException } from "app/shared/errors";
import { convertDateString } from "app/shared/utils/.common";
import { getCallerInfo } from "app/shared/utils/.server";
import { data, Link } from "react-router";
import type { Route } from "./+types/index";

export function meta() {
  return [
    { title: `ウェブログ - 記事一覧 | ${INFO.TITLE}` },
    {
      name: "description",
      content: `ウェブログ - 記事一覧 | ${INFO.DESCRIPTION}`,
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const recordList = await weblogService.getListAll();

    return data({
      Ok: recordList,
      Err: null,
    });
  } catch (error) {
    logger.error(
      error instanceof Error ? error.message : "Unknown error.",
      getCallerInfo(),
    );
    const payload = catchException(error);
    // 異常系のレスポンス
    return data(payload, { status: payload.Err.status });
  }
}

export default function Entries({ loaderData }: Route.ComponentProps) {
  const loaderPayload = loaderData;

  if (loaderPayload.Err) {
    return <p>{loaderPayload.Err.message}</p>;
  }

  const weblogList = loaderPayload.Ok;
  return (
    <>
      <Marquee>
        <div className="flex justify-between items-center">
          <div className="w-9/12">
            <h1 className="heading-primary">ウェブログ記事一覧</h1>
          </div>
          <div className="w-auto">
            <Link
              to="/weblog/newentry"
              className="inline-block bg-primary hover:bg-slate-500 text-white p-4 rounded-md cursor-pointer disabled:opacity-30"
            >
              新規記事作成
            </Link>
          </div>
        </div>
      </Marquee>
      <Container className="mb-24">
        <div className="">
          {weblogList.length > 0 ? (
            <>
              <dl className="md:grid grid-cols-[10rem_1fr_10rem_10rem_10rem] bg-gray-300">
                <dd className="p-4">公開日</dd>
                <dd className="p-4">記事タイトル</dd>
                <dd className="p-4 text-center">投稿者</dd>
                <dd className="p-4 text-center">最終更新者</dd>
                <dd className="p-4 text-center">状態</dd>
              </dl>
              {weblogList.map((weblog) => (
                <dl
                  key={weblog.unique_key}
                  className="md:grid grid-cols-[10rem_1fr_10rem_10rem_10rem] bg-white border-b border-gray-200"
                >
                  <dd className="p-4">
                    <time
                      dateTime={
                        convertDateString(weblog.published_at, true) ??
                        ""
                      }
                      className="w-full block truncate"
                    >
                      {convertDateString(weblog.published_at, true)}
                    </time>
                  </dd>
                  <dd className="p-4 truncate">
                    <Link
                      to={`/weblog/${weblog.unique_key}`}
                      className="border-b border-gray-300 hover:border-none"
                    >
                      {weblog.title}
                    </Link>
                  </dd>
                  <dd className="p-4 truncate text-center">
                    {weblog.created_by_display_name || "No name"}
                  </dd>
                  <dd className="p-4 truncate text-center">
                    {weblog.updated_by_display_name || "No name"}
                  </dd>
                  <dd className="p-4 truncate text-center">
                    {weblog.is_published ? "公開中" : "非公開"}
                  </dd>
                </dl>
              ))}
            </>
          ) : (
            <p className="text-center w-full">
              記事が見つかりませんでした。
            </p>
          )}
        </div>
      </Container>
    </>
  );
}
