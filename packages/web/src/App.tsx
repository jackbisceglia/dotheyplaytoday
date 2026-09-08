import "./styles/global.css";

import {
  createRouter,
  defineRoute,
  defineRoutes,
  query,
} from "@solidjs/router";
import { redirect } from "@solidjs/web";
import { createMemo, Errored, Loading, Show } from "solid-js";

import { auth } from "./lib/auth.js";
import { withApiClient } from "./lib/api.js";
import { AuthenticatedHome } from "./pages/AuthenticatedHome.jsx";
import { SignIn } from "./pages/SignIn.jsx";
import { Feedback } from "./pages/Feedback.jsx";
import { Home } from "./pages/Home.jsx";
import { NotFound } from "./pages/NotFound.jsx";
import { Unsubscribe } from "./pages/Unsubscribe.jsx";

const getSubjects = query(
  () =>
    withApiClient((api) => api.subjects.list()).catch((error: unknown) => {
      console.error("Failed to load the subject catalog", error);
      return [];
    }),
  "subjects",
);

// The API's host-only cookie is available to browser requests, not Web SSR.
const getUser = query(async (pathname: string, search: string) => {
  const { data, error } = await auth.getSession();
  if (error) throw new Error(error.message, { cause: error });

  if (pathname === "/" && data) return redirect(`/home${search}`);
  if (pathname === "/home" && !data) return redirect("/sign-in");

  return data?.user;
}, "user");

const routes = defineRoutes([
  defineRoute({
    path: "/",
    preload: ({ location }) => {
      void getSubjects();
      return import.meta.env.SSR
        ? undefined
        : getUser(location.pathname, location.search);
    },
    component: () => {
      const subjects = createMemo(() => getSubjects());

      return <Home homeHref={paths()} subjects={subjects()} />;
    },
  }),
  defineRoute({
    path: "/home",
    preload: ({ location }) => {
      return import.meta.env.SSR
        ? undefined
        : getUser(location.pathname, location.search);
    },
    component: (props) => {
      const user = createMemo(() => props.data);

      return (
        <Errored
          fallback={
            <p class="form-error" role="alert">
              We couldn’t check your session. Refresh to try again.
            </p>
          }
        >
          <Loading fallback={<p>Checking your session...</p>}>
            <Show when={user()} fallback={<p>Checking your session...</p>}>
              {(user) => <AuthenticatedHome user={user()} />}
            </Show>
          </Loading>
        </Errored>
      );
    },
  }),
  defineRoute({ path: "/sign-in", component: SignIn }),
  defineRoute({
    path: "/feedback",
    component: () => <Feedback homeHref={paths()} />,
  }),
  defineRoute({
    path: "/unsubscribe/:token",
    component: (props) => (
      <Unsubscribe homeHref={paths()} token={props.params.token} />
    ),
  }),
  { path: "*404", component: () => <NotFound homeHref={paths()} /> },
]);

const Router = createRouter({ routes });
const { paths } = Router;

const DevOnlyAlerts = () => (
  <Show when={import.meta.env.DEV}>
    <aside class="dev-catalog-notice" role="status">
      Development catalog: event notifications are available for the NBA only.
    </aside>
  </Show>
);

export default function App() {
  return (
    <>
      <DevOnlyAlerts />
      <Router />
    </>
  );
}
