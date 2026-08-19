import "./styles/global.css";

import {
  createRouter,
  defineRoute,
  defineRoutes,
  query,
} from "@solidjs/router";
import { createMemo } from "solid-js";

import { withApiClient } from "./lib/api.js";
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

      return <Home homeHref={paths()} subjects={subjects()} />;
    },
  }),
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

export default function App() {
  return <Router />;
}
