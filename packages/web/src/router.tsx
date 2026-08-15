import {
  createRouter,
  defineRoute,
  defineRoutes,
  query,
} from "@solidjs/router";
import { createMemo } from "solid-js";

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
    preload: () => createMemo(() => getSubjects()),
    component: (props) => <Home homeHref={paths()} subjects={props.data()} />,
  }),
  defineRoute({
    path: "/unsubscribe/:token",
    component: (props) => (
      <Unsubscribe homeHref={paths()} token={props.params.token} />
    ),
  }),
  { path: "*404", component: () => <NotFound homeHref={paths()} /> },
]);

export const Router = createRouter({ routes });
export const { paths } = Router;
