import "./styles/global.css";

import {
  createRouter,
  defineRoute,
  defineRoutes,
  query,
  useLocation,
} from "@solidjs/router";
import { createMemo, Errored, Loading, Show, useContext } from "solid-js";

import { getUser, SessionContext } from "./lib/session.js";
import { AuthenticatedLayout } from "./layouts/AuthenticatedLayout.jsx";
import { Redirect } from "./modules/ui/Redirect.jsx";
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

const routes = defineRoutes([
  defineRoute({
    path: "/",
    preload: () => getSubjects(),
    component: () => {
      const subjects = createMemo(() => getSubjects());
      const user = useContext(SessionContext);
      const location = useLocation();

      return (
        <>
          <Errored fallback={null}>
            <Loading fallback={null}>
              <Show when={user()}>
                <Redirect href={`/home${location.search}${location.hash}`} />
              </Show>
            </Loading>
          </Errored>
          <Home homeHref={paths()} subjects={subjects()} />
        </>
      );
    },
  }),
  {
    component: AuthenticatedLayout,
    children: [defineRoute({ path: "/home", component: AuthenticatedHome })],
  },
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
    <Router>
      {(props) => {
        // The API's host-only cookie is available to browser requests, not Web SSR.
        const user = createMemo(() =>
          import.meta.env.SSR ? undefined : getUser(),
        );

        return (
          <SessionContext value={user}>
            <DevOnlyAlerts />
            {props.children}
          </SessionContext>
        );
      }}
    </Router>
  );
}
