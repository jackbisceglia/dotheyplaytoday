import "./styles/global.css";

import {
  createRouter,
  defineRoute,
  defineRoutes,
  query,
} from "@solidjs/router";
import { createMemo, Show } from "solid-js";

import { withApiClient } from "./lib/api.js";
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

      return <Home homeHref={paths()} subjects={subjects()} />;
    },
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
