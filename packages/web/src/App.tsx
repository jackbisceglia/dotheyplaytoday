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
import { RootShell } from "./pages/shell.jsx";

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
    component: RootShell,
    children: [
      defineRoute({
        path: "/",
        preload: () => getSubjects(),
        component: () => {
          const subjects = createMemo(() => getSubjects());

          return <Home subjects={subjects()} />;
        },
      }),
      defineRoute({
        path: "/feedback",
        component: () => <Feedback />,
      }),
      defineRoute({
        path: "/unsubscribe/:token",
        component: (props) => <Unsubscribe token={props.params.token} />,
      }),
      { path: "*404", component: () => <NotFound /> },
    ],
  }),
]);

const Router = createRouter({ routes });

export default function App() {
  return <Router />;
}
