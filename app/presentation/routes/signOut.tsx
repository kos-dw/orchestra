import type { Route } from ".react-router/types/app/presentation/routes/+types/signOut";
import {
  logger,
  sessionsService,
} from "app/di/.server/inversify.config";
import { INFO } from "app/shared/constants";
import { getCallerInfo } from "app/shared/utils/.server";
import { useEffect, useRef } from "react";
import { Link, redirect } from "react-router";
export function meta({}: Route.MetaArgs) {
  return [
    { title: INFO.TITLE },
    { name: "description", content: INFO.DESCRIPTION },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const { getSession, destroySession } =
    sessionsService.getSessionStorage();
  const session = await getSession(request.headers.get("Cookie"));

  try {
    logger.info(`Signed out auth.id=${session.data.auth?.id}`);
    return redirect("/signin", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  } catch (error) {
    logger.error(
      error instanceof Error ? error.message : "Unknown error.",
      getCallerInfo(),
    );
  }
}

export default function SignOut({}: Route.ComponentProps) {
  const viewArea = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const setViewHeight = () => {
      const headerHeight =
        document.querySelector("header")?.clientHeight || 0;
      const footerHeight =
        document.querySelector("footer")?.clientHeight || 0;
      const culcHeight = `calc(100vh - ${headerHeight + footerHeight}px)`;
      viewArea.current!.style.height = culcHeight;
    };

    setViewHeight();
    window.addEventListener("resize", setViewHeight);

    return () => {
      window.removeEventListener("resize", setViewHeight);
    };
  }, []);

  return (
    <>
      <div
        data-area="view"
        ref={viewArea}
        className="w-full grid place-items-center"
      >
        <div className="w-80">
          <h1 className="mb-4 text-center text-xl">
            You will exit the site.
          </h1>

          <div className="text-center mb-4">
            <p>Are you sure you want to Sign out?</p>
          </div>
          <div className="mb-4">
            <form method="post">
              <button
                type="submit"
                className="cursor-pointer bg-slate-900 hover:bg-slate-700 text-white w-full h-12 rounded-md"
              >
                Yes, sign out.
              </button>
            </form>
          </div>
          <div className="text-center">
            <Link to="/">Never mind</Link>
          </div>
        </div>
      </div>
    </>
  );
}
