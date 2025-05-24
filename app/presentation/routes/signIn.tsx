import type { Route } from ".react-router/types/app/presentation/routes/+types/signIn";
import {
  authService,
  logger,
  sessionsService,
} from "app/di/.server/inversify.config";
import { incomingWebhooks } from "app/infrastructure/.server/services/slack.service";
import { Logo } from "app/presentation/components/svg";
import { HTTP_STATUS, INFO } from "app/shared/constants";
import ENV from "app/shared/env/.server";
import { getCallerInfo } from "app/shared/utils/.server";
import { data, redirect } from "react-router";

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
    // セッションがある場合はリダイレクト
    if (auth) return redirect("/dashboard");
  } catch (error) {
    logger.error(
      error instanceof Error ? error.message : "Unknown error.",
      getCallerInfo(),
    );
  }
}

export async function action({ request }: Route.ActionArgs) {
  const { getSession, commitSession } =
    sessionsService.getSessionStorage();

  const formData = await request.formData();
  const session = await getSession(request.headers.get("Cookie"));

  try {
    // 認証処理
    const result = await authService.authCredential(formData);

    if (result.Ok) {
      const auth = result.Ok;
      session.set("auth", auth);
      logger.info(`Signed in auth.id=${auth.id}`);
      const currentHour = new Date().getHours();

      switch (true) {
        case currentHour < 12:
          session.flash(
            "success",
            `おはようございます! ${auth.display_name}`,
          );
          break;
        case currentHour < 18:
          session.flash("success", `こんにちは! ${auth.display_name}`);
          break;
        default:
          session.flash("success", `こんばんは! ${auth.display_name}`);
          break;
      }

      // サインイン通知
      incomingWebhooks(
        `[${INFO.APP_NAME}:${ENV.CLIENT_NAME}]\nUser Signed in\nuser_id=${auth.id}\ndisplay_name=${auth.display_name}`,
      );

      // 認証が成功した時のリダイレクト
      return redirect("/", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }

    // 認証が失敗した時のレスポンス
    return data(
      {
        Ok: null,
        Err: result.Err,
      },
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

    // 異常系のレスポンス
    return data(
      {
        Ok: null,
        Err: {
          log: "Unexpected error",
          issues: [{ message: "Unexpected error" }],
          status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        },
      },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      },
    );
  }
}

export default function SignIn({ actionData }: Route.ComponentProps) {
  const payload = actionData;

  return (
    <>
      <div className="w-full h-screen grid place-items-center bg-tertiary">
        <div className="w-80">
          <div className="mb-4">
            <Logo className="fill-primary w-full" />
          </div>
          <h1 className="mb-4 text-center">Sign in to your account.</h1>

          <div className="mb-8">
            <div aria-label="error">
              {payload?.Err && (
                <p className="text-center text-red-500 text-sm mb-4">
                  認証に失敗しました。
                </p>
              )}
            </div>
            <form method="POST">
              <ul className="grid grid-rows-2 gap-4">
                <li>
                  <label>
                    <p className="font-en">Email</p>
                    <input
                      name="email"
                      type="text"
                      className="border border-gray-300 bg-white px-4 w-full h-12"
                    />
                  </label>
                </li>
                <li>
                  <label>
                    <p className="font-en">Password</p>
                    <input
                      name="password"
                      type="password"
                      autoComplete="password"
                      className="border border-gray-300 bg-white px-4 w-full h-12"
                    />
                  </label>
                </li>
                <li>
                  <button
                    type="submit"
                    className="cursor-pointer bg-primary hover:bg-slate-500 text-white w-full h-12 rounded-md"
                  >
                    Sign in
                  </button>
                </li>
              </ul>
            </form>
          </div>
          <p className="text-center text-sm tracking-normal font-en">
            &copy;&nbsp;{INFO.ESTERBLISHMENT_YEAR}-
            {new Date().getFullYear()}
            &nbsp;{INFO.APP_NAME}
            <br />
            &nbsp;Powered by {INFO.POWERED_BY}.
          </p>
        </div>
      </div>
    </>
  );
}
