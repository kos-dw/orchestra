import type { Route } from ".react-router/types/app/presentation/layouts/+types/default";
import {
  logger,
  sessionsService,
} from "app/di/.server/inversify.config";
import Aside from "app/presentation/components/aside";
import Footer from "app/presentation/components/footer";
import Header from "app/presentation/components/header";
import Loader from "app/presentation/components/loader";
import { HTTP_STATUS } from "app/shared/constants";
import { getCallerInfo } from "app/shared/utils/.server";
import { useAtom } from "jotai";
import { data, Outlet, redirect, useNavigation } from "react-router";
import { userDataStore } from "../stores";

export async function loader({ params, request }: Route.LoaderArgs) {
  const { getSession } = sessionsService.getSessionStorage();
  const session = await getSession(request.headers.get("Cookie"));

  try {
    const auth = session.get("auth");

    if (!auth) return redirect("/signin");

    if (auth) {
      return {
        Ok: {
          user_unique_key: auth.unique_key,
          display_name: auth.display_name,
          user_email: auth.email,
        },
        Err: null,
      };
    }
  } catch (error) {
    logger.error(
      error instanceof Error ? error.message : "Unknown error.",
      getCallerInfo(),
    );

    return data(
      { Ok: null, Err: "Internal Server Error" },
      {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      },
    );
  }
}

export default function DefaultLayout({
  loaderData,
}: Route.ComponentProps) {
  const payload = loaderData;

  const [userData, setUserData] = useAtom(userDataStore);
  if (payload?.Ok && userData === null) {
    setUserData(payload.Ok);
  }
  const navigation = useNavigation();

  return navigation.state === "loading" ? (
    <Loader />
  ) : (
    <div className="h-full grid grid-rows-[auto_1fr_auto]">
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] overflow-y-auto max-w-screen">
        <Aside className="h-full" />
        <main className="bg-tertiary h-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <Footer className="bg-secondary" />
    </div>
  );
}
