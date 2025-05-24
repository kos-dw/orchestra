// import { WeblogService } from "~/.server/application/services/weblog.service";
// import type { WeblogEntity } from "~/.server/domain/entities/weblog.entities";
// import { catchException } from "~/errors";
import type { Route } from ".react-router/types/app/presentation/routes/+types/dashboard";
import {
  logger,
  sessionsService,
} from "app/di/.server/inversify.config";
import Container from "app/presentation/components/container";
import { catchException } from "app/shared/errors";
import { getCallerInfo } from "app/shared/utils/.server";
import { useEffect } from "react";
import { data } from "react-router";
import { toast } from "sonner";

export async function loader({ request }: Route.LoaderArgs) {
  const { commitSession, getSession } =
    sessionsService.getSessionStorage();
  const session = await getSession(request.headers.get("Cookie"));

  try {
    const flash = session.get("success");
    // 正常系のレスポンス
    return data(
      { Ok: { flash }, Err: null },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      },
    );
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

export default function Dashboard({
  loaderData,
}: Route.ComponentProps) {
  const payload = loaderData;

  if (payload.Err) return <p>{payload.Err.message}</p>;

  const { flash } = payload.Ok;

  useEffect(() => {
    let id: number | string;
    if (flash) {
      id = toast.success(flash);
    }

    return () => {
      toast.dismiss(id);
    };
  }, [flash]);
  return (
    <>
      <Container className="pt-8">
        <h1 className="heading-primary font-en mb-8">Welcome back!</h1>
      </Container>
      {/* <Container>
        <h2 className="heading-secondary font-en mb-8">Latest weblog</h2>
        {weblogList.length > 0 ? (
          <>
            <ul className="mb-8">
              {weblogList.map((weblog) => (
                <li key={weblog.weblog_unique_key} className="mb-2 md:mb-4">
                  <dl className="flex flex-wrap md:flex-nowrap">
                    <dt data-label="タイトル" className="order-2 w-full">
                      <Link
                        to={`${NAVI.WEBLOG.URL}/${weblog.weblog_unique_key}`}
                        className="border-b border-gray-300 hover:border-none"
                      >
                        {weblog.title}
                      </Link>
                    </dt>
                    <dd data-label="投稿日時" className="order-1 w-36 shrink-0">
                      {convertDateString(weblog.published_at, true)} ―
                    </dd>
                  </dl>
                </li>
              ))}
            </ul>

            <Link
              to="/weblog"
              className="inline-block text-center px-4 py-2 bg-slate-500 text-white font-en hover:bg-slate-600"
            >
              All articles
            </Link>
          </>
        ) : (
          <p>現在記事はありません。</p>
        )}
      </Container> */}
    </>
  );
}
